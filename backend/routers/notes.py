from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from config.database import get_db
from services.note_service import NoteService
from schemas.note_schemas import CreateNoteDTO, UpdateNoteDTO, NoteResponse

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.post(
    "",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new note"
)
def create_note(
    dto: CreateNoteDTO,
    db: Session = Depends(get_db)
):
    """
    Create a new note with title and content.
    """
    service = NoteService(db)
    return service.create_note(dto)


@router.get(
    "",
    response_model=List[NoteResponse],
    summary="Get all notes"
)
def get_notes(
    archived: Optional[bool] = Query(None, description="Filter by archived status"),
    category_id: Optional[UUID] = Query(None, description="Filter by category ID"),
    db: Session = Depends(get_db)
):
    """
    Get all notes with optional filters:
    - archived: true (only archived), false (only active), null (all notes)
    - category_id: filter by specific category
    """
    service = NoteService(db)
    return service.get_notes(archived=archived, category_id=category_id)


@router.get(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Get a single note"
)
def get_note(
    note_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get a single note by ID.
    """
    service = NoteService(db)
    return service.get_note(note_id)


@router.put(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Update a note"
)
def update_note(
    note_id: UUID,
    dto: UpdateNoteDTO,
    db: Session = Depends(get_db)
):
    """
    Update an existing note's title and/or content.
    """
    service = NoteService(db)
    return service.update_note(note_id, dto)


@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a note"
)
def delete_note(
    note_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Delete a note permanently.
    """
    service = NoteService(db)
    service.delete_note(note_id)


@router.patch(
    "/{note_id}/archive",
    response_model=NoteResponse,
    summary="Archive a note"
)
def archive_note(
    note_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Archive a note (sets is_archived to true).
    """
    service = NoteService(db)
    return service.archive_note(note_id)


@router.patch(
    "/{note_id}/unarchive",
    response_model=NoteResponse,
    summary="Unarchive a note"
)
def unarchive_note(
    note_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Unarchive a note (sets is_archived to false).
    """
    service = NoteService(db)
    return service.unarchive_note(note_id)


@router.post(
    "/{note_id}/categories/{category_id}",
    response_model=NoteResponse,
    summary="Add category to note"
)
def add_category_to_note(
    note_id: UUID,
    category_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Add a category to a note.
    """
    service = NoteService(db)
    return service.add_category_to_note(note_id, category_id)


@router.delete(
    "/{note_id}/categories/{category_id}",
    response_model=NoteResponse,
    summary="Remove category from note"
)
def remove_category_from_note(
    note_id: UUID,
    category_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Remove a category from a note.
    """
    service = NoteService(db)
    return service.remove_category_from_note(note_id, category_id)
