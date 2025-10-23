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
                {"_id": 1, "title": 1, "job_title": 1, "match_threshold": 1, "auto_reject_threshold": 1}
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
            applications = list(self.db.applications.find({"job_id": job_id}))
            
            if not applications:
                return {
                    "job_title": job.get("title", job.get("job_title")),
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
                "job_title": job.get("title", job.get("job_title")),
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
                {"_id": 1, "title": 1, "job_title": 1, "created_at": 1, "views": 1}
            ))

            matching_history = []
            for job in jobs:
                job_id = str(job["_id"])
                
                # Get applications for this job
                applications = list(self.db.applications.find({"job_id": job_id}))
                
                if applications:
                    total_applications = len(applications)
                    avg_match_score = sum(app.get("matchScore", 0) for app in applications) / total_applications
                    high_quality_candidates = len([app for app in applications if app.get("matchScore", 0) >= 80])
                    
                    matching_history.append({
                        "job_id": str(job["_id"]),  # Convert ObjectId to string
                        "job_title": job.get("job_title", job.get("title", "Unknown")),
                        "posted_date": job.get("created_at"),
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
        """Analyze competitor job postings - Returns None as real competitor data requires external API"""
        try:
            # Return None or empty structure since we don't have access to real competitor data
            # In production, this would integrate with external job APIs
            return {
                "your_job": {
                    "job_title": job_title,
                    "location": location,
                    "industry": industry
                },
                "competitor_analysis": [],
                "market_insights": {
                    "note": "Competitor analysis requires external API integration"
                }
            }
        except Exception as e:
            print(f"Error in competitor analysis: {e}")
            return None

    def get_candidate_recommendations(self, job_id, min_threshold=70):
        """Get candidate recommendations based on match score threshold"""
        try:
            applications = list(self.db.applications.find(
                {"job_id": job_id, "matchScore": {"$gte": min_threshold}},
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
                {"_id": 1, "title": 1, "job_title": 1, "match_threshold": 1, "auto_reject_threshold": 1, "created_at": 1, "views": 1}
            ))
            
            # Get recent applications by getting job IDs first, then applications
            job_ids = [str(job["_id"]) for job in jobs]
            recent_applications = []
            if job_ids:
                recent_applications = list(self.db.applications.find(
                    {"job_id": {"$in": job_ids}},
                    {"_id": 1, "job_id": 1, "matchScore": 1, "created_at": 1}
                ).sort("created_at", -1).limit(50))
            
            # Calculate summary stats
            total_jobs = len(jobs)
            total_applications = len(recent_applications)
            avg_match_score = sum(app.get("matchScore", 0) for app in recent_applications) / len(recent_applications) if recent_applications else 0
            
            # Get top performing jobs
            job_performance = {}
            for app in recent_applications:
                job_id = app.get("job_id")
                if job_id not in job_performance:
                    job_performance[job_id] = {"applications": 0, "total_score": 0}
                job_performance[job_id]["applications"] += 1
                job_performance[job_id]["total_score"] += app.get("matchScore", 0)
            
            top_jobs = []
            for job_id, stats in job_performance.items():
                job = next((j for j in jobs if str(j["_id"]) == job_id), None)
                if job:
                    top_jobs.append({
                        "job_title": job.get("job_title", job.get("title", "Unknown")),
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
        """Get comprehensive recruitment analytics for dashboard cards - REAL DATA ONLY"""
        try:
            print(f"🔍 Getting recruitment analytics for recruiter: {recruiter_id}")
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get all jobs by this recruiter
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id},
                {"_id": 1, "title": 1, "job_title": 1, "created_at": 1, "views": 1, "status": 1}
            ))
            print(f"📋 Found {len(jobs)} jobs for recruiter")
            
            job_ids = [str(job["_id"]) for job in jobs]
            print(f"📋 Job IDs: {job_ids}")
            
            # Get applications for these jobs - ONLY real recruiter data
            applications = []
            if job_ids:
                applications = list(self.db.applications.find(
                    {"job_id": {"$in": job_ids}},
                    {"_id": 1, "job_id": 1, "matchScore": 1, "created_at": 1, "status": 1, "applied_at": 1}
                ))
                print(f"👥 Found {len(applications)} applications for recruiter's jobs")
            
            # Calculate Application Trends
            total_applications_30 = len(applications)
            applications_by_day = {}
            for app in applications:
                # Try both created_at and applied_at fields
                app_date = app.get("applied_at") or app.get("created_at", datetime.utcnow())
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
                jobs_with_apps = [job for job in jobs if any(app.get("job_id") == str(job["_id"]) for app in applications)]
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
                    
                    avg_days_to_fill = sum(days_since_posting) / len(days_since_posting) if days_since_posting else 0
            
            # Calculate additional metrics
            avg_match_score = sum(app.get("matchScore", 0) for app in applications) / len(applications) if applications else 0
            
            # Get recent activity (last 7 days)
            recent_activity = 0
            for app in applications:
                app_date = app.get("applied_at") or app.get("created_at", datetime.utcnow())
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
                    "jobs_with_applications": len([job for job in jobs if any(app.get("job_id") == str(job["_id"]) for app in applications)])
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
            import traceback
            traceback.print_exc()
            return None

    def get_job_performance_metrics(self, job_id):
        """Get comprehensive performance metrics for a specific job"""
        try:
            job = self.jobs.find_one({"_id": ObjectId(job_id)})
            if not job:
                return None

            applications = list(self.db.applications.find({"job_id": job_id}))
            
            if not applications:
                return {
                    "job_title": job.get("title", job.get("job_title")),
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
                "job_title": job.get("title", job.get("job_title")),
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

    def get_detailed_recruiter_analytics(self, recruiter_id, days=30):
        """Get detailed analytics for recruiter including charts data - REAL DATA ONLY"""
        try:
            print(f"🔍 Getting detailed analytics for recruiter: {recruiter_id}")
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get all jobs by this recruiter
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id},
                {"_id": 1, "title": 1, "job_title": 1, "created_at": 1, "views": 1, "status": 1, "location": 1, "job_type": 1}
            ))
            print(f"📋 Found {len(jobs)} jobs for recruiter")
            
            job_ids = [str(job["_id"]) for job in jobs]
            
            # Get applications for these jobs - ONLY real recruiter data
            applications = []
            if job_ids:
                applications = list(self.db.applications.find(
                    {"job_id": {"$in": job_ids}},
                    {"_id": 1, "job_id": 1, "matchScore": 1, "created_at": 1, "status": 1, "applied_at": 1}
                ))
                print(f"👥 Found {len(applications)} applications for recruiter's jobs")
            
            # Applications over time (for charts)
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
                date_str = app_date_only.isoformat()
                applications_by_day[date_str] = applications_by_day.get(date_str, 0) + 1
            
            # Job performance metrics - ONLY real data
            job_performance = []
            for job in jobs:
                job_id = str(job["_id"])
                job_applications = [app for app in applications if app.get("job_id") == job_id]
                
                performance = {
                    "job_id": job_id,
                    "job_title": job.get("title", job.get("job_title", "Unknown")),
                    "views": job.get("views", 0),
                    "applications": len(job_applications),
                    "avg_match_score": sum(app.get("matchScore", 0) for app in job_applications) / len(job_applications) if job_applications else 0,
                    "conversion_rate": (len(job_applications) / job.get("views", 1)) * 100 if job.get("views", 0) > 0 else 0,
                    "location": job.get("location", "Not specified"),
                    "job_type": job.get("job_type", "Not specified")
                }
                job_performance.append(performance)
            
            # Sort by applications descending
            job_performance.sort(key=lambda x: x["applications"], reverse=True)
            
            # Status distribution
            status_distribution = {}
            for app in applications:
                status = app.get("status", "pending")
                status_distribution[status] = status_distribution.get(status, 0) + 1
            
            # Match score distribution
            score_ranges = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
            for app in applications:
                score = app.get("matchScore", 0)
                if score <= 20:
                    score_ranges["0-20"] += 1
                elif score <= 40:
                    score_ranges["21-40"] += 1
                elif score <= 60:
                    score_ranges["41-60"] += 1
                elif score <= 80:
                    score_ranges["61-80"] += 1
                else:
                    score_ranges["81-100"] += 1
            
            return {
                "overview": {
                    "total_jobs": len(jobs),
                    "total_applications": len(applications),
                    "total_views": sum(job.get("views", 0) for job in jobs),
                    "avg_match_score": sum(app.get("matchScore", 0) for app in applications) / len(applications) if applications else 0
                },
                "applications_over_time": applications_by_day,
                "job_performance": job_performance[:10],  # Top 10 performing jobs
                "status_distribution": status_distribution,
                "match_score_distribution": score_ranges,
                "top_performing_jobs": job_performance[:5],
                "recent_activity": {
                    "last_7_days": len([app for app in applications if self._is_recent(app.get("created_at"), 7)]),
                    "last_30_days": len(applications)
                }
            }
        except Exception as e:
            print(f"Error getting detailed recruiter analytics: {e}")
            import traceback
            traceback.print_exc()
            return None

    def get_all_jobs_performance(self, recruiter_id):
        """Get performance metrics for all jobs - REAL DATA ONLY"""
        try:
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id},
                {"_id": 1, "title": 1, "job_title": 1, "created_at": 1, "views": 1, "location": 1, "job_type": 1, "status": 1}
            ))
            
            job_ids = [str(job["_id"]) for job in jobs]
            applications = []
            if job_ids:
                applications = list(self.db.applications.find(
                    {"job_id": {"$in": job_ids}},
                    {"_id": 1, "job_id": 1, "matchScore": 1, "created_at": 1, "status": 1, "applied_at": 1}
                ))
            
            job_performance = []
            
            # Use ONLY real matching applications
            for job in jobs:
                job_id = str(job["_id"])
                job_applications = [app for app in applications if app.get("job_id") == job_id]
                
                # Calculate time metrics
                created_at = job.get("created_at", datetime.utcnow())
                if isinstance(created_at, str):
                    try:
                        created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    except:
                        created_at = datetime.utcnow()
                elif not isinstance(created_at, datetime):
                    created_at = datetime.utcnow()
                
                days_posted = (datetime.utcnow() - created_at).days
                
                performance = {
                    "job_id": job_id,
                    "job_title": job.get("title", job.get("job_title", "Unknown")),
                    "location": job.get("location", "Not specified"),
                    "job_type": job.get("job_type", "Not specified"),
                    "status": job.get("status", "active"),
                    "posted_date": created_at.isoformat(),
                    "days_posted": days_posted,
                    "views": job.get("views", 0),
                    "applications": len(job_applications),
                    "avg_match_score": sum(app.get("matchScore", 0) for app in job_applications) / len(job_applications) if job_applications else 0,
                    "conversion_rate": (len(job_applications) / job.get("views", 1)) * 100 if job.get("views", 0) > 0 else 0,
                    "high_quality_applications": len([app for app in job_applications if app.get("matchScore", 0) >= 80])
                }
                job_performance.append(performance)
            
            # Sort by performance metrics
            job_performance.sort(key=lambda x: (x["applications"], x["avg_match_score"]), reverse=True)
            
            return {
                "jobs": job_performance,
                "summary": {
                    "total_jobs": len(jobs),
                    "active_jobs": len([job for job in job_performance if job["status"] == "active"]),
                    "avg_applications_per_job": sum(job["applications"] for job in job_performance) / len(job_performance) if job_performance else 0,
                    "avg_views_per_job": sum(job["views"] for job in job_performance) / len(job_performance) if job_performance else 0
                }
            }
        except Exception as e:
            print(f"Error getting all jobs performance: {e}")
            return None

    def get_candidate_insights(self, recruiter_id):
        """Get candidate insights and demographics - REAL DATA ONLY"""
        try:
            # Get all jobs by this recruiter
            jobs = list(self.jobs.find(
                {"recruiter_id": recruiter_id},
                {"_id": 1}
            ))
            
            job_ids = [str(job["_id"]) for job in jobs]
            applications = []
            if job_ids:
                applications = list(self.db.applications.find(
                    {"job_id": {"$in": job_ids}},
                    {"_id": 1, "job_id": 1, "matchScore": 1, "created_at": 1, "status": 1, "resume_skills": 1}
                ))
            
            if not applications:
                return {
                    "total_candidates": 0,
                    "match_score_distribution": {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0},
                    "top_skills": [],
                    "candidate_quality_insights": {
                        "high_quality_count": 0,
                        "medium_quality_count": 0,
                        "low_quality_count": 0,
                        "high_quality_percentage": 0
                    },
                    "application_trends": {},
                    "avg_match_score": 0
                }
            
            # Match score distribution
            score_ranges = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
            for app in applications:
                score = app.get("matchScore", 0)
                if score <= 20:
                    score_ranges["0-20"] += 1
                elif score <= 40:
                    score_ranges["21-40"] += 1
                elif score <= 60:
                    score_ranges["41-60"] += 1
                elif score <= 80:
                    score_ranges["61-80"] += 1
                else:
                    score_ranges["81-100"] += 1
            
            # Top skills analysis
            all_skills = []
            for app in applications:
                skills = app.get("resume_skills", [])
                if isinstance(skills, str):
                    skills = skills.split(",")
                all_skills.extend([skill.strip() for skill in skills if skill.strip()])
            
            skill_counts = {}
            for skill in all_skills:
                skill_counts[skill] = skill_counts.get(skill, 0) + 1
            
            top_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:10]
            
            # Candidate quality insights
            high_quality = len([app for app in applications if app.get("matchScore", 0) >= 80])
            medium_quality = len([app for app in applications if 50 <= app.get("matchScore", 0) < 80])
            low_quality = len([app for app in applications if app.get("matchScore", 0) < 50])
            
            # Application trends (last 30 days)
            applications_by_week = {}
            for app in applications:
                app_date = app.get("created_at", datetime.utcnow())
                if isinstance(app_date, str):
                    try:
                        app_date = datetime.fromisoformat(app_date.replace('Z', '+00:00'))
                    except:
                        app_date = datetime.utcnow()
                elif not isinstance(app_date, datetime):
                    app_date = datetime.utcnow()
                
                # Get week number
                week = app_date.isocalendar()[1]
                year = app_date.year
                week_key = f"{year}-W{week}"
                applications_by_week[week_key] = applications_by_week.get(week_key, 0) + 1
            
            return {
                "total_candidates": len(applications),
                "match_score_distribution": score_ranges,
                "top_skills": [{"skill": skill, "count": count} for skill, count in top_skills],
                "candidate_quality_insights": {
                    "high_quality_count": high_quality,
                    "medium_quality_count": medium_quality,
                    "low_quality_count": low_quality,
                    "high_quality_percentage": (high_quality / len(applications)) * 100 if applications else 0
                },
                "application_trends": applications_by_week,
                "avg_match_score": sum(app.get("matchScore", 0) for app in applications) / len(applications) if applications else 0
            }
        except Exception as e:
            print(f"Error getting candidate insights: {e}")
            return None

    def _is_recent(self, date, days):
        """Helper method to check if a date is within recent days"""
        if isinstance(date, str):
            try:
                date = datetime.fromisoformat(date.replace('Z', '+00:00'))
            except:
                date = datetime.utcnow()
        elif not isinstance(date, datetime):
            date = datetime.utcnow()
        
        return date > datetime.utcnow() - timedelta(days=days)
