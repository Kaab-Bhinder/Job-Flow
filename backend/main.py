from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlmodel import Session, select
from database import init_db, get_session
from models import Job, User, SavedJob, Application
from utils import get_password_hash, verify_password, create_access_token, decode_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import json
import os
import urllib.parse
import httpx
from datetime import timedelta
from sqlmodel import select

app = FastAPI(title="Job Flow API — Dev")

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5175", "http://localhost:5176"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def build_frontend_url(path: str = "") -> str:
    frontend = os.environ.get('FRONTEND_URL', 'http://localhost:5173').rstrip('/')
    if path and not path.startswith('/'):
        path = '/' + path
    return frontend + path


def send_verification_email(email: str, verify_url: str):
    resend_api_key = os.environ.get('RESEND_API_KEY')
    resend_from = os.environ.get('RESEND_FROM_EMAIL', 'Job Flow <no-reply@jobflow.local>')

    payload = {
        'from': resend_from,
        'to': [email],
        'subject': 'Verify your Job Flow email',
        'html': (
            '<p>Verify your Job Flow account by opening this link:</p>'
            f'<p><a href="{verify_url}">{verify_url}</a></p>'
            '<p>If you did not create this account, ignore this message.</p>'
        ),
        'text': f'Verify your Job Flow account by opening this link:\n\n{verify_url}\n\nIf you did not create this account, ignore this message.',
    }

    # Local/dev fallback when Resend is not configured.
    if not resend_api_key:
        print(f"Verification link for {email}: {verify_url}")
        return False

    response = httpx.post(
        'https://api.resend.com/emails',
        headers={
            'Authorization': f'Bearer {resend_api_key}',
            'Content-Type': 'application/json',
        },
        json=payload,
        timeout=15.0,
    )
    try:
        response.raise_for_status()
        return True
    except Exception as exc:
        print(f"Resend failed for {email}: {exc}")
        print(f"Verification link for {email}: {verify_url}")
        return False

# --- Simple dependencies ---

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    with get_session() as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user

# --- Auth ---
class RegisterIn(BaseModel):
    id: str
    email: str
    fullName: Optional[str]
    password: str

@app.post('/auth/register')
def register(payload: RegisterIn):
    with get_session() as session:
        # prevent duplicate accounts by email
        by_id = session.get(User, payload.id)
        by_email = session.exec(select(User).where(User.email == payload.email)).first()
        if by_id or by_email:
            # If the existing account was created via social provider, instruct user to use that provider
            if by_email and getattr(by_email, 'provider', 'local') != 'local':
                raise HTTPException(status_code=400, detail='An account with this email exists via social login. Please sign in with the provider or link accounts.')
            raise HTTPException(status_code=400, detail='User exists')
        hashed = get_password_hash(payload.password)
        user = User(id=payload.id, email=payload.email, fullName=payload.fullName, hashed_password=hashed, provider='local', is_email_verified=False)
        session.add(user)
        session.commit()
        verify_token = create_access_token({"sub": user.email, "purpose": "verify_email"}, expires_delta=timedelta(minutes=60))
        verify_url = build_frontend_url(f"/verify-email?token={verify_token}")
        send_verification_email(user.email, verify_url)
        return {"id": user.id, "email": user.email, "fullName": user.fullName, "needsVerification": True, "verifyUrl": verify_url}

@app.post('/auth/login')
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # expects username= user id for simplicity
    with get_session() as session:
        user = session.get(User, form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail='Invalid credentials')
        if not getattr(user, 'is_email_verified', False):
            raise HTTPException(status_code=403, detail='Please verify your email before logging in. Check your inbox for the verification link.')
        token = create_access_token({"sub": user.id})
        return {"access_token": token, "token_type": "bearer"}


@app.get('/auth/me')
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "fullName": user.fullName, "provider": getattr(user, 'provider', 'local'), "is_email_verified": getattr(user, 'is_email_verified', False)}


# --- Google OAuth skeleton (requires GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET env vars) ---
@app.get('/auth/google')
def google_auth():
    client_id = os.environ.get('GOOGLE_CLIENT_ID')
    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', 'http://127.0.0.1:8000/auth/google/callback')
    if not client_id:
        return {"error": "GOOGLE_CLIENT_ID not configured on server"}
    params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline',
        'prompt': 'consent',
    }
    url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode(params)
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url)


