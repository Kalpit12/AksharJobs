import jwt
import datetime
from config import Config
from flask_jwt_extended import create_access_token

SECRET_KEY = Config.JWT_SECRET_KEY

def generate_jwt_token(user_id):
    """
    Generates a JWT token for user authentication using Flask-JWT-Extended.

    Parameters:
    - user_id (str): The user ID (ObjectId as string).

    Returns:
    - str: A JWT token encoded with the user's ID and expiration time.

    Token Expiry:
    - The token expires in 24 hours (extended from 1 hour for better UX).
    """
    # Use Flask-JWT-Extended to create properly formatted tokens
    # This ensures compatibility with @jwt_required() decorator
    access_token = create_access_token(
        identity=user_id,
        expires_delta=datetime.timedelta(hours=24)
    )
    return access_token

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