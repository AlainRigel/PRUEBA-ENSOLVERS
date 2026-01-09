from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status

from repositories.note_repository import NoteRepository
from repositories.category_repository import CategoryRepository
from schemas.note_schemas import CreateNoteDTO, UpdateNoteDTO, NoteResponse


class NoteService:
    """
    Service layer for Note business logic.
    Orchestrates operations between routers and repositories.
    """
    
    def __init__(self, db: Session):
        self.note_repo = NoteRepository(db)
        self.category_repo = CategoryRepository(db)
    
    def create_note(self, dto: CreateNoteDTO) -> NoteResponse:
        """
        Create a new note.
        
        Args:
            dto: Note creation data
            
        Returns:
            Created note
        """
        note = self.note_repo.create(title=dto.title, content=dto.content)
        return NoteResponse.model_validate(note)
    
    def get_notes(
        self,
        archived: Optional[bool] = None,
        category_id: Optional[UUID] = None
    ) -> List[NoteResponse]:
        """
        Get all notes with optional filters.
        
        Args:
            archived: Filter by archived status
            category_id: Filter by category
            
        Returns:
            List of notes
        """
        notes = self.note_repo.get_all(archived=archived, category_id=category_id)
        return [NoteResponse.model_validate(note) for note in notes]
    
    def get_note(self, note_id: UUID) -> NoteResponse:
        """
        Get a single note by ID.
        
        Args:
            note_id: UUID of the note
            
        Returns:
            Note data
            
        Raises:
            HTTPException: If note not found
        """
        note = self.note_repo.get_by_id(note_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
        return NoteResponse.model_validate(note)
    
    def update_note(self, note_id: UUID, dto: UpdateNoteDTO) -> NoteResponse:
        """
        Update an existing note.
        
        Args:
            note_id: UUID of the note to update
            dto: Update data
            
        Returns:
            Updated note
            
        Raises:
            HTTPException: If note not found
        """
        note = self.note_repo.update(
            note_id=note_id,
            title=dto.title,
            content=dto.content
        )
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
        return NoteResponse.model_validate(note)
    
    def delete_note(self, note_id: UUID) -> None:
        """
        Delete a note.
        
        Args:
            note_id: UUID of the note to delete
            
        Raises:
            HTTPException: If note not found
        """
        deleted = self.note_repo.delete(note_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
    
    def archive_note(self, note_id: UUID) -> NoteResponse:
        """
        Archive a note.
        
        Args:
            note_id: UUID of the note to archive
            
        Returns:
            Archived note
            
        Raises:
            HTTPException: If note not found
        """
        note = self.note_repo.archive(note_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
        return NoteResponse.model_validate(note)
    
    def unarchive_note(self, note_id: UUID) -> NoteResponse:
        """
        Unarchive a note.
        
        Args:
            note_id: UUID of the note to unarchive
            
        Returns:
            Unarchived note
            
        Raises:
            HTTPException: If note not found
        """
        note = self.note_repo.unarchive(note_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
        return NoteResponse.model_validate(note)
    
    def add_category_to_note(self, note_id: UUID, category_id: UUID) -> NoteResponse:
        """
        Add a category to a note.
        
        Args:
            note_id: UUID of the note
            category_id: UUID of the category
            
        Returns:
            Updated note
            
        Raises:
            HTTPException: If note or category not found
        """
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        note = self.note_repo.add_category(note_id, category)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
        
        return NoteResponse.model_validate(note)
    
    def remove_category_from_note(self, note_id: UUID, category_id: UUID) -> NoteResponse:
        """
        Remove a category from a note.
        
        Args:
            note_id: UUID of the note
            category_id: UUID of the category
            
        Returns:
            Updated note
            
        Raises:
            HTTPException: If note or category not found
        """
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        note = self.note_repo.remove_category(note_id, category)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
        
        return NoteResponse.model_validate(note)
