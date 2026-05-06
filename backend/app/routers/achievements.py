from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Achievement
from ..schemas import Achievement as AchievementSchema, AchievementCreate

router = APIRouter()

@router.post("/achievements", response_model=AchievementSchema)
def create_achievement(achievement: AchievementCreate, db: Session = Depends(get_db)):
    db_achievement = Achievement(
        description=achievement.description,
        category=achievement.category,
        tags=",".join(achievement.tags) if achievement.tags else None
    )
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

@router.get("/achievements", response_model=List[AchievementSchema])
def read_achievements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    achievements = db.query(Achievement).offset(skip).limit(limit).all()
    return achievements

@router.get("/achievements/{achievement_id}", response_model=AchievementSchema)
def read_achievement(achievement_id: int, db: Session = Depends(get_db)):
    db_achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if db_achievement is None:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achievement

@router.put("/achievements/{achievement_id}", response_model=AchievementSchema)
def update_achievement(achievement_id: int, achievement: AchievementCreate, db: Session = Depends(get_db)):
    db_achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if db_achievement is None:
        raise HTTPException(status_code=404, detail="Achievement not found")

    db_achievement.description = achievement.description
    db_achievement.category = achievement.category
    db_achievement.tags = ",".join(achievement.tags) if achievement.tags else None

    db.commit()
    db.refresh(db_achievement)
    return db_achievement

@router.delete("/achievements/{achievement_id}")
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    db_achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if db_achievement is None:
        raise HTTPException(status_code=404, detail="Achievement not found")

    db.delete(db_achievement)
    db.commit()
    return {"message": "Achievement deleted successfully"}