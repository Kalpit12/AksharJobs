from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from bson import ObjectId
import json
from models.community_model import Community

community_routes = Blueprint('community_routes', __name__)
# Communities - Public endpoints used by frontend (JobSearch, CommunitySelector)
@community_routes.route("/communities", methods=["GET"])
def list_communities():
    """Return all active communities (public)"""
    try:
        items = Community.get_all_communities() or []
        # Normalize ObjectIds to strings
        normalized = []
        for c in items:
            try:
                c["_id"] = str(c.get("_id"))
            except Exception:
                pass
            normalized.append(c)
        return jsonify({
            "success": True,
            "communities": normalized,
            "total": len(normalized)
        }), 200
    except Exception as e:
        print(f"Error listing communities: {e}")
        # Return empty list instead of 500 to avoid breaking UI
        return jsonify({
            "success": True,
            "communities": [],
            "total": 0
        }), 200


@community_routes.route("/communities/<community_id>", methods=["GET"])
def get_community(community_id):
    """Return a specific community by id (public)"""
    try:
        doc = Community.get_community_by_id(community_id)
        if not doc:
            return jsonify({"success": False, "error": "Community not found"}), 404
        try:
            doc["_id"] = str(doc.get("_id"))
        except Exception:
            pass
        return jsonify({"success": True, "community": doc}), 200
    except Exception as e:
        print(f"Error fetching community {community_id}: {e}")
        return jsonify({"success": False, "error": "Failed to fetch community"}), 500


@community_routes.route("/communities/stats", methods=["GET"])
def communities_stats_public():
    """Basic community stats (public). Uses counts from DB if available."""
    try:
        items = Community.get_all_communities() or []
        total = len(items)
        active = sum(1 for c in items if c.get("is_active", True))
        categories = {}
        for c in items:
            cat = (c.get("category") or "Uncategorized").strip() or "Uncategorized"
            categories[cat] = categories.get(cat, 0) + 1
        return jsonify({
            "success": True,
            "stats": {
                "total": total,
                "active": active,
                "by_category": categories
            }
        }), 200
    except Exception as e:
        print(f"Error fetching community stats: {e}")
        return jsonify({
            "success": True,
            "stats": {"total": 0, "active": 0, "by_category": {}}
        }), 200

# Mock data storage - in production, this would be MongoDB
questions_db = []
polls_db = []
votes_db = {}

@community_routes.route("/qa/questions", methods=["GET"])
@jwt_required()
def get_questions():
    """Get all questions with optional filtering and sorting"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        sort_by = request.args.get('sort', 'recent')  # recent, popular, answered
        category = request.args.get('category', 'all')
        search = request.args.get('search', '')
        
        # Filter questions
        filtered_questions = questions_db.copy()
        
        # Apply category filter
        if category != 'all':
            filtered_questions = [q for q in filtered_questions if q.get('category', '').lower() == category.lower()]
        
        # Apply search filter
        if search:
            filtered_questions = [
                q for q in filtered_questions 
                if search.lower() in q.get('title', '').lower() or 
                   search.lower() in q.get('content', '').lower()
            ]
        
        # Sort questions
        if sort_by == 'recent':
            filtered_questions.sort(key=lambda x: x.get('timestamp', datetime.min), reverse=True)
        elif sort_by == 'popular':
            filtered_questions.sort(key=lambda x: x.get('upvotes', 0) - x.get('downvotes', 0), reverse=True)
        elif sort_by == 'answered':
            filtered_questions.sort(key=lambda x: len(x.get('answers', [])), reverse=True)
        
        return jsonify({
            "success": True,
            "questions": filtered_questions,
            "total": len(filtered_questions)
        }), 200
        
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return jsonify({"error": "Failed to fetch questions"}), 500

@community_routes.route("/qa/questions", methods=["POST"])
@jwt_required()
def create_question():
    """Create a new question"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title') or not data.get('content'):
            return jsonify({"error": "Title and content are required"}), 400
        
        question = {
            "id": str(ObjectId()),
            "title": data['title'],
            "content": data['content'],
            "category": data.get('category', 'General'),
            "author_id": current_user_id,
            "author": "Current User",  # In production, fetch from user profile
            "author_role": "Job Seeker",  # In production, fetch from user profile
            "timestamp": datetime.utcnow().isoformat(),
            "upvotes": 0,
            "downvotes": 0,
            "answers": [],
            "tags": data.get('tags', []),
            "is_active": True
        }
        
        questions_db.append(question)
        
        return jsonify({
            "success": True,
            "question": question,
            "message": "Question created successfully"
        }), 201
        
    except Exception as e:
        print(f"Error creating question: {e}")
        return jsonify({"error": "Failed to create question"}), 500

