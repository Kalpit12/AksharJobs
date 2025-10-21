#!/usr/bin/env python3
"""
Modern Resume Service with Enhanced Gemini AI Integration
Fast, reliable, and intelligent resume processing
"""

import os
import logging
import re
from typing import Dict, Any, Optional, List
import google.generativeai as genai
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class ModernResumeService:
    def __init__(self, gemini_api_key: Optional[str] = None):
        """Initialize the modern resume service"""
        self.gemini_model = None
        self.use_ai = False
        
        if gemini_api_key:
            try:
                genai.configure(api_key=gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest')
                self.use_ai = True
                logger.info("[OK] Gemini AI initialized successfully")
            except Exception as e:
                logger.warning(f"[WARNING] Gemini AI initialization failed: {e}")
                self.use_ai = False
        
        # Initialize text extraction methods
        self._init_extractors()
    
    def _init_extractors(self):
        """Initialize text extraction methods"""
        try:
            import PyPDF2
            import pdfplumber
            from docx import Document
            self.pdfplumber_available = True
            self.pypdf2_available = True
            self.docx_available = True
            logger.info("[OK] All text extraction libraries available")
        except ImportError as e:
            logger.warning(f"[WARNING] Some text extraction libraries missing: {e}")
            self.pdfplumber_available = False
            self.pypdf2_available = False
            self.docx_available = False
    
    def process_resume(self, file_path: str, file_extension: str) -> Dict[str, Any]:
        """Process resume with AI-powered extraction"""
        try:
            logger.info(f"🚀 Starting modern resume processing for: {file_path}")
            
            # Extract text content
            text_content = self._extract_text(file_path, file_extension)
            if not text_content:
                raise Exception("Failed to extract text from resume")
            
            logger.info(f"📝 Extracted {len(text_content)} characters of text")
            
            # Process with AI if available, otherwise use fallback
            if self.use_ai and self.gemini_model:
                logger.info("🤖 Using Gemini AI for intelligent extraction")
                resume_data = self._ai_extract_resume(text_content)
            else:
                logger.info("🔄 Using intelligent fallback extraction")
                resume_data = self._fallback_extract_resume(text_content)
            
            # Enhance with additional processing
            resume_data = self._enhance_resume_data(resume_data, text_content)
            
            logger.info("✅ Resume processing completed successfully")
            return resume_data
            
        except Exception as e:
            logger.error(f"❌ Resume processing failed: {e}")
            # Return basic fallback data
            return self._create_basic_fallback()
    
    def _extract_text(self, file_path: str, file_extension: str) -> Optional[str]:
        """Extract text from various file formats"""
        try:
            if file_extension.lower() == 'pdf':
                return self._extract_pdf_text(file_path)
            elif file_extension.lower() in ['docx', 'doc']:
                return self._extract_docx_text(file_path)
            elif file_extension.lower() == 'txt':
                return self._extract_text_file(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
        except Exception as e:
            logger.error(f"Text extraction failed: {e}")
            return None
    
    def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF using multiple methods"""
        text = ""
        
        # Try pdfplumber first (better for complex PDFs)
        if self.pdfplumber_available:
            try:
                import pdfplumber
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                if text.strip():
                    logger.info("✅ PDF text extracted with pdfplumber")
                    return text.strip()
            except Exception as e:
                logger.warning(f"pdfplumber failed: {e}")
        
        # Fallback to PyPDF2
        if self.pypdf2_available:
            try:
                import PyPDF2
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        text += page.extract_text() + "\n"
                if text.strip():
                    logger.info("✅ PDF text extracted with PyPDF2")
                    return text.strip()
            except Exception as e:
                logger.warning(f"PyPDF2 failed: {e}")
        
        raise Exception("All PDF extraction methods failed")
    
    def _extract_docx_text(self, file_path: str) -> str:
        """Extract text from DOCX files"""
        if not self.docx_available:
            raise Exception("python-docx not available")
        
        try:
            from docx import Document
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            logger.info("✅ DOCX text extracted successfully")
            return text.strip()
        except Exception as e:
            raise Exception(f"DOCX extraction failed: {e}")
    
    def _extract_text_file(self, file_path: str) -> str:
        """Extract text from plain text files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            logger.info("✅ Text file extracted successfully")
            return text.strip()
        except Exception as e:
            raise Exception(f"Text file extraction failed: {e}")
    
    def _ai_extract_resume(self, text_content: str) -> Dict[str, Any]:
        """Extract resume data using Gemini AI"""
        try:
            prompt = f"""
            Analyze this resume and extract structured information. Return ONLY a valid JSON object with the following structure:
            
            {{
                "personal_info": {{
                    "name": "Full Name",
                    "email": "Email Address",
                    "phone": "Phone Number",
                    "location": "City, Country",
                    "linkedin": "LinkedIn URL if available"
                }},
                "summary": "Professional summary in 2-3 sentences",
                "skills": {{
                    "technical_skills": ["skill1", "skill2", "skill3"],
                    "soft_skills": ["skill1", "skill2", "skill3"],
                    "languages": ["language1", "language2"]
                }},
                "experience": [
                    {{
                        "title": "Job Title",
                        "company": "Company Name",
                        "duration": "Duration",
                        "description": "Brief description of role and achievements"
                    }}
                ],
                "education": [
                    {{
                        "degree": "Degree Name",
                        "institution": "Institution Name",
                        "year": "Year",
                        "gpa": "GPA if available"
                    }}
                ],
                "projects": [
                    {{
                        "name": "Project Name",
                        "description": "Project description",
                        "technologies": ["tech1", "tech2"],
                        "url": "URL if available"
                    }}
                ],
                "certifications": ["cert1", "cert2"],
                "achievements": ["achievement1", "achievement2"]
            }}
            
            Resume text:
            {text_content[:4000]}
            
            Extract the information accurately and return ONLY the JSON object.
            """
            
            response = self.gemini_model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean the response to extract JSON
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                resume_data = json.loads(json_str)
                logger.info("✅ AI extraction completed successfully")
                return resume_data
            else:
                raise Exception("AI response doesn't contain valid JSON")
                
        except Exception as e:
            logger.error(f"AI extraction failed: {e}")
            raise Exception(f"AI processing failed: {e}")
    
    def _fallback_extract_resume(self, text_content: str) -> Dict[str, Any]:
        """Intelligent fallback extraction without AI"""
        try:
            # Extract personal info using regex patterns
            personal_info = self._extract_personal_info(text_content)
            
            # Extract skills using keyword matching
            skills = self._extract_skills(text_content)
            
            # Extract experience using pattern matching
            experience = self._extract_experience(text_content)
            
            # Extract education using pattern matching
            education = self._extract_education(text_content)
            
            # Create structured data
            resume_data = {
                "personal_info": personal_info,
                "summary": self._extract_summary(text_content),
                "skills": skills,
                "experience": experience,
                "education": education,
                "projects": self._extract_projects(text_content),
                "certifications": self._extract_certifications(text_content),
                "achievements": self._extract_achievements(text_content)
            }
            
            logger.info("✅ Fallback extraction completed successfully")
            return resume_data
            
        except Exception as e:
            logger.error(f"Fallback extraction failed: {e}")
            raise Exception(f"Fallback processing failed: {e}")
    
    def _extract_personal_info(self, text: str) -> Dict[str, str]:
        """Extract personal information using regex patterns"""
        info = {
            "name": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": ""
        }
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            info["email"] = email_match.group()
        
        # Extract phone
        phone_pattern = r'(\+?[\d\s\-\(\)]{10,})'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            info["phone"] = phone_match.group().strip()
        
        # Extract LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w\-]+'
        linkedin_match = re.search(linkedin_pattern, text)
        if linkedin_match:
            info["linkedin"] = f"https://{linkedin_match.group()}"
        
        # Extract name (first few lines, before email/phone)
        lines = text.split('\n')[:10]
        for line in lines:
            line = line.strip()
            if line and not re.search(r'[@\d]', line) and len(line) < 50:
                if not info["name"]:
                    info["name"] = line
                    break
        
        # Extract location (look for city, country patterns)
        location_pattern = r'([A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+)*)'
        location_matches = re.findall(location_pattern, text)
        for match in location_matches:
            if len(match) > 3 and match not in info["name"]:
                info["location"] = match
                break
        
        return info
    
    def _extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract skills using keyword matching"""
        # Common technical skills
        tech_skills = [
            'Python', 'JavaScript', 'Java', 'C++', 'C#', 'React', 'Node.js', 'Angular',
            'Vue.js', 'Django', 'Flask', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL',
            'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Linux', 'HTML', 'CSS',
            'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala'
        ]
        
        # Common soft skills
        soft_skills = [
            'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
            'Time Management', 'Adaptability', 'Creativity', 'Collaboration', 'Analytical',
            'Strategic Planning', 'Project Management', 'Customer Service', 'Negotiation'
        ]
        
        # Common languages
        languages = [
            'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
            'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian', 'Dutch'
        ]
        
        found_tech = [skill for skill in tech_skills if skill.lower() in text.lower()]
        found_soft = [skill for skill in soft_skills if skill.lower() in text.lower()]
        found_langs = [lang for lang in languages if lang.lower() in text.lower()]
        
        return {
            "technical_skills": found_tech[:10],  # Limit to top 10
            "soft_skills": found_soft[:8],
            "languages": found_langs[:5]
        }
    
    def _extract_experience(self, text: str) -> List[Dict[str, str]]:
        """Extract work experience using pattern matching"""
        experience = []
        
        # Look for common job title patterns
        job_patterns = [
            r'(?:Senior\s+)?(?:Software\s+)?(?:Engineer|Developer|Programmer)',
            r'(?:Full\s+Stack|Frontend|Backend|DevOps|Data)\s+(?:Engineer|Developer)',
            r'(?:Project|Product|Program)\s+Manager',
            r'(?:Business|Data)\s+Analyst',
            r'(?:UI|UX)\s+Designer'
        ]
        
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            if any(re.search(pattern, line, re.IGNORECASE) for pattern in job_patterns):
                # Try to extract company and duration from nearby lines
                company = ""
                duration = ""
                
                # Look for company in next few lines
                for j in range(i+1, min(i+5, len(lines))):
                    next_line = lines[j].strip()
                    if next_line and len(next_line) < 100 and not re.search(r'[@\d]', next_line):
                        if not company:
                            company = next_line
                        elif not duration and re.search(r'\d{4}', next_line):
                            duration = next_line
                
                if company:
                    experience.append({
                        "title": line,
                        "company": company,
                        "duration": duration,
                        "description": "Role responsibilities and achievements"
                    })
        
        return experience[:5]  # Limit to top 5 experiences
    
    def _extract_education(self, text: str) -> List[Dict[str, str]]:
        """Extract education information"""
        education = []
        
        # Look for degree patterns
        degree_patterns = [
            r'(?:Bachelor|Master|PhD|BSc|MSc|MBA|BBA|BS|MS)\'?s?\s+(?:of|in)?\s+[A-Za-z\s]+',
            r'[A-Za-z\s]+(?:Bachelor|Master|PhD|BSc|MSc|MBA|BBA|BS|MS)'
        ]
        
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            if any(re.search(pattern, line, re.IGNORECASE) for pattern in degree_patterns):
                # Look for institution in nearby lines
                institution = ""
                year = ""
                
                for j in range(i+1, min(i+3, len(lines))):
                    next_line = lines[j].strip()
                    if next_line and len(next_line) < 100:
                        if not institution and not re.search(r'\d{4}', next_line):
                            institution = next_line
                        elif not year and re.search(r'\d{4}', next_line):
                            year = next_line
                
                if institution:
                    education.append({
                        "degree": line,
                        "institution": institution,
                        "year": year,
                        "gpa": ""
                    })
        
        return education[:3]  # Limit to top 3 education entries
    
    def _extract_summary(self, text: str) -> str:
        """Extract or generate professional summary"""
        # Look for existing summary
        summary_patterns = [
            r'(?:Professional\s+)?(?:Summary|Profile|Objective)[:\s]*([^.\n]+[.\n]+[^.\n]+[.\n]+[^.\n]+)',
            r'(?:About|I am|Experienced)[^.\n]+[.\n]+[^.\n]+[.\n]+[^.\n]+'
        ]
        
        for pattern in summary_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip() if len(match.groups()) > 0 else match.group().strip()
        
        # Generate basic summary
        return "Experienced professional with strong technical skills and proven track record of delivering results."
    
    def _extract_projects(self, text: str) -> List[Dict[str, str]]:
        """Extract project information"""
        projects = []
        
        # Look for project patterns
        project_patterns = [
            r'(?:Project|Portfolio)[:\s]*([^.\n]+)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:App|Application|System|Platform|Tool))'
        ]
        
        for pattern in project_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(match) > 5:
                    projects.append({
                        "name": match,
                        "description": "Project description and technologies used",
                        "technologies": [],
                        "url": ""
                    })
        
        return projects[:3]  # Limit to top 3 projects
    
    def _extract_certifications(self, text: str) -> List[str]:
        """Extract certifications"""
        cert_patterns = [
            r'(?:Certified|Certification|Certificate)[:\s]*([^.\n]+)',
            r'([A-Z]{2,}(?:\s+[A-Z]{2,})*\s+(?:Certified|Professional|Expert))'
        ]
        
        certifications = []
        for pattern in cert_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(match) > 3:
                    certifications.append(match.strip())
        
        return list(set(certifications))[:5]  # Remove duplicates, limit to 5
    
    def _extract_achievements(self, text: str) -> List[str]:
        """Extract achievements and accomplishments"""
        achievement_patterns = [
            r'(?:Achieved|Accomplished|Completed|Delivered)[^.\n]+',
            r'(?:Increased|Improved|Reduced|Optimized)[^.\n]+',
            r'(?:Led|Managed|Coordinated)[^.\n]+'
        ]
        
        achievements = []
        for pattern in achievement_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(match) > 10:
                    achievements.append(match.strip())
        
        return achievements[:5]  # Limit to top 5 achievements
    
    def _enhance_resume_data(self, resume_data: Dict[str, Any], text_content: str) -> Dict[str, Any]:
        """Enhance resume data with additional processing"""
        try:
            # Add processing metadata
            resume_data["processing_info"] = {
                "processed_at": datetime.now().isoformat(),
                "ai_processed": self.use_ai,
                "text_length": len(text_content),
                "extraction_method": "ai" if self.use_ai else "fallback"
            }
            
            # Clean and validate data
            for key, value in resume_data.items():
                if isinstance(value, str) and value:
                    resume_data[key] = value.strip()
                elif isinstance(value, list):
                    resume_data[key] = [item.strip() if isinstance(item, str) else item for item in value if item]
            
            # Generate AI recommendations if available
            if self.use_ai:
                resume_data["ai_recommendations"] = self._generate_ai_recommendations(resume_data)
            
            return resume_data
            
        except Exception as e:
            logger.warning(f"Data enhancement failed: {e}")
            return resume_data
    
    def _generate_ai_recommendations(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI-powered personalized career recommendations"""
        try:
            # Extract key information for personalization
            skills = resume_data.get('skills', {})
            technical_skills = skills.get('technical_skills', [])
            soft_skills = skills.get('soft_skills', [])
            experience = resume_data.get('experience', [])
            education = resume_data.get('education', [])
            personal_info = resume_data.get('personal_info', {})
            
            # Determine experience level
            experience_level = self._determine_experience_level(experience)
            
            # Determine primary field/industry
            primary_field = self._determine_primary_field(technical_skills, experience)
            
            # Create personalized prompt
            prompt = f"""
            Analyze this professional's resume and provide highly personalized, specific career recommendations based on their unique background:

            PERSONAL PROFILE:
            - Name: {personal_info.get('name', 'Professional')}
            - Experience Level: {experience_level}
            - Primary Field: {primary_field}
            - Technical Skills: {', '.join(technical_skills[:10])}
            - Soft Skills: {', '.join(soft_skills[:5])}
            - Years of Experience: {len(experience)} positions
            - Education: {', '.join([edu.get('degree', '') for edu in education])}
            - Location: {personal_info.get('location', 'Not specified')}

            DETAILED EXPERIENCE:
            {self._format_experience_for_ai(experience)}

            EDUCATION BACKGROUND:
            {self._format_education_for_ai(education)}

            Based on this specific profile, provide personalized recommendations in JSON format:
            {{
                "career_path": {{
                    "suggested_roles": ["3 specific roles based on their exact skills and experience level"],
                    "next_steps": ["3 specific next career moves based on their background"],
                    "career_progression": ["immediate role", "2-year goal", "5-year goal"],
                    "industry_opportunities": ["specific industries that match their profile"]
                }},
                "skill_development": {{
                    "recommended_skills": ["5 skills that complement their existing expertise"],
                    "skill_gaps": ["3 skills missing for their target roles"],
                    "learning_resources": ["specific courses/platforms for their skill level"],
                    "certification_recommendations": ["relevant certifications for their field"]
                }},
                "job_search": {{
                    "target_companies": ["companies that hire their specific skill set"],
                    "salary_range": "realistic range for their experience level and location",
                    "industry_focus": ["specific industries based on their background"],
                    "job_titles_to_search": ["exact job titles they should apply for"],
                    "geographic_opportunities": ["best locations for their field"]
                }},
                "personalized_insights": {{
                    "strengths": ["their unique competitive advantages"],
                    "market_position": "how they compare in the job market",
                    "growth_potential": "specific areas for professional growth",
                    "networking_suggestions": ["where to network based on their field"]
                }}
            }}

            Make all recommendations specific to their exact profile, not generic advice.
            """
            
            response = self.gemini_model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                recommendations = json.loads(json_str)
                
                # Add personalization metadata
                recommendations["personalization_info"] = {
                    "generated_for": personal_info.get('name', 'User'),
                    "experience_level": experience_level,
                    "primary_field": primary_field,
                    "generated_at": datetime.now().isoformat(),
                    "is_personalized": True
                }
                
                logger.info(f"✅ Personalized AI recommendations generated for {experience_level} {primary_field} professional")
                return recommendations
            else:
                return self._generate_personalized_fallback_recommendations(resume_data)
                
        except Exception as e:
            logger.warning(f"AI recommendations failed: {e}")
            return self._generate_personalized_fallback_recommendations(resume_data)
    
    def _determine_experience_level(self, experience: List[Dict[str, str]]) -> str:
        """Determine experience level based on work history"""
        if not experience:
            return "Entry Level"
        elif len(experience) <= 2:
            return "Junior Level"
        elif len(experience) <= 4:
            return "Mid Level"
        else:
            return "Senior Level"
    
    def _determine_primary_field(self, technical_skills: List[str], experience: List[Dict[str, str]]) -> str:
        """Determine primary field/industry based on skills and experience"""
        # Check technical skills for field indicators
        web_dev_skills = ['JavaScript', 'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'Node.js']
        data_science_skills = ['Python', 'R', 'Machine Learning', 'Data Analysis', 'SQL', 'Pandas']
        mobile_dev_skills = ['Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS', 'Android']
        devops_skills = ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform']
        backend_skills = ['Java', 'C#', '.NET', 'Spring', 'Django', 'Flask']
        
        # Count skill matches
        field_scores = {
            'Web Development': sum(1 for skill in technical_skills if skill in web_dev_skills),
            'Data Science': sum(1 for skill in technical_skills if skill in data_science_skills),
            'Mobile Development': sum(1 for skill in technical_skills if skill in mobile_dev_skills),
            'DevOps': sum(1 for skill in technical_skills if skill in devops_skills),
            'Backend Development': sum(1 for skill in technical_skills if skill in backend_skills)
        }
        
        # Check experience titles
        for exp in experience:
            title = exp.get('title', '').lower()
            if 'data' in title or 'analyst' in title:
                field_scores['Data Science'] += 2
            elif 'mobile' in title or 'ios' in title or 'android' in title:
                field_scores['Mobile Development'] += 2
            elif 'devops' in title or 'infrastructure' in title:
                field_scores['DevOps'] += 2
            elif 'backend' in title or 'server' in title:
                field_scores['Backend Development'] += 2
            elif 'frontend' in title or 'web' in title:
                field_scores['Web Development'] += 2
        
        # Return field with highest score
        if max(field_scores.values()) > 0:
            return max(field_scores, key=field_scores.get)
        else:
            return "General Technology"
    
    def _format_experience_for_ai(self, experience: List[Dict[str, str]]) -> str:
        """Format experience data for AI analysis"""
        if not experience:
            return "No professional experience listed"
        
        formatted = []
        for exp in experience:
            formatted.append(f"- {exp.get('title', 'Position')} at {exp.get('company', 'Company')} ({exp.get('duration', 'Duration')})")
        
        return '\n'.join(formatted)
    
    def _format_education_for_ai(self, education: List[Dict[str, str]]) -> str:
        """Format education data for AI analysis"""
        if not education:
            return "No formal education listed"
        
        formatted = []
        for edu in education:
            formatted.append(f"- {edu.get('degree', 'Degree')} from {edu.get('institution', 'Institution')} ({edu.get('year', 'Year')})")
        
        return '\n'.join(formatted)
    
    def _generate_personalized_fallback_recommendations(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized fallback recommendations without AI"""
        skills = resume_data.get('skills', {})
        technical_skills = skills.get('technical_skills', [])
        experience = resume_data.get('experience', [])
        personal_info = resume_data.get('personal_info', {})
        
        experience_level = self._determine_experience_level(experience)
        primary_field = self._determine_primary_field(technical_skills, experience)
        
        # Personalized recommendations based on field and experience
        field_specific_recommendations = self._get_field_specific_recommendations(primary_field, experience_level, technical_skills)
        
        return {
            "career_path": {
                "suggested_roles": field_specific_recommendations['roles'],
                "next_steps": field_specific_recommendations['next_steps'],
                "career_progression": field_specific_recommendations['progression'],
                "industry_opportunities": field_specific_recommendations['industries']
            },
            "skill_development": {
                "recommended_skills": field_specific_recommendations['skills'],
                "skill_gaps": field_specific_recommendations['skill_gaps'],
                "learning_resources": field_specific_recommendations['learning'],
                "certification_recommendations": field_specific_recommendations['certifications']
            },
            "job_search": {
                "target_companies": field_specific_recommendations['companies'],
                "salary_range": self._get_salary_estimate(primary_field, experience_level, personal_info.get('location', '')),
                "industry_focus": field_specific_recommendations['industries'],
                "job_titles_to_search": field_specific_recommendations['job_titles'],
                "geographic_opportunities": field_specific_recommendations['locations']
            },
            "personalized_insights": {
                "strengths": field_specific_recommendations['strengths'],
                "market_position": f"{experience_level} professional in {primary_field}",
                "growth_potential": field_specific_recommendations['growth_areas'],
                "networking_suggestions": field_specific_recommendations['networking']
            },
            "personalization_info": {
                "generated_for": personal_info.get('name', 'User'),
                "experience_level": experience_level,
                "primary_field": primary_field,
                "generated_at": datetime.now().isoformat(),
                "is_personalized": True
            }
        }
    
    def _get_field_specific_recommendations(self, field: str, level: str, skills: List[str]) -> Dict[str, List[str]]:
        """Get field and experience level specific recommendations"""
        
        # Define field-specific data
        field_data = {
            'Web Development': {
                'Entry Level': {
                    'roles': ['Junior Frontend Developer', 'Web Developer Intern', 'UI Developer'],
                    'skills': ['React.js', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs'],
                    'companies': ['Local startups', 'Web agencies', 'E-commerce companies'],
                    'job_titles': ['Frontend Developer', 'Web Developer', 'Junior React Developer'],
                    'certifications': ['Meta React Certificate', 'Google UX Design', 'AWS Cloud Practitioner']
                },
                'Mid Level': {
                    'roles': ['Full Stack Developer', 'Senior Frontend Developer', 'React Developer'],
                    'skills': ['Next.js', 'GraphQL', 'Node.js', 'Database Design', 'Testing'],
                    'companies': ['Tech companies', 'SaaS platforms', 'Digital agencies'],
                    'job_titles': ['Full Stack Developer', 'Senior Frontend Developer', 'React Specialist'],
                    'certifications': ['AWS Solutions Architect', 'Google Cloud Professional', 'MongoDB Certified']
                },
                'Senior Level': {
                    'roles': ['Lead Frontend Developer', 'Full Stack Architect', 'Engineering Manager'],
                    'skills': ['System Architecture', 'Team Leadership', 'Performance Optimization', 'Microservices'],
                    'companies': ['Fortune 500', 'Tech giants', 'Scale-ups'],
                    'job_titles': ['Technical Lead', 'Engineering Manager', 'Principal Developer'],
                    'certifications': ['AWS Solutions Architect Pro', 'PMP', 'Certified Scrum Master']
                }
            },
            'Data Science': {
                'Entry Level': {
                    'roles': ['Junior Data Analyst', 'Data Science Intern', 'Business Intelligence Analyst'],
                    'skills': ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
                    'companies': ['Consulting firms', 'Banks', 'E-commerce companies'],
                    'job_titles': ['Data Analyst', 'Junior Data Scientist', 'BI Analyst'],
                    'certifications': ['Google Data Analytics', 'IBM Data Science', 'Microsoft Power BI']
                },
                'Mid Level': {
                    'roles': ['Data Scientist', 'Senior Data Analyst', 'ML Engineer'],
                    'skills': ['Machine Learning', 'Deep Learning', 'Apache Spark', 'Cloud ML', 'A/B Testing'],
                    'companies': ['Tech companies', 'Financial services', 'Healthcare'],
                    'job_titles': ['Data Scientist', 'ML Engineer', 'Senior Data Analyst'],
                    'certifications': ['AWS ML Specialty', 'Google ML Engineer', 'Databricks Certified']
                },
                'Senior Level': {
                    'roles': ['Lead Data Scientist', 'Data Science Manager', 'Chief Data Officer'],
                    'skills': ['Data Strategy', 'Team Management', 'MLOps', 'Data Governance'],
                    'companies': ['Fortune 500', 'Tech giants', 'Consulting firms'],
                    'job_titles': ['Principal Data Scientist', 'Data Science Manager', 'Head of Analytics'],
                    'certifications': ['AWS ML Specialty Pro', 'Google Cloud ML', 'Executive Data Science']
                }
            },
            'Mobile Development': {
                'Entry Level': {
                    'roles': ['Junior iOS Developer', 'Junior Android Developer', 'Mobile App Developer'],
                    'skills': ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Mobile UI/UX'],
                    'companies': ['App development agencies', 'Startups', 'E-commerce'],
                    'job_titles': ['iOS Developer', 'Android Developer', 'Mobile Developer'],
                    'certifications': ['Apple Developer', 'Google Android Associate', 'React Native Certified']
                },
                'Mid Level': {
                    'roles': ['Senior Mobile Developer', 'Mobile Team Lead', 'Cross-platform Developer'],
                    'skills': ['Advanced iOS/Android', 'CI/CD for Mobile', 'App Store Optimization', 'Performance'],
                    'companies': ['Tech companies', 'Mobile-first startups', 'Enterprise'],
                    'job_titles': ['Senior Mobile Developer', 'Lead iOS Developer', 'Mobile Architect'],
                    'certifications': ['Apple Developer Pro', 'Google Android Expert', 'Flutter Certified']
                },
                'Senior Level': {
                    'roles': ['Mobile Engineering Manager', 'Principal Mobile Developer', 'Mobile Architect'],
                    'skills': ['Mobile Strategy', 'Team Leadership', 'Architecture Design', 'Platform Strategy'],
                    'companies': ['Tech giants', 'Major apps', 'Enterprise companies'],
                    'job_titles': ['Mobile Engineering Manager', 'Principal Mobile Engineer', 'Head of Mobile'],
                    'certifications': ['Apple Leadership', 'Google Cloud Mobile', 'Enterprise Mobile Strategy']
                }
            }
        }
        
        # Get field-specific data or default to general tech
        current_field_data = field_data.get(field, field_data['Web Development'])
        level_data = current_field_data.get(level, current_field_data['Entry Level'])
        
        return {
            'roles': level_data['roles'],
            'skills': level_data['skills'],
            'companies': level_data['companies'],
            'job_titles': level_data['job_titles'],
            'certifications': level_data['certifications'],
            'next_steps': [
                f"Develop expertise in {level_data['skills'][0]} for {field}",
                f"Apply to {level_data['companies'][0]} and similar companies",
                f"Consider pursuing {level_data['certifications'][0]} certification"
            ],
            'progression': [
                level_data['roles'][0],
                level_data['roles'][1] if len(level_data['roles']) > 1 else f"Senior {level_data['roles'][0]}",
                "Team Lead" if level == "Entry Level" else "Engineering Manager"
            ],
            'industries': [field, 'Technology', 'Startups'],
            'skill_gaps': [skill for skill in level_data['skills'] if skill not in skills],
            'learning': [
                f"Coursera - {field} Specialization",
                f"Udemy - Advanced {level_data['skills'][0] if level_data['skills'] else field}",
                "LinkedIn Learning - Professional Development"
            ],
            'locations': ['Remote', 'Nairobi', 'Kampala', 'Lagos', 'Cape Town'],
            'strengths': [f"Strong {field} background", f"{level} experience", "Relevant technical skills"],
            'growth_areas': [f"Advanced {field} skills", "Leadership abilities", "Industry certifications"],
            'networking': [f"{field} meetups", "Tech conferences", "Professional associations"]
        }
    
    def _get_salary_estimate(self, field: str, level: str, location: str) -> str:
        """Get salary estimate based on field, level, and location"""
        # Base salary ranges by field and level (in KSh)
        salary_ranges = {
            'Web Development': {
                'Entry Level': (80000, 150000),
                'Junior Level': (120000, 200000),
                'Mid Level': (180000, 350000),
                'Senior Level': (300000, 600000)
            },
            'Data Science': {
                'Entry Level': (100000, 180000),
                'Junior Level': (150000, 250000),
                'Mid Level': (220000, 400000),
                'Senior Level': (350000, 700000)
            },
            'Mobile Development': {
                'Entry Level': (90000, 160000),
                'Junior Level': (130000, 220000),
                'Mid Level': (200000, 380000),
                'Senior Level': (320000, 650000)
            },
            'DevOps': {
                'Entry Level': (110000, 190000),
                'Junior Level': (160000, 270000),
                'Mid Level': (240000, 420000),
                'Senior Level': (380000, 750000)
            }
        }
        
        # Get range for field and level
        field_ranges = salary_ranges.get(field, salary_ranges['Web Development'])
        min_salary, max_salary = field_ranges.get(level, field_ranges['Entry Level'])
        
        # Adjust for location (basic adjustment)
        if 'nairobi' in location.lower():
            min_salary = int(min_salary * 1.1)
            max_salary = int(max_salary * 1.1)
        elif 'remote' in location.lower():
            min_salary = int(min_salary * 1.2)
            max_salary = int(max_salary * 1.2)
        
        return f"KSh {min_salary:,} - {max_salary:,}"
    
    def _generate_fallback_recommendations(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback recommendations without AI - kept for backward compatibility"""
        return self._generate_personalized_fallback_recommendations(resume_data)
    
    def _create_basic_fallback(self) -> Dict[str, Any]:
        """Create basic fallback data if all processing fails"""
        return {
            "personal_info": {
                "name": "Resume Uploaded",
                "email": "Please update your profile",
                "phone": "",
                "location": "Location not specified",
                "linkedin": ""
            },
            "summary": "Resume uploaded successfully. Please review and update your profile information.",
            "skills": {
                "technical_skills": ["Resume Uploaded"],
                "soft_skills": ["Professional"],
                "languages": ["English"]
            },
            "experience": [],
            "education": [],
            "projects": [],
            "certifications": [],
            "achievements": ["Successfully uploaded resume to AksharJobs"],
            "processing_info": {
                "processed_at": datetime.now().isoformat(),
                "ai_processed": False,
                "text_length": 0,
                "extraction_method": "fallback"
            }
        }
