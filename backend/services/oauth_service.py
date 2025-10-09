import requests
import json
from flask import current_app
from services.auth_service import AuthService
from models.user_model import User
from utils.db import get_db
import jwt
from datetime import datetime, timedelta
import os

class OAuthService:
    
    @staticmethod
    def get_google_user_info(access_token):
        """Get user information from Google using access token"""
        try:
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers=headers
            )
            
            if response.status_code == 200:
                user_info = response.json()
                return {
                    'email': user_info.get('email'),
                    'first_name': user_info.get('given_name', ''),
                    'last_name': user_info.get('family_name', ''),
                    'profile_picture': user_info.get('picture', ''),
                    'google_id': user_info.get('id'),
                    'provider': 'google'
                }
            else:
                return None
        except Exception as e:
            print(f"Error getting Google user info: {e}")
            return None
    
    @staticmethod
    def get_linkedin_user_info(access_token):
        """Get user information from LinkedIn using access token"""
        try:
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(
                'https://api.linkedin.com/v2/me',
                headers=headers
            )
            
            if response.status_code == 200:
                user_info = response.json()
                
                # Get email address separately
                email_response = requests.get(
                    'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
                    headers=headers
                )
                
                email = ''
                if email_response.status_code == 200:
                    email_data = email_response.json()
                    if email_data.get('elements') and len(email_data['elements']) > 0:
                        email = email_data['elements'][0]['handle~']['emailAddress']
                
                return {
                    'email': email,
                    'first_name': user_info.get('localizedFirstName', ''),
                    'last_name': user_info.get('localizedLastName', ''),
                    'profile_picture': '',  # LinkedIn doesn't provide profile picture in basic API
                    'linkedin_id': user_info.get('id'),
                    'provider': 'linkedin'
                }
            else:
                return None
        except Exception as e:
            print(f"Error getting LinkedIn user info: {e}")
            return None
    
    @staticmethod
    def handle_oauth_login(user_info):
        """Handle OAuth login - check if user exists and return user data"""
        try:
            db = get_db()
            users_collection = db.users
            
            # Check if user exists by email
            existing_user = users_collection.find_one({'email': user_info['email']})
            
            if existing_user:
                # User exists, check if they have OAuth provider info
                if 'oauth_providers' not in existing_user:
                    # Add OAuth provider info to existing user
                    users_collection.update_one(
                        {'_id': existing_user['_id']},
                        {
                            '$set': {
                                'oauth_providers': [user_info['provider']],
                                f'{user_info["provider"]}_id': user_info.get(f'{user_info["provider"]}_id', ''),
                                'last_login': datetime.utcnow()
                            }
                        }
                    )
                
                # Check if user has completed profile setup
                profile_completed = existing_user.get('profileCompleted', False)
                
                # Generate JWT token
                token = OAuthService.generate_jwt_token(existing_user)
                
                return {
                    'success': True,
                    'message': 'Login successful',
                    'token': token,
                    'user': {
                        'id': str(existing_user['_id']),
                        'email': existing_user['email'],
                        'firstName': existing_user.get('firstName', ''),
                        'lastName': existing_user.get('lastName', ''),
                        'userType': existing_user.get('userType', 'jobSeeker'),
                        'role': existing_user.get('userType', 'jobSeeker'),
                        'profileCompleted': profile_completed
                    }
                }
            else:
                return {
                    'success': False,
                    'message': 'User not found. Please sign up first.',
                    'requires_signup': True,
                    'oauth_data': user_info
                }
                
        except Exception as e:
            print(f"Error in OAuth login: {e}")
            return {
                'success': False,
                'message': 'An error occurred during login'
            }
    
    @staticmethod
    def handle_oauth_signup(user_info, user_type='jobSeeker'):
        """Handle OAuth signup - create new user account"""
        try:
            print(f"OAuth signup called with user_info: {user_info}, user_type: {user_type}")
            db = get_db()
            users_collection = db.users
            
            # Check if user already exists
            existing_user = users_collection.find_one({'email': user_info['email']})
            if existing_user:
                print(f"User already exists: {existing_user}")
                return {
                    'success': False,
                    'message': 'User already exists. Please login instead.'
                }
            
            # Create new user data
            new_user_data = {
                'email': user_info['email'],
                'firstName': user_info['first_name'],
                'lastName': user_info['last_name'],
                'userType': user_type,
                'password': '',  # No password for OAuth users
                'oauth_providers': [user_info['provider']],
                f'{user_info["provider"]}_id': user_info.get(f'{user_info["provider"]}_id', ''),
                'profileImage': user_info.get('profile_picture', ''),
                'createdAt': datetime.utcnow(),
                'lastLogin': datetime.utcnow(),
                'isEmailVerified': True,  # OAuth users are pre-verified
                'isPhoneVerified': False,
                'status': 'active'
            }
            
            print(f"Creating new user with data: {new_user_data}")
            
            # Insert new user
            result = users_collection.insert_one(new_user_data)
            
            if result.inserted_id:
                # Create promo code for new user
                try:
                    from services.promo_code_service import PromoCodeService
                    promo_result = PromoCodeService.create_user_promo_code(
                        str(result.inserted_id),
                        user_info['first_name'],
                        user_info['last_name'],
                        user_type
                    )
                    print(f"Promo code creation result: {promo_result}")
                except Exception as e:
                    print(f"Error creating promo code for OAuth user: {e}")
                
                # Generate JWT token
                user_data = {
                    '_id': result.inserted_id,
                    'email': user_info['email'],
                    'firstName': user_info['first_name'],
                    'lastName': user_info['last_name'],
                    'userType': user_type
                }
                
                token = OAuthService.generate_jwt_token(user_data)
                
                result_data = {
                    'success': True,
                    'message': 'Account created successfully',
                    'token': token,
                    'user': {
                        'id': str(result.inserted_id),
                        'email': user_info['email'],
                        'firstName': user_info['first_name'],
                        'lastName': user_info['last_name'],
                        'userType': user_type,
                        'role': user_type,
                        'profileCompleted': False  # New users haven't completed profile
                    }
                }
                print(f"Returning success result: {result_data}")
                return result_data
            else:
                return {
                    'success': False,
                    'message': 'Failed to create account'
                }
                
        except Exception as e:
            print(f"Error in OAuth signup: {e}")
            return {
                'success': False,
                'message': 'An error occurred during signup'
            }
    
    @staticmethod
    def generate_jwt_token(user_data):
        """Generate JWT token for OAuth users"""
        try:
            secret_key = os.getenv('SECRET_KEY')
            payload = {
                'sub': str(user_data['_id']),  # Flask-JWT-Extended expects 'sub' claim
                'user_id': str(user_data['_id']),
                'email': user_data['email'],
                'role': user_data.get('userType', 'jobSeeker'),
                'exp': datetime.utcnow() + timedelta(hours=24)
            }
            
            token = jwt.encode(payload, secret_key, algorithm='HS256')
            return token
            
        except Exception as e:
            print(f"Error generating JWT token: {e}")
            return None
    
    @staticmethod
    def get_google_auth_url():
        """Generate Google OAuth URL"""
        try:
            print("get_google_auth_url called")
            client_id = os.getenv('GOOGLE_CLIENT_ID')
            redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:3002/api/auth/google/callback')
            
            print(f"Client ID: {client_id}")
            print(f"Redirect URI: {redirect_uri}")
            
            if not client_id:
                print("No Google Client ID found")
                return None
                
            scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
            
            auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?" \
                      f"client_id={client_id}&" \
                      f"redirect_uri={redirect_uri}&" \
                      f"scope={scope}&" \
                      f"response_type=code&" \
                      f"access_type=offline"
            
            print(f"Generated auth URL: {auth_url}")
            return auth_url
            
        except Exception as e:
            print(f"Error in get_google_auth_url: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    @staticmethod
    def get_linkedin_auth_url():
        """Generate LinkedIn OAuth URL"""
        client_id = os.getenv('LINKEDIN_CLIENT_ID')
        redirect_uri = os.getenv('LINKEDIN_REDIRECT_URI', 'http://localhost:3002/api/auth/linkedin/callback')
        
        if not client_id:
            return None
            
        scope = 'r_liteprofile r_emailaddress'
        
        auth_url = f"https://www.linkedin.com/oauth/v2/authorization?" \
                  f"response_type=code&" \
                  f"client_id={client_id}&" \
                  f"redirect_uri={redirect_uri}&" \
                  f"scope={scope}&" \
                  f"state=random_state_string"
        
        return auth_url
