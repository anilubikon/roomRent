# Backend Setup Guide

## 1) Install dependencies

```bash
cd backend
npm install
```

## 2) Configure environment

```bash
npm run setup
# or manually copy .env.example -> .env
```

Update `.env` values based on your machine/service credentials.

## 3) Start local development server

```bash
npm run dev
```

The server runs on `http://localhost:5000` by default.

## 4) Health check

```bash
curl http://localhost:5000/health
```

You should receive a JSON response with `ok: true`.

## Notes

- `CORS_ORIGINS` supports comma-separated origins.
- In production mode (`NODE_ENV=production`), backend requires:
  - `MONGO_URI`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
- If Mongo URI is empty in local dev, backend starts without DB connection (warning logged).
