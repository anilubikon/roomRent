# RentFlow - Full-Stack Rent Management App

RentFlow is a startup-grade RentTech + FinTech platform scaffold built with:
- **Flutter** (mobile frontend)
- **Node.js + Express + MongoDB** (backend)
- **Socket.io** (real-time chat + WebRTC signaling)
- **Razorpay** (payments)

## Modules Delivered

### Frontend (Flutter)
- Splash
- OTP Login / Signup
- Home with module navigation
- Property Listing
- Property Detail
- Add Property
- Chat
- Video Call
- Wallet
- Payment
- Loan / EMI
- User Profile
- Owner Dashboard
- Booking / Rent History
- Notifications

### Backend (Express + MongoDB)
- JWT Auth
- OTP auth endpoints
- Role-based access (tenant/owner/agent/admin)
- Property CRUD-oriented APIs (create/list/detail)
- Booking APIs
- Wallet APIs
- Loan APIs (EMI calculation)
- Payment APIs (Razorpay order + verification)
- Chat history APIs
- Notification APIs
- Socket events for chat + WebRTC signaling

---

## Folder Structure

```txt
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    socket/

mobile_app/
  lib/
    core/
    navigation/
    features/
    models/
    services/
```

---

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Required `.env` keys:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### Backend API Overview

#### Auth
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/register`

#### Properties
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties` (owner/agent/admin)

#### Bookings
- `POST /api/bookings`
- `GET /api/bookings/mine`

#### Wallet
- `GET /api/wallet`
- `POST /api/wallet/topup`

#### Loans
- `POST /api/loans/apply`
- `GET /api/loans/mine`

#### Payments
- `POST /api/payments/order`
- `POST /api/payments/verify`
- `GET /api/payments/mine`

#### Notifications
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

#### Chat
- `GET /api/chat/:roomId/messages`

Socket events:
- `join_room`
- `chat_message`
- `webrtc_offer`
- `webrtc_answer`
- `webrtc_ice_candidate`

---

## Flutter Setup

```bash
cd mobile_app
flutter pub get
flutter run
```

Update base URLs in `ApiService` and socket base URL for your environment.

---

## Production Notes

- Replace dev OTP (`123456`) with Firebase/MessageCentral provider.
- Add Cloudinary/S3 for property images & videos.
- Use Agenda.js + Redis for rent reminders and retry jobs.
- Add webhook endpoint and signature verification hardening for Razorpay.
- Add observability (Sentry + metrics) and CI/CD.

