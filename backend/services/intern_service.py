"""
Intern Service
Handles business logic for intern management, profile updates,
and AI-powered internship recommendations
"""

from datetime import datetime
from bson import ObjectId
from utils.db import get_db

class InternService:
    def __init__(self):
        self.db = get_db()
        self.users_collection = self.db['users']
        self.internships_collection = self.db['internships']
        self.applications_collection = self.db['intern_applications']
        self.saved_internships_collection = self.db['saved_internships']
    
    def get_current_timestamp(self):
        """Return current UTC timestamp"""
        return datetime.utcnow()
    
    def save_intern_details(self, user_id, intern_data):
        """
        Save or update intern details in the database
        """
        try:
            # Update user document with intern details
            result = self.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {
                    'internDetails': intern_data,
                    'profileCompleted': True,
                    'updatedAt': self.get_current_timestamp()
                }}
            )
            
            if result.modified_count > 0 or result.matched_count > 0:
                return {'success': True}
            else:
                return {'success': False, 'error': 'User not found'}
                
        except Exception as e:
            print(f"Error saving intern details: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def get_intern_profile(self, user_id):
        """
        Retrieve intern profile data
        """
        try:
            user = self.users_collection.find_one(
                {'_id': ObjectId(user_id)},
                {'password': 0}  # Exclude password field
            )
            
            if user and 'internDetails' in user:
                # Merge user basic info with intern details
                profile = {
                    'userId': str(user['_id']),
                    'email': user.get('email'),
                    'firstName': user.get('firstName'),
                    'lastName': user.get('lastName'),
                    **user.get('internDetails', {})
                }
                return profile
            else:
                return None
                
        except Exception as e:
            print(f"Error fetching intern profile: {str(e)}")
            return None
    
    def generate_recommendations(self, user_id):
        """
        Generate AI-powered internship recommendations based on intern profile
        Uses matching algorithm to find best-fit internships
        """
        try:
            # Get intern profile
            intern_profile = self.get_intern_profile(user_id)
            
            if not intern_profile:
                return []
            
            # Get all available internships
            internships = list(self.internships_collection.find({'status': 'active'}))
            
            # If no internships in database, return sample recommendations
            if not internships:
                return self._generate_sample_recommendations(intern_profile)
            
            # Calculate match scores for each internship
            recommendations = []
            for internship in internships:
                match_score = self._calculate_match_score(intern_profile, internship)
                
                if match_score > 40:  # Only recommend internships with >40% match
                    internship_data = {
                        'id': str(internship['_id']),
                        'title': internship.get('title'),
                        'company': internship.get('company'),
                        'location': internship.get('location'),
                        'type': internship.get('type', 'Remote'),
                        'duration': internship.get('duration', '3-6 months'),
                        'stipend': internship.get('stipend', ''),
                        'domain': internship.get('domain', ''),
                        'requiredSkills': internship.get('requiredSkills', []),
                        'description': internship.get('description', ''),
                        'companyLogo': internship.get('companyLogo', ''),
                        'matchScore': match_score,
                        'postedDate': internship.get('createdAt', '')
                    }
                    recommendations.append(internship_data)
            
            # Sort by match score (highest first)
            recommendations.sort(key=lambda x: x['matchScore'], reverse=True)
            
            # Return top 20 recommendations
            return recommendations[:20]
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return self._generate_sample_recommendations(intern_profile)
    
    def _calculate_match_score(self, intern_profile, internship):
        """
        Calculate AI-powered match score between intern and internship
        Returns score from 0-100
        """
        score = 0
        
        # Skill matching (40 points max)
        intern_skills = set(intern_profile.get('technicalSkills', []))
        required_skills = set(internship.get('requiredSkills', []))
        
        if required_skills:
            matched_skills = intern_skills.intersection(required_skills)
            skill_match_percentage = len(matched_skills) / len(required_skills)
            score += skill_match_percentage * 40
        
        # Domain matching (20 points max)
        intern_domains = set(intern_profile.get('workDomains', []))
        internship_domain = internship.get('domain', '')
        
        if internship_domain in intern_domains:
            score += 20
        
        # Location matching (15 points max)
        intern_location = intern_profile.get('currentLocation', '').lower()
        internship_location = internship.get('location', '').lower()
        willing_to_relocate = intern_profile.get('willingToRelocate', 'No')
        
        if intern_location in internship_location or internship_location == 'remote':
            score += 15
        elif willing_to_relocate == 'Yes':
            score += 10
        
        # Internship type matching (15 points max)
        intern_types = set(intern_profile.get('internshipType', []))
        internship_type = internship.get('type', 'Remote')
        
        if internship_type in intern_types:
            score += 15
        
        # Education level matching (10 points max)
        intern_year = intern_profile.get('currentYear', '')
        required_year = internship.get('requiredYear', '')
        
        if not required_year or intern_year == required_year:
            score += 10
        
        return min(round(score), 100)
    
    def _generate_sample_recommendations(self, intern_profile):
        """
        Generate sample internship recommendations when no real data exists
        """
        sample_internships = [
            {
                'id': 'sample_1',
                'title': 'Frontend Developer Intern',
                'company': 'Tech Innovations Inc.',
                'location': 'Remote',
                'type': 'Remote',
                'duration': '3-6 months',
                'stipend': '$800/month',
                'domain': 'Web Development',
                'requiredSkills': ['React', 'JavaScript', 'HTML/CSS'],
                'description': 'Build modern web applications using React',
                'companyLogo': '',
                'matchScore': 85,
                'postedDate': datetime.utcnow()
            },
            {
                'id': 'sample_2',
                'title': 'Data Science Intern',
                'company': 'DataWorks Analytics',
                'location': 'New York, NY',
                'type': 'Hybrid',
                'duration': '4-6 months',
                'stipend': '$1200/month',
                'domain': 'Data Science',
                'requiredSkills': ['Python', 'Machine Learning', 'Data Analysis'],
                'description': 'Work on real-world data science projects',
                'companyLogo': '',
                'matchScore': 75,
                'postedDate': datetime.utcnow()
            },
            {
                'id': 'sample_3',
                'title': 'UI/UX Design Intern',
                'company': 'Creative Studio',
                'location': 'San Francisco, CA',
                'type': 'On-site',
                'duration': '3-4 months',
                'stipend': '$1000/month',
                'domain': 'UI/UX Design',
                'requiredSkills': ['Figma', 'Adobe XD', 'User Research'],
                'description': 'Design beautiful user experiences',
                'companyLogo': '',
                'matchScore': 70,
                'postedDate': datetime.utcnow()
            },
            {
                'id': 'sample_4',
                'title': 'Marketing Intern',
                'company': 'Growth Marketing Co.',
                'location': 'Remote',
                'type': 'Remote',
                'duration': '3-5 months',
                'stipend': '$600/month',
                'domain': 'Digital Marketing',
                'requiredSkills': ['Social Media', 'Content Writing', 'Analytics'],
                'description': 'Help grow our brand presence online',
                'companyLogo': '',
                'matchScore': 65,
                'postedDate': datetime.utcnow()
            },
            {
                'id': 'sample_5',
                'title': 'Backend Developer Intern',
                'company': 'Cloud Solutions Ltd.',
                'location': 'Austin, TX',
                'type': 'Hybrid',
                'duration': '5-6 months',
                'stipend': '$1500/month',
                'domain': 'Web Development',
                'requiredSkills': ['Node.js', 'MongoDB', 'API Development'],
                'description': 'Build scalable backend systems',
                'companyLogo': '',
                'matchScore': 80,
                'postedDate': datetime.utcnow()
            }
        ]
        
        return sample_internships
    
    def get_saved_internships(self, user_id):
        """
        Get list of internships saved by the intern
        """
        try:
            saved = list(self.saved_internships_collection.find({
                'userId': ObjectId(user_id)
            }))
            
            internship_ids = [s['internshipId'] for s in saved]
            internships = list(self.internships_collection.find({
                '_id': {'$in': [ObjectId(iid) for iid in internship_ids]}
            }))
            
            return internships
            
        except Exception as e:
            print(f"Error fetching saved internships: {str(e)}")
            return []
    
    def save_internship(self, user_id, internship_id):
        """
        Save an internship for the intern
        """
        try:
            # Check if already saved
            existing = self.saved_internships_collection.find_one({
                'userId': ObjectId(user_id),
                'internshipId': internship_id
            })
            
            if existing:
                # Remove from saved (toggle)
                self.saved_internships_collection.delete_one({'_id': existing['_id']})
                return {'success': True, 'action': 'removed'}
            else:
                # Add to saved
                self.saved_internships_collection.insert_one({
                    'userId': ObjectId(user_id),
                    'internshipId': internship_id,
                    'savedAt': self.get_current_timestamp()
                })
                return {'success': True, 'action': 'saved'}
                
        except Exception as e:
            print(f"Error saving internship: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def apply_to_internship(self, user_id, internship_id):
        """
        Submit an application to an internship
        """
        try:
            # Check if already applied
            existing = self.applications_collection.find_one({
                'userId': ObjectId(user_id),
                'internshipId': internship_id
            })
            
            if existing:
                return {'success': False, 'error': 'Already applied to this internship'}
            
            # Create application
            self.applications_collection.insert_one({
                'userId': ObjectId(user_id),
                'internshipId': internship_id,
                'status': 'pending',
                'appliedAt': self.get_current_timestamp()
            })
            
            return {'success': True}
            
        except Exception as e:
            print(f"Error applying to internship: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def get_intern_stats(self, user_id):
        """
        Get statistics for the intern (applications, saves, etc.)
        """
        try:
            # Count applications
            applications_count = self.applications_collection.count_documents({
                'userId': ObjectId(user_id)
            })
            
            # Count saved internships
            saved_count = self.saved_internships_collection.count_documents({
                'userId': ObjectId(user_id)
            })
            
            # Get profile completion percentage
            profile = self.get_intern_profile(user_id)
            profile_score = self._calculate_profile_score(profile) if profile else 0
            
            return {
                'applications': applications_count,
                'saved': saved_count,
                'profileScore': profile_score,
                'recommendations': 0  # Will be calculated dynamically
            }
            
        except Exception as e:
            print(f"Error fetching intern stats: {str(e)}")
            return {
                'applications': 0,
                'saved': 0,
                'profileScore': 0,
                'recommendations': 0
            }
    
    def _calculate_profile_score(self, profile):
        """
        Calculate profile completion score (0-100)
        """
        if not profile:
            return 0
        
        score = 0
        required_fields = [
            'fullName', 'email', 'mobile', 'currentLocation',
            'collegeName', 'degree', 'currentYear', 'graduationYear',
            'desiredRole', 'technicalSkills', 'softSkills'
        ]
        
        for field in required_fields:
            if profile.get(field):
                score += 100 / len(required_fields)
        
        return min(round(score), 100)

