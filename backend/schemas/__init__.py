from schemas.note_schemas import (
    NoteBase,
    CreateNoteDTO,
    UpdateNoteDTO,
    NoteResponse,
    NoteListResponse
)
from schemas.category_schemas import (
    CategoryBase,
    CreateCategoryDTO,
    UpdateCategoryDTO,
    CategoryResponse,
    CategoryWithNotesCount
)

__all__ = [
    "NoteBase",
    "CreateNoteDTO",
    "UpdateNoteDTO",
    "NoteResponse",
    "NoteListResponse",
    "CategoryBase",
    "CreateCategoryDTO",
    "UpdateCategoryDTO",
    "CategoryResponse",
    "CategoryWithNotesCount"
]
