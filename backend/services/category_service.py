from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from uuid import UUID
from fastapi import HTTPException, status

from repositories.category_repository import CategoryRepository
from schemas.category_schemas import CreateCategoryDTO, UpdateCategoryDTO, CategoryResponse


class CategoryService:
    """
    Service layer for Category business logic.
    Orchestrates operations between routers and repositories.
    """
    
    def __init__(self, db: Session):
        self.category_repo = CategoryRepository(db)
    
    def create_category(self, dto: CreateCategoryDTO) -> CategoryResponse:
        """
        Create a new category.
        
        Args:
            dto: Category creation data
            
        Returns:
            Created category
            
        Raises:
            HTTPException: If category name already exists
        """
        # Check if category with same name already exists
        existing = self.category_repo.get_by_name(dto.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with name '{dto.name}' already exists"
            )
        
        try:
            category = self.category_repo.create(name=dto.name, color=dto.color)
            return CategoryResponse.model_validate(category)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with name '{dto.name}' already exists"
            )
    
    def get_categories(self) -> List[CategoryResponse]:
        """
        Get all categories.
        
        Returns:
            List of all categories
        """
        categories = self.category_repo.get_all()
        return [CategoryResponse.model_validate(cat) for cat in categories]
    
    def get_category(self, category_id: UUID) -> CategoryResponse:
        """
        Get a single category by ID.
        
        Args:
            category_id: UUID of the category
            
        Returns:
            Category data
            
        Raises:
            HTTPException: If category not found
        """
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        return CategoryResponse.model_validate(category)
    
    def update_category(self, category_id: UUID, dto: UpdateCategoryDTO) -> CategoryResponse:
        """
        Update an existing category.
        
        Args:
            category_id: UUID of the category to update
            dto: Update data
            
        Returns:
            Updated category
            
        Raises:
            HTTPException: If category not found or name already exists
        """
        # Check if new name already exists (if name is being updated)
        if dto.name:
            existing = self.category_repo.get_by_name(dto.name)
            if existing and existing.id != category_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with name '{dto.name}' already exists"
                )
        
        category = self.category_repo.update(
            category_id=category_id,
            name=dto.name,
            color=dto.color
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        return CategoryResponse.model_validate(category)
    
    def delete_category(self, category_id: UUID) -> None:
        """
        Delete a category.
        
        Args:
            category_id: UUID of the category to delete
            
        Raises:
            HTTPException: If category not found
        """
        deleted = self.category_repo.delete(category_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
