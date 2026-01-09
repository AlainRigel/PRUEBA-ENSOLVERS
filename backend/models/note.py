from sqlalchemy import Column, String, Text, Boolean, DateTime, Table, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from config.database import Base
import uuid


# Association table for many-to-many relationship between notes and categories
note_categories = Table(
    'note_categories',
    Base.metadata,
    Column('note_id', UUID(as_uuid=True), ForeignKey('notes.id', ondelete='CASCADE'), primary_key=True),
    Column('category_id', UUID(as_uuid=True), ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)
)


class Note(Base):
    """
    Note model representing a user's note.
    
    Attributes:
        id: Unique identifier (UUID)
        title: Note title
        content: Note content (text)
        is_archived: Whether the note is archived
        created_at: Timestamp when note was created
        updated_at: Timestamp when note was last updated
        categories: List of categories associated with this note
    """
    __tablename__ = "notes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_archived = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    categories = relationship(
        "Category",
        secondary=note_categories,
        back_populates="notes",
        lazy="joined"
    )
    
    def __repr__(self):
        return f"<Note(id={self.id}, title='{self.title}', archived={self.is_archived})>"
