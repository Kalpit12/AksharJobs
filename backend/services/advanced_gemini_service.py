"""
Advanced Gemini Service with Latest Models for Better Accuracy and Performance
"""

import logging
import requests
import os
import json
import re
from typing import Dict, List, Optional, Union
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.edn.local')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AdvancedGeminiService:
    """
    Advanced Gemini service with support for multiple models and intelligent selection
    """
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        print(f"DEBUG: GEMINI_API_KEY = {self.api_key}")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Available models with their capabilities
        self.models = {
            'gemini-1.5-flash': {
                'url': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
                'max_tokens': 8192,
                'cost': 'free',
                'speed': 'fast',
                'accuracy': 'good',
                'use_case': 'quick_analysis'
            },
            'gemini-1.5-pro': {
                'url': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
                'max_tokens': 8192,
                'cost': 'paid',
                'speed': 'medium',
                'accuracy': 'excellent',
                'use_case': 'detailed_analysis'
            },
            'gemini-2.0-flash-exp': {
                'url': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
                'max_tokens': 32768,
                'cost': 'paid',
                'speed': 'fast',
                'accuracy': 'excellent',
                'use_case': 'complex_analysis'
            }
        }
        
        # Default model selection strategy
        self.default_model = 'gemini-1.5-pro'  # Best balance of accuracy and speed
    
    def select_model(self, task_type: str = 'default', complexity: str = 'medium') -> str:
        """
        Intelligently select the best model based on task type and complexity
        
        Args:
            task_type: Type of task (resume_parsing, job_matching, analysis, etc.)
            complexity: Task complexity (simple, medium, complex)
            
        Returns:
            str: Selected model name
        """
        if task_type == 'resume_parsing':
            return 'gemini-1.5-pro'  # Best for structured data extraction
        elif task_type == 'job_matching':
            return 'gemini-2.0-flash-exp'  # Best for complex reasoning
        elif task_type == 'quick_analysis':
            return 'gemini-1.5-flash'  # Fast for simple tasks
        elif complexity == 'complex':
            return 'gemini-2.0-flash-exp'
        elif complexity == 'simple':
            return 'gemini-1.5-flash'
        else:
            return self.default_model
    
    def call_gemini(self, prompt: str, model: str = None, temperature: float = 0.1, 
                   max_tokens: int = None, task_type: str = 'default') -> Optional[str]:
        """
        Call Gemini API with specified model and parameters, with intelligent fallback
        
        Args:
            prompt: The input prompt
            model: Specific model to use (if None, auto-selects)
            temperature: Controls randomness (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            task_type: Type of task for model selection
            
        Returns:
            str: Generated response or None if failed
        """
        if model is None:
            model = self.select_model(task_type)
        
        if model not in self.models:
            logger.error(f"Unknown model: {model}")
            return None
        
        # Try the requested model first, then fallback to free tier
        models_to_try = [model]
        if model != 'gemini-1.5-flash':
            models_to_try.append('gemini-1.5-flash')  # Fallback to free tier
        
        for attempt_model in models_to_try:
            try:
                result = self._make_api_call(prompt, attempt_model, temperature, max_tokens, task_type)
                if result:
                    logger.info(f"Successfully used {attempt_model} for {task_type}")
                    return result
                else:
                    logger.warning(f"Failed to get response from {attempt_model}")
            except Exception as e:
                logger.warning(f"API call failed for {attempt_model}: {e}")
                continue
        
        logger.error("All model attempts failed")
        return None
    
    def _make_api_call(self, prompt: str, model: str, temperature: float, 
                      max_tokens: int, task_type: str) -> Optional[str]:
        """Make individual API call to specific model"""
        model_config = self.models[model]
        url = model_config['url']
        
        # Set max_tokens if not specified
        if max_tokens is None:
            max_tokens = min(model_config['max_tokens'], 4096)
        
        # Optimize temperature based on task type
        if task_type == 'resume_parsing':
            temperature = 0.05
        elif task_type == 'job_matching':
            temperature = 0.1
        elif task_type == 'creative':
            temperature = 0.7
        
        response = requests.post(
            url,
            params={"key": self.api_key},
            json={
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": temperature,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": max_tokens,
                    "candidateCount": 1
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            },
            timeout=120
        )
        
        response.raise_for_status()
        result = response.json()
        
        if "candidates" in result and len(result["candidates"]) > 0:
            content = result["candidates"][0]["content"]["parts"][0]["text"]
            return content
        else:
            logger.error(f"Unexpected response format from {model}: {result}")
            return None
    
    def parse_resume_advanced(self, resume_text: str) -> Optional[Dict]:
        """
        Advanced resume parsing with improved accuracy using Gemini 1.5 Pro
        
        Args:
            resume_text: Raw resume text
            
        Returns:
            dict: Parsed resume data or None if failed
        """
        prompt = f"""
        You are an expert resume parser with access to the latest AI technology. 
        Extract the following details from this resume text with maximum accuracy and precision:

        Resume Text:
        {resume_text}

        Extract and return ONLY a valid JSON object with this exact structure:
        {{
            "name": "Full name as it appears",
            "profile_summary": "Professional summary in 2-3 sentences",
            "skills": ["skill1", "skill2", "skill3"],
            "education": [
                {{
                    "degree": "Degree name",
                    "university": "University name",
                    "year": "Graduation year",
                    "grade": "GPA or grade if mentioned"
                }}
            ],
            "experience": [
                {{
                    "title": "Job title",
                    "company": "Company name",
                    "start_date": "MMM YYYY format",
                    "end_date": "MMM YYYY or 'Present'",
                    "description": "Job description and key achievements",
                    "location": "Work location"
                }}
            ],
            "projects": [
                {{
                    "title": "Project name",
                    "tools": ["technology1", "technology2"],
                    "description": "Project description and outcomes"
                }}
            ],
            "certificates": [
                {{
                    "name": "Certificate name",
                    "issuer": "Issuing organization"
                }}
            ],
            "job_recommended": ["Recommended job titles based on skills and experience"]
        }}

        IMPORTANT RULES:
        1. Return ONLY valid JSON, no additional text
        2. If information is not available, use empty string "" or empty array []
        3. Be precise with dates and formatting
        4. Extract ALL relevant skills, not just technical ones
        5. Include soft skills, tools, technologies, and methodologies
        6. For experience, focus on achievements and impact, not just duties
        7. Recommend 5-7 relevant job titles based on the candidate's profile
        """
        
        response = self.call_gemini(prompt, model='gemini-1.5-pro', task_type='resume_parsing')
        
        if not response:
            return None
        
        try:
            # Clean the response
            cleaned_response = re.sub(r'```json\n?', '', response)
            cleaned_response = re.sub(r'```', '', cleaned_response).strip()
            
            # Parse JSON
            parsed_data = json.loads(cleaned_response)
            logger.info("Successfully parsed resume with Gemini 1.5 Pro")
            return parsed_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw response: {response}")
            return None
    
    def generate_advanced_match_analysis(self, resume_data: Dict, job_data: Dict, 
                                       match_score: float) -> Optional[Dict]:
        """
        Generate advanced job-resume match analysis using Gemini 2.0 Flash Exp
        
        Args:
            resume_data: Parsed resume data
            job_data: Job description data
            match_score: SBERT similarity score
            
        Returns:
            dict: Advanced match analysis or None if failed
        """
        prompt = f"""
        You are a senior HR analyst with 15+ years of experience in talent acquisition and AI-powered recruitment.
        Analyze this job-resume match with maximum precision and provide actionable insights.

        CANDIDATE PROFILE:
        Name: {resume_data.get('name', 'N/A')}
        Summary: {resume_data.get('profile_summary', 'N/A')}
        Skills: {', '.join(resume_data.get('skills', []))}
        Education: {json.dumps(resume_data.get('education', []), indent=2)}
        Experience: {json.dumps(resume_data.get('experience', []), indent=2)}
        Projects: {json.dumps(resume_data.get('projects', []), indent=2)}
        Certificates: {json.dumps(resume_data.get('certificates', []), indent=2)}

        JOB REQUIREMENTS:
        Title: {job_data.get('job_title', 'N/A')}
        Company: {job_data.get('company_name', 'N/A')}
        Required Skills: {job_data.get('required_skills', 'N/A')}
        Education Required: {job_data.get('education_required', 'N/A')}
        Experience Required: {job_data.get('experience_required', 'N/A')}
        Description: {job_data.get('description', 'N/A')}
        Responsibilities: {job_data.get('responsibilities', 'N/A')}

        SBERT SIMILARITY SCORE: {match_score}

        Provide a comprehensive analysis in this EXACT JSON format:
        {{
            "overall_match_score": "85",
            "education_match": "90",
            "skills_match": "78",
            "experience_match": "82",
            "cultural_fit_score": "88",
            "growth_potential_score": "85",
            
            "detailed_analysis": {{
                "strengths": [
                    "Specific strength 1 with evidence",
                    "Specific strength 2 with evidence"
                ],
                "gaps": [
                    "Specific gap 1 with impact",
                    "Specific gap 2 with impact"
                ],
                "risk_factors": [
                    "Potential concern 1",
                    "Potential concern 2"
                ]
            }},
            
            "job_seeker_insights": {{
                "overall_feedback": "Comprehensive feedback on fit",
                "strengths": ["Top 3-5 strengths"],
                "gaps": ["Missing qualifications"],
                "improvement_suggestions": [
                    "Specific actionable advice 1",
                    "Specific actionable advice 2"
                ],
                "career_advice": "Long-term career guidance"
            }},
            
            "recruiter_insights": {{
                "key_qualifications": ["Top qualifications that match"],
                "concerns": ["Potential red flags"],
                "hiring_recommendation": "Strongly Recommended/Recommended with Reservations/Not Recommended",
                "interview_focus": ["Key areas to explore in interview"],
                "salary_justification": "Market rate analysis",
                "onboarding_plan": "Suggested onboarding approach"
            }},
            
            "ai_confidence": "95"
        }}

        ANALYSIS REQUIREMENTS:
        1. Be extremely precise with percentages (no % signs in JSON)
        2. Provide specific, actionable insights
        3. Consider both technical and soft skills
        4. Factor in career progression and growth potential
        5. Include cultural fit assessment
        6. Provide interview preparation guidance
        7. Consider market conditions and salary expectations
        8. Give confidence score for AI analysis (0-100)
        """
        
        response = self.call_gemini(prompt, model='gemini-2.0-flash-exp', 
                                  task_type='job_matching', max_tokens=4096)
        
        if not response:
            return None
        
        try:
            # Clean the response
            cleaned_response = re.sub(r'```json\n?', '', response)
            cleaned_response = re.sub(r'```', '', cleaned_response).strip()
            
            # Parse JSON
            analysis = json.loads(cleaned_response)
            logger.info("Successfully generated advanced match analysis with Gemini 2.0 Flash Exp")
            return analysis
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse analysis JSON: {e}")
            logger.error(f"Raw response: {response}")
            return None
    
    def get_model_info(self) -> Dict:
        """
        Get information about available models
        
        Returns:
            dict: Model information
        """
        return {
            "available_models": list(self.models.keys()),
            "default_model": self.default_model,
            "model_capabilities": self.models
        }

# Global instance
advanced_gemini_service = AdvancedGeminiService()

def get_advanced_gemini_service() -> AdvancedGeminiService:
    """Get the global advanced Gemini service instance"""
    return advanced_gemini_service
