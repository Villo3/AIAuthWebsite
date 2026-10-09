import Link from "next/link";

export const metadata = {
  title: "Terms — Ostrelio",
  description: "Pilot-evaluation terms for Ostrelio access requests.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6 sm:p-10">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Ostrelio · Terms</p>
      <h1 className="text-3xl font-bold tracking-tight">Terms: evaluation access</h1>
      <p className="text-sm text-muted-foreground">
        Founder/counsel review pending — this page describes our current process. It is not legal advice.
      </p>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">What Ostrelio is</h2>
        <p>
          Ostrelio is B2B security software for governing consequential AI-agent actions with
          company-native decision controls. Each company profile is customer configuration, not a
          dedicated or fine-tuned model. Jev, when enabled, contributes a typed decision signal inside
          deterministic company guardrails and cannot weaken a hard denial or approval requirement.
        </p>
      </section>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">Evaluation scope</h2>
        <p>
          Request access starts a human conversation about a pilot evaluation — not a production
          subscription, service-level agreement, or managed deployment. Demos and screenshots use
          simulated fixtures unless explicitly labeled as measured results.
        </p>
      </section>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">Acceptable use</h2>
        <p>
          Do not submit personal data beyond your business contact details, credentials, secrets, or
          unlawful content. Abuse protection may throttle bursts; repeated misuse may be ignored
          without reply.
        </p>
      </section>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a className="underline" href="mailto:hello@boundary.dev">hello@boundary.dev</a>. See also{" "}
          <Link className="underline" href="/privacy">Privacy</Link>.
        </p>
      </section>
      <p className="text-sm">
        <Link className="underline" href="/">Back to Ostrelio</Link>
      </p>
    </main>
  );
}