@community_routes.route("/qa/questions/<question_id>/answers", methods=["POST"])
@jwt_required()
def create_answer():
    """Create an answer for a question"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        question_id = request.view_args['question_id']
        
        if not data.get('content'):
            return jsonify({"error": "Answer content is required"}), 400
        
        # Find the question
        question = next((q for q in questions_db if q['id'] == question_id), None)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        answer = {
            "id": str(ObjectId()),
            "content": data['content'],
            "author_id": current_user_id,
            "author": "Current User",  # In production, fetch from user profile
            "author_role": "Job Seeker",  # In production, fetch from user profile
            "timestamp": datetime.utcnow().isoformat(),
            "upvotes": 0,
            "is_accepted": False
        }
        
        question['answers'].append(answer)
        
        return jsonify({
            "success": True,
            "answer": answer,
            "message": "Answer posted successfully"
        }), 201
        
    except Exception as e:
        print(f"Error creating answer: {e}")
        return jsonify({"error": "Failed to create answer"}), 500

@community_routes.route("/qa/questions/<question_id>/vote", methods=["POST"])
@jwt_required()
def vote_question():
    """Vote on a question (upvote or downvote)"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        question_id = request.view_args['question_id']
        
        vote_type = data.get('type')  # 'up' or 'down'
        if vote_type not in ['up', 'down']:
            return jsonify({"error": "Invalid vote type"}), 400
        
        # Find the question
        question = next((q for q in questions_db if q['id'] == question_id), None)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        # Update vote count
        if vote_type == 'up':
            question['upvotes'] += 1
        else:
            question['downvotes'] += 1
        
        return jsonify({
            "success": True,
            "message": "Vote recorded successfully",
            "upvotes": question['upvotes'],
            "downvotes": question['downvotes']
        }), 200
        
    except Exception as e:
        print(f"Error voting on question: {e}")
        return jsonify({"error": "Failed to record vote"}), 500

@community_routes.route("/polls", methods=["GET"])
@jwt_required()
def get_polls():
    """Get all active polls"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        status = request.args.get('status', 'active')  # active, expired, all
        
        filtered_polls = polls_db.copy()
        
        # Filter by status
        if status == 'active':
            filtered_polls = [p for p in filtered_polls if p.get('is_active', True)]
        elif status == 'expired':
            filtered_polls = [p for p in filtered_polls if not p.get('is_active', True)]
        
        # Sort by creation date (newest first)
        filtered_polls.sort(key=lambda x: x.get('created_at', datetime.min), reverse=True)
        
        return jsonify({
            "success": True,
            "polls": filtered_polls,
            "total": len(filtered_polls)
        }), 200
        
    except Exception as e:
        print(f"Error fetching polls: {e}")
        return jsonify({"error": "Failed to fetch polls"}), 500

@community_routes.route("/polls", methods=["POST"])
@jwt_required()
def create_poll():
    """Create a new poll"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title') or not data.get('options'):
            return jsonify({"error": "Title and options are required"}), 400
        
        if len(data['options']) < 2:
            return jsonify({"error": "At least 2 options are required"}), 400
        
        # Calculate expiration time
        duration_hours = data.get('duration', 24)
        expires_at = datetime.utcnow() + timedelta(hours=duration_hours)
        
        poll = {
            "id": str(ObjectId()),
            "title": data['title'],
            "description": data.get('description', ''),
            "options": [
                {
                    "id": i + 1,
                    "text": option,
                    "votes": 0,
                    "percentage": 0
                }
                for i, option in enumerate(data['options'])
            ],
            "total_votes": 0,
            "author_id": current_user_id,
            "author": "Current User",  # In production, fetch from user profile
            "category": data.get('category', 'General'),
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": expires_at.isoformat(),
            "is_active": True,
            "is_public": data.get('is_public', True),
            "tags": data.get('tags', [])
        }
        
        polls_db.append(poll)
        
        return jsonify({
            "success": True,
            "poll": poll,
            "message": "Poll created successfully"
        }), 201
        
    except Exception as e:
        print(f"Error creating poll: {e}")
        return jsonify({"error": "Failed to create poll"}), 500

