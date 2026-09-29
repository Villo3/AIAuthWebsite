# Boundary website

The standalone public website for Boundary, the runtime authorization layer for consequential
AI-agent actions. This repository contains only the marketing site, legal pages, and access-request
form. The private control-plane application and backend live separately.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Before pushing changes:

```bash
npm run lint
npm run check
npm test
npm run build
```

Tests cover the access-request API route and lead validation with Vitest.

## Deploy to Vercel

1. In Vercel, choose **Add New → Project**.
2. Import this GitHub repository.
3. Leave the framework preset as **Next.js**.
4. Keep the root directory as `.` and the default install/build/output settings.
5. Deploy. No environment variables are required for the website to build and run.

Vercel reads Node 22 from `package.json`. Pull requests and pushes to the production branch receive
normal Vercel preview/production deployments after the GitHub integration is enabled.

## Request access form → Formspree

Submissions to the Request access form are sent server-side from `POST /api/access-requests`
to a Formspree endpoint. The visitor's email application is never opened and no secret ever
reaches the browser.

### 1. Create a Formspree form

1. Sign in at <https://formspree.io> and create a new form (or reuse an existing one) for
   the website. The form receives these fields: `email`, `company`, `useCase`, `source`,
   `consent`, `submittedAt`, and `site: boundary-website`.
2. Copy the form's endpoint — it looks like `https://formspree.io/f/XXXXX`. This is the
   endpoint value; treat it as a secret. Never commit it.

### 2. Configure Vercel

1. Open the project in Vercel: **Project → Settings → Environment Variables**.
2. Add `ACCESS_REQUEST_WEBHOOK_URL` with the Formspree endpoint value
   (for example `https://formspree.io/f/XXXXX`).
3. Enable the variable for **Production** and **Preview** (and any custom environments
   that should accept form submissions).
4. Redeploy the website (Settings → Deployments → **Redeploy**).

Optional: set `ACCESS_REQUEST_WEBHOOK_SECRET` to a random string; the API route sends it
as a `Bearer` token so Formspree-side automation can verify the request origin.

### 3. Verify a submission

1. Fill in the form on the deployed site with a real work email and submit.
2. Expect the success message ("Thanks — we received your request…") and **no** change
   to the page URL.
3. Open the form in Formspree → **Inbox** to see the submission with the fields above.
4. If delivery fails, the form shows a friendly inline error and nothing is recorded as
   received.

`ACCESS_REQUEST_WEBHOOK_URL` is **required** for submissions: without it, the API returns
a structured 503 error and the form shows an inline "temporarily unavailable" message.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical production origin used by page metadata. |
| `NEXT_PUBLIC_APP_URL` | Product sign-in destination. Without it, Sign in scrolls to Developers. |
| `ACCESS_REQUEST_WEBHOOK_URL` | Formspree endpoint for validated access-request submissions (see above). Required for live forms. |
| `ACCESS_REQUEST_WEBHOOK_SECRET` | Optional bearer secret sent only from the serverless route to Formspree. |

See `.env.example` for placeholder values. Never commit a real Formspree endpoint, email
address, or token to this repository. Validation, body-size limits (8 KB), the honeypot,
request timeouts (8 s), and `Cache-Control: no-store` all apply server-side; submitted form
data never appears in logs or error messages.

## Repository boundaries

- Never place control-plane API keys, Jev credentials, or webhook secrets in `NEXT_PUBLIC_*` variables.
- The illustrated decisions, latencies, and traces on the marketing page are labeled demo fixtures.
- This repository does not contain the Boundary control-plane backend, customer data, or production
  decision history.
