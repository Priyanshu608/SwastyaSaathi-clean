# SwastyaSaathi (Minimal Scaffold)

This repository contains a minimal, local, full-stack scaffold for SwastyaSaathi — a simple Indian healthcare assistant.

Run backend (per-service):

```powershell
cd server
npm install
npm run dev
```

Run frontend (per-service):

```powershell
cd web
npm install
npm run dev
```

Convenience (root helper):

```powershell
# from repo root - installs concurrently (dev helper)
npm install

# install both services deps
npm run install-all

# start both server and web concurrently
npm run dev
```

Environment files and notes:

- The repository root contains `.env.example`. If you have a root `.env`, its values were used to populate `server/.env` and `web/.env` when available. Do not commit secrets.
- For convenience the following files were created (if they did not already exist):
	- `server/.env` — contains `PORT` and `LMSTUDIO_URL` (if present in root `.env`).
	- `web/.env` — contains `VITE_API_URL` (points to `http://localhost:5000`).
- If `server/.env` or `web/.env` already existed, they were NOT overwritten. Instead, `.local.example` files would be created with recommended contents — check the repository root for such files.
- To run with a local LM Studio, set `LMSTUDIO_URL` in `server/.env` (example: `http://localhost:3000/v1/chat/completions`) and restart the backend. The server will fall back to RAG-only responses if the LLM is unreachable.

Quick curl test (backend should be running):

```powershell
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message":"I have fever","city":"Mumbai","age":30}'
```


LM Studio / local LLM (optional)
- You can run a free local LLM using LM Studio (https://lmstudio.ai). Download LM Studio, load a local model (e.g. a GPT4All model), and enable the OpenAI-compatible API in LM Studio settings.
- Set `LMSTUDIO_URL` in `.env` to the LM Studio OpenAI-compatible endpoint (example: `http://localhost:3000/v1/chat/completions`). If LM Studio is unreachable, the server will fall back to the local RAG-only responses.

Run a quick curl test (backend should be running):

```powershell
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message":"I have fever","city":"Mumbai","age":30}'
```

Behavior notes:
- The server uses a simple keyword-based RAG (searching `server/data/diseases.json`) to find evidence snippets.
- When `LMSTUDIO_URL` is set and reachable, the server will ask the local LLM to produce a richer grounded reply using RAG evidence. If the LLM call fails or times out, the server will return a RAG-only fallback reply.

API endpoints:
- POST `/api/chat` -> body `{ message, city, age }` returns `{ reply, sources }`
- GET `/api/schemes` -> returns schemes list
- GET `/api/hospitals?city=CityName` -> returns hospitals in that city
