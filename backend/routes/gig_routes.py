from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.gig_service import GigService
from bson import ObjectId

gig_routes = Blueprint('gig_routes', __name__)

@gig_routes.route('/gigs', methods=['POST'])
@jwt_required()
def create_gig():
    """Create a new gig"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        # Get user role for better error messages
        from models.user_model import User
        user = User.find_by_id(user_id)
        if user:
            user_role = user.get("userType", "unknown")
            data["user_role"] = user_role  # Add role info for validation
        
        result = GigService.create_gig_service(data, user_id)
        
        if result["success"]:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs', methods=['GET'])
def get_gigs():
    """Get all gigs with optional filters"""
    try:
        # Get query parameters
        category = request.args.get('category')
        status = request.args.get('status')
        location_type = request.args.get('location_type')
        max_budget = request.args.get('max_budget', type=int)
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        # Build filters
        filters = {}
        if category:
            filters['category'] = category
        if status:
            filters['status'] = status
        if location_type:
            filters['location_type'] = location_type
        if max_budget:
            filters['max_budget'] = max_budget
        
        result = GigService.get_gigs_service(filters, page, limit)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs/<gig_id>', methods=['GET'])
def get_gig(gig_id):
    """Get a specific gig by ID"""
    try:
        result = GigService.get_gig_by_id_service(gig_id)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs/<gig_id>/apply', methods=['POST'])
@jwt_required()
def apply_for_gig(gig_id):
    """Apply for a gig"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'proposal' not in data or 'bid_amount' not in data:
            return jsonify({"success": False, "error": "Proposal and bid amount are required"}), 400
        
        proposal = data['proposal']
        bid_amount = data['bid_amount']
        
        if not proposal.strip():
            return jsonify({"success": False, "error": "Proposal cannot be empty"}), 400
        
        if not isinstance(bid_amount, (int, float)) or bid_amount <= 0:
            return jsonify({"success": False, "error": "Invalid bid amount"}), 400
        
        result = GigService.apply_for_gig_service(gig_id, user_id, proposal, bid_amount)
        
        if result["success"]:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs/<gig_id>/applications', methods=['GET'])
@jwt_required()
def get_gig_applications(gig_id):
    """Get applications for a specific gig (only for gig poster)"""
    try:
        user_id = get_jwt_identity()
        result = GigService.get_gig_applications_service(gig_id, user_id)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs/<gig_id>/applications/<application_id>/accept', methods=['POST'])
@jwt_required()
def accept_application(gig_id, application_id):
    """Accept a gig application (only for gig poster)"""
    try:
        user_id = get_jwt_identity()
        result = GigService.accept_gig_application_service(application_id, gig_id, user_id)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs/categories', methods=['GET'])
def get_gig_categories():
    """Get available gig categories"""
    try:
        # Get user role from query parameter if provided
        user_role = request.args.get('user_role', 'all')
        
        all_categories = {
            "recruiter": [
                "Web Development",
                "Mobile Development", 
                "Graphic Design",
                "Digital Marketing",
                "SEO",
                "Customer Service",
                "Sales & Marketing",
                "Administrative",
                "Research",
                "Other"
            ],
            "job_seeker": [
                "Content Writing",
                "Virtual Assistant", 
                "Translation",
                "Video Editing",
                "Social Media Management",
                "Data Entry",
                "Research",
                "Administrative",
                "Other"
            ],
            "all": [
                "Web Development",
                "Mobile Development", 
                "Graphic Design",
                "Content Writing",
                "Digital Marketing",
                "Data Entry",
                "Virtual Assistant",
                "Translation",
                "Video Editing",
                "Social Media Management",
                "SEO",
                "Customer Service",
                "Sales & Marketing",
                "Administrative",
                "Research",
                "Other"
            ]
        }
        
        categories = all_categories.get(user_role, all_categories["all"])
        
        return jsonify({
            "success": True,
            "categories": categories,
            "user_role": user_role
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs/my-gigs', methods=['GET'])
@jwt_required()
def get_my_gigs():
    """Get gigs posted by the current user"""
    try:
        user_id = get_jwt_identity()
        
        # This would need to be implemented in the service
        # For now, return a placeholder
        return jsonify({
            "success": True,
            "message": "Feature coming soon",
            "gigs": []
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gig_routes.route('/gigs/my-applications', methods=['GET'])
@jwt_required()
def get_my_applications():
    """Get applications submitted by the current user"""
    try:
        user_id = get_jwt_identity()
        
        # This would need to be implemented in the service
        # For now, return a placeholder
        return jsonify({
            "success": True,
            "message": "Feature coming soon",
            "applications": []
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
