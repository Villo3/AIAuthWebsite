import Link from "next/link";

export const metadata = {
  title: "Privacy — Ostrelio",
  description: "How Ostrelio handles Request access contact details.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6 sm:p-10">
      <h1 className="text-3xl font-bold tracking-tight">Privacy: Request access leads</h1>
      <p className="text-sm text-muted-foreground">
        Founder/counsel review pending — this page describes our current process. It is not legal advice.
      </p>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">What we store</h2>
        <p>
          When you submit Request access we store your work email, optional company and use-case text,
          the consent timestamp, and an allowlisted source (website, referral, event, or outbound).
          We store nothing else from the form.
        </p>
      </section>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">Why and where</h2>
        <p>
          We use these details only to reply to your request and evaluate pilot fit. On the default
          website deployment, submitting the form opens a prefilled message in your email application
          and the website does not store the form. If Ostrelio configures a server-side lead webhook,
          the validated details are sent only to that private lead handler. Lead data is never sent to
          Jev or another decision-model provider.
        </p>
      </section>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">Who can access</h2>
        <p>
          Only authorized Ostrelio operators and the configured email or lead-service provider can
          process submitted requests. There is no public lead listing and no ad tracking on this form.
        </p>
      </section>
      <section className="space-y-2 text-sm leading-6">
        <h2 className="text-lg font-semibold">Retention and deletion</h2>
        <p>
          We keep a received request only as long as a genuine business conversation requires. To
          request deletion, email{" "}
          <a className="underline" href="mailto:hello@boundary.dev">hello@boundary.dev</a> from the
          address you submitted.
        </p>
      </section>
      <p className="text-sm">
        <Link className="underline" href="/">Back to Ostrelio</Link> · <Link className="underline" href="/terms">Terms</Link>
      </p>
    </main>
  );
}
