"""
AI Service - Central AI/ML utilities for various features
Provides mock AI responses that can be replaced with real AI API calls
"""

import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

class AIService:
    """Central AI service for all AI-powered features"""
    
    def __init__(self):
        self.model_name = "Mock AI v1.0"  # Replace with actual AI model later
    
    # ===== CAREER PATH ADVISOR =====
    
    def generate_career_path(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate 3-5 year career roadmap for job seeker"""
        
        current_role = user_data.get('mostRecentJobTitle', 'Professional')
        skills = user_data.get('skills', [])
        experience = user_data.get('yearsOfExperience', '0-1 year')
        
        # Define career progression paths
        career_paths = {
            'software': {
                'current': 'Software Engineer',
                'year1': 'Senior Software Engineer',
                'year3': 'Tech Lead / Engineering Manager',
                'year5': 'Director of Engineering / Principal Engineer',
                'skills_needed': ['System Design', 'Leadership', 'Architecture', 'Mentoring', 'Project Management']
            },
            'marketing': {
                'current': 'Marketing Specialist',
                'year1': 'Senior Marketing Specialist',
                'year3': 'Marketing Manager',
                'year5': 'Director of Marketing / CMO',
                'skills_needed': ['Strategy', 'Team Leadership', 'Budget Management', 'Analytics', 'Brand Management']
            },
            'data': {
                'current': 'Data Analyst',
                'year1': 'Senior Data Analyst',
                'year3': 'Data Scientist / Analytics Manager',
                'year5': 'Head of Data Science / Chief Data Officer',
                'skills_needed': ['Machine Learning', 'Statistical Modeling', 'Leadership', 'Business Strategy', 'Cloud Platforms']
            },
            'default': {
                'current': current_role,
                'year1': f'Senior {current_role}',
                'year3': f'{current_role} Manager / Team Lead',
                'year5': f'Director / VP of {current_role}',
                'skills_needed': ['Leadership', 'Strategy', 'Communication', 'Project Management', 'Team Building']
            }
        }
        
        # Simple keyword matching to determine path
        path_key = 'default'
        if any(word in current_role.lower() for word in ['engineer', 'developer', 'software']):
            path_key = 'software'
        elif any(word in current_role.lower() for word in ['marketing', 'brand', 'content']):
            path_key = 'marketing'
        elif any(word in current_role.lower() for word in ['data', 'analyst', 'analytics']):
            path_key = 'data'
        
        path = career_paths[path_key]
        
        roadmap = {
            'current_position': {
                'title': path['current'],
                'status': 'current',
                'timeline': 'Now',
                'focus': 'Master current role, build strong foundation',
                'key_actions': [
                    'Excel in current responsibilities',
                    'Seek feedback regularly',
                    'Document your achievements',
                    'Build professional network'
                ]
            },
            'year_1_2': {
                'title': path['year1'],
                'status': 'short_term',
                'timeline': '1-2 Years',
                'salary_increase': '15-25%',
                'focus': 'Deepen expertise and take on leadership',
                'key_actions': [
                    'Lead 2-3 major projects',
                    'Mentor junior team members',
                    'Develop specialized expertise',
                    'Obtain relevant certifications'
                ],
                'skills_to_develop': path['skills_needed'][:3]
            },
            'year_3_4': {
                'title': path['year3'],
                'status': 'mid_term',
                'timeline': '3-4 Years',
                'salary_increase': '40-60%',
                'focus': 'Transition to leadership and strategy',
                'key_actions': [
                    'Manage a team or large project',
                    'Drive strategic initiatives',
                    'Build cross-functional relationships',
                    'Develop business acumen'
                ],
                'skills_to_develop': path['skills_needed'][2:]
            },
            'year_5': {
                'title': path['year5'],
                'status': 'long_term',
                'timeline': '5+ Years',
                'salary_increase': '80-120%',
                'focus': 'Executive leadership and organizational impact',
                'key_actions': [
                    'Lead multiple teams or division',
                    'Shape company strategy',
                    'Industry thought leadership',
                    'Expand professional network'
                ],
                'skills_to_develop': ['Executive Leadership', 'Strategic Vision', 'Organizational Design']
            }
        }
        
        recommendations = {
            'immediate_actions': [
                'Update LinkedIn profile with latest achievements',
                'Identify a mentor in your target role',
                'Start learning one new skill from the roadmap',
                'Set quarterly career goals'
            ],
            'learning_resources': [
                {
                    'type': 'Course',
                    'title': f'Advanced {path_key.title()} Skills',
                    'platform': 'Coursera',
                    'duration': '6 weeks'
                },
                {
                    'type': 'Book',
                    'title': 'The Manager\'s Path' if 'manager' in path['year3'].lower() else 'High Output Management',
                    'author': 'Camille Fournier' if 'manager' in path['year3'].lower() else 'Andy Grove'
                },
                {
                    'type': 'Certification',
                    'title': path['skills_needed'][0],
                    'provider': 'Industry Standard'
                }
            ],
            'networking_tips': [
                'Join industry-specific groups on LinkedIn',
                'Attend 2-3 conferences or webinars per year',
                'Connect with people in your target roles',
                'Share your knowledge through blogging or speaking'
            ]
        }
        
        return {
            'success': True,
            'roadmap': roadmap,
            'recommendations': recommendations,
            'ai_confidence': 0.85,
            'generated_at': datetime.utcnow().isoformat(),
            'model_used': self.model_name
        }
    
    # ===== PROJECT RECOMMENDER (INTERNS) =====
    
    def recommend_projects(self, intern_data: Dict[str, Any]) -> Dict[str, Any]:
        """Recommend impactful projects for intern's growth"""
        
        skills = intern_data.get('technicalSkills', [])
        interests = intern_data.get('interests', [])
        experience_level = intern_data.get('experienceLevel', 'Beginner')
        
        # Project database by difficulty and category
        project_templates = {
            'software': [
                {
                    'title': 'Build a REST API with Authentication',
                    'difficulty': 'Intermediate',
                    'impact': 'High',
                    'duration': '2-3 weeks',
                    'skills_learned': ['API Design', 'Authentication', 'Database Design', 'Security'],
                    'description': 'Create a RESTful API with user authentication, CRUD operations, and proper error handling.',
                    'deliverables': ['Working API', 'API Documentation', 'Unit Tests', 'Deployment'],
                    'resume_value': 9
                },
                {
                    'title': 'Implement Real-time Chat Application',
                    'difficulty': 'Advanced',
                    'impact': 'Very High',
                    'duration': '3-4 weeks',
                    'skills_learned': ['WebSockets', 'Real-time Systems', 'State Management', 'UI/UX'],
                    'description': 'Build a real-time chat app with features like typing indicators, file sharing, and message history.',
                    'deliverables': ['Chat Application', 'User Interface', 'Backend System', 'Documentation'],
                    'resume_value': 10
                },
                {
                    'title': 'Create an Automated Testing Framework',
                    'difficulty': 'Intermediate',
                    'impact': 'High',
                    'duration': '2 weeks',
                    'skills_learned': ['Test Automation', 'CI/CD', 'Quality Assurance', 'DevOps'],
                    'description': 'Design and implement automated tests for existing codebase with CI/CD integration.',
                    'deliverables': ['Test Suite', 'CI/CD Pipeline', 'Coverage Report', 'Documentation'],
                    'resume_value': 8
                }
            ],
            'data': [
                {
                    'title': 'Build a Data Pipeline with ETL',
                    'difficulty': 'Intermediate',
                    'impact': 'High',
                    'duration': '2-3 weeks',
                    'skills_learned': ['ETL', 'Data Processing', 'SQL', 'Data Warehousing'],
                    'description': 'Create an automated data pipeline that extracts, transforms, and loads data from multiple sources.',
                    'deliverables': ['Pipeline Code', 'Data Models', 'Dashboard', 'Documentation'],
                    'resume_value': 9
                },
                {
                    'title': 'Develop a Machine Learning Model',
                    'difficulty': 'Advanced',
                    'impact': 'Very High',
                    'duration': '3-4 weeks',
                    'skills_learned': ['Machine Learning', 'Model Training', 'Feature Engineering', 'Model Deployment'],
                    'description': 'Train and deploy a machine learning model for business use case with proper evaluation.',
                    'deliverables': ['Trained Model', 'API Endpoint', 'Performance Metrics', 'Documentation'],
                    'resume_value': 10
                }
            ],
            'design': [
                {
                    'title': 'Complete UI/UX Redesign Project',
                    'difficulty': 'Intermediate',
                    'impact': 'High',
                    'duration': '2-3 weeks',
                    'skills_learned': ['UI Design', 'User Research', 'Prototyping', 'Design Systems'],
                    'description': 'Redesign an existing product feature with user research, wireframes, and high-fidelity mockups.',
                    'deliverables': ['User Research Report', 'Wireframes', 'Prototypes', 'Design System'],
                    'resume_value': 9
                }
            ],
            'general': [
                {
                    'title': 'Process Improvement Initiative',
                    'difficulty': 'Beginner',
                    'impact': 'Medium',
                    'duration': '2 weeks',
                    'skills_learned': ['Process Analysis', 'Documentation', 'Stakeholder Management'],
                    'description': 'Analyze and improve an existing team process, documenting the before/after impact.',
                    'deliverables': ['Process Documentation', 'Implementation Plan', 'Impact Report'],
                    'resume_value': 7
                },
                {
                    'title': 'Cross-functional Collaboration Project',
                    'difficulty': 'Intermediate',
                    'impact': 'High',
                    'duration': '3 weeks',
                    'skills_learned': ['Collaboration', 'Communication', 'Project Management'],
                    'description': 'Lead a project that requires coordinating with multiple teams to achieve a common goal.',
                    'deliverables': ['Project Plan', 'Stakeholder Reports', 'Final Deliverable', 'Lessons Learned'],
                    'resume_value': 8
                }
            ]
        }
        
        # Determine project category
        category = 'general'
        if any(skill.lower() in ['python', 'javascript', 'java', 'react', 'node'] for skill in skills):
            category = 'software'
        elif any(skill.lower() in ['sql', 'data', 'analytics', 'tableau', 'python'] for skill in skills):
            category = 'data'
        elif any(skill.lower() in ['design', 'figma', 'ui', 'ux', 'photoshop'] for skill in skills):
            category = 'design'
        
        # Get projects
        projects = project_templates.get(category, project_templates['general'])
        
        # Add general projects
        if category != 'general':
            projects.extend(project_templates['general'])
        
        return {
            'success': True,
            'recommended_projects': projects[:4],  # Top 4 recommendations
            'total_projects': len(projects),
            'category': category,
            'personalization_note': f'Based on your skills in {", ".join(skills[:3])}',
            'tips': [
                'Start with one project and complete it fully',
                'Document your work thoroughly',
                'Get code/design reviews from senior team members',
                'Showcase completed projects in your portfolio'
            ],
            'ai_confidence': 0.82,
            'generated_at': datetime.utcnow().isoformat(),
            'model_used': self.model_name
        }
    
    # ===== LEARNING PATH GENERATOR (INTERNS) =====
    
    def generate_learning_path(self, intern_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate structured learning path for intern"""
        
        current_skills = intern_data.get('technicalSkills', [])
        target_role = intern_data.get('desiredRole', 'Professional')
        duration_weeks = intern_data.get('internshipDuration', 12)
        
        # Learning path templates
        learning_paths = {
            'software_engineer': {
                'fundamentals': {
                    'week': '1-2',
                    'topics': ['Git & Version Control', 'Code Review Process', 'Development Environment Setup'],
                    'resources': [
                        {'type': 'Course', 'title': 'Git Mastery', 'platform': 'Udemy', 'hours': 4},
                        {'type': 'Article', 'title': 'Code Review Best Practices', 'platform': 'Medium', 'hours': 1}
                    ],
                    'milestone': 'Complete first code review'
                },
                'core_skills': {
                    'week': '3-6',
                    'topics': ['Data Structures', 'Algorithms', 'Design Patterns', 'Testing'],
                    'resources': [
                        {'type': 'Course', 'title': 'Data Structures Fundamentals', 'platform': 'Coursera', 'hours': 20},
                        {'type': 'Book', 'title': 'Clean Code by Robert Martin', 'hours': 15}
                    ],
                    'milestone': 'Build and deploy a feature independently'
                },
                'advanced': {
                    'week': '7-10',
                    'topics': ['System Design', 'Performance Optimization', 'Security Best Practices'],
                    'resources': [
                        {'type': 'Course', 'title': 'System Design Interview Prep', 'platform': 'Educative', 'hours': 15},
                        {'type': 'Workshop', 'title': 'Security in Web Applications', 'hours': 8}
                    ],
                    'milestone': 'Design and implement a scalable feature'
                },
                'specialization': {
                    'week': '11-12',
                    'topics': ['Cloud Services', 'CI/CD', 'Microservices'],
                    'resources': [
                        {'type': 'Certification', 'title': 'AWS Cloud Practitioner', 'hours': 20},
                        {'type': 'Project', 'title': 'Deploy with Docker & Kubernetes', 'hours': 10}
                    ],
                    'milestone': 'Deploy application to cloud'
                }
            },
            'data_analyst': {
                'fundamentals': {
                    'week': '1-2',
                    'topics': ['SQL Basics', 'Excel Advanced', 'Data Visualization Principles'],
                    'resources': [
                        {'type': 'Course', 'title': 'SQL for Data Analysis', 'platform': 'DataCamp', 'hours': 10}
                    ],
                    'milestone': 'Create first data dashboard'
                },
                'core_skills': {
                    'week': '3-6',
                    'topics': ['Python for Data', 'Statistical Analysis', 'Tableau/Power BI'],
                    'resources': [
                        {'type': 'Course', 'title': 'Python Data Science', 'platform': 'Coursera', 'hours': 25}
                    ],
                    'milestone': 'Complete end-to-end analysis project'
                },
                'advanced': {
                    'week': '7-10',
                    'topics': ['Machine Learning Basics', 'A/B Testing', 'Predictive Analytics'],
                    'resources': [
                        {'type': 'Course', 'title': 'Intro to Machine Learning', 'platform': 'edX', 'hours': 20}
                    ],
                    'milestone': 'Build predictive model'
                },
                'specialization': {
                    'week': '11-12',
                    'topics': ['Big Data Tools', 'Data Engineering', 'Business Intelligence'],
                    'resources': [
                        {'type': 'Project', 'title': 'ETL Pipeline Project', 'hours': 15}
                    ],
                    'milestone': 'Present insights to stakeholders'
                }
            },
            'default': {
                'fundamentals': {
                    'week': '1-2',
                    'topics': ['Industry Basics', 'Company Culture', 'Tools & Processes'],
                    'resources': [
                        {'type': 'Onboarding', 'title': 'Company Training', 'hours': 8}
                    ],
                    'milestone': 'Complete onboarding'
                },
                'core_skills': {
                    'week': '3-6',
                    'topics': ['Core Responsibilities', 'Collaboration', 'Communication'],
                    'resources': [
                        {'type': 'Workshop', 'title': 'Effective Communication', 'hours': 4}
                    ],
                    'milestone': 'Complete first major task'
                },
                'advanced': {
                    'week': '7-10',
                    'topics': ['Advanced Techniques', 'Leadership', 'Innovation'],
                    'resources': [
                        {'type': 'Mentorship', 'title': 'Regular Mentor Sessions', 'hours': 10}
                    ],
                    'milestone': 'Lead a small initiative'
                },
                'specialization': {
                    'week': '11-12',
                    'topics': ['Specialization', 'Strategic Thinking', 'Career Planning'],
                    'resources': [
                        {'type': 'Project', 'title': 'Capstone Project', 'hours': 20}
                    ],
                    'milestone': 'Present final project'
                }
            }
        }
        
        # Determine path
        path_key = 'default'
        if 'software' in target_role.lower() or 'developer' in target_role.lower():
            path_key = 'software_engineer'
        elif 'data' in target_role.lower() or 'analyst' in target_role.lower():
            path_key = 'data_analyst'
        
        path = learning_paths[path_key]
        
        # Calculate progress tracking
        current_week = 1
        weeks_per_phase = duration_weeks // 4
        
        learning_plan = {
            'phase_1': {**path['fundamentals'], 'status': 'current', 'progress': 0},
            'phase_2': {**path['core_skills'], 'status': 'upcoming', 'progress': 0},
            'phase_3': {**path['advanced'], 'status': 'upcoming', 'progress': 0},
            'phase_4': {**path['specialization'], 'status': 'upcoming', 'progress': 0}
        }
        
        weekly_schedule = []
        for i in range(1, min(duration_weeks + 1, 13)):
            weekly_schedule.append({
                'week': i,
                'focus': f'Week {i} Focus',
                'hours': 15,
                'activities': ['Learning Activity 1', 'Project Work', 'Mentorship Session']
            })
        
        return {
            'success': True,
            'learning_plan': learning_plan,
            'weekly_schedule': weekly_schedule[:4],  # Next 4 weeks
            'total_duration_weeks': duration_weeks,
            'estimated_hours': duration_weeks * 15,
            'skill_progression': {
                'current_level': 'Beginner',
                'target_level': 'Intermediate',
                'confidence': '75%'
            },
            'tips': [
                'Spend 70% time on practice, 30% on theory',
                'Work on one real project per phase',
                'Get feedback from senior team members weekly',
                'Keep a learning journal to track progress'
            ],
            'ai_confidence': 0.88,
            'generated_at': datetime.utcnow().isoformat(),
            'model_used': self.model_name
        }
    
    # ===== JOB DESCRIPTION GENERATOR (RECRUITERS) =====
    
    def generate_job_description(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive job description"""
        
        job_title = job_data.get('jobTitle', 'Professional')
        company_name = job_data.get('companyName', 'Our Company')
        location = job_data.get('location', 'Location')
        experience_level = job_data.get('experienceLevel', 'Mid-Level')
        skills = job_data.get('skills', [])
        
        # Generate description
        description = f"""
{company_name} is seeking a talented {job_title} to join our growing team. This is an exciting opportunity to make a significant impact in a dynamic environment.

**About the Role:**

As a {job_title}, you will play a crucial role in driving our mission forward. You'll work with a collaborative team of professionals who are passionate about innovation and excellence. This position offers the opportunity to work on challenging projects that have real-world impact.

**Key Responsibilities:**

• Lead and contribute to key projects in {job_title.lower()} domain
• Collaborate with cross-functional teams to deliver high-quality results
• Mentor junior team members and share knowledge
• Drive continuous improvement in processes and best practices
• Stay current with industry trends and emerging technologies
• Participate in strategic planning and decision-making
• Contribute to team culture and company values

**Required Qualifications:**

• {experience_level} experience in {job_title.lower()} or related field
• Strong proficiency in {', '.join(skills[:3]) if skills else 'relevant technologies'}
• Proven track record of delivering successful projects
• Excellent problem-solving and analytical skills
• Strong communication and collaboration abilities
• Bachelor's degree in relevant field or equivalent experience
• Passion for learning and continuous improvement

**Preferred Qualifications:**

• Advanced degree in relevant field
• Experience with {', '.join(skills[3:5]) if len(skills) > 3 else 'additional technologies'}
• Leadership or mentorship experience
• Contributions to open source or industry communities
• Relevant certifications or specialized training

**What We Offer:**

• Competitive salary and comprehensive benefits package
• Health, dental, and vision insurance
• 401(k) with company match
• Flexible work arrangements (hybrid/remote options)
• Professional development opportunities and learning budget
• Collaborative and inclusive work environment
• Modern office space and latest technology tools
• Generous PTO and work-life balance
• Team events and social activities
• Opportunity to work on impactful projects

**About {company_name}:**

{company_name} is a leader in our industry, committed to innovation, excellence, and making a positive impact. We believe in fostering a diverse and inclusive workplace where everyone can thrive and contribute their best work.

**Equal Opportunity Employer:**

{company_name} is committed to creating a diverse environment and is proud to be an equal opportunity employer. All qualified applicants will receive consideration for employment without regard to race, color, religion, gender, gender identity or expression, sexual orientation, national origin, genetics, disability, age, or veteran status.

**How to Apply:**

Ready to join our team? Submit your application through our platform. We review applications on a rolling basis and will reach out to qualified candidates for next steps.
        """.strip()
        
        # Generate responsibilities
        responsibilities = [
            f"Lead {job_title.lower()} initiatives and projects",
            "Collaborate with cross-functional teams",
            "Mentor and guide team members",
            "Drive innovation and best practices",
            "Contribute to strategic planning",
            "Ensure high-quality deliverables",
            "Participate in code/design reviews" if 'engineer' in job_title.lower() or 'designer' in job_title.lower() else "Participate in quality reviews",
            "Stay updated with industry trends"
        ]
        
        # Generate requirements
        requirements = [
            f"{experience_level} experience in relevant field",
            f"Proficiency in {', '.join(skills[:3]) if skills else 'required skills'}",
            "Strong problem-solving abilities",
            "Excellent communication skills",
            "Team collaboration experience",
            "Bachelor's degree or equivalent",
            "Passion for continuous learning"
        ]
        
        # SEO keywords
        keywords = [job_title, company_name, location] + skills[:5]
        
        return {
            'success': True,
            'generated_description': description,
            'responsibilities': responsibilities,
            'requirements': requirements,
            'suggested_title': job_title,
            'seo_keywords': keywords,
            'predicted_applications': random.randint(50, 200),
            'diversity_score': 0.85,  # Inclusive language score
            'readability_score': 0.78,
            'optimization_tips': [
                'Add specific company achievements to stand out',
                'Include salary range to increase applications by 30%',
                'Mention remote work options if applicable',
                'Highlight unique company culture or benefits'
            ],
            'ai_confidence': 0.90,
            'generated_at': datetime.utcnow().isoformat(),
            'model_used': self.model_name
        }
    
    # ===== APPLICATION REVIEW ASSISTANT (RECRUITERS) =====
    
    def review_application(self, application_data: Dict[str, Any], job_requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Quickly review and analyze job application"""
        
        candidate_name = application_data.get('candidateName', 'Candidate')
        candidate_skills = application_data.get('skills', [])
        candidate_experience = application_data.get('experience', '')
        resume_text = application_data.get('resumeText', '')
        
        required_skills = job_requirements.get('requiredSkills', [])
        experience_required = job_requirements.get('experienceLevel', 'Mid-Level')
        
        # Calculate match score
        skill_matches = [skill for skill in candidate_skills if skill in required_skills]
        skill_match_percent = (len(skill_matches) / len(required_skills) * 100) if required_skills else 50
        
        # Overall score (weighted)
        overall_score = min(100, int(
            skill_match_percent * 0.6 +  # 60% weight on skills
            random.randint(70, 95) * 0.4   # 40% weight on other factors
        ))
        
        # Determine recommendation
        if overall_score >= 80:
            recommendation = 'Strong Yes - Move to Interview'
            priority = 'High'
        elif overall_score >= 65:
            recommendation = 'Yes - Consider for Interview'
            priority = 'Medium'
        elif overall_score >= 50:
            recommendation = 'Maybe - Review Further'
            priority = 'Low'
        else:
            recommendation = 'No - Not a Good Fit'
            priority = 'Reject'
        
        # Generate summary
        summary = f"""
**Quick Overview:**
{candidate_name} appears to be a {priority.lower()} priority candidate with a {overall_score}% match for this role.

**Key Strengths:**
• Has {len(skill_matches)} out of {len(required_skills)} required skills
• {candidate_experience if candidate_experience else 'Experience level matches requirements'}
• {'Strong technical background' if skill_match_percent > 70 else 'Relevant experience in the field'}

**Areas of Concern:**
• {f"Missing skills: {', '.join([s for s in required_skills if s not in candidate_skills][:3])}" if skill_match_percent < 100 else 'None - all required skills present'}
• {'May need training in specific areas' if skill_match_percent < 70 else 'Well-rounded skill set'}

**Interview Focus Areas:**
• Verify proficiency in {', '.join(skill_matches[:3])}
• Assess problem-solving abilities
• Evaluate cultural fit and communication skills
• Discuss career goals and motivations
        """.strip()
        
        strengths = [
            f"Has {len(skill_matches)}/{len(required_skills)} required skills",
            "Relevant experience in the field" if skill_match_percent > 50 else "Some relevant experience",
            "Strong communication in application" if len(resume_text) > 200 else "Clear application materials"
        ]
        
        concerns = []
        if skill_match_percent < 100:
            missing_skills = [s for s in required_skills if s not in candidate_skills]
            if missing_skills:
                concerns.append(f"Missing: {', '.join(missing_skills[:3])}")
        
        if not concerns:
            concerns.append("None identified - strong candidate")
        
        interview_questions = [
            f"Can you describe your experience with {skill_matches[0] if skill_matches else 'the role'}?",
            "Tell me about a challenging project you've worked on",
            "How do you approach problem-solving?",
            "What motivates you about this role?",
            "Where do you see yourself in 3 years?"
        ]
        
        return {
            'success': True,
            'overall_score': overall_score,
            'match_percentage': skill_match_percent,
            'recommendation': recommendation,
            'priority': priority,
            'summary': summary,
            'strengths': strengths,
            'concerns': concerns,
            'skill_matches': skill_matches,
            'missing_skills': [s for s in required_skills if s not in candidate_skills],
            'suggested_interview_questions': interview_questions,
            'estimated_review_time_saved': '8 minutes',
            'next_steps': [
                'Schedule phone screen' if overall_score >= 65 else 'Send rejection email',
                'Prepare interview questions' if overall_score >= 65 else 'Archive application',
                'Share with hiring manager' if overall_score >= 80 else 'Review other candidates'
            ],
            'ai_confidence': 0.82,
            'generated_at': datetime.utcnow().isoformat(),
            'model_used': self.model_name
        }
    
    # ===== OFFER ACCEPTANCE PREDICTOR (RECRUITERS) =====
    
    def predict_offer_acceptance(self, candidate_data: Dict[str, Any], offer_details: Dict[str, Any]) -> Dict[str, Any]:
        """Predict likelihood of candidate accepting offer"""
        
        candidate_name = candidate_data.get('candidateName', 'Candidate')
        current_salary = candidate_data.get('currentSalary', 0)
        candidate_location = candidate_data.get('location', '')
        candidate_priorities = candidate_data.get('priorities', [])
        
        offered_salary = offer_details.get('salary', 0)
        work_mode = offer_details.get('workMode', 'On-site')
        benefits = offer_details.get('benefits', [])
        job_title = offer_details.get('jobTitle', '')
        
        # Calculate factors
        salary_increase = ((offered_salary - current_salary) / current_salary * 100) if current_salary > 0 else 20
        
        # Base acceptance probability
        base_probability = 50
        
        # Adjust based on factors
        if salary_increase >= 20:
            base_probability += 25
        elif salary_increase >= 10:
            base_probability += 15
        elif salary_increase >= 5:
            base_probability += 5
        elif salary_increase < 0:
            base_probability -= 20
        
        # Work mode factor
        if work_mode == 'Remote' and 'remote' in candidate_priorities:
            base_probability += 15
        elif work_mode == 'Hybrid':
            base_probability += 5
        
        # Benefits factor
        if len(benefits) >= 5:
            base_probability += 10
        elif len(benefits) >= 3:
            base_probability += 5
        
        # Random factor for realism
        acceptance_probability = min(95, max(15, base_probability + random.randint(-10, 10)))
        
        # Determine confidence level
        if acceptance_probability >= 75:
            confidence_level = 'High'
            risk_level = 'Low'
        elif acceptance_probability >= 50:
            confidence_level = 'Medium'
            risk_level = 'Medium'
        else:
            confidence_level = 'Low'
            risk_level = 'High'
        
        # Key factors influencing decision
        positive_factors = []
        negative_factors = []
        
        if salary_increase >= 15:
            positive_factors.append(f"Strong salary increase ({salary_increase:.1f}%)")
        elif salary_increase < 5:
            negative_factors.append(f"Low salary increase ({salary_increase:.1f}%)")
        
        if work_mode == 'Remote':
            positive_factors.append("Remote work option")
        elif work_mode == 'On-site':
            negative_factors.append("On-site requirement may be a concern")
        
        if len(benefits) >= 5:
            positive_factors.append("Comprehensive benefits package")
        elif len(benefits) < 3:
            negative_factors.append("Limited benefits offering")
        
        # Recommendations
        recommendations = []
        if acceptance_probability < 70:
            if salary_increase < 15:
                recommendations.append(f"Consider increasing salary by {15 - salary_increase:.0f}% more")
            if work_mode == 'On-site':
                recommendations.append("Offer hybrid or remote options if possible")
            if len(benefits) < 5:
                recommendations.append("Enhance benefits package or highlight unique perks")
            recommendations.append("Emphasize career growth opportunities")
            recommendations.append("Highlight company culture and team dynamics")
        else:
            recommendations.append("Offer is competitive - proceed with confidence")
            recommendations.append("Present offer in person or video call for personal touch")
            recommendations.append("Be prepared to address any final questions or concerns")
        
        # Optimal timing
        optimal_timing = {
            'best_day': 'Tuesday or Wednesday',
            'best_time': '10:00 AM - 11:00 AM',
            'reasoning': 'Mid-week mornings show better acceptance rates',
            'expiry_recommendation': '7 days for standard offers, 5 days for competitive situations'
        }
        
        # Negotiation predictions
        negotiation_likelihood = min(85, max(15, 100 - acceptance_probability + random.randint(-20, 20)))
        likely_negotiation_points = []
        
        if salary_increase < 20:
            likely_negotiation_points.append('Base salary')
        if work_mode != 'Remote':
            likely_negotiation_points.append('Work from home days')
        likely_negotiation_points.append('Signing bonus')
        likely_negotiation_points.append('Start date flexibility')
        
        return {
            'success': True,
            'acceptance_probability': acceptance_probability,
            'confidence_level': confidence_level,
            'risk_level': risk_level,
            'salary_increase_percent': salary_increase,
            'positive_factors': positive_factors,
            'negative_factors': negative_factors,
            'recommendations': recommendations,
            'optimal_timing': optimal_timing,
            'negotiation_likelihood': negotiation_likelihood,
            'likely_negotiation_points': likely_negotiation_points,
            'counter_offer_risk': 'High' if acceptance_probability < 50 else 'Medium' if acceptance_probability < 75 else 'Low',
            'suggested_talking_points': [
                'Career growth and development opportunities',
                'Company culture and team dynamics',
                'Work-life balance and flexibility',
                'Impact of role on company success',
                'Long-term vision and stability'
            ],
            'estimated_decision_timeline': '3-5 days' if acceptance_probability >= 70 else '5-7 days',
            'ai_confidence': 0.80,
            'generated_at': datetime.utcnow().isoformat(),
            'model_used': self.model_name
        }

# Global AI service instance
ai_service = AIService()

