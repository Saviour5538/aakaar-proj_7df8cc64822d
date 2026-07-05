import os
import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.dialects.postgresql import UUID

DATABASE_URL_ENV = "DATABASE_URL"
DATABASE_URL = os.environ[DATABASE_URL_ENV]

from database.config import declarative_base
from database.config import Base
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Match(Base):
    __tablename__ = "matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    result = Column(String, nullable=False)
    winner = Column(String, nullable=True)
    moves = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="matches")


User.matches = relationship("Match", back_populates="user", cascade="all, delete-orphan")