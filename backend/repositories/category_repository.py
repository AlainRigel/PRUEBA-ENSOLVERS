from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from models.category import Category


class CategoryRepository:
    """
    Repository layer for Category entity.
    Handles all database operations for categories.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Category]:
        """
        Get all categories.
        
        Returns:
            List of all categories
        """
        return self.db.query(Category).order_by(Category.name).all()
    
    def get_by_id(self, category_id: UUID) -> Optional[Category]:
        """
        Get a single category by ID.
        
        Args:
            category_id: UUID of the category
            
        Returns:
            Category if found, None otherwise
        """
        return self.db.query(Category).filter(Category.id == category_id).first()
    
    def get_by_name(self, name: str) -> Optional[Category]:
        """
        Get a category by name.
        
        Args:
            name: Category name
            
        Returns:
            Category if found, None otherwise
        """
        return self.db.query(Category).filter(Category.name == name).first()
    
    def create(self, name: str, color: Optional[str] = None) -> Category:
        """
        Create a new category.
        
        Args:
            name: Category name
            color: Optional hex color code
            
        Returns:
            Created category
        """
        category = Category(name=name, color=color)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def update(
        self,
        category_id: UUID,
        name: Optional[str] = None,
        color: Optional[str] = None
    ) -> Optional[Category]:
        """
        Update an existing category.
        
        Args:
            category_id: UUID of the category to update
            name: New name (optional)
            color: New color (optional)
            
        Returns:
            Updated category if found, None otherwise
        """
        category = self.get_by_id(category_id)
        if not category:
            return None
        
        if name is not None:
            category.name = name
        if color is not None:
            category.color = color
        
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def delete(self, category_id: UUID) -> bool:
        """
        Delete a category.
        
        Args:
            category_id: UUID of the category to delete
            
        Returns:
            True if deleted, False if not found
        """
        category = self.get_by_id(category_id)
        if not category:
            return False
        
        self.db.delete(category)
        self.db.commit()
        return True