@community_routes.route("/polls/<poll_id>/vote", methods=["POST"])
@jwt_required()
def vote_poll():
    """Vote on a poll"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        poll_id = request.view_args['poll_id']
        
        option_id = data.get('option_id')
        if not option_id:
            return jsonify({"error": "Option ID is required"}), 400
        
        # Check if user has already voted
        user_votes = votes_db.get(current_user_id, {})
        if poll_id in user_votes:
            return jsonify({"error": "You have already voted on this poll"}), 400
        
        # Find the poll
        poll = next((p for p in polls_db if p['id'] == poll_id), None)
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        
        if not poll.get('is_active', True):
            return jsonify({"error": "Poll is no longer active"}), 400
        
        # Find the option
        option = next((opt for opt in poll['options'] if opt['id'] == option_id), None)
        if not option:
            return jsonify({"error": "Invalid option"}), 400
        
        # Update vote counts
        option['votes'] += 1
        poll['total_votes'] += 1
        
        # Recalculate percentages
        for opt in poll['options']:
            opt['percentage'] = round((opt['votes'] / poll['total_votes']) * 100) if poll['total_votes'] > 0 else 0
        
        # Record user's vote
        if current_user_id not in votes_db:
            votes_db[current_user_id] = {}
        votes_db[current_user_id][poll_id] = option_id
        
        return jsonify({
            "success": True,
            "message": "Vote recorded successfully",
            "poll": poll
        }), 200
        
    except Exception as e:
        print(f"Error voting on poll: {e}")
        return jsonify({"error": "Failed to record vote"}), 500

@community_routes.route("/polls/<poll_id>", methods=["GET"])
@jwt_required()
def get_poll_details():
    """Get detailed information about a specific poll"""
    try:
        current_user_id = get_jwt_identity()
        poll_id = request.view_args['poll_id']
        
        # Find the poll
        poll = next((p for p in polls_db if p['id'] == poll_id), None)
        if not poll:
            return jsonify({"error": "Poll not found"}), 404
        
        # Check if user has voted
        user_votes = votes_db.get(current_user_id, {})
        has_voted = poll_id in user_votes
        user_vote_option = user_votes.get(poll_id)
        
        return jsonify({
            "success": True,
            "poll": poll,
            "has_voted": has_voted,
            "user_vote_option": user_vote_option
        }), 200
        
    except Exception as e:
        print(f"Error fetching poll details: {e}")
        return jsonify({"error": "Failed to fetch poll details"}), 500

@community_routes.route("/community/stats", methods=["GET"])
@jwt_required()
def get_community_stats():
    """Get community statistics"""
    try:
        current_user_id = get_jwt_identity()
        
        # Calculate stats
        total_questions = len(questions_db)
        total_polls = len(polls_db)
        total_answers = sum(len(q.get('answers', [])) for q in questions_db)
        total_votes = sum(p.get('total_votes', 0) for p in polls_db)
        
        # Mock active users count
        active_users = 1247
        
        stats = {
            "active_users": active_users,
            "total_questions": total_questions,
            "total_polls": total_polls,
            "total_answers": total_answers,
            "total_votes": total_votes,
            "questions_answered": total_answers,
            "polls_created": total_polls,
            "total_engagement": total_questions + total_answers + total_votes
        }
        
        return jsonify({
            "success": True,
            "stats": stats
        }), 200
        
    except Exception as e:
        print(f"Error fetching community stats: {e}")
        return jsonify({"error": "Failed to fetch community stats"}), 500

# Initialize with some mock data
def initialize_mock_data():
    """Initialize mock data for development"""
    global questions_db, polls_db
    
    if not questions_db:
        questions_db.extend([
            {
                "id": "1",
                "title": "What are the best practices for remote work productivity?",
                "content": "I've been working remotely for 6 months and I'm looking for ways to improve my productivity. What strategies have worked best for you?",
                "author": "Sarah Johnson",
                "author_role": "Senior Developer",
                "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                "category": "Career",
                "upvotes": 15,
                "downvotes": 2,
                "answers": [
                    {
                        "id": "1",
                        "content": "I've found that having a dedicated workspace and following the Pomodoro Technique really helps. Also, taking regular breaks and staying hydrated.",
                        "author": "Mike Chen",
                        "author_role": "Product Manager",
                        "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                        "upvotes": 8,
                        "is_accepted": True
                    }
                ],
                "tags": ["remote-work", "productivity", "career"]
            }
        ])
    
    if not polls_db:
        polls_db.extend([
            {
                "id": "1",
                "title": "What's your preferred work arrangement?",
                "description": "Help us understand the current trends in work preferences",
                "options": [
                    {"id": 1, "text": "Fully Remote", "votes": 234, "percentage": 45},
                    {"id": 2, "text": "Hybrid (2-3 days in office)", "votes": 189, "percentage": 36},
                    {"id": 3, "text": "Fully On-site", "votes": 67, "percentage": 13},
                    {"id": 4, "text": "Flexible (varies by project)", "votes": 31, "percentage": 6}
                ],
                "total_votes": 521,
                "author": "HR Team",
                "category": "Work Life",
                "created_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                "expires_at": (datetime.utcnow() + timedelta(hours=22)).isoformat(),
                "is_active": True,
                "is_public": True,
                "tags": ["work", "remote", "flexibility"]
            }
        ])

# Initialize mock data when the module is imported
initialize_mock_data()