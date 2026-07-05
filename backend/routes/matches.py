from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import UUID

from database.models import Match
from database.config import SessionLocal
from backend.services.auth import get_current_user, get_current_user_id
from datetime import datetime

router = APIRouter(prefix="/matches")

class MatchResponse(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    result: str
    winner: Optional[str] = None
    moves: int
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=MatchResponse, status_code=status.HTTP_201_CREATED, operation_id="create_match")
async def create_match(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    try:
        new_match = Match(
            user_id=current_user,
            result="ongoing",
            winner=None,
            moves=0,
            created_at=datetime.utcnow()
        )
        db.add(new_match)
        db.commit()
        db.refresh(new_match)
        return new_match
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create match")

@router.get("/", response_model=List[MatchResponse], status_code=status.HTTP_200_OK, operation_id="get_matches")
async def get_matches(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    try:
        matches = db.query(Match).filter(Match.user_id == current_user).all()
        return matches
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve matches")