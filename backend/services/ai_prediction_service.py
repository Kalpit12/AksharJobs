import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd
import joblib
import os
from datetime import datetime, timedelta
import re
from collections import Counter

class ApplicationSuccessPredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.feature_columns = [
            'days_since_application',
            'job_title_match_score',
            'company_size_score',
            'experience_level_match',
            'skills_match_percentage',
            'application_time_score',
            'job_type_match',
            'location_match',
            'salary_expectation_match',
            'education_match'
        ]
        self.model_path = 'backend/models/application_success_model.pkl'
        self.encoders_path = 'backend/models/label_encoders.pkl'
        
    def extract_features_from_application(self, application_data, job_data, user_profile):
        """Extract features from application data for prediction"""
        features = {}
        
        # Days since application
        applied_date = application_data.get('appliedDate') or application_data.get('applied_at')
        if applied_date:
            try:
                app_date = datetime.fromisoformat(applied_date.replace('Z', '+00:00'))
            except:
                app_date = datetime.now()
        else:
            app_date = datetime.now()
        features['days_since_application'] = (datetime.now() - app_date).days
        
        # Job title match score (simple keyword matching)
        user_title = user_profile.get('currentTitle', user_profile.get('firstName', '') + ' ' + user_profile.get('lastName', '')).lower()
        job_title = job_data.get('title', job_data.get('job_title', '')).lower()
        features['job_title_match_score'] = self._calculate_text_similarity(user_title, job_title)
        
        # Company size score (based on company name patterns)
        company_name = job_data.get('company', job_data.get('company_name', '')).lower()
        features['company_size_score'] = self._estimate_company_size(company_name)
        
        # Experience level match
        user_experience = user_profile.get('experience', 2)  # Default to 2 years
        job_experience = self._extract_experience_requirement(job_data.get('description', ''))
        features['experience_level_match'] = min(user_experience / max(job_experience, 1), 2.0)
        
        # Skills match percentage
        user_skills = user_profile.get('skills', [])
        job_skills = self._extract_skills_from_description(job_data.get('description', ''))
        features['skills_match_percentage'] = self._calculate_skills_match(user_skills, job_skills)
        
        # Application time score (time of day/week when applied)
        app_hour = app_date.hour
        app_weekday = app_date.weekday()
        features['application_time_score'] = self._calculate_application_time_score(app_hour, app_weekday)
        
        # Job type match
        user_preference = user_profile.get('preferredJobType', 'full-time')
        job_type = job_data.get('type', job_data.get('job_type', 'full-time')).lower()
        features['job_type_match'] = 1.0 if user_preference.lower() == job_type else 0.5
        
        # Location match
        user_location = user_profile.get('location', '').lower()
        job_location = job_data.get('location', '').lower()
        features['location_match'] = self._calculate_location_match(user_location, job_location)
        
        # Salary expectation match (simplified)
        user_salary = user_profile.get('expectedSalary', 0)
        job_salary = self._extract_salary_from_description(job_data.get('description', ''))
        if job_salary > 0 and user_salary > 0:
            features['salary_expectation_match'] = min(user_salary / job_salary, 1.5) if job_salary > 0 else 0.8
        else:
            features['salary_expectation_match'] = 0.8
        
        # Education match
        user_education = user_profile.get('education', 'bachelor').lower()
        job_education = self._extract_education_requirement(job_data.get('description', ''))
        features['education_match'] = self._calculate_education_match(user_education, job_education)
        
        return features
    
    def _calculate_text_similarity(self, text1, text2):
        """Calculate simple text similarity based on common words"""
        words1 = set(text1.split())
        words2 = set(text2.split())
        if not words1 and not words2:
            return 0.0
        if not words1 or not words2:
            return 0.0
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return len(intersection) / len(union) if union else 0.0
    
    def _estimate_company_size(self, company_name):
        """Estimate company size based on name patterns"""
        large_company_indicators = ['corp', 'corporation', 'inc', 'ltd', 'company', 'enterprises', 'group', 'holdings']
        startup_indicators = ['startup', 'labs', 'studio', 'works', 'tech', 'solutions']
        
        company_lower = company_name.lower()
        
        if any(indicator in company_lower for indicator in large_company_indicators):
            return 0.8  # Large company
        elif any(indicator in company_lower for indicator in startup_indicators):
            return 0.3  # Startup
        else:
            return 0.5  # Medium company
    
    def _extract_experience_requirement(self, description):
        """Extract experience requirement from job description"""
        description_lower = description.lower()
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*of\s*experience',
            r'(\d+)\+?\s*years?\s*experience',
            r'minimum\s*(\d+)\s*years?',
            r'at\s*least\s*(\d+)\s*years?'
        ]
        
        for pattern in experience_patterns:
            match = re.search(pattern, description_lower)
            if match:
                return int(match.group(1))
        
        # Default experience based on keywords
        if 'senior' in description_lower or 'lead' in description_lower:
            return 5
        elif 'junior' in description_lower or 'entry' in description_lower:
            return 1
        else:
            return 3
    
    def _extract_skills_from_description(self, description):
        """Extract skills from job description"""
        # Common technical skills
        common_skills = [
            'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'mongodb',
            'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'typescript',
            'angular', 'vue', 'django', 'flask', 'spring', 'php', 'ruby',
            'machine learning', 'data science', 'analytics', 'tableau', 'power bi'
        ]
        
        description_lower = description.lower()
        found_skills = []
        
        for skill in common_skills:
            if skill in description_lower:
                found_skills.append(skill)
        
        return found_skills
    
    def _calculate_skills_match(self, user_skills, job_skills):
        """Calculate percentage of skills match"""
        if not job_skills:
            return 0.8  # Default if no skills specified
        
        user_skills_lower = [skill.lower() for skill in user_skills]
        job_skills_lower = [skill.lower() for skill in job_skills]
        
        matches = sum(1 for skill in job_skills_lower if skill in user_skills_lower)
        return matches / len(job_skills_lower) if job_skills_lower else 0.0
    
    def _calculate_application_time_score(self, hour, weekday):
        """Calculate score based on application timing"""
        # Best times: weekday mornings (9-11 AM) and afternoons (2-4 PM)
        if weekday < 5:  # Weekday
            if 9 <= hour <= 11 or 14 <= hour <= 16:
                return 1.0
            elif 8 <= hour <= 17:
                return 0.8
            else:
                return 0.6
        else:  # Weekend
            return 0.4
    
    def _calculate_location_match(self, user_location, job_location):
        """Calculate location match score"""
        if not user_location or not job_location:
            return 0.8  # Default if location not specified
        
        user_location_lower = user_location.lower()
        job_location_lower = job_location.lower()
        
        # Exact match
        if user_location_lower == job_location_lower:
            return 1.0
        
        # Remote work
        if 'remote' in job_location_lower:
            return 0.9
        
        # Partial match (city, state)
        user_parts = user_location_lower.split(',')
        job_parts = job_location_lower.split(',')
        
        if any(part.strip() in job_parts for part in user_parts):
            return 0.7
        
        return 0.3
    
    def _extract_salary_from_description(self, description):
        """Extract salary information from job description"""
        salary_patterns = [
            r'\$(\d{1,3}(?:,\d{3})*(?:k|K)?)',
            r'(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*dollars?',
            r'salary.*?(\d{1,3}(?:,\d{3})*(?:k|K)?)'
        ]
        
        description_lower = description.lower()
        
        for pattern in salary_patterns:
            match = re.search(pattern, description_lower)
            if match:
                salary_str = match.group(1)
                if 'k' in salary_str.lower():
                    return int(salary_str.replace('k', '').replace('K', '').replace(',', '')) * 1000
                else:
                    return int(salary_str.replace(',', ''))
        
        return 0
    
    def _extract_education_requirement(self, description):
        """Extract education requirement from job description"""
        description_lower = description.lower()
        
        if 'phd' in description_lower or 'doctorate' in description_lower:
            return 'phd'
        elif 'master' in description_lower or 'mba' in description_lower:
            return 'master'
        elif 'bachelor' in description_lower or 'degree' in description_lower:
            return 'bachelor'
        else:
            return 'none'
    
    def _calculate_education_match(self, user_education, job_education):
        """Calculate education match score"""
        education_levels = {'none': 0, 'high school': 1, 'bachelor': 2, 'master': 3, 'phd': 4}
        
        user_level = education_levels.get(user_education, 1)
        job_level = education_levels.get(job_education, 1)
        
        if user_level >= job_level:
            return 1.0
        else:
            return max(0.3, 1.0 - (job_level - user_level) * 0.2)
    
    def train_model(self, applications_data):
        """Train the prediction model with historical data"""
        if not applications_data:
            print("No training data available")
            return False
        
        # Prepare training data
        X = []
        y = []
        
        for app in applications_data:
            features = self.extract_features_from_application(
                app['application'], 
                app['job'], 
                app['user']
            )
            
            # Convert features to array
            feature_vector = [features.get(col, 0.0) for col in self.feature_columns]
            X.append(feature_vector)
            
            # Determine success (1 for interview/hired, 0 for rejected/no response)
            status = app['application'].get('status', '').lower()
            success = 1 if status in ['interview', 'hired', 'shortlisted'] else 0
            y.append(success)
        
        if len(X) < 10:  # Need minimum data for training
            print(f"Insufficient training data: {len(X)} samples")
            return False
        
        # Convert to numpy arrays
        X = np.array(X)
        y = np.array(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model trained with accuracy: {accuracy:.3f}")
        
        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        
        return True
    
    def load_model(self):
        """Load the trained model"""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            return True
        return False
    
    def predict_success_probability(self, application_data, job_data, user_profile):
        """Predict success probability for a new application"""
        if not self.model:
            if not self.load_model():
                # Return default prediction if no model available
                return self._get_default_prediction(application_data, job_data, user_profile)
        
        # Extract features
        features = self.extract_features_from_application(application_data, job_data, user_profile)
        feature_vector = [features.get(col, 0.0) for col in self.feature_columns]
        
        # Make prediction
        probability = self.model.predict_proba([feature_vector])[0][1]  # Probability of success
        return min(max(probability, 0.0), 1.0)  # Clamp between 0 and 1
    
    def _get_default_prediction(self, application_data, job_data, user_profile):
        """Get default prediction when no trained model is available"""
        features = self.extract_features_from_application(application_data, job_data, user_profile)
        
        # Simple heuristic-based prediction
        base_score = 0.5
        
        # Adjust based on key factors
        if features['skills_match_percentage'] > 0.7:
            base_score += 0.2
        if features['experience_level_match'] > 1.0:
            base_score += 0.1
        if features['job_title_match_score'] > 0.3:
            base_score += 0.1
        if features['company_size_score'] > 0.6:
            base_score += 0.05
        
        return min(max(base_score, 0.1), 0.9)
    
    def get_prediction_explanation(self, application_data, job_data, user_profile):
        """Get explanation for the prediction"""
        features = self.extract_features_from_application(application_data, job_data, user_profile)
        
        explanations = []
        
        if features['skills_match_percentage'] > 0.7:
            explanations.append(f"Strong skills match ({features['skills_match_percentage']:.0%})")
        elif features['skills_match_percentage'] < 0.3:
            explanations.append(f"Low skills match ({features['skills_match_percentage']:.0%})")
        
        if features['experience_level_match'] > 1.2:
            explanations.append("Overqualified for the role")
        elif features['experience_level_match'] < 0.8:
            explanations.append("May need more experience")
        
        if features['job_title_match_score'] > 0.4:
            explanations.append("Good job title alignment")
        
        if features['company_size_score'] > 0.7:
            explanations.append("Large company (higher competition)")
        elif features['company_size_score'] < 0.4:
            explanations.append("Startup environment")
        
        if features['days_since_application'] > 7:
            explanations.append("Applied over a week ago")
        
        return explanations

# Global instance
prediction_service = ApplicationSuccessPredictor()
