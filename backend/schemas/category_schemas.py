from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class CategoryBase(BaseModel):
    """Base schema for Category"""
    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$", description="Hex color code")


class CreateCategoryDTO(CategoryBase):
    """Schema for creating a new category"""
    pass


class UpdateCategoryDTO(BaseModel):
    """Schema for updating a category"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")


class CategoryResponse(CategoryBase):
    """Schema for category response"""
    id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class CategoryWithNotesCount(CategoryResponse):
    """Schema for category with notes count"""
    notes_count: int = 0
