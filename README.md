# Room Rent App (Flutter + Node.js + Socket + Razorpay)

Ye project aapke idea ka production-ready **starter blueprint** hai:

- Flutter mobile app scaffold
- Node.js backend with REST APIs
- Socket.IO realtime chat
- WebRTC signaling events for video call
- Razorpay payment order + verification flow
- Rent payment mode: `full` ya `emi`
- Listing search: room/flat + student/family filters
- Owner/Agent listing post kar sakte hain
- Company margin split logic included

---

## 1) Architecture

```text
mobile_app (Flutter)
  -> REST APIs (Node.js/Express)
  -> Socket.IO (chat + call signaling)

backend (Node.js)
  -> MongoDB (users, listings, payments, chat)
  -> Razorpay Orders + Signature Verification
```

---

## 2) Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Important ENV

- `MONGO_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `CLIENT_URL`

### Main APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/listings`
- `POST /api/listings` (owner/agent only)
- `POST /api/payments/order`
- `POST /api/payments/verify`
- `GET /api/chat/:roomId/messages`

---

## 3) Payment Business Logic

Aapne bola:
- owner ko amount aapki company degi,
- user se amount aap loge,
- aapka margin configurable hona chahiye.

Iske liye `splitPayment()` function company vs owner payout amount calculate karta hai.
Aap chahein to per-owner margin customize kar sakte ho (`companyMarginPercent`).

---

## 4) Flutter Setup

```bash
cd mobile_app
flutter pub get
flutter run
```

Current app scaffold me home screen pe major modules listed hain and API/socket service foundation diya gaya hai.

---

## 5) Chat + Video Call

- Chat messages Socket.IO room based events se chalte hain.
- Video call ke liye WebRTC signaling events added:
  - `webrtc_offer`
  - `webrtc_answer`
  - `webrtc_ice_candidate`

Note: Client side media stream & call UI aapko flutter_webrtc ke through complete karna hoga (starter wiring done).

---

## 6) GitHub me code kaise add karein

```bash
git init
git add .
git commit -m "Initial room rent app scaffold"
git remote add origin <your-github-repo-url>
git push -u origin work
```

Agar aap chaho to next step me mai aapke liye:
1. complete auth screens,
2. listing create/search UI,
3. razorpay checkout integration in Flutter,
4. full chat UI + call screen
bhi add kar sakta hu.
