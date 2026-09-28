export const LEAD_SOURCES = ["website", "referral", "event", "outbound"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_LIMITS = {
  email: 254,
  company: 120,
  useCase: 1000,
  bodyBytes: 8192,
} as const;

export type LeadInput = {
  email: string;
  company?: string;
  useCase?: string;
  consent: true;
  source: LeadSource;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isLeadSource(value: unknown): value is LeadSource {
  return typeof value === "string" && (LEAD_SOURCES as readonly string[]).includes(value);
}

export function validateLeadInput(
  input: unknown,
): { ok: true; value: LeadInput } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Enter a valid work email." };
  }
  const body = input as Record<string, unknown>;
  if (typeof body.email !== "string" || body.email.length > LEAD_LIMITS.email) {
    return { ok: false, error: "Enter a valid work email." };
  }
  const email = body.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid work email." };
  if (body.consent !== true) {
    return { ok: false, error: "Please accept the consent statement so we can reply to your request." };
  }

  const source = body.source === undefined ? "website" : body.source;
  if (!isLeadSource(source)) return { ok: false, error: "Select a valid request source." };

  let company: string | undefined;
  if (body.company !== undefined && body.company !== null && body.company !== "") {
    if (typeof body.company !== "string" || body.company.trim().length > LEAD_LIMITS.company) {
      return { ok: false, error: "Company name must be 120 characters or fewer." };
    }
    company = body.company.trim();
  }

  let useCase: string | undefined;
  if (body.useCase !== undefined && body.useCase !== null && body.useCase !== "") {
    if (typeof body.useCase !== "string" || body.useCase.trim().length > LEAD_LIMITS.useCase) {
      return { ok: false, error: "Use case must be 1,000 characters or fewer." };
    }
    useCase = body.useCase.trim();
  }

  return { ok: true, value: { email, company, useCase, consent: true, source } };
}
