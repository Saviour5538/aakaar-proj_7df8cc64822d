from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.models import Match, User
from database.config import SessionLocal
from backend.services.auth import get_current_user, get_current_user_id

router = APIRouter(prefix="/stats")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", operation_id="get_stats", response_model=None)
async def get_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    try:
        user_id = current_user

        # Query matches for the current user
        total_matches = db.query(Match).filter(Match.user_id == user_id).count()
        wins = db.query(Match).filter(Match.user_id == user_id, Match.result == "win").count()
        losses = db.query(Match).filter(Match.user_id == user_id, Match.result == "loss").count()
        draws = db.query(Match).filter(Match.user_id == user_id, Match.result == "draw").count()

        # Return statistics
        return {
            "total_matches": total_matches,
            "wins": wins,
            "losses": losses,
            "draws": draws
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching statistics."
        )