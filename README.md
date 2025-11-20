# SwastyaSaathi (Minimal Scaffold)

This repository contains a minimal, local, full-stack scaffold for SwastyaSaathi — a simple Indian healthcare assistant.

Run backend:

```powershell
cd server
npm install
npm run dev
```

Run frontend:

```powershell
cd web
npm install
npm run dev
```

Notes:
- Copy `.env.example` to `.env` in the repo root (backend reads `PORT`).
- Frontend uses `VITE_API_URL` from `.env` when you run Vite.

API endpoints:
- POST `/api/chat` -> body `{ message, city, age }` returns `{ reply, sources }`
- GET `/api/schemes` -> returns schemes list
- GET `/api/hospitals?city=CityName` -> returns hospitals in that city
