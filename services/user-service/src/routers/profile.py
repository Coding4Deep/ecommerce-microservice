from fastapi import APIRouter, HTTPException, Depends, status
from models.user import UserResponse, UserUpdate, Address
from database import get_db
from routers.auth import get_current_user
from utils.logger import logger

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    """Get current user's profile"""
    try:
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        
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
        logger.error(f"Error fetching profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch profile"
        )

# Placeholder for get_current_user dependency
async def get_current_user():
    # This would be implemented with JWT token validation
    return {"id": "64a1b2c3d4e5f6789abcde01", "email": "user@example.com"}
