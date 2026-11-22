# WedPlan — Wedding Planning Platform (Frontend Client)

A modern, role-based wedding planning platform and vendor marketplace built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, seamlessly connected with an Express.js & MongoDB backend, Stripe Checkout, and JWT authentication.

---

## 🔗 Repository & Deployment Links

- **Live Website**: [https://wedplan-frontend-two.vercel.app](https://wedplan-frontend-two.vercel.app)
- **Client GitHub Repository**: [https://github.com/rakibhasanshuvo712-hub/wedplan-client](https://github.com/rakibhasanshuvo712-hub/wedplan-client)
- **Server GitHub Repository**: [https://github.com/rakibhasanshuvo712-hub/wedplan-server](https://github.com/rakibhasanshuvo712-hub/wedplan-server)
- **Live Backend API**: [https://wedplan-backend-inky.vercel.app](https://wedplan-backend-inky.vercel.app)

---

## 🌟 Important Features

### 1. Customer Experience
- **Public & Authenticated Browsing**: Discover approved wedding services across 6 curated categories: *Wedding Venues*, *Photography & Videography*, *Decoration & Florist*, *Catering Services*, *Makeup & Styling*, and *Wedding Fashion*.
- **Real-Time Search & Multi-Filter**: Filter by category, location, and sort by price (Low to High, High to Low) or newest.
- **Service Details & Anti-Double-Booking**: Dynamic gallery with multiple images, detailed inclusions, and date conflict protection.
- **Customer Dashboard**: Overview metrics, booking requests tracking, and the ability to cancel pending inquiries.

### 2. Vendor Studio
- **Listing Portfolio Management**: Create and update services with high-resolution imagery.
- **Tiered Publishing Limits**: Free vendors can publish up to 3 active services; Premium vendors enjoy unlimited listings.
- **Booking Request Review**: Accept or reject incoming event inquiries with real-time status transitions.
- **Stripe Premium Upgrade**: One-click Stripe Checkout test payment for $49/yr to unlock unlimited listings and verified badges.

### 3. Administrator Governance
- **Platform Analytics**: Total users, vendors, couples, active services, pending reviews, total transactions, and revenue.
- **User Moderation**: Instant block/unblock control to protect platform security.
- **Service Audit Workflow**: Approve or reject vendor submissions before publication.
- **Financial Audit Ledger**: Read-only Stripe transaction records verified via webhooks.

### 4. Authentication & Security
- **Email/Password & Google OAuth**: Full credential registration and sign-in (name, email, password with strength rules, role selection) plus real Google Sign-In using the server-side OAuth authorization-code flow. The Google Client ID and Client Secret live only in server environment variables; the code exchange, ID-token verification (audience/issuer/expiry) and session creation all happen in Next.js route handlers. The backend still verifies the Google access token before creating an account.
- **Session Resilience**: Token stored with Lax cookies & localStorage; session preloaded on page refresh without UI flicker or 401 logouts.
- **Role Verification**: Client-side `RoleGuard` + server-side JWT verification for `admin`, `vendor`, and `customer`.

---

## 🛠 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend API**: Express.js, MongoDB Atlas, Mongoose, Stripe SDK

---

## 📋 Environment Variables

Create a `.env.local` file in the client root directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51UbcZ3LP7zqBYcCwv9LuM8WHjIFP3FY0jirU6beIXvgvIzXZ1flZiwFC1qzr3j83Ezi3jdX0prtFgwWpgsjFp4fo00ISetO1KK

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth — SERVER-SIDE ONLY (never use a NEXT_PUBLIC_ prefix)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Callback URL registered in Google Cloud Console (localhost dev value).
# Defaults to the current origin + /api/auth/callback/google when omitted.
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

> The Client Secret must stay on the server. It is used only by
> `/auth/google/start` and `/api/auth/callback/google` to exchange the one-time
> authorization code for tokens. It is never imported by a Client Component or
> bundled into browser JavaScript.
>
> In Google Cloud Console, add the callback URL as an **Authorized redirect URI**
> for the same OAuth client (both `http://localhost:3000/api/auth/callback/google`
> for local development and your deployed URL, e.g.
> `https://wedplan-frontend-two.vercel.app/api/auth/callback/google`). Redirect URIs
> are exact string matches, so use `GOOGLE_REDIRECT_URI` if your host differs.

---

## 🚀 Installation & Local Run Guide

### Prerequisites
- Node.js (v18.17 or later)
- Running backend server at `http://localhost:5000` (see `wedplan-server`)

### Step 1: Install Dependencies
```bash
git clone https://github.com/rakibhasanshuvo712-hub/wedplan-client.git
cd wedplan-client
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env.local` and ensure `NEXT_PUBLIC_API_URL` points to your backend.

### Step 3: Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials for Examiner Evaluation

Sign in with these credentials on `/signin`, or use the Google button:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@wedplan.com` | `Admin@123456` | Full Admin Console (`/dashboard/admin`) |
| **Vendor (Premium)** | `vendor@wedplan.com` | `Vendor@123456` | Vendor Studio (`/dashboard/vendor`) |
| **Customer** | `customer@wedplan.com` | `Customer@123456` | Customer Portal (`/dashboard/customer`) |

### Testing Google Sign-In
1. Make sure the OAuth client's callback URL is registered in Google Cloud Console (see above).
2. Open `/signin` or `/signup` and choose a role on the sign-up page (Customer or Vendor).
3. Click **Continue with Google**. You are redirected to Google's real consent screen.
4. Google redirects back to `/api/auth/callback/google`, which exchanges the code using the client secret, verifies the ID token and asks the backend to create the WedPlan session.
5. On success you are redirected to the dashboard matching your role. On failure you return to `/signin` with an error message.

---

## 🛡 Security & Route Protection
- Client-side `RoleGuard` prevents manual URL manipulation.
- Server-side JWT token verification ensures unauthorized or blocked users cannot perform mutations.
- Public routes remain fully accessible without session lockouts or production 404/504 errors on page reload.
