from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text

DATABASE_URL = "sqlite:///./jobflow.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def init_db():
    SQLModel.metadata.create_all(engine)
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info('user')"))}
        migrations = {
            'provider': "ALTER TABLE user ADD COLUMN provider TEXT DEFAULT 'local'",
            'provider_id': "ALTER TABLE user ADD COLUMN provider_id TEXT",
            'is_email_verified': "ALTER TABLE user ADD COLUMN is_email_verified BOOLEAN DEFAULT 0",
            'skills': "ALTER TABLE user ADD COLUMN skills TEXT",
            # job table migrations
            'adzuna_category': "ALTER TABLE job ADD COLUMN adzuna_category TEXT",
            'sector': "ALTER TABLE job ADD COLUMN sector TEXT",
        }
        for column, ddl in migrations.items():
            if column not in columns:
                conn.execute(text(ddl))

def get_session():
    return Session(engine)
