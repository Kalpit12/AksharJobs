import os
import logging
import re
import json
from typing import Dict, Any, Optional, Tuple, List
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.edn.local')

logger = logging.getLogger(__name__)

class LocalLanguageResumeService:
    """
    Advanced resume analysis service specifically designed for Swahili and local Kenyan languages.
    This service provides cultural context, local business understanding, and enhanced talent insights.
    """
    
    def __init__(self, gemini_model):
        self.gemini_model = gemini_model
        self.supported_languages = [
            'swahili', 'english', 'kikuyu', 'kamba', 'luhya', 'kisii', 'meru', 'kalenjin',
            'sheng', 'giriama', 'taita', 'pokomo', 'rendille', 'samburu', 'turkana'
        ]
        
        # Kenyan business and cultural context patterns
        self.local_business_patterns = {
            'informal_sector': [
                'mama mboga', 'boda boda', 'jua kali', 'mitumba', 'hawker', 'vendor',
                'small business', 'kiosk', 'duka', 'shamba', 'farm', 'livestock'
            ],
            'formal_sector': [
                'company', 'corporation', 'enterprise', 'limited', 'ltd', 'plc',
                'ngo', 'government', 'ministry', 'parastatal', 'state corporation'
            ],
            'local_skills': [
                'swahili', 'kiswahili', 'local language', 'community', 'tribe',
                'cultural', 'traditional', 'local market', 'local business'
            ]
        }
    
    def analyze_local_context(self, resume_text: str) -> Dict[str, Any]:
        """
        Analyze resume for local Kenyan context, language usage, and cultural elements.
        """
        try:
            logger.info("Starting local context analysis for Kenyan market")
            
            # Detect languages used in the resume
            language_analysis = self._detect_languages(resume_text)
            
            # Analyze local business context
            business_context = self._analyze_business_context(resume_text)
            
            # Extract cultural and community elements
            cultural_elements = self._extract_cultural_elements(resume_text)
            
            # Generate local market insights
            market_insights = self._generate_market_insights(resume_text, language_analysis, business_context)
            
            return {
                'language_analysis': language_analysis,
                'business_context': business_context,
                'cultural_elements': cultural_elements,
                'market_insights': market_insights,
                'local_talent_score': self._calculate_local_talent_score(language_analysis, business_context, cultural_elements)
            }
            
        except Exception as e:
            logger.error(f"Error in local context analysis: {str(e)}")
            return {}
    
    def _detect_languages(self, text: str) -> Dict[str, Any]:
        """
        Detect languages used in the resume with confidence scores.
        """
        try:
            # Common Swahili words and patterns
            swahili_patterns = [
                'jambo', 'karibu', 'asante', 'tafadhali', 'hakuna', 'kuna', 'nina', 'una',
                'mimi', 'wewe', 'yeye', 'sisi', 'nyinyi', 'wao', 'hii', 'hizi', 'huyu',
                'hawa', 'hapa', 'pale', 'kule', 'huku', 'huko', 'huko', 'hapa', 'pale'
            ]
            
            # Sheng patterns (Kenyan urban slang)
            sheng_patterns = [
                'mzeee', 'bro', 'dude', 'man', 'guy', 'chick', 'babe', 'dude', 'man',
                'cool', 'nice', 'good', 'bad', 'big', 'small', 'new', 'old', 'young'
            ]
            
            # Local language indicators
            local_indicators = {
                'swahili': 0,
                'sheng': 0,
                'local_english': 0,
                'tribal_language': 0
            }
            
            text_lower = text.lower()
            
            # Count Swahili patterns
            for pattern in swahili_patterns:
                local_indicators['swahili'] += text_lower.count(pattern)
            
            # Count Sheng patterns
            for pattern in sheng_patterns:
                local_indicators['sheng'] += text_lower.count(pattern)
            
            # Detect local English patterns
            local_english_patterns = [
                'kindly', 'please', 'thank you', 'regards', 'yours faithfully',
                'dear sir', 'dear madam', 'reference', 'curriculum vitae'
            ]
            
            for pattern in local_english_patterns:
                local_indicators['local_english'] += text_lower.count(pattern)
            
            # Calculate confidence scores
            total_words = len(text.split())
            confidence_scores = {}
            
            for language, count in local_indicators.items():
                if total_words > 0:
                    confidence_scores[language] = min(1.0, (count / total_words) * 10)
                else:
                    confidence_scores[language] = 0.0
            
            # Determine primary language
            primary_language = max(confidence_scores.items(), key=lambda x: x[1])
            
            return {
                'primary_language': primary_language[0],
                'confidence_scores': confidence_scores,
                'total_patterns_found': sum(local_indicators.values()),
                'language_mix': 'multilingual' if sum(confidence_scores.values()) > 1.5 else 'single_language'
            }
            
        except Exception as e:
            logger.error(f"Error detecting languages: {str(e)}")
            return {'primary_language': 'unknown', 'confidence_scores': {}, 'error': str(e)}
    
    def _analyze_business_context(self, text: str) -> Dict[str, Any]:
        """
        Analyze the business context and sector alignment for Kenyan market.
        """
        try:
            text_lower = text.lower()
            
            # Analyze sector alignment
            informal_sector_score = 0
            formal_sector_score = 0
            
            for pattern in self.local_business_patterns['informal_sector']:
                informal_sector_score += text_lower.count(pattern)
            
            for pattern in self.local_business_patterns['formal_sector']:
                formal_sector_score += text_lower.count(pattern)
            
            # Determine sector preference
            if informal_sector_score > formal_sector_score:
                sector_preference = 'informal_sector'
                sector_score = informal_sector_score
            else:
                sector_preference = 'formal_sector'
                sector_score = formal_sector_score
            
            # Analyze local market understanding
            local_market_keywords = [
                'kenya', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret',
                'local market', 'kenyan', 'east africa', 'africa', 'local business',
                'community', 'local', 'regional', 'african'
            ]
            
            local_market_score = 0
            for keyword in local_market_keywords:
                local_market_score += text_lower.count(keyword)
            
            return {
                'sector_preference': sector_preference,
                'sector_score': sector_score,
                'local_market_understanding': local_market_score,
                'business_type': 'local_focused' if local_market_score > 2 else 'international_focused',
                'sector_balance': {
                    'informal': informal_sector_score,
                    'formal': formal_sector_score
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing business context: {str(e)}")
            return {'error': str(e)}
    
    def _extract_cultural_elements(self, text: str) -> Dict[str, Any]:
        """
        Extract cultural and community elements from the resume.
        """
        try:
            text_lower = text.lower()
            
            # Community and cultural indicators
            community_patterns = {
                'community_service': ['volunteer', 'community', 'ngo', 'charity', 'help', 'support'],
                'cultural_activities': ['culture', 'traditional', 'heritage', 'custom', 'tribe'],
                'local_networks': ['network', 'association', 'group', 'club', 'society'],
                'religious_affiliation': ['church', 'mosque', 'temple', 'religious', 'faith']
            }
            
            cultural_elements = {}
            
            for category, patterns in community_patterns.items():
                count = 0
                for pattern in patterns:
                    count += text_lower.count(pattern)
                cultural_elements[category] = count
            
            # Calculate cultural engagement score
            total_cultural_score = sum(cultural_elements.values())
            
            return {
                'cultural_elements': cultural_elements,
                'total_cultural_score': total_cultural_score,
                'cultural_engagement': 'high' if total_cultural_score > 5 else 'medium' if total_cultural_score > 2 else 'low',
                'community_focus': 'strong' if cultural_elements.get('community_service', 0) > 2 else 'moderate'
            }
            
        except Exception as e:
            logger.error(f"Error extracting cultural elements: {str(e)}")
            return {'error': str(e)}
    
    def _generate_market_insights(self, text: str, language_analysis: Dict, business_context: Dict) -> Dict[str, Any]:
        """
        Generate AI-powered market insights for recruiters.
        """
        try:
            # Create comprehensive prompt for market analysis
            prompt = f"""
            As a Kenyan HR expert, analyze this resume for local market insights:
            
            Resume Text: {text[:2000]}...
            
            Language Analysis: {json.dumps(language_analysis, indent=2)}
            Business Context: {json.dumps(business_context, indent=2)}
            
            Provide insights in JSON format:
            {{
                "local_market_fit": {{
                    "score": "1-10 score for local market fit",
                    "strengths": ["key strengths for Kenyan market"],
                    "challenges": ["potential challenges in local market"],
                    "recommendations": ["specific recommendations for local success"]
                }},
                "cultural_intelligence": {{
                    "score": "1-10 score for cultural understanding",
                    "local_adaptability": "assessment of local adaptability",
                    "community_integration": "potential for community integration"
                }},
                "business_potential": {{
                    "local_business_opportunities": ["specific opportunities in Kenya"],
                    "market_gaps": ["areas where candidate can fill market gaps"],
                    "growth_potential": "assessment of growth potential in local market"
                }},
                "recruiter_insights": {{
                    "hiring_recommendation": "strong/consider/reject with reasoning",
                    "role_suggestions": ["specific roles this candidate would excel in"],
                    "training_needs": ["areas where candidate might need training"],
                    "local_advantage": "unique advantages this candidate brings to local market"
                }}
            }}
            
            Focus on Kenyan business context, local market dynamics, and cultural fit.
            """
            
            # Use Gemini AI for analysis
            response = self.gemini_model.generate_content(
                prompt,
                generation_config={
                    'temperature': 0.3,
                    'top_p': 0.8,
                    'top_k': 40,
                    'max_output_tokens': 2048,
                }
            )
            
            if response and response.text:
                # Parse JSON response
                try:
                    insights = json.loads(response.text.strip())
                    return insights
                except json.JSONDecodeError:
                    logger.warning("Failed to parse AI insights, using fallback")
                    return self._generate_fallback_insights(language_analysis, business_context)
            else:
                return self._generate_fallback_insights(language_analysis, business_context)
                
        except Exception as e:
            logger.error(f"Error generating market insights: {str(e)}")
            return self._generate_fallback_insights(language_analysis, business_context)
    
    def _generate_fallback_insights(self, language_analysis: Dict, business_context: Dict) -> Dict[str, Any]:
        """
        Generate fallback insights when AI analysis fails.
        """
        try:
            # Calculate basic scores based on available data
            local_market_score = min(10, max(1, 
                (language_analysis.get('confidence_scores', {}).get('swahili', 0) * 5) +
                (business_context.get('local_market_understanding', 0) * 2)
            ))
            
            cultural_score = min(10, max(1, 
                (language_analysis.get('confidence_scores', {}).get('local_english', 0) * 3) +
                (business_context.get('sector_score', 0) * 1.5)
            ))
            
            return {
                "local_market_fit": {
                    "score": round(local_market_score, 1),
                    "strengths": ["Local language proficiency", "Market understanding"] if local_market_score > 6 else ["Basic local knowledge"],
                    "challenges": ["Limited local experience"] if local_market_score < 5 else ["Some areas for improvement"],
                    "recommendations": ["Focus on local networking", "Develop cultural understanding"]
                },
                "cultural_intelligence": {
                    "score": round(cultural_score, 1),
                    "local_adaptability": "Good" if cultural_score > 6 else "Moderate",
                    "community_integration": "High potential" if cultural_score > 7 else "Moderate potential"
                },
                "business_potential": {
                    "local_business_opportunities": ["Local market entry", "Community-based services"],
                    "market_gaps": ["Language services", "Cultural consulting"],
                    "growth_potential": "Strong" if local_market_score > 7 else "Moderate"
                },
                "recruiter_insights": {
                    "hiring_recommendation": "Strong candidate" if local_market_score > 7 else "Consider with training",
                    "role_suggestions": ["Local market specialist", "Community liaison"],
                    "training_needs": ["Advanced local business practices"] if local_market_score < 6 else ["Minimal"],
                    "local_advantage": "Strong local market understanding and language skills"
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating fallback insights: {str(e)}")
            return {"error": "Unable to generate insights"}
    
    def _calculate_local_talent_score(self, language_analysis: Dict, business_context: Dict, cultural_elements: Dict) -> Dict[str, Any]:
        """
        Calculate comprehensive local talent score for recruiters.
        """
        try:
            # Language proficiency score (0-100)
            language_score = 0
            if 'confidence_scores' in language_analysis:
                scores = language_analysis['confidence_scores']
                language_score = (
                    scores.get('swahili', 0) * 40 +
                    scores.get('local_english', 0) * 30 +
                    scores.get('sheng', 0) * 20 +
                    scores.get('tribal_language', 0) * 10
                ) * 100
            
            # Business context score (0-100)
            business_score = min(100, 
                (business_context.get('local_market_understanding', 0) * 20) +
                (business_context.get('sector_score', 0) * 15)
            )
            
            # Cultural engagement score (0-100)
            cultural_score = min(100, 
                cultural_elements.get('total_cultural_score', 0) * 15
            )
            
            # Overall local talent score
            overall_score = (language_score * 0.4 + business_score * 0.4 + cultural_score * 0.2)
            
            # Determine talent tier
            if overall_score >= 80:
                talent_tier = "Elite Local Talent"
                tier_description = "Exceptional local market understanding and cultural intelligence"
            elif overall_score >= 60:
                talent_tier = "Strong Local Talent"
                tier_description = "Good local market fit with room for growth"
            elif overall_score >= 40:
                talent_tier = "Developing Local Talent"
                tier_description = "Basic local knowledge with potential for development"
            else:
                talent_tier = "International Talent"
                tier_description = "Limited local market experience, may need cultural training"
            
            return {
                'overall_score': round(overall_score, 1),
                'talent_tier': talent_tier,
                'tier_description': tier_description,
                'component_scores': {
                    'language_proficiency': round(language_score, 1),
                    'business_context': round(business_score, 1),
                    'cultural_engagement': round(cultural_score, 1)
                },
                'market_recommendation': 'Highly recommended for local roles' if overall_score > 70 else 'Consider with training' if overall_score > 50 else 'May need significant local market training'
            }
            
        except Exception as e:
            logger.error(f"Error calculating local talent score: {str(e)}")
            return {'error': 'Unable to calculate score'}
    
    def get_recruiter_insights(self, resume_data: Dict[str, Any], local_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive recruiter insights combining resume data with local analysis.
        """
        try:
            return {
                'candidate_summary': {
                    'name': resume_data.get('personal_info', {}).get('name', 'Unknown'),
                    'local_talent_score': local_analysis.get('local_talent_score', {}).get('overall_score', 0),
                    'talent_tier': local_analysis.get('local_talent_score', {}).get('talent_tier', 'Unknown'),
                    'primary_language': local_analysis.get('language_analysis', {}).get('primary_language', 'Unknown')
                },
                'local_market_analysis': local_analysis.get('market_insights', {}),
                'recruitment_recommendations': {
                    'hiring_priority': 'High' if local_analysis.get('local_talent_score', {}).get('overall_score', 0) > 70 else 'Medium' if local_analysis.get('local_talent_score', {}).get('overall_score', 0) > 50 else 'Low',
                    'role_suggestions': local_analysis.get('market_insights', {}).get('recruiter_insights', {}).get('role_suggestions', []),
                    'training_needs': local_analysis.get('market_insights', {}).get('recruiter_insights', {}).get('training_needs', []),
                    'local_advantage': local_analysis.get('market_insights', {}).get('recruiter_insights', {}).get('local_advantage', '')
                },
                'cultural_fit_analysis': {
                    'language_proficiency': local_analysis.get('language_analysis', {}),
                    'business_context': local_analysis.get('business_context', {}),
                    'cultural_elements': local_analysis.get('cultural_elements', {})
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating recruiter insights: {str(e)}")
            return {'error': 'Unable to generate recruiter insights'}
