from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from config.database import Base
from models.note import note_categories
import uuid


class Category(Base):
    """
    Category model for organizing notes.
    
    Attributes:
        id: Unique identifier (UUID)
        name: Category name (unique)
        color: Optional hex color code for UI display
        created_at: Timestamp when category was created
        notes: List of notes associated with this category
    """
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    color = Column(String(7), nullable=True)  # Hex color code (e.g., #FF5733)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    notes = relationship(
        "Note",
        secondary=note_categories,
        back_populates="categories",
        lazy="select"
    )
    
    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"
