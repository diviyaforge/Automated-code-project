from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from routers.auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/api", tags=["Sessions & History"])

# ─── SAVED SESSIONS ───

@router.get("/saved-sessions", response_model=List[schemas.SessionResponse])
def get_sessions(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(models.Session).filter(
        models.Session.user_id == current_user.id
    ).order_by(models.Session.id.desc()).all()
    return sessions

@router.post("/saved-sessions", response_model=schemas.SessionResponse)
def save_session(
    session_data: schemas.SessionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_session = models.Session(
        user_id=current_user.id,
        code=session_data.code,
        result=session_data.result,
        label=session_data.label
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.delete("/saved-sessions/{session_id}")
def delete_session(
    session_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_session = db.query(models.Session).filter(
        models.Session.id == session_id,
        models.Session.user_id == current_user.id
    ).first()
    
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or not authorized to delete."
        )
    
    db.delete(db_session)
    db.commit()
    return {"message": "Session deleted successfully"}

# ─── ANALYSIS HISTORY ───

@router.get("/analysis-history", response_model=List[schemas.HistoryResponse])
def get_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(models.History).filter(
        models.History.user_id == current_user.id
    ).order_by(models.History.id.desc()).all()
    return history

@router.post("/analysis-history", response_model=schemas.HistoryResponse)
def create_history_entry(
    entry_data: schemas.SessionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_entry = models.History(
        user_id=current_user.id,
        code=entry_data.code,
        result=entry_data.result,
        label=entry_data.label
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry
