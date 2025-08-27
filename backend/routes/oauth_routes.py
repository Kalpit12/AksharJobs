from flask import Blueprint, request, jsonify, redirect, url_for, session
from services.oauth_service import OAuthService
import requests
import os
import json

oauth_routes = Blueprint("oauth_routes", __name__)

@oauth_routes.route("/google/auth", methods=["GET"])
def google_auth():
    """Initiate Google OAuth flow"""
    try:
        print("Google auth endpoint called")
        print(f"GOOGLE_CLIENT_ID: {os.getenv('GOOGLE_CLIENT_ID')}")
        print(f"GOOGLE_REDIRECT_URI: {os.getenv('GOOGLE_REDIRECT_URI')}")
        
        auth_url = OAuthService.get_google_auth_url()
        print(f"Generated auth URL: {auth_url}")
        
        if auth_url:
            return jsonify({"auth_url": auth_url}), 200
        else:
            return jsonify({"error": "Google OAuth not configured"}), 500
    except Exception as e:
        print(f"Error in Google auth: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@oauth_routes.route("/linkedin/auth", methods=["GET"])
def linkedin_auth():
    """Initiate LinkedIn OAuth flow"""
    try:
        auth_url = OAuthService.get_linkedin_auth_url()
        if auth_url:
            return jsonify({"auth_url": auth_url}), 200
        else:
            return jsonify({"error": "LinkedIn OAuth not configured"}), 500
    except Exception as e:
        print(f"Error in LinkedIn auth: {e}")
        return jsonify({"error": "An error occurred"}), 500

@oauth_routes.route("/google/callback", methods=["GET"])
def google_callback():
    """Handle Google OAuth callback"""
    try:
        code = request.args.get('code')
        if not code:
            return jsonify({"error": "Authorization code not received"}), 400
        
        # Exchange code for access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:3002/api/auth/google/callback')
        }
        
        token_response = requests.post(token_url, data=token_data)
        
        if token_response.status_code == 200:
            token_info = token_response.json()
            access_token = token_info.get('access_token')
            
            if access_token:
                # Get user info from Google
                user_info = OAuthService.get_google_user_info(access_token)
                
                if user_info:
                    # Handle OAuth login/signup
                    print(f"Got user info from Google: {user_info}")
                    result = OAuthService.handle_oauth_login(user_info)
                    print(f"OAuth login result: {result}")
                    
                    if result['success']:
                        if result.get('requires_signup'):
                            # New user - redirect directly to role selection
                            print("New user detected, redirecting to role selection")
                            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
                            role_selection_url = f"{frontend_url}/oauth-role-selection?data={json.dumps(result['oauth_data'])}"
                            print(f"Redirecting to: {role_selection_url}")
                            return redirect(role_selection_url)
                        else:
                            # Existing user - redirect to success page then dashboard
                            print("Existing user detected, redirecting to success page")
                            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
                            success_url = f"{frontend_url}/oauth-success?token={result['token']}&user={json.dumps(result['user'])}"
                            print(f"Redirecting to: {success_url}")
                            return redirect(success_url)
                    else:
                        if result.get('requires_signup'):
                            # Redirect to role selection page with OAuth data
                            print("Signup required, redirecting to role selection")
                            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
                            role_selection_url = f"{frontend_url}/oauth-role-selection?data={json.dumps(result['oauth_data'])}"
                            print(f"Redirecting to: {role_selection_url}")
                            return redirect(role_selection_url)
                        else:
                            # Redirect to error page
                            print("Error occurred, redirecting to error page")
                            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
                            error_url = f"{frontend_url}/oauth-error?message={result['message']}"
                            print(f"Redirecting to: {error_url}")
                            return redirect(error_url)
                else:
                    return jsonify({"error": "Failed to get user information from Google"}), 400
            else:
                return jsonify({"error": "Failed to get access token from Google"}), 400
        else:
            return jsonify({"error": "Failed to exchange code for access token"}), 400
            
    except Exception as e:
        print(f"Error in Google callback: {e}")
        return jsonify({"error": "An error occurred during Google authentication"}), 500

