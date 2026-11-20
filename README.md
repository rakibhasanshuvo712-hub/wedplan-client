# WedPlan — Wedding Planning Platform (Frontend Client)

A modern, role-based wedding planning platform and vendor marketplace built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, seamlessly connected with an Express.js & MongoDB backend, Stripe Checkout, and JWT authentication.

---

## 🔗 Repository & Deployment Links

- **Live Website**: [https://wedplan-platform.vercel.app](https://wedplan-platform.vercel.app)
- **Client GitHub Repository**: [https://github.com/rakib/wedplan-client](https://github.com/rakib/wedplan-client)
- **Server GitHub Repository**: [https://github.com/rakib/wedplan-server](https://github.com/rakib/wedplan-server)

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

---

## 🛠 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
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
```

---

## 🚀 Installation & Local Run Guide

### Prerequisites
- Node.js (v18.17 or later)
- Running backend server at `http://localhost:5000` (see `wedplan-server`)

### Step 1: Install Dependencies
```bash
git clone https://github.com/rakib/wedplan-client.git
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

Quick-fill buttons are provided on the `/signin` page for convenience:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@wedplan.com` | `Admin@123456` | Full Admin Console (`/dashboard/admin`) |
| **Vendor (Premium)** | `vendor@wedplan.com` | `Vendor@123456` | Vendor Studio (`/dashboard/vendor`) |
| **Customer** | `customer@wedplan.com` | `Customer@123456` | Customer Portal (`/dashboard/customer`) |

---

## 🛡 Security & Route Protection
- Client-side `RoleGuard` prevents manual URL manipulation.
- Server-side JWT token verification ensures unauthorized or blocked users cannot perform mutations.
- Public routes remain fully accessible without session lockouts or production 404/504 errors on page reload.
