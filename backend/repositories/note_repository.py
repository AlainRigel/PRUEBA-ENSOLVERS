from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from uuid import UUID
from models.note import Note
from models.category import Category


class NoteRepository:
    """
    Repository layer for Note entity.
    Handles all database operations for notes.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(
        self,
        archived: Optional[bool] = None,
        category_id: Optional[UUID] = None
    ) -> List[Note]:
        """
        Get all notes with optional filters.
        
        Args:
            archived: Filter by archived status (None = all notes)
            category_id: Filter by category ID
            
        Returns:
            List of notes matching the filters
        """
        query = self.db.query(Note)
        
        if archived is not None:
            query = query.filter(Note.is_archived == archived)
        
        if category_id is not None:
            query = query.join(Note.categories).filter(Category.id == category_id)
        
        return query.order_by(Note.created_at.desc()).all()
    
    def get_by_id(self, note_id: UUID) -> Optional[Note]:
        """
        Get a single note by ID.
        
        Args:
            note_id: UUID of the note
            
        Returns:
            Note if found, None otherwise
        """
        return self.db.query(Note).filter(Note.id == note_id).first()
    
    def create(self, title: str, content: str) -> Note:
        """
        Create a new note.
        
        Args:
            title: Note title
            content: Note content
            
        Returns:
            Created note
        """
        note = Note(title=title, content=content, is_archived=False)
        self.db.add(note)
        self.db.commit()
        self.db.refresh(note)
        return note
    
    def update(self, note_id: UUID, title: Optional[str] = None, content: Optional[str] = None) -> Optional[Note]:
        """
        Update an existing note.
        
        Args:
            note_id: UUID of the note to update
            title: New title (optional)
            content: New content (optional)
            
        Returns:
            Updated note if found, None otherwise
        """
        note = self.get_by_id(note_id)
        if not note:
            return None
        
        if title is not None:
            note.title = title
        if content is not None:
            note.content = content
        
        self.db.commit()
        self.db.refresh(note)
        return note
    
    def delete(self, note_id: UUID) -> bool:
        """
        Delete a note.
        
        Args:
            note_id: UUID of the note to delete
            
        Returns:
            True if deleted, False if not found
        """
        note = self.get_by_id(note_id)
        if not note:
            return False
        
        self.db.delete(note)
        self.db.commit()
        return True
    
    def archive(self, note_id: UUID) -> Optional[Note]:
        """
        Archive a note.
        
        Args:
            note_id: UUID of the note to archive
            
        Returns:
            Archived note if found, None otherwise
        """
        note = self.get_by_id(note_id)
        if not note:
            return None
        
        note.is_archived = True
        self.db.commit()
        self.db.refresh(note)
        return note
    
    def unarchive(self, note_id: UUID) -> Optional[Note]:
        """
        Unarchive a note.
        
        Args:
            note_id: UUID of the note to unarchive
            
        Returns:
            Unarchived note if found, None otherwise
        """
        note = self.get_by_id(note_id)
        if not note:
            return None
        
        note.is_archived = False
        self.db.commit()
        self.db.refresh(note)
        return note
    
    def add_category(self, note_id: UUID, category: Category) -> Optional[Note]:
        """
        Add a category to a note.
        
        Args:
            note_id: UUID of the note
            category: Category object to add
            
        Returns:
            Updated note if found, None otherwise
        """
        note = self.get_by_id(note_id)
        if not note:
            return None
        
        if category not in note.categories:
            note.categories.append(category)
            self.db.commit()
            self.db.refresh(note)
        
        return note
    
    def remove_category(self, note_id: UUID, category: Category) -> Optional[Note]:
        """
        Remove a category from a note.
        
        Args:
            note_id: UUID of the note
            category: Category object to remove
            
        Returns:
            Updated note if found, None otherwise
        """
        note = self.get_by_id(note_id)
        if not note:
            return None
        
        if category in note.categories:
            note.categories.remove(category)
            self.db.commit()
            self.db.refresh(note)
        
        return note
