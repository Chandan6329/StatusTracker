from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .models import Priority, Status

class AchievementBase(BaseModel):
    description: str
    category: str
    tags: Optional[List[str]] = []

class AchievementCreate(AchievementBase):
    pass

class Achievement(AchievementBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    description: str
    priority: Priority = Priority.MEDIUM
    status: Status = Status.TODO
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    description: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None
    due_date: Optional[datetime] = None

class Task(TaskBase):
    id: int
    created_date: datetime

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class ExportRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None