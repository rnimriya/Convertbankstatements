# Deploying the extraction backend

The web app (`web/`, on Vercel) calls this FastAPI service to extract transactions
from PDFs. **It must be deployed as its own service** — it is not part of the
Next.js app. If `BACKEND_URL_SERVER` points at the web app's own domain, the app
calls itself and every upload fails with *"Extraction service is temporarily
unavailable."* (In deployed environments the app now refuses to fabricate data.)

## 1. Pick the shared secret

Both sides must share one secret. Generate it once:

```bash
openssl rand -hex 32
```

You will set this value as `BACKEND_API_KEY` on **both** the backend host and Vercel.

## 2. Deploy the backend (Render example)

1. Push this repo to GitHub (already done).
2. Render → **New → Blueprint** → select the repo. It reads `backend/render.yaml`.
   (Or **New → Web Service**, root directory `backend`, runtime Docker.)
3. Set the secret env vars in the Render dashboard:
   - `BACKEND_API_KEY` = the secret from step 1
   - `ANTHROPIC_API_KEY` = your Anthropic key (enables Vision for scanned PDFs)
   - `APP_ENV` = `production` (already in the blueprint)
   - `WEB_URL` = `https://www.convertstatement.online`
4. Deploy. Confirm it's healthy:
   ```bash
   curl https://<your-backend>.onrender.com/health
   # {"status":"ok","backend":"fastapi",...}
   ```

The same `Dockerfile` works on Railway, Fly.io, or any container host — just set
the same four env vars and bind `$PORT` (the Dockerfile already does).

## 3. Point the web app at it (Vercel)

In Vercel → Project → Settings → Environment Variables (Production):

| Variable | Value |
|----------|-------|
| `BACKEND_URL_SERVER` | `https://<your-backend>.onrender.com` (the FastAPI host — **not** the web domain) |
| `BACKEND_API_KEY` | the same secret from step 1 |

Redeploy the web app. Uploads now return real extracted data.

## 4. Verify

Upload a real bank-statement PDF on the live site. You should get actual
transactions (not the demo/sample). If you get the 503, check:
- `curl https://<backend>/health` returns ok
- `BACKEND_API_KEY` matches on both sides (a mismatch → backend returns 403 → web shows 503)
- `BACKEND_URL_SERVER` has no trailing path and is the backend host

## Local development

`backend/.env` and the repo-root `.env.local` are already wired for local use:
`BACKEND_URL_SERVER=http://localhost:8000` with a matching `BACKEND_API_KEY`.

```bash
cd backend && venv/bin/python main.py     # starts on 127.0.0.1:8000
# in another shell:
cd web && npm run dev                      # http://localhost:3000
```
