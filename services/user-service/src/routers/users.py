from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from models.user import UserResponse, UserUpdate
from database import get_db
from utils.logger import logger

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    """Get all users (admin only)"""
    try:
        cursor = db.users.find().skip(skip).limit(limit)
        users = []
        async for user in cursor:
            user_response = UserResponse(
                id=str(user["_id"]),
                email=user["email"],
                first_name=user["first_name"],
                last_name=user["last_name"],
                phone=user.get("phone"),
                role=user["role"],
                is_active=user["is_active"],
                is_verified=user["is_verified"],
                addresses=user.get("addresses", []),
                created_at=user["created_at"],
                updated_at=user["updated_at"],
                last_login=user.get("last_login")
            )
            users.append(user_response)
        
        return users
        
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch users"
        )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db = Depends(get_db)):
    """Get user by ID"""
    try:
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user_response = UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            first_name=user["first_name"],
            last_name=user["last_name"],
            phone=user.get("phone"),
            role=user["role"],
            is_active=user["is_active"],
            is_verified=user["is_verified"],
            addresses=user.get("addresses", []),
            created_at=user["created_at"],
            updated_at=user["updated_at"],
            last_login=user.get("last_login")
        )
        
        return user_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user"
        )
