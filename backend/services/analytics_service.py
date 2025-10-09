from datetime import datetime, timedelta
from bson import ObjectId
from utils.db import get_db
from models.job_model import jobs_collection
from models.application_model import application_collection
import json

class AnalyticsService:
    def __init__(self):
        self.db = get_db()
        self.jobs = jobs_collection
        self.applications = application_collection

    def get_match_score_thresholds(self, recruiter_id):
        """Get current match score thresholds for a recruiter"""
        try:
            # Get jobs with their current thresholds
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id},
                {"_id": 1, "job_title": 1, "match_threshold": 1, "auto_reject_threshold": 1}
            ))
            # Convert ObjectIds to strings for JSON serialization
            for job in jobs:
                job["_id"] = str(job["_id"])
            return jobs
        except Exception as e:
            print(f"Error getting match thresholds: {e}")
            return []

    def set_match_score_thresholds(self, job_id, min_threshold, auto_reject_threshold):
        """Set match score thresholds for a specific job"""
        try:
            result = self.jobs.update_one(
                {"_id": ObjectId(job_id)},
                {
                    "$set": {
                        "match_threshold": min_threshold,
                        "auto_reject_threshold": auto_reject_threshold,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error setting match thresholds: {e}")
            return False

    def get_skills_gap_analysis(self, job_id):
        """Analyze skills gaps for all candidates of a specific job"""
        try:
            # Get job requirements
            job = self.jobs.find_one({"_id": ObjectId(job_id)})
            if not job:
                return None

            required_skills = job.get("required_skills", [])
            if isinstance(required_skills, str):
                required_skills = required_skills.split(",")
            required_skills = [skill.strip() for skill in required_skills if skill.strip()]

            # Get all applications for this job
            applications = list(self.applications.find({"jobId": job_id}))
            
            if not applications:
                return {
                    "job_title": job.get("job_title"),
                    "required_skills": required_skills,
                    "candidates_analysis": []
                }
            
            skills_analysis = []
            for app in applications:
                candidate_skills = app.get("resume_skills", [])
                if isinstance(candidate_skills, str):
                    candidate_skills = candidate_skills.split(",")
                
                candidate_skills = [skill.strip() for skill in candidate_skills if skill.strip()]
                
                # Calculate skills gap
                matched_skills = [skill for skill in required_skills if skill.lower() in [s.lower() for s in candidate_skills]]
                missing_skills = [skill for skill in required_skills if skill.lower() not in [s.lower() for s in candidate_skills]]
                
                skills_analysis.append({
                    "candidate_id": app.get("userId"),
                    "candidate_name": app.get("candidate_name", "Unknown"),
                    "match_score": app.get("matchScore", 0),
                    "matched_skills": matched_skills,
                    "missing_skills": missing_skills,
                    "skills_match_percentage": len(matched_skills) / len(required_skills) * 100 if required_skills else 0
                })

            return {
                "job_title": job.get("job_title"),
                "required_skills": required_skills,
                "candidates_analysis": skills_analysis
            }
        except Exception as e:
            print(f"Error in skills gap analysis: {e}")
            return None

    def get_matching_history(self, recruiter_id, days=30):
        """Get matching history and performance metrics for a recruiter"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get all jobs by this recruiter
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id, "created_at": {"$gte": start_date}},
                {"_id": 1, "job_title": 1, "created_at": 1, "views": 1}
            ))

            matching_history = []
            for job in jobs:
                job_id = str(job["_id"])
                
                # Get applications for this job
                applications = list(self.applications.find({"jobId": job_id}))
                
                if applications:
                    total_applications = len(applications)
                    avg_match_score = sum(app.get("matchScore", 0) for app in applications) / total_applications
                    high_quality_candidates = len([app for app in applications if app.get("matchScore", 0) >= 80])
                    
                    matching_history.append({
                        "job_id": str(job["_id"]),  # Convert ObjectId to string
                        "job_title": job["job_title"],
                        "posted_date": job["created_at"],
                        "total_applications": total_applications,
                        "average_match_score": round(avg_match_score, 2),
                        "high_quality_candidates": high_quality_candidates,
                        "views": job.get("views", 0),
                        "conversion_rate": (total_applications / job.get("views", 1)) * 100 if job.get("views", 0) > 0 else 0
                    })

            return matching_history
        except Exception as e:
            print(f"Error getting matching history: {e}")
            return []

    def get_competitor_analysis(self, job_title, location, industry):
        """Analyze competitor job postings (mock data for now)"""
        try:
            # This would typically integrate with external job APIs
            # For now, returning mock data structure
            competitor_jobs = [
                {
                    "company": "Competitor A",
                    "job_title": job_title,
                    "location": location,
                    "salary_range": "$80k - $120k",
                    "posted_date": datetime.utcnow() - timedelta(days=5),
                    "applicants": 45,
                    "match_quality": "High"
                },
                {
                    "company": "Competitor B",
                    "job_title": job_title,
                    "location": location,
                    "salary_range": "$75k - $110k",
                    "posted_date": datetime.utcnow() - timedelta(days=3),
                    "applicants": 32,
                    "match_quality": "Medium"
                }
            ]
            
            return {
                "your_job": {
                    "job_title": job_title,
                    "location": location,
                    "industry": industry
                },
                "competitor_analysis": competitor_jobs,
                "market_insights": {
                    "average_salary": "$85k - $115k",
                    "average_applicants": 38,
                    "market_demand": "High"
                }
            }
        except Exception as e:
            print(f"Error in competitor analysis: {e}")
            return None

    def get_candidate_recommendations(self, job_id, min_threshold=70):
        """Get candidate recommendations based on match score threshold"""
        try:
            applications = list(self.applications.find(
                {"jobId": job_id, "matchScore": {"$gte": min_threshold}},
                {"_id": 1, "userId": 1, "candidate_name": 1, "matchScore": 1, "resume_skills": 1}
            ).sort("matchScore", -1))
            
            return applications
        except Exception as e:
            print(f"Error getting candidate recommendations: {e}")
            return []

    def get_dashboard_summary(self, recruiter_id):
        """Get summary analytics for recruiter dashboard"""
        try:
            # Get basic job counts and thresholds
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id},
                {"_id": 1, "job_title": 1, "match_threshold": 1, "auto_reject_threshold": 1, "created_at": 1, "views": 1}
            ))
            
            # Get recent applications by getting job IDs first, then applications
            job_ids = [str(job["_id"]) for job in jobs]
            recent_applications = []
            if job_ids:
                recent_applications = list(self.applications.find(
                    {"jobId": {"$in": job_ids}},
                    {"_id": 1, "jobId": 1, "matchScore": 1, "created_at": 1}
                ).sort("created_at", -1).limit(50))
            
            # Calculate summary stats
            total_jobs = len(jobs)
            total_applications = len(recent_applications)
            avg_match_score = sum(app.get("matchScore", 0) for app in recent_applications) / len(recent_applications) if recent_applications else 0
            
            # Get top performing jobs
            job_performance = {}
            for app in recent_applications:
                job_id = app.get("jobId")
                if job_id not in job_performance:
                    job_performance[job_id] = {"applications": 0, "total_score": 0}
                job_performance[job_id]["applications"] += 1
                job_performance[job_id]["total_score"] += app.get("matchScore", 0)
            
            top_jobs = []
            for job_id, stats in job_performance.items():
                job = next((j for j in jobs if str(j["_id"]) == job_id), None)
                if job:
                    top_jobs.append({
                        "job_title": job["job_title"],
                        "applications": stats["applications"],
                        "avg_score": round(stats["total_score"] / stats["applications"], 2)
                    })
            
            top_jobs.sort(key=lambda x: x["avg_score"], reverse=True)
            
            return {
                "total_jobs": total_jobs,
                "total_applications": total_applications,
                "average_match_score": round(avg_match_score, 2),
                "top_performing_jobs": top_jobs[:5],
                "recent_activity": len([app for app in recent_applications if app.get("created_at", datetime.utcnow()) > datetime.utcnow() - timedelta(days=7)])
            }
        except Exception as e:
            print(f"Error getting dashboard summary: {e}")
            return None

    def get_recruitment_analytics(self, recruiter_id, days=30):
        """Get comprehensive recruitment analytics for dashboard cards"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get all jobs by this recruiter (remove date filter for now to include all jobs)
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id},
                {"_id": 1, "job_title": 1, "created_at": 1, "views": 1, "status": 1}
            ))
            
            job_ids = [str(job["_id"]) for job in jobs]
            
            # Get applications for these jobs
            applications = []
            if job_ids:
                applications = list(self.applications.find(
                    {"jobId": {"$in": job_ids}},
                    {"_id": 1, "jobId": 1, "matchScore": 1, "created_at": 1, "status": 1}
                ))
            
            # Calculate Application Trends
            total_applications_30 = len(applications)
            applications_by_day = {}
            for app in applications:
                app_date = app.get("created_at", datetime.utcnow())
                if isinstance(app_date, str):
                    try:
                        app_date = datetime.fromisoformat(app_date.replace('Z', '+00:00'))
                    except:
                        app_date = datetime.utcnow()
                elif not isinstance(app_date, datetime):
                    app_date = datetime.utcnow()
                
                app_date_only = app_date.date()
                # Convert date to string for JSON serialization
                date_str = app_date_only.isoformat()
                applications_by_day[date_str] = applications_by_day.get(date_str, 0) + 1
            
            # Calculate Job Performance
            total_views_30 = sum(job.get("views", 0) for job in jobs)
            conversion_rate = (total_applications_30 / total_views_30 * 100) if total_views_30 > 0 else 0
            
            # Calculate Candidate Quality
            high_quality_threshold = 80
            high_quality_candidates = len([app for app in applications if app.get("matchScore", 0) >= high_quality_threshold])
            high_quality_rate = (high_quality_candidates / total_applications_30 * 100) if total_applications_30 > 0 else 0
            
            # Calculate Time to Hire
            avg_days_to_fill = 0
            if jobs:
                # Calculate average days since posting for jobs with applications
                jobs_with_apps = [job for job in jobs if any(app.get("jobId") == str(job["_id"]) for app in applications)]
                if jobs_with_apps:
                    now = datetime.utcnow()
                    days_since_posting = []
                    for job in jobs_with_apps:
                        job_date = job.get("created_at")
                        if isinstance(job_date, str):
                            try:
                                job_date = datetime.fromisoformat(job_date.replace('Z', '+00:00'))
                            except:
                                job_date = now
                        elif not isinstance(job_date, datetime):
                            job_date = now
                        
                        days_since_posting.append((now - job_date).days)
                    
                    avg_days_to_fill = sum(days_since_posting) / len(days_since_posting)
            
            # Calculate additional metrics
            avg_match_score = sum(app.get("matchScore", 0) for app in applications) / len(applications) if applications else 0
            
            # Get recent activity (last 7 days)
            recent_activity = 0
            for app in applications:
                app_date = app.get("created_at", datetime.utcnow())
                if isinstance(app_date, str):
                    try:
                        app_date = datetime.fromisoformat(app_date.replace('Z', '+00:00'))
                    except:
                        app_date = datetime.utcnow()
                elif not isinstance(app_date, datetime):
                    app_date = datetime.utcnow()
                
                if app_date > datetime.utcnow() - timedelta(days=7):
                    recent_activity += 1
            
            return {
                "application_trends": {
                    "total_applications_30": total_applications_30,
                    "applications_by_day": applications_by_day,
                    "trend_direction": "up" if total_applications_30 > 0 else "stable"
                },
                "job_performance": {
                    "total_views_30": total_views_30,
                    "conversion_rate": round(conversion_rate, 1),
                    "total_jobs": len(jobs)
                },
                "candidate_quality": {
                    "high_quality_candidates": high_quality_candidates,
                    "high_quality_rate": round(high_quality_rate, 1),
                    "avg_match_score": round(avg_match_score, 1)
                },
                "time_to_hire": {
                    "avg_days_to_fill": round(avg_days_to_fill, 1),
                    "jobs_with_applications": len([job for job in jobs if any(app.get("jobId") == str(job["_id"]) for app in applications)])
                },
                "overview": {
                    "total_jobs": len(jobs),
                    "total_applications": total_applications_30,
                    "total_views": total_views_30,
                    "recent_activity": recent_activity
                }
            }
        except Exception as e:
            print(f"Error getting recruitment analytics: {e}")
            return None

    def get_job_performance_metrics(self, job_id):
        """Get comprehensive performance metrics for a specific job"""
        try:
            job = self.jobs.find_one({"_id": ObjectId(job_id)})
            if not job:
                return None

            applications = list(self.applications.find({"jobId": job_id}))
            
            if not applications:
                return {
                    "job_title": job.get("job_title"),
                    "total_applications": 0,
                    "average_match_score": 0,
                    "skills_distribution": {},
                    "experience_distribution": {},
                    "top_candidates": []
                }

            # Calculate metrics
            total_applications = len(applications)
            avg_match_score = sum(app.get("matchScore", 0) for app in applications) / total_applications
            
            # Skills distribution
            all_skills = []
            for app in applications:
                skills = app.get("resume_skills", [])
                if isinstance(skills, str):
                    skills = skills.split(",")
                all_skills.extend([skill.strip() for skill in skills])
            
            skills_distribution = {}
            for skill in all_skills:
                skills_distribution[skill] = skills_distribution.get(skill, 0) + 1

            # Top candidates
            top_candidates = sorted(applications, key=lambda x: x.get("matchScore", 0), reverse=True)[:5]

            return {
                "job_title": job.get("job_title"),
                "total_applications": total_applications,
                "average_match_score": round(avg_match_score, 2),
                "skills_distribution": skills_distribution,
                "top_candidates": top_candidates,
                "views": job.get("views", 0),
                "conversion_rate": (total_applications / job.get("views", 1)) * 100 if job.get("views", 0) > 0 else 0
            }
        except Exception as e:
            print(f"Error getting job performance metrics: {e}")
            return None
