from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
import os
import logging
from services.local_language_resume_service import LocalLanguageResumeService
from services.resume_service import ResumeService
from utils.GeminiResult import call_gemini_free
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.edn.local')

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize services
local_language_service = LocalLanguageResumeService(gemini_model)
resume_service = ResumeService(gemini_model)

local_language_routes = Blueprint("local_language_routes", __name__)

@local_language_routes.route("/analyze_local_context", methods=["POST"])
@jwt_required()
@cross_origin()
def analyze_local_context():
    """
    Analyze resume for local Kenyan context, language usage, and cultural elements.
    This is the main endpoint for recruiters to get enhanced local market insights.
    
    Request Body:
    - resume_text: Raw text content of the resume
    - candidate_id: Optional candidate ID for tracking
    
    Returns:
    - Comprehensive local context analysis with cultural insights
    """
    try:
        data = request.json
        if not data or 'resume_text' not in data:
            return jsonify({"error": "Resume text is required"}), 400
        
        resume_text = data['resume_text']
        candidate_id = data.get('candidate_id', 'unknown')
        
        if not resume_text.strip():
            return jsonify({"error": "Resume text cannot be empty"}), 400
        
        logging.info(f"Starting local context analysis for candidate: {candidate_id}")
        
        # Perform local context analysis
        local_analysis = local_language_service.analyze_local_context(resume_text)
        
        if not local_analysis:
            return jsonify({"error": "Failed to analyze local context"}), 500
        
        # Generate recruiter insights
        recruiter_insights = local_language_service.get_recruiter_insights(
            {'personal_info': {'name': candidate_id}}, 
            local_analysis
        )
        
        response_data = {
            "success": True,
            "candidate_id": candidate_id,
            "local_analysis": local_analysis,
            "recruiter_insights": recruiter_insights,
            "analysis_timestamp": str(datetime.now())
        }
        
        logging.info(f"Local context analysis completed for candidate: {candidate_id}")
        return jsonify(response_data), 200
        
    except Exception as e:
        logging.error(f"Error in local context analysis: {str(e)}")
        return jsonify({"error": "Internal server error during analysis"}), 500

@local_language_routes.route("/enhanced_resume_analysis", methods=["POST"])
@jwt_required()
@cross_origin()
def enhanced_resume_analysis():
    """
    Enhanced resume analysis combining standard resume parsing with local language analysis.
    This provides recruiters with both technical skills and local market fit.
    
    Request Body:
    - resume_file: Resume file (PDF/DOCX)
    - analysis_type: "standard", "local_focus", or "comprehensive"
    
    Returns:
    - Combined resume data and local market insights
    """
    try:
        # Check if file is present
        if 'resume_file' not in request.files:
            return jsonify({"error": "Resume file is required"}), 400
        
        file = request.files['resume_file']
        analysis_type = request.form.get('analysis_type', 'comprehensive')
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Validate file type
        allowed_extensions = {'pdf', 'docx', 'doc'}
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        
        if file_extension not in allowed_extensions:
            return jsonify({"error": "Unsupported file type. Use PDF or DOCX"}), 400
        
        # Save file temporarily
        temp_path = f"temp_resume_{os.getpid()}.{file_extension}"
        file.save(temp_path)
        
        try:
            # Extract text content
            text_content = resume_service._extract_text(temp_path, file_extension)
            
            if not text_content:
                return jsonify({"error": "Failed to extract text from resume"}), 500
            
            # Perform standard resume analysis
            resume_data, ai_recommendations = resume_service.process_resume(temp_path, file_extension)
            
            # Perform local language analysis
            local_analysis = local_language_service.analyze_local_context(text_content)
            
            # Generate comprehensive recruiter insights
            recruiter_insights = local_language_service.get_recruiter_insights(
                resume_data or {}, 
                local_analysis
            )
            
            # Combine results based on analysis type
            if analysis_type == "standard":
                response_data = {
                    "success": True,
                    "resume_data": resume_data,
                    "ai_recommendations": ai_recommendations
                }
            elif analysis_type == "local_focus":
                response_data = {
                    "success": True,
                    "local_analysis": local_analysis,
                    "recruiter_insights": recruiter_insights
                }
            else:  # comprehensive
                response_data = {
                    "success": True,
                    "resume_data": resume_data,
                    "ai_recommendations": ai_recommendations,
                    "local_analysis": local_analysis,
                    "recruiter_insights": recruiter_insights,
                    "comprehensive_score": local_analysis.get('local_talent_score', {}).get('overall_score', 0)
                }
            
            return jsonify(response_data), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        logging.error(f"Error in enhanced resume analysis: {str(e)}")
        return jsonify({"error": "Internal server error during analysis"}), 500

