from pymongo import MongoClient

from app.core.config import settings


client = MongoClient(settings.MONGO_URL)

db = client[settings.DATABASE_NAME]

users_collection = db["users"]
chats_collection = db["chats"]
projects_collection = db["projects"]
files_collection = db["files"]
messages_collection = db["messages"]