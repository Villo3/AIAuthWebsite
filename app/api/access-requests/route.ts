import { NextResponse } from "next/server";
import { LEAD_LIMITS, validateLeadInput } from "@/lib/leads/validation";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

const GENERIC_DELIVERY_ERROR = "We could not send your request. Please try again.";

type DeliveryFetch = (url: URL | RequestInfo, init?: RequestInit) => Promise<Response>;

// Injectable seam for tests. The production route always uses global fetch.
let deliveryFetch: DeliveryFetch = (url, init) => fetch(url, init);

export function __setDeliveryFetchForTests(fetchImpl: DeliveryFetch) {
  deliveryFetch = fetchImpl;
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > LEAD_LIMITS.bodyBytes) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413, headers: NO_STORE });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid work email." }, { status: 400, headers: NO_STORE });
  }

  // Honeypot: pretend success without recording or forwarding anything.
  if (input && typeof input === "object" && "website" in input && input.website) {
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  const validated = validateLeadInput(input);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400, headers: NO_STORE });
  }

  const webhookUrl = process.env.ACCESS_REQUEST_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Access requests are temporarily unavailable. Please try again later." },
      { status: 503, headers: NO_STORE },
    );
  }

  let parsedWebhook: URL;
  try {
    parsedWebhook = new URL(webhookUrl);
    if (parsedWebhook.protocol !== "https:") throw new Error("Webhook must use HTTPS");
  } catch {
    return NextResponse.json({ error: GENERIC_DELIVERY_ERROR }, { status: 503, headers: NO_STORE });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ACCESS_REQUEST_WEBHOOK_SECRET) {
    headers.Authorization = `Bearer ${process.env.ACCESS_REQUEST_WEBHOOK_SECRET}`;
  }

  try {
    const response = await deliveryFetch(parsedWebhook, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...validated.value,
        submittedAt: new Date().toISOString(),
        site: "boundary-website",
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
  } catch {
    return NextResponse.json({ error: GENERIC_DELIVERY_ERROR }, { status: 503, headers: NO_STORE });
  }

  return NextResponse.json({ ok: true, delivery: "webhook" }, { status: 201, headers: NO_STORE });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405, headers: NO_STORE });
}