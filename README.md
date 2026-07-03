# Donations Portal  Frontend

A responsive single-page donation experience built with React, TypeScript,
and Tailwind CSS. It guides a donor through a short wizard - amount, details,
payment, confirmation - and reflects live loading, success, and error states
from the API.

> See the [root README](../README.md) for the problem statement, architecture,
> framework rationale, assumptions, security notes, and future improvements.

## Prerequisites

- Node.js **22** (matches CI; Node 20+ should also work).
- The backend running on `http://localhost:3001` (see `../BackEnd`).

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # oxlint
npm test         # jest
```


## Production

When the frontend and API are on different hosts (e.g. Render and Vercel), set the backend
URL **before** building:

```bash
VITE_API_BASE_URL=https://assessment-wx9c.onrender.com
```

- On Vercel: add `VITE_API_BASE_URL` as an environment variable on the
  **frontend** service, then redeploy (Vite uses it in at build time).
- Locally: copy `.env.example` to `.env.local` if you need to point at a remote
  API; leave unset to use the dev proxy.

The base URL is read in `src/config/apiBase.ts` and used by `src/api/donations.ts`.

## How it works

- **`hooks/useDonationWizard.ts`** holds all wizard state: the form, current
  step, validation errors, submission/polling flags, and the resulting receipt.
  It also owns the `Idempotency-Key` (one per payment attempt) so retries never
  double-charge.
- **`hooks/useStepFocus.ts`** moves focus to the active step heading when the
  user navigates the wizard (accessibility).
- **`api/donations.ts`** is a typed API client. For M-Pesa it submits, then
  **polls** `GET /api/donations/:id` until the donation is `completed` or
  `failed` (or it times out). For card it reads the synchronous result. API
  errors are surfaced as a typed `DonationApiError` carrying the HTTP status and
  any validation `details`.
- **`components/steps/`** are the four wizard steps; **`components/layout/`**
  includes the header, hero, and security assurance footer; **`components/ui/`**
  holds shared UI such as `ValidationErrors` (`role="alert"`, `aria-live`); the
  running **donation summary** is shown alongside the form.
- **`utils/validation.ts`** validates each step client-side for instant
  feedback. The server re-validates everything and remains the source of truth.

## Flow

```
Amount → Details → Payment → Confirmation
                     │
                     ├─ M-Pesa: submit → 202 pending → poll status → done
                     └─ Card:   submit → 201/402 → done
```

## Layout

```
src/
├── App.tsx               wizard  + step routing
├── config/               apiBase (VITE_API_BASE_URL)
├── hooks/                useDonationWizard, useStepFocus
├── api/                  typed client + polling
├── components/
│   ├── steps/            AmountStep, DetailsStep, PaymentStep, ConfirmationStep
│   ├── layout/           Header, Hero, SecurityFooter
│   ├── stepper/          ProgressStepper
│   ├── summary/          DonationSummary
│   ├── ui/               ValidationErrors
│   └── icons/            inline SVG icons
├── utils/                validation, formatting
└── types/                shared TypeScript types
```

## Testing

```bash
npm test
```

Jest + Testing Library cover validation, formatting, the donations API client,
payment step behaviour, and accessible error announcements.
