import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { GET, POST, __setDeliveryFetchForTests } from "@/app/api/access-requests/route";
import { LEAD_LIMITS, validateLeadInput } from "@/lib/leads/validation";

const FORMSPREE_URL = "https://formspree.io/f/mock-test-id";

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://boundary.dev/api/access-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const plain = () => ({
  email: "ada@example.com",
  company: "Example Co",
  useCase: "Approve refunds",
  source: "website",
  consent: true,
});

afterEach(() => {
  vi.restoreAllMocks();
  __setDeliveryFetchForTests((url, init) => fetch(url, init));
  delete process.env.ACCESS_REQUEST_WEBHOOK_URL;
  delete process.env.ACCESS_REQUEST_WEBHOOK_SECRET;
});

beforeEach(() => {
  process.env.ACCESS_REQUEST_WEBHOOK_URL = FORMSPREE_URL;
});

describe("POST /api/access-requests", () => {
  test("returns 201 and forwards validated submission to Formspree", async () => {
    const captured: { url: string; init: RequestInit }[] = [];
    const fakeFetch = (url: URL | RequestInfo, init: RequestInit = {}) => {
      captured.push({ url: String(url), init });
      return Promise.resolve(jsonResponse({ ok: true }));
    };
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(jsonRequest(plain()));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, delivery: "webhook" });
    expect(res.headers.get("Cache-Control")).toBe("no-store");

    expect(captured).toHaveLength(1);
    expect(captured[0].url).toBe(FORMSPREE_URL);
    expect(captured[0].init.method).toBe("POST");
    const sent = JSON.parse(captured[0].init.body as string);
    expect(sent.email).toBe("ada@example.com");
    expect(sent.company).toBe("Example Co");
    expect(sent.useCase).toBe("Approve refunds");
    expect(sent.source).toBe("website");
    expect(sent.consent).toBe(true);
    expect(sent.site).toBe("boundary-website");
    expect(typeof sent.submittedAt).toBe("string");
    expect(Date.parse(sent.submittedAt)).not.toBeNaN();
    expect(captured[0].init.signal).toBeDefined();
  });

  test("includes bearer secret header when configured", async () => {
    const captured: RequestInit[] = [];
    process.env.ACCESS_REQUEST_WEBHOOK_SECRET = "s3cret-token";
    const fakeFetch = (_url: URL | RequestInfo, init: RequestInit = {}) => {
      captured.push(init);
      return Promise.resolve(jsonResponse({ ok: true }));
    };
    __setDeliveryFetchForTests(fakeFetch);
    try {
      await POST(jsonRequest(plain()));
      expect(captured[0].headers).toEqual({ "Content-Type": "application/json", Authorization: "Bearer s3cret-token" });
    } finally {
      delete process.env.ACCESS_REQUEST_WEBHOOK_SECRET;
    }
  });

  test("rejects invalid input without calling the webhook", async () => {
    const fakeFetch = vi.fn(() => Promise.resolve(jsonResponse({ ok: true })));
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(jsonRequest({ email: "not-an-email", consent: true }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Enter a valid work email.");
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  test("rejects missing consent", async () => {
    const fakeFetch = vi.fn(() => Promise.resolve(jsonResponse({ ok: true })));
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(jsonRequest({ email: "ada@example.com", consent: false }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("consent");
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  test("rejects oversized bodies before parsing", async () => {
    const request = new Request("https://boundary.dev/api/access-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `${"a".repeat(LEAD_LIMITS.email + 1)}@example.com`, consent: true }),
    });
    vi.spyOn(request.headers, "get").mockImplementation((name: string) =>
      name.toLowerCase() === "content-length" ? String(LEAD_LIMITS.bodyBytes + 1) : null,
    );
    const fakeFetch = vi.fn(() => Promise.resolve(jsonResponse({ ok: true })));
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(request);
    expect(res.status).toBe(413);
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  test("honeypot submissions are ignored and never forwarded", async () => {
    const fakeFetch = vi.fn(() => Promise.resolve(jsonResponse({ ok: true })));
    __setDeliveryFetchForTests(fakeFetch);
    const request = jsonRequest({ ...plain(), website: "spam.example" });
    const res = await POST(request);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  test("returns a structured error when Formspree is not configured", async () => {
    delete process.env.ACCESS_REQUEST_WEBHOOK_URL;
    const fakeFetch = vi.fn(() => Promise.resolve(jsonResponse({ ok: true })));
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(jsonRequest(plain()));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBeUndefined();
    expect(body.error).toContain("temporarily unavailable");
    // Never a mailto fallback.
    expect(String(res.url)).not.toContain("mailto:");
    expect(JSON.stringify(body)).not.toContain("mailto:");
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  test("rejects non-HTTPS webhook configuration", async () => {
    process.env.ACCESS_REQUEST_WEBHOOK_URL = "http://formspree.example/f/not-today";
    const fakeFetch = vi.fn(() => Promise.resolve(jsonResponse({ ok: true })));
    __setDeliveryFetchForTests(fakeFetch);
    try {
      const res = await POST(jsonRequest(plain()));
      expect(res.status).toBe(503);
      expect(fakeFetch).not.toHaveBeenCalled();
    } finally {
      delete process.env.ACCESS_REQUEST_WEBHOOK_URL;
    }
  });

  test("returns a structured error when Formspree responds with an error", async () => {
    const fakeFetch = () => Promise.resolve(jsonResponse({ ok: false, errors: ["spam"] }, 422));
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(jsonRequest(plain()));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBeUndefined();
    expect(body.error).toContain("try again");
    expect(JSON.stringify(body)).not.toContain("spam");
    expect(JSON.stringify(body)).toContain("error");
  });

  test("returns a structured error on network failure", async () => {
    const fakeFetch = () => Promise.reject(new Error("connection refused"));
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(jsonRequest(plain()));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain("connection refused");
  });

  test("returns a structured error on timeout", async () => {
    const fakeFetch = () => Promise.reject(new DOMException("The operation was aborted.", "AbortError"));
    __setDeliveryFetchForTests(fakeFetch);
    const res = await POST(jsonRequest(plain()));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain("aborted");
  });

  test("never returns a mailto: URL on any path", async () => {
    delete process.env.ACCESS_REQUEST_WEBHOOK_URL;
    __setDeliveryFetchForTests(() => Promise.resolve(jsonResponse({ ok: true })));
    const noConfig = await POST(jsonRequest(plain()));
    expect(JSON.stringify(await noConfig.json())).not.toContain("mailto:");

    const success = await POST(jsonRequest(plain()));
    expect(JSON.stringify(await success.json())).not.toContain("mailto:");
  });

  test("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect((await res.json()).error).toBe("Method not allowed.");
  });
});

describe("validateLeadInput", () => {
  test("accepts a complete lead", () => {
    const result = validateLeadInput(plain());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe("ada@example.com");
      expect(result.value.source).toBe("website");
    }
  });

  test("defaults source to website and trims fields", () => {
    const result = validateLeadInput({
      email: "  ADA@Example.COM ",
      company: "  Example Co  ",
      consent: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe("ada@example.com");
      expect(result.value.company).toBe("Example Co");
      expect(result.value.source).toBe("website");
    }
  });

  test("rejects a body over the limit", () => {
    const result = validateLeadInput({
      email: `${"a".repeat(LEAD_LIMITS.email + 1)}@example.com`,
      consent: true,
    });
    expect(result.ok).toBe(false);
  });
});