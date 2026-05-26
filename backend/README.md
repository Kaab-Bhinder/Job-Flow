FastAPI backend scaffold for Job Flow

Run locally:

```bash

source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```python -m venv .venv

Available routes:
- `POST /auth/register` — register user
- `POST /auth/login` — login -> returns access token
- `GET /jobs` — search/filter jobs (query params)
- `GET /jobs/{id}` — job details
- `GET /saved` — protected: list saved job ids
- `POST /saved` — protected: save job
- `DELETE /saved/{job_id}` — protected: unsave job
- `GET /tracker` — protected: list applications
- `POST /tracker` — protected: add application
- `PATCH /tracker/{id}` — protected: update status/notes
- `POST /cv` — mock CV generator

Notes:
- This scaffold uses SQLite and seeds mock data from the frontend `mockData.ts`.
- JWT secret and settings are simplistic for local development.

Google OAuth (optional):
- Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and optionally `GOOGLE_REDIRECT_URI` and `FRONTEND_URL` in the environment before starting the server.
- The backend exposes `/auth/google` to start the OAuth flow and `/auth/google/callback` to handle the callback and issue a JWT.
- Example (Linux/macOS):

```bash
export GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET=your_secret
export FRONTEND_URL=http://localhost:5173
```

If not configured, the endpoints return helpful errors and the frontend buttons are shown as placeholders.

Email verification (local dev + Resend):
- New password accounts are created as unverified and receive a verification link at `FRONTEND_URL/verify-email?token=...`.
- The backend verifies the token at `/auth/verify` and then redirects to `/login?verified=1`.
- To send actual email with Resend, set these environment variables before starting the backend:

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Job Flow <no-reply@yourdomain.com>"
```

- If Resend is not configured, the backend prints the verification link to the server log so you can test locally.
- If Resend rejects the sender or API key, the backend falls back to logging the link so signup still works while you fix the Resend dashboard settings.
