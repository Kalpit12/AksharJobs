#!/usr/bin/env python3
"""
Personalized Job Recommendations Service
Provides AI-powered, user-specific job recommendations based on resume analysis
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import json
from bson import ObjectId

from utils.db import get_db
from services.job_service import get_all_jobs
from utils.sbert_match import compute_similarity
from services.new_resume_service import ModernResumeService

logger = logging.getLogger(__name__)

class PersonalizedRecommendationService:
    def __init__(self, gemini_api_key: Optional[str] = None):
        """Initialize personalized recommendation service"""
        self.resume_service = ModernResumeService(gemini_api_key)
        self.use_ai = gemini_api_key is not None
        
    def get_personalized_job_recommendations(self, user_id: str, limit: int = 10) -> Dict[str, Any]:
        """Get personalized job recommendations for a specific user"""
        try:
            logger.info(f"🎯 Generating personalized job recommendations for user: {user_id}")
            
            # Get user's resume data
            db = get_db()
            user_profile = db.users.find_one({'_id': ObjectId(user_id)})
            
            if not user_profile or 'resume_data' not in user_profile:
                logger.warning(f"No resume data found for user: {user_id}")
                return self._get_default_recommendations()
            
            resume_data = user_profile['resume_data']
            
            # Get all available jobs
            all_jobs = get_all_jobs()
            if not all_jobs:
                logger.warning("No jobs available for recommendations")
                return {"recommended_jobs": [], "message": "No jobs available"}
            
            # Calculate personalized match scores
            job_matches = []
            for job in all_jobs:
                match_data = self._calculate_personalized_match(resume_data, job)
                if match_data['match_score'] > 0.3:  # Only include decent matches
                    job_matches.append(match_data)
            
            # Sort by match score and take top recommendations
            job_matches.sort(key=lambda x: x['match_score'], reverse=True)
            top_matches = job_matches[:limit]
            
            # Generate category-based recommendations
            categorized_recommendations = self._categorize_recommendations(top_matches, resume_data)
            
            # Add personalization insights
            personalization_info = self._generate_personalization_insights(resume_data, top_matches)
            
            result = {
                "recommended_jobs": top_matches,
                "categorized_recommendations": categorized_recommendations,
                "personalization_info": personalization_info,
                "total_matches": len(job_matches),
                "generated_at": datetime.now().isoformat()
            }
            
            # Store recommendations in user profile for future quick access
            self._store_recommendations(user_id, result)
            
            logger.info(f"✅ Generated {len(top_matches)} personalized recommendations for user: {user_id}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error generating personalized recommendations: {e}")
            return self._get_default_recommendations()
    
    def _calculate_personalized_match(self, resume_data: Dict[str, Any], job: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate personalized match score between resume and job"""
        try:
            # Extract resume information
            skills = resume_data.get('skills', {})
            technical_skills = skills.get('technical_skills', [])
            experience = resume_data.get('experience', [])
            education = resume_data.get('education', [])
            
            # Extract job information
            job_title = job.get('title', '')
            job_description = job.get('description', '')
            required_skills = job.get('skills', [])
            job_category = job.get('category', '')
            experience_required = job.get('experienceRequired', '')
            
            # Calculate skill match score
            skill_match_score = self._calculate_skill_match(technical_skills, required_skills)
            
            # Calculate experience relevance
            experience_match_score = self._calculate_experience_match(experience, job_title, job_description)
            
            # Calculate education relevance
            education_match_score = self._calculate_education_match(education, job.get('educationRequired', ''))
            
            # Calculate semantic similarity using SBERT
            resume_text = self._create_resume_text(resume_data)
            job_text = f"{job_title} {job_description} {' '.join(required_skills)}"
            semantic_similarity = float(compute_similarity(resume_text, job_text))
            
            # Calculate final weighted score
            final_score = (
                0.3 * skill_match_score +
                0.25 * experience_match_score +
                0.15 * education_match_score +
                0.3 * semantic_similarity
            )
            
            # Generate personalized reasons
            match_reasons = self._generate_match_reasons(
                skill_match_score, experience_match_score, education_match_score, 
                technical_skills, required_skills, experience, job_title
            )
            
            return {
                "job": job,
                "match_score": round(final_score, 3),
                "skill_match": round(skill_match_score, 3),
                "experience_match": round(experience_match_score, 3),
                "education_match": round(education_match_score, 3),
                "semantic_similarity": round(semantic_similarity, 3),
                "match_reasons": match_reasons,
                "recommendation_type": self._get_recommendation_type(final_score)
            }
            
        except Exception as e:
            logger.error(f"Error calculating match for job {job.get('title', 'Unknown')}: {e}")
            return {
                "job": job,
                "match_score": 0.0,
                "match_reasons": ["Unable to calculate match"],
                "recommendation_type": "low_match"
            }
    
    def _calculate_skill_match(self, user_skills: List[str], required_skills: List[str]) -> float:
        """Calculate skill match percentage"""
        if not required_skills:
            return 0.5  # Neutral score if no skills specified
        
        user_skills_lower = [skill.lower() for skill in user_skills]
        required_skills_lower = [skill.lower() for skill in required_skills]
        
        matches = sum(1 for skill in required_skills_lower if skill in user_skills_lower)
        return matches / len(required_skills) if required_skills else 0.0
    
    def _calculate_experience_match(self, experience: List[Dict[str, str]], job_title: str, job_description: str) -> float:
        """Calculate experience relevance score"""
        if not experience:
            return 0.2  # Low score for no experience
        
        job_text = f"{job_title} {job_description}".lower()
        experience_text = " ".join([
            f"{exp.get('title', '')} {exp.get('description', '')}" 
            for exp in experience
        ]).lower()
        
        # Simple keyword matching for experience relevance
        common_words = set(job_text.split()) & set(experience_text.split())
        relevance_score = len(common_words) / max(len(job_text.split()), 1)
        
        return min(relevance_score * 2, 1.0)  # Cap at 1.0
    
    def _calculate_education_match(self, education: List[Dict[str, str]], required_education: str) -> float:
        """Calculate education match score"""
        if not required_education:
            return 0.5  # Neutral if no education requirement
        
        if not education:
            return 0.3  # Lower score for no education
        
        education_text = " ".join([edu.get('degree', '') for edu in education]).lower()
        required_education_lower = required_education.lower()
        
        # Check for degree level matches
        if 'bachelor' in required_education_lower and 'bachelor' in education_text:
            return 0.8
        elif 'master' in required_education_lower and 'master' in education_text:
            return 1.0
        elif 'phd' in required_education_lower and 'phd' in education_text:
            return 1.0
        else:
            return 0.6  # Partial match
    
    def _create_resume_text(self, resume_data: Dict[str, Any]) -> str:
        """Create searchable text from resume data"""
        text_parts = []
        
        # Add skills
        skills = resume_data.get('skills', {})
        for skill_type, skill_list in skills.items():
            text_parts.extend(skill_list)
        
        # Add experience
        for exp in resume_data.get('experience', []):
            text_parts.append(exp.get('title', ''))
            text_parts.append(exp.get('description', ''))
        
        # Add education
        for edu in resume_data.get('education', []):
            text_parts.append(edu.get('degree', ''))
        
        # Add summary
        text_parts.append(resume_data.get('summary', ''))
        
        return " ".join(filter(None, text_parts))
    
    def _generate_match_reasons(self, skill_match: float, exp_match: float, edu_match: float, 
                              user_skills: List[str], required_skills: List[str], 
                              experience: List[Dict[str, str]], job_title: str) -> List[str]:
        """Generate specific reasons why this job matches the user"""
        reasons = []
        
        if skill_match > 0.7:
            matching_skills = [skill for skill in required_skills if skill.lower() in [s.lower() for s in user_skills]]
            reasons.append(f"Strong skill match: You have {len(matching_skills)} of the required skills including {', '.join(matching_skills[:3])}")
        elif skill_match > 0.4:
            matching_skills = [skill for skill in required_skills if skill.lower() in [s.lower() for s in user_skills]]
            reasons.append(f"Good skill foundation: {len(matching_skills)} matching skills")
        
        if exp_match > 0.6:
            relevant_titles = [exp.get('title', '') for exp in experience if any(word in exp.get('title', '').lower() for word in job_title.lower().split())]
            if relevant_titles:
                reasons.append(f"Relevant experience: Your background in {relevant_titles[0]} aligns well")
        
        if edu_match > 0.7:
            reasons.append("Educational background matches requirements")
        
        if len(experience) >= 3:
            reasons.append(f"Solid experience: {len(experience)} professional positions")
        
        return reasons if reasons else ["This role could be a good growth opportunity"]
    
    def _get_recommendation_type(self, score: float) -> str:
        """Categorize recommendation based on match score"""
        if score >= 0.8:
            return "perfect_match"
        elif score >= 0.6:
            return "strong_match"
        elif score >= 0.4:
            return "good_match"
        else:
            return "growth_opportunity"
    
    def _categorize_recommendations(self, job_matches: List[Dict[str, Any]], resume_data: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
        """Categorize recommendations by type and field"""
        categories = {
            "perfect_matches": [],
            "skill_based_matches": [],
            "growth_opportunities": [],
            "field_specific": {},
            "experience_level_matches": []
        }
        
        # Determine user's primary field
        skills = resume_data.get('skills', {})
        technical_skills = skills.get('technical_skills', [])
        experience = resume_data.get('experience', [])
        primary_field = self.resume_service._determine_primary_field(technical_skills, experience)
        
        for match in job_matches:
            job = match['job']
            score = match['match_score']
            recommendation_type = match['recommendation_type']
            
            # Categorize by match quality
            if recommendation_type == "perfect_match":
                categories["perfect_matches"].append(match)
            elif score >= 0.6:
                categories["skill_based_matches"].append(match)
            else:
                categories["growth_opportunities"].append(match)
            
            # Categorize by field
            job_category = job.get('category', 'Other')
            if job_category not in categories["field_specific"]:
                categories["field_specific"][job_category] = []
            categories["field_specific"][job_category].append(match)
        
        return categories
    
    def _generate_personalization_insights(self, resume_data: Dict[str, Any], matches: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate insights about the user's market position"""
        skills = resume_data.get('skills', {})
        technical_skills = skills.get('technical_skills', [])
        experience = resume_data.get('experience', [])
        
        experience_level = self.resume_service._determine_experience_level(experience)
        primary_field = self.resume_service._determine_primary_field(technical_skills, experience)
        
        # Analyze match distribution
        perfect_matches = len([m for m in matches if m['match_score'] >= 0.8])
        good_matches = len([m for m in matches if 0.6 <= m['match_score'] < 0.8])
        growth_opportunities = len([m for m in matches if m['match_score'] < 0.6])
        
        return {
            "profile_summary": {
                "experience_level": experience_level,
                "primary_field": primary_field,
                "total_skills": len(technical_skills),
                "years_experience": len(experience)
            },
            "market_analysis": {
                "perfect_matches": perfect_matches,
                "good_matches": good_matches,
                "growth_opportunities": growth_opportunities,
                "market_demand": "High" if perfect_matches > 3 else "Moderate" if good_matches > 5 else "Emerging"
            },
            "recommendations_summary": {
                "top_recommendation_score": matches[0]['match_score'] if matches else 0,
                "average_match_score": sum(m['match_score'] for m in matches) / len(matches) if matches else 0,
                "fields_represented": len(set(m['job'].get('category', 'Other') for m in matches))
            }
        }
    
    def _store_recommendations(self, user_id: str, recommendations: Dict[str, Any]) -> None:
        """Store recommendations in user profile for quick access"""
        try:
            db = get_db()
            update_data = {
                'personalized_job_recommendations': recommendations,
                'recommendations_generated_at': datetime.now().isoformat()
            }
            
            db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )
            
            logger.info(f"✅ Stored personalized recommendations for user: {user_id}")
            
        except Exception as e:
            logger.warning(f"Failed to store recommendations: {e}")
    
    def get_stored_recommendations(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get previously stored recommendations if they're recent"""
        try:
            db = get_db()
            user_profile = db.users.find_one({'_id': ObjectId(user_id)})
            
            if user_profile and 'personalized_job_recommendations' in user_profile:
                stored_recs = user_profile['personalized_job_recommendations']
                generated_at = user_profile.get('recommendations_generated_at')
                
                # Check if recommendations are recent (less than 24 hours old)
                if generated_at:
                    from datetime import datetime, timedelta
                    generated_time = datetime.fromisoformat(generated_at.replace('Z', '+00:00'))
                    if datetime.now() - generated_time < timedelta(hours=24):
                        logger.info(f"✅ Returning stored recommendations for user: {user_id}")
                        return stored_recs
                
            return None
            
        except Exception as e:
            logger.warning(f"Error retrieving stored recommendations: {e}")
            return None
    
    def refresh_recommendations(self, user_id: str) -> Dict[str, Any]:
        """Force refresh of recommendations (bypass cache)"""
        logger.info(f"🔄 Force refreshing recommendations for user: {user_id}")
        return self.get_personalized_job_recommendations(user_id)
    
    def _get_default_recommendations(self) -> Dict[str, Any]:
        """Return default recommendations for users without resume data"""
        return {
            "recommended_jobs": [],
            "message": "Upload your resume to get personalized job recommendations",
            "default_suggestions": [
                "Complete your profile with resume upload",
                "Add your skills and experience",
                "Set your job preferences"
            ],
            "generated_at": datetime.now().isoformat()
        }
    
    def get_recommendations_by_category(self, user_id: str, category: str) -> Dict[str, Any]:
        """Get recommendations filtered by specific category/field"""
        try:
            all_recommendations = self.get_personalized_job_recommendations(user_id, limit=50)
            
            if 'categorized_recommendations' in all_recommendations:
                field_specific = all_recommendations['categorized_recommendations'].get('field_specific', {})
                
                if category in field_specific:
                    return {
                        "category": category,
                        "jobs": field_specific[category],
                        "count": len(field_specific[category]),
                        "generated_at": datetime.now().isoformat()
                    }
            
            return {
                "category": category,
                "jobs": [],
                "message": f"No recommendations found for {category}",
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting category recommendations: {e}")
            return {"error": "Failed to get category recommendations"}
    
    def get_career_progression_recommendations(self, user_id: str) -> Dict[str, Any]:
        """Get recommendations focused on career progression"""
        try:
            db = get_db()
            user_profile = db.users.find_one({'_id': ObjectId(user_id)})
            
            if not user_profile or 'resume_data' not in user_profile:
                return {"error": "Resume data required for career progression analysis"}
            
            resume_data = user_profile['resume_data']
            experience = resume_data.get('experience', [])
            skills = resume_data.get('skills', {})
            
            current_level = self.resume_service._determine_experience_level(experience)
            primary_field = self.resume_service._determine_primary_field(skills.get('technical_skills', []), experience)
            
            # Get jobs for next career level
            target_levels = {
                "Entry Level": "Junior Level",
                "Junior Level": "Mid Level", 
                "Mid Level": "Senior Level",
                "Senior Level": "Leadership"
            }
            
            target_level = target_levels.get(current_level, "Senior Level")
            
            # Find jobs that match career progression
            all_jobs = get_all_jobs()
            progression_jobs = []
            
            for job in all_jobs:
                job_title = job.get('title', '').lower()
                
                # Check if job represents career progression
                is_progression = (
                    ('senior' in job_title and current_level in ['Entry Level', 'Junior Level']) or
                    ('lead' in job_title and current_level in ['Junior Level', 'Mid Level']) or
                    ('manager' in job_title and current_level in ['Mid Level', 'Senior Level']) or
                    ('director' in job_title and current_level == 'Senior Level')
                )
                
                if is_progression:
                    match_data = self._calculate_personalized_match(resume_data, job)
                    if match_data['match_score'] > 0.4:
                        progression_jobs.append(match_data)
            
            # Sort by match score
            progression_jobs.sort(key=lambda x: x['match_score'], reverse=True)
            
            return {
                "current_level": current_level,
                "target_level": target_level,
                "primary_field": primary_field,
                "progression_opportunities": progression_jobs[:5],
                "career_advice": self._get_progression_advice(current_level, primary_field),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating career progression recommendations: {e}")
            return {"error": "Failed to generate career progression recommendations"}
    
    def _get_progression_advice(self, current_level: str, field: str) -> List[str]:
        """Get specific advice for career progression"""
        advice_map = {
            "Entry Level": [
                f"Focus on building core {field} skills",
                "Gain 1-2 years of hands-on experience",
                "Build a portfolio of projects",
                "Seek mentorship from senior professionals"
            ],
            "Junior Level": [
                f"Develop advanced {field} expertise",
                "Take on more complex projects",
                "Start mentoring newer team members",
                "Consider relevant certifications"
            ],
            "Mid Level": [
                "Develop leadership and management skills",
                "Lead cross-functional projects",
                "Build strategic thinking abilities",
                "Expand your professional network"
            ],
            "Senior Level": [
                "Focus on organizational impact",
                "Develop business acumen",
                "Build and lead high-performing teams",
                "Drive technical strategy and innovation"
            ]
        }
        
        return advice_map.get(current_level, advice_map["Entry Level"])
