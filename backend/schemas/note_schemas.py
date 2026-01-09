from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from schemas.category_schemas import CategoryResponse


class NoteBase(BaseModel):
    """Base schema for Note"""
    title: str = Field(..., min_length=1, max_length=255, description="Note title")
    content: str = Field(..., min_length=1, description="Note content")


class CreateNoteDTO(NoteBase):
    """Schema for creating a new note"""
    pass


class UpdateNoteDTO(BaseModel):
    """Schema for updating a note (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)


class NoteResponse(NoteBase):
    """Schema for note response"""
    id: UUID
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    categories: List[CategoryResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


class NoteListResponse(BaseModel):
    """Schema for list of notes"""
    notes: List[NoteResponse]
    total: int
    archived: Optional[bool] = None