@local_language_routes.route("/batch_local_analysis", methods=["POST"])
@jwt_required()
@cross_origin()
def batch_local_analysis():
    """
    Perform local context analysis on multiple resumes for batch processing.
    Useful for recruiters analyzing multiple candidates.
    
    Request Body:
    - resumes: Array of resume texts
    - candidate_ids: Array of corresponding candidate IDs
    
    Returns:
    - Batch analysis results with local market insights
    """
    try:
        data = request.json
        if not data or 'resumes' not in data:
            return jsonify({"error": "Resumes array is required"}), 400
        
        resumes = data['resumes']
        candidate_ids = data.get('candidate_ids', [])
        
        if not isinstance(resumes, list) or len(resumes) == 0:
            return jsonify({"error": "Resumes must be a non-empty array"}), 400
        
        if candidate_ids and len(candidate_ids) != len(resumes):
            return jsonify({"error": "Candidate IDs array must match resumes array length"}), 400
        
        # Perform batch analysis
        batch_results = []
        
        for i, resume_text in enumerate(resumes):
            candidate_id = candidate_ids[i] if candidate_ids else f"candidate_{i+1}"
            
            try:
                # Analyze local context
                local_analysis = local_language_service.analyze_local_context(resume_text)
                
                # Generate recruiter insights
                recruiter_insights = local_language_service.get_recruiter_insights(
                    {'personal_info': {'name': candidate_id}}, 
                    local_analysis
                )
                
                batch_results.append({
                    "candidate_id": candidate_id,
                    "local_analysis": local_analysis,
                    "recruiter_insights": recruiter_insights,
                    "status": "success"
                })
                
            except Exception as e:
                logging.error(f"Error analyzing resume for candidate {candidate_id}: {str(e)}")
                batch_results.append({
                    "candidate_id": candidate_id,
                    "status": "error",
                    "error": str(e)
                })
        
        # Calculate batch statistics
        successful_analyses = [r for r in batch_results if r['status'] == 'success']
        if successful_analyses:
            avg_score = sum(
                r['local_analysis'].get('local_talent_score', {}).get('overall_score', 0) 
                for r in successful_analyses
            ) / len(successful_analyses)
            
            talent_distribution = {
                "elite": len([r for r in successful_analyses if 
                    r['local_analysis'].get('local_talent_score', {}).get('talent_tier') == "Elite Local Talent"]),
                "strong": len([r for r in successful_analyses if 
                    r['local_analysis'].get('local_talent_score', {}).get('talent_tier') == "Strong Local Talent"]),
                "developing": len([r for r in successful_analyses if 
                    r['local_analysis'].get('local_talent_score', {}).get('talent_tier') == "Developing Local Talent"]),
                "international": len([r for r in successful_analyses if 
                    r['local_analysis'].get('local_talent_score', {}).get('talent_tier') == "International Talent"])
            }
        else:
            avg_score = 0
            talent_distribution = {}
        
        response_data = {
            "success": True,
            "total_resumes": len(resumes),
            "successful_analyses": len(successful_analyses),
            "failed_analyses": len(resumes) - len(successful_analyses),
            "average_local_talent_score": round(avg_score, 1),
            "talent_distribution": talent_distribution,
            "batch_results": batch_results
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logging.error(f"Error in batch local analysis: {str(e)}")
        return jsonify({"error": "Internal server error during batch analysis"}), 500

@local_language_routes.route("/local_market_insights", methods=["GET"])
@jwt_required()
@cross_origin()
def get_local_market_insights():
    """
    Get general insights about the Kenyan job market and local talent characteristics.
    Useful for recruiters to understand market trends and candidate profiles.
    
    Returns:
    - Local market insights and trends
    """
    try:
        # Generate market insights using AI
        prompt = """
        As a Kenyan HR expert, provide insights about the current Kenyan job market:
        
        1. Local language preferences and their impact on hiring
        2. Cultural factors that influence recruitment decisions
        3. Sector-specific insights (formal vs informal)
        4. Emerging trends in local talent acquisition
        5. Challenges and opportunities for recruiters in Kenya
        
        Provide this in JSON format with practical insights for recruiters.
        """
        
        try:
            response = gemini_model.generate_content(
                prompt,
                generation_config={
                    'temperature': 0.3,
                    'top_p': 0.8,
                    'top_k': 40,
                    'max_output_tokens': 2048,
                }
            )
            
            if response and response.text:
                import json
                market_insights = json.loads(response.text.strip())
            else:
                market_insights = self._get_fallback_market_insights()
                
        except Exception as e:
            logging.warning(f"AI market insights failed: {str(e)}")
            market_insights = self._get_fallback_market_insights()
        
        response_data = {
            "success": True,
            "market_insights": market_insights,
            "analysis_timestamp": str(datetime.now())
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logging.error(f"Error getting local market insights: {str(e)}")
        return jsonify({"error": "Internal server error getting market insights"}), 500

def _get_fallback_market_insights():
    """
    Fallback market insights when AI analysis fails.
    """
    return {
        "local_language_trends": {
            "swahili_proficiency": "High demand for Swahili-speaking candidates in customer-facing roles",
            "multilingual_advantage": "Candidates with multiple local languages have 40% higher placement rates",
            "sheng_understanding": "Urban roles benefit from Sheng language familiarity"
        },
        "cultural_factors": {
            "community_networks": "Strong community ties increase candidate reliability",
            "local_business_understanding": "Knowledge of local market dynamics is highly valued",
            "cultural_adaptability": "Candidates who understand Kenyan business culture perform better"
        },
        "sector_insights": {
            "informal_sector": "Growing demand for candidates with informal sector experience",
            "formal_sector": "International companies seek local market experts",
            "hybrid_roles": "Increasing demand for candidates who bridge formal and informal sectors"
        },
        "recruitment_trends": {
            "local_focus": "Companies prioritizing local market understanding over international experience",
            "cultural_intelligence": "Cultural fit becoming as important as technical skills",
            "community_integration": "Strong preference for candidates with local community involvement"
        }
    }

# Import datetime for timestamp
from datetime import datetime
