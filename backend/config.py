import os
from dotenv import load_dotenv
import cloudinary

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
SECRET_KEY = os.getenv("SECRET_KEY")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

class Config:
    JWT_SECRET_KEY = SECRET_KEY
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_ACCESS_TOKEN_EXPIRES = 3600

    