@app.get('/auth/google/callback')
def google_callback(code: str | None = None):
    client_id = os.environ.get('GOOGLE_CLIENT_ID')
    client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', 'http://127.0.0.1:8000/auth/google/callback')
    if not code:
        raise HTTPException(status_code=400, detail='Missing code')
    if not client_id or not client_secret:
        return {"error": "Google OAuth not fully configured on server"}

    token_url = 'https://oauth2.googleapis.com/token'
    data = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    }
    try:
        r = httpx.post(token_url, data=data, timeout=10.0)
        r.raise_for_status()
        token_data = r.json()
        userinfo = httpx.get('https://www.googleapis.com/oauth2/v3/userinfo', headers={'Authorization': f"Bearer {token_data.get('access_token')}"}).json()
        email = userinfo.get('email')
        name = userinfo.get('name')
        provider_id = userinfo.get('sub')
        email_verified = userinfo.get('email_verified', False)
        with get_session() as session:
            existing = session.get(User, email)
            if not existing:
                u = User(id=email, email=email, fullName=name or '', hashed_password=get_password_hash(email), provider='google', provider_id=provider_id, is_email_verified=bool(email_verified))
                session.add(u)
                session.commit()
            else:
                # If the account already exists, let Google become the trusted login and mark verified.
                if provider_id and not getattr(existing, 'provider_id', None):
                    existing.provider_id = provider_id
                existing.is_email_verified = True
                existing.provider = 'google'
                session.add(existing)
                session.commit()
            user = session.get(User, email)
            jwt = create_access_token({"sub": user.id})
            from fastapi.responses import RedirectResponse
            redirect = f"{build_frontend_url('/') }?token={jwt}"
            return RedirectResponse(redirect)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Email verification (dev-friendly) ---
@app.post('/auth/send_verification')
def send_verification(email: str):
    # In production send via email; for dev we return token and URL
    from utils import create_access_token
    token = create_access_token({"sub": email, "purpose": "verify_email"}, expires_delta=timedelta(minutes=30))
    frontend = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    verify_url = f"{frontend}/verify?token={token}"
    return {"token": token, "verify_url": verify_url}


@app.get('/auth/verify')
def verify_email(token: str):
    payload = decode_access_token(token)
    if not payload or payload.get('purpose') != 'verify_email':
        raise HTTPException(status_code=400, detail='Invalid or expired token')
    email = payload.get('sub')
    with get_session() as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(status_code=404, detail='User not found')
        user.is_email_verified = True
        session.add(user)
        session.commit()
        from fastapi.responses import RedirectResponse
        return RedirectResponse(build_frontend_url('/login?verified=1'))


@app.post('/auth/resend_verification')
def resend_verification(email: str):
    with get_session() as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(status_code=404, detail='User not found')
        if getattr(user, 'is_email_verified', False):
            return {"sent": False, "detail": "Email is already verified"}
        verify_token = create_access_token({"sub": user.email, "purpose": "verify_email"}, expires_delta=timedelta(minutes=60))
        verify_url = build_frontend_url(f"/verify-email?token={verify_token}")
        send_verification_email(user.email, verify_url)
        return {"sent": True, "verifyUrl": verify_url}

# --- Jobs ---
@app.get('/jobs')
def search_jobs(keyword: Optional[str] = None, location: Optional[str] = None, jobType: Optional[str] = None, category: Optional[str] = None, isRemote: Optional[bool] = None, salaryMin: Optional[int] = None, salaryMax: Optional[int] = None, sortBy: Optional[str] = 'relevance'):
    with get_session() as session:
        q = select(Job)
        results = session.exec(q).all()
        # in-memory filtering for simplicity
        def match(job: Job):
            if keyword:
                kw = keyword.lower()
                if kw not in (job.title or '').lower() and kw not in (job.company or '').lower() and kw not in (job.description or '').lower():
                    return False
            if location:
                if location.lower() not in (job.location or '').lower():
                    return False
            if jobType and job.jobType != jobType:
                return False
            if category and job.category != category:
                return False
            if isRemote is not None and job.isRemote != isRemote:
                return False
            if salaryMin and (job.salaryMin is None or job.salaryMin < salaryMin):
                return False
            if salaryMax and (job.salaryMax is None or job.salaryMax > salaryMax):
                pass
            return True
        filtered = [j for j in results if match(j)]
        # TODO: implement sorting
        return filtered

@app.get('/jobs/{job_id}')
def get_job(job_id: str):
    with get_session() as session:
        job = session.get(Job, job_id)
        if not job:
            raise HTTPException(status_code=404, detail='Job not found')
        return job

# --- Saved jobs ---
@app.get('/saved')
def get_saved(user: User = Depends(get_current_user)):
    with get_session() as session:
        rows = session.exec(select(SavedJob).where(SavedJob.user_id == user.id)).all()
        return [r.job_id for r in rows]

class SaveIn(BaseModel):
    job_id: str

@app.post('/saved')
def save_job(payload: SaveIn, user: User = Depends(get_current_user)):
    with get_session() as session:
        existing = session.exec(select(SavedJob).where(SavedJob.user_id == user.id, SavedJob.job_id == payload.job_id)).first()
        if existing:
            raise HTTPException(status_code=400, detail='Already saved')
        row = SavedJob(user_id=user.id, job_id=payload.job_id)
        session.add(row)
        session.commit()
        return {"saved": True}

