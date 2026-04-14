# RentFlow – RentTech + FinTech Super App (Flutter + Node.js)

Startup-grade reference implementation for a rental marketplace + closed-loop Rent Help wallet.

## Tech Stack

### Mobile (Flutter)
- Clean Architecture-ready feature modules
- Dio API layer
- Socket service for chat / signaling
- Airbnb-style UI scaffold (light/dark capable)

### Backend (Node.js)
- Node.js + Express + MongoDB (Mongoose)
- Socket.io (chat + WebRTC signaling)
- Razorpay order + signature verification
- Role-based auth (tenant/owner/agent/admin)
- Rent Help closed-loop wallet logic

---

## Core Business Features Implemented

### 1) Rental Marketplace
- Property listing and details
- Booking APIs
- Owner/agent property publish flow
- Tenant booking and payment history

### 2) Closed-Loop Wallet (Main USP)
- Wallet split into:
  - `cashBalance` (user top-up)
  - `rentHelpBalance` (company-provided credit)
- **No withdrawal endpoint** (closed-loop by design)
- Rent payments can be settled using wallet split (cash + rent help)

### 3) Rent Help (Pay Later, Non-Loan UX)
- Admin grants credit (`₹5,000–₹50,000`)
- Credit usable only for rent (wallet-restricted)
- Full or EMI repayment mode
- Installment schedule with late-fee tagging
- Auto-block rent help on overdue/default

### 4) Payment Mediation
- Tenant pays platform (Razorpay or wallet)
- Payment model stores commission + owner payout split
- Razorpay webhook/signature-ready verification flow

### 5) Realtime + Communication
- Socket-based chat
- WebRTC signaling channel events for video call setup

---

## Backend APIs

### Auth
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/register`

### Property + Booking
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties`
- `POST /api/bookings`
- `GET /api/bookings/mine`

### Wallet + Rent Help
- `GET /api/wallet`
- `GET /api/wallet/transactions`
- `POST /api/wallet/topup`
- `POST /api/wallet/rent-help/repay`
- `POST /api/wallet/rent-help/grant` (admin only)

### Payments
- `POST /api/payments/order`
- `POST /api/payments/verify`
- `POST /api/payments/rent/wallet`
- `GET /api/payments/mine`

### Rent Help Insights
- `POST /api/loans/apply` (simulation endpoint)
- `GET /api/loans/mine` (returns user Rent Help credits)

### Chat + Notifications
- `GET /api/chat/:roomId/messages`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

---

## Data Models

- `User`
- `Property`
- `Booking`
- `Wallet`
- `WalletTransaction`
- `RentHelpCredit`
- `Payment`
- `ChatMessage`
- `Notification`
- `OtpCode`

---

## Folder Structure

```txt
backend/
  src/
    app.js
    index.js
    config/
    controllers/
    jobs/
    middleware/
    models/
    routes/
    services/
    socket/

mobile_app/
  lib/
    app.dart
    core/
    features/
    models/
    navigation/
    services/
```

---

## Local Setup

### Backend
```bash
cd backend
npm install
npm run setup
npm run dev
```

### Flutter
```bash
cd mobile_app
flutter pub get
flutter run
```

---

## Environment Variables

See `backend/.env.example`:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGINS` (comma-separated allowed origins)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `REDIS_URL`
- `ENABLE_DEMO_JOBS`

---

## Production Hardening Roadmap

1. Replace demo OTP with provider (Firebase/MSG91/Twilio Verify)
2. Add KYC workflows (Aadhaar/PAN APIs + manual review)
3. Introduce Agenda.js + Redis-backed job orchestration
4. Add event bus + ledger for finance-grade wallet auditing
5. Add Razorpay webhook ingestion with idempotency keys
6. Add fraud detection pipeline (duplicate listings + abnormal transactions)
7. Implement legal stack (PDF agreement + eSign)
8. Add owner analytics dashboards and recommendation services
9. Add CI/CD, SAST/DAST, observability and backup policies

---

## Notes

This repository is a production-oriented scaffold with core rent + fintech rails implemented and extensible architecture for full startup rollout.
