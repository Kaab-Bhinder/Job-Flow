from typing import Optional
from sqlmodel import SQLModel, Field

class Job(SQLModel, table=True):
    id: str = Field(primary_key=True)
    source: Optional[str]
    title: str
    company: str
    companyLogo: Optional[str]
    location: Optional[str]
    description: Optional[str]
    salaryMin: Optional[int]
    salaryMax: Optional[int]
    salaryCurrency: Optional[str]
    jobType: Optional[str]
    isRemote: Optional[bool]
    applyUrl: Optional[str]
    category: Optional[str]
    adzuna_category: Optional[str]
    sector: Optional[str]
    postedAt: Optional[str]
    tags: Optional[str]  # comma-separated

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    email: str
    fullName: Optional[str]
    hashed_password: str
    provider: Optional[str] = "local"
    provider_id: Optional[str] = None
    is_email_verified: bool = False
    skills: Optional[str] = None

class SavedJob(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    job_id: str

class Application(SQLModel, table=True):
    id: str = Field(primary_key=True)
    user_id: str
    job_id: str
    status: str
    notes: Optional[str]
    appliedAt: Optional[str]
    statusChangedAt: Optional[str]