@oauth_routes.route("/oauth/signup", methods=["POST"])
def oauth_signup():
    """Complete OAuth signup with selected role"""
    try:
        data = request.get_json()
        print(f"OAuth signup called with data: {data}")
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract user data and role
        user_info = {
            'email': data.get('email'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'profile_picture': data.get('profile_picture', ''),
            'google_id': data.get('google_id', ''),
            'provider': data.get('provider', 'google')
        }
        user_type = data.get('userType', 'jobSeeker')
        
        print(f"User info: {user_info}")
        print(f"User type: {user_type}")
        
        if not user_info['email'] or not user_type:
            return jsonify({"error": "Email and user type are required"}), 400
        
        # Handle OAuth signup
        result = OAuthService.handle_oauth_signup(user_info, user_type)
        print(f"OAuth signup result: {result}")
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        print(f"Error in OAuth signup: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An error occurred during signup"}), 500

@oauth_routes.route("/linkedin/callback", methods=["GET"])
def linkedin_callback():
    """Handle LinkedIn OAuth callback"""
    try:
        code = request.args.get('code')
        if not code:
            return jsonify({"error": "Authorization code not received"}), 400
        
        # Exchange code for access token
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': os.getenv('LINKEDIN_CLIENT_ID'),
            'client_secret': os.getenv('LINKEDIN_CLIENT_SECRET'),
            'redirect_uri': os.getenv('LINKEDIN_REDIRECT_URI', 'http://localhost:3002/api/auth/linkedin/callback')
        }
        
        token_response = requests.post(token_url, data=token_data)
        
        if token_response.status_code == 200:
            token_info = token_response.json()
            access_token = token_info.get('access_token')
            
            if access_token:
                # Get user info from LinkedIn
                user_info = OAuthService.get_linkedin_user_info(access_token)
                
                if user_info:
                    # Handle OAuth login/signup
                    result = OAuthService.handle_oauth_login(user_info)
                    
                    if result['success']:
                        # Redirect to frontend with success data
                        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
                        success_url = f"{frontend_url}/oauth-success?token={result['token']}&user={json.dumps(result['user'])}"
                        return redirect(success_url)
                    else:
                        if result.get('requires_signup'):
                            # Redirect to signup page with OAuth data
                            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
                            signup_url = f"{frontend_url}/oauth-signup?data={json.dumps(result['oauth_data'])}"
                            return redirect(signup_url)
                        else:
                            # Redirect to error page
                            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3003')
                            error_url = f"{frontend_url}/oauth-error?message={result['message']}"
                            return redirect(error_url)
                else:
                    return jsonify({"error": "Failed to get user information from LinkedIn"}), 400
            else:
                return jsonify({"error": "Failed to get access token from LinkedIn"}), 400
        else:
            return jsonify({"error": "Failed to exchange code for access token"}), 400
            
    except Exception as e:
        print(f"Error in LinkedIn callback: {e}")
        return jsonify({"error": "An error occurred during LinkedIn authentication"}), 500

@oauth_routes.route("/oauth/status", methods=["GET"])
def oauth_status():
    """Check OAuth configuration status"""
    try:
        google_configured = bool(os.getenv('GOOGLE_CLIENT_ID') and os.getenv('GOOGLE_CLIENT_SECRET'))
        linkedin_configured = bool(os.getenv('LINKEDIN_CLIENT_ID') and os.getenv('LINKEDIN_CLIENT_SECRET'))
        
        return jsonify({
            "google_configured": google_configured,
            "linkedin_configured": linkedin_configured,
            "frontend_url": os.getenv('FRONTEND_URL', 'http://localhost:3003')
        }), 200
        
    except Exception as e:
        print(f"Error checking OAuth status: {e}")
        return jsonify({"error": "An error occurred"}), 500
