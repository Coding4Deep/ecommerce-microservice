from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING
import os
from utils.logger import logger

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def get_database():
    return db.database

async def init_db():
    """Initialize database connection and create indexes"""
    try:
        # MongoDB connection
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017/ecommerce")
        db.client = AsyncIOMotorClient(mongodb_url)
        db.database = db.client.get_default_database()
        
        # Test connection
        await db.client.admin.command('ping')
        logger.info("Connected to MongoDB successfully")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_db():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed")

async def create_indexes():
    """Create database indexes for optimal performance"""
    try:
        users_collection = db.database.users
        
        # Create indexes
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("phone", ASCENDING)], sparse=True),
            IndexModel([("created_at", ASCENDING)]),
            IndexModel([("is_active", ASCENDING)]),
            IndexModel([("role", ASCENDING)])
        ]
        
        await users_collection.create_indexes(indexes)
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")
        raise

# Dependency to get database
async def get_db():
    return await get_database()
