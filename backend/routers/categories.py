from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from config.database import get_db
from services.category_service import CategoryService
from schemas.category_schemas import CreateCategoryDTO, UpdateCategoryDTO, CategoryResponse

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new category"
)
def create_category(
    dto: CreateCategoryDTO,
    db: Session = Depends(get_db)
):
    """
    Create a new category with a unique name and optional color.
    """
    service = CategoryService(db)
    return service.create_category(dto)


@router.get(
    "",
    response_model=List[CategoryResponse],
    summary="Get all categories"
)
def get_categories(
    db: Session = Depends(get_db)
):
    """
    Get all categories ordered by name.
    """
    service = CategoryService(db)
    return service.get_categories()


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Get a single category"
)
def get_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get a single category by ID.
    """
    service = CategoryService(db)
    return service.get_category(category_id)


@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Update a category"
)
def update_category(
    category_id: UUID,
    dto: UpdateCategoryDTO,
    db: Session = Depends(get_db)
):
    """
    Update an existing category's name and/or color.
    """
    service = CategoryService(db)
    return service.update_category(category_id, dto)


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a category"
)
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Delete a category. This will remove the category from all associated notes.
    """
    service = CategoryService(db)
    service.delete_category(category_id)
