import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

def generate_jwt_token(user_id):
    """
    Generates a JWT token for user authentication.

    Parameters:
    - user_id (str): The user ID (ObjectId as string).

    Returns:
    - str: A JWT token encoded with the user's ID and expiration time.

    Token Expiry:
    - The token expires in 24 hours (extended from 1 hour for better UX).
    """
    payload = {
        "sub": user_id,  # Flask-JWT-Extended expects 'sub' claim
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(token):
    """
    Verifies and decodes a JWT token.

    Parameters:
    - token (str): The JWT token to verify.

    Returns:
    - dict: Decoded token payload if valid.
    - None: If the token is expired or invalid."
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None