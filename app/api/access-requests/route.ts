import { NextResponse } from "next/server";
import { LEAD_LIMITS, validateLeadInput } from "@/lib/leads/validation";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

function mailtoUrl(lead: {
  email: string;
  company?: string;
  useCase?: string;
  source: string;
}) {
  const recipient = process.env.ACCESS_REQUEST_EMAIL || "hello@boundary.dev";
  const subject = `Ostrelio access request${lead.company ? ` — ${lead.company}` : ""}`;
  const body = [
    `Work email: ${lead.email}`,
    `Company: ${lead.company || "Not provided"}`,
    `Source: ${lead.source}`,
    "",
    "Use case:",
    lead.useCase || "Not provided",
  ].join("\n");
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
      { ok: true, delivery: "email", mailtoUrl: mailtoUrl(validated.value) },
      { headers: NO_STORE },
    );
  }

  let parsedWebhook: URL;
  try {
    parsedWebhook = new URL(webhookUrl);
    if (parsedWebhook.protocol !== "https:") throw new Error("Webhook must use HTTPS");
  } catch {
    return NextResponse.json(
      { error: "Access requests are temporarily unavailable. Email hello@boundary.dev." },
      { status: 503, headers: NO_STORE },
    );
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ACCESS_REQUEST_WEBHOOK_SECRET) {
    headers.Authorization = `Bearer ${process.env.ACCESS_REQUEST_WEBHOOK_SECRET}`;
  }

  try {
    const response = await fetch(parsedWebhook, {
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
    return NextResponse.json(
      { error: "We could not send your request. Please email hello@boundary.dev." },
      { status: 503, headers: NO_STORE },
    );
  }

  return NextResponse.json({ ok: true, delivery: "webhook" }, { status: 201, headers: NO_STORE });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405, headers: NO_STORE });
}