@app.delete('/saved/{job_id}')
def unsave_job(job_id: str, user: User = Depends(get_current_user)):
    with get_session() as session:
        row = session.exec(select(SavedJob).where(SavedJob.user_id == user.id, SavedJob.job_id == job_id)).first()
        if row:
            session.delete(row)
            session.commit()
        return {"saved": False}

# --- Tracker (applications) ---
@app.get('/tracker')
def list_apps(user: User = Depends(get_current_user)):
    with get_session() as session:
        rows = session.exec(select(Application).where(Application.user_id == user.id)).all()
        return rows

class AppIn(BaseModel):
    job_id: str
    status: Optional[str] = 'saved'

@app.post('/tracker')
def add_app(payload: AppIn, user: User = Depends(get_current_user)):
    with get_session() as session:
        app_obj = Application(id=f'app-{int(os.times().system*1000)}', user_id=user.id, job_id=payload.job_id, status=payload.status, notes='', appliedAt='', statusChangedAt='')
        session.add(app_obj)
        session.commit()
        return app_obj

@app.patch('/tracker/{app_id}')
def update_app(app_id: str, status: Optional[str] = None, notes: Optional[str] = None, user: User = Depends(get_current_user)):
    with get_session() as session:
        app_obj = session.get(Application, app_id)
        if not app_obj or app_obj.user_id != user.id:
            raise HTTPException(status_code=404, detail='Application not found')
        if status:
            app_obj.status = status
        if notes is not None:
            app_obj.notes = notes
        session.add(app_obj)
        session.commit()
        return app_obj

@app.delete('/tracker/{app_id}')
def remove_app(app_id: str, user: User = Depends(get_current_user)):
    with get_session() as session:
        app_obj = session.get(Application, app_id)
        if app_obj and app_obj.user_id == user.id:
            session.delete(app_obj)
            session.commit()
        return {"removed": True}

# --- CV mock ---
class CVIn(BaseModel):
    job_id: str
    template: Optional[str]

@app.post('/cv')
def build_cv(payload: CVIn, user: User = Depends(get_current_user)):
    # Mock response — in real app call AI provider
    return {"cv_text": f"Mock CV for user {user.fullName} tailored to job {payload.job_id}"}

# --- Startup: init DB and seed from frontend mock data ---
@app.on_event('startup')
def on_startup():
    init_db()
    # seed if empty
    with get_session() as session:
        count = session.exec(select(Job)).all()
        if not count:
            # load seed from frontend mockData.json if exists
            try:
                import pathlib
                root = pathlib.Path(__file__).parent.parent / 'frontend' / 'src' / 'lib' / 'mockData.ts'
                # fallback: try to load a prepared JSON seeds file
                seed_json = pathlib.Path(__file__).parent / 'seed_jobs.json'
                if seed_json.exists():
                    data = json.loads(seed_json.read_text())
                else:
                    # create seed from a minimal internal list
                    data = [
                        {"id":"1","title":"Senior Frontend Engineer","company":"Stripe","companyLogo":"","location":"San Francisco, CA","description":"...","salaryMin":180000,"salaryMax":250000,"salaryCurrency":"USD","jobType":"Full-time","isRemote":False,"applyUrl":"","category":"Engineering","postedAt":"2026-05-24T10:00:00Z","tags":"React,TypeScript"},
                        {"id":"2","title":"Full Stack Developer","company":"Vercel","companyLogo":"","location":"Remote","description":"...","salaryMin":140000,"salaryMax":200000,"salaryCurrency":"USD","jobType":"Full-time","isRemote":True,"applyUrl":"","category":"Engineering","postedAt":"2026-05-23T14:30:00Z","tags":"Next.js,Node.js"}
                    ]
                for j in data:
                    job = Job(id=j.get('id'), source=j.get('source'), title=j.get('title'), company=j.get('company'), companyLogo=j.get('companyLogo'), location=j.get('location'), description=j.get('description'), salaryMin=j.get('salaryMin'), salaryMax=j.get('salaryMax'), salaryCurrency=j.get('salaryCurrency'), jobType=j.get('jobType'), isRemote=j.get('isRemote'), applyUrl=j.get('applyUrl'), category=j.get('category'), postedAt=j.get('postedAt'), tags=j.get('tags'))
                    session.add(job)
                # seed a default user
                from models import User as U
                if not session.get(U, '1'):
                    user = U(id='1', email='kaab@jobflow.com', fullName='Kaab Bhinder', hashed_password=get_password_hash('password'), provider='local', is_email_verified=True)
                    session.add(user)
                session.commit()
            except Exception as e:
                print('Seed error', e)
