import os
from datetime import datetime

def parse_date(date_str):
    """Parse date string handling both short (%b) and full (%B) month formats."""
    for fmt in ("%b %Y", "%B %Y"):  # Try both short (Jan) and full (January) month formats
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None  # Return None if parsing fails

def calculate_experience(experience_list):
    if not experience_list:
        return 0

    current_date = datetime.now()
    total_months = 0  # Store total months across all experiences

    for exp in experience_list:
        if 'years' in exp and exp['years']:
            start_end = exp['years'].split(' - ')
            
            if len(start_end) == 2:
                start_date_str, end_date_str = start_end

                # Convert to proper date format
                start_date = parse_date(start_date_str)
                end_date = parse_date(end_date_str) if end_date_str.upper() != "PRESENT" else current_date
                
                if start_date and end_date:
                    # Calculate months for this experience
                    months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
                    total_months += months  # Sum up months
                else:
                    print(f"Skipping invalid date: {start_date_str} - {end_date_str}")
    #print(total_months)
    return total_months

def match_experience(total_exp_months, job_experience_required):
    # Convert total experience from months to years
    total_exp_years = total_exp_months / 12  

    # Extract required experience in years
    try:
        required_years = int(job_experience_required.split("+")[0].split()[0]) if job_experience_required else 0
    except (ValueError, IndexError):
        required_years = 0  # Default if parsing fails

    missing_years = max(0, required_years - total_exp_years)

    if total_exp_years >= required_years:
        return "Experience Criteria Met"
    elif total_exp_years > 0:
        return f"Experience Partially Matches (Missing {round(missing_years, 1)} years)"
    else:
        return "Experience Criteria Not Met (No relevant experience)"


def match_education(resume_education, job_education_required):
    missing_education = list(job_education_required)
    for degree in resume_education:
        for required_degree in job_education_required:
            if required_degree.lower() in degree["degree"].lower():
                missing_education.remove(required_degree)
                return "Education Criteria Met"
    return f"Education Criteria Not Met (Missing {', '.join(missing_education)})"

def match_skills(resume_skills, job_skills_required):
    job_skills_list = [skill.strip() for skill in job_skills_required.split(',')]
    matched = [skill for skill in job_skills_list if skill in resume_skills]
    missing = [skill for skill in job_skills_list if skill not in resume_skills]
    skills_match=(len(missing)/len(job_skills_list))*100
    return {
        "matched": matched,
        "missing": missing,
        "status": "Skills Criteria Met" if not missing else "Skills Criteria Partially Met",
        "skills_match":skills_match
    }

def match_certifications(resume_certifications, job_certifications_required):
    if not job_certifications_required:
        return "No Certifications Required"
    
    matched = [cert for cert in job_certifications_required if cert in resume_certifications]
    
    return "Certification Criteria Met" if matched else "Certification Criteria Not Met"

# Dummy data for testing
resume ={"_id":{"$oid":"67cebf2be0fcced35933490d"},
         "name":"John Doe",
         "profile_summary":"Experienced ML engineer and Data scientist",
         "skills":["Python","Machine Learning","Deep Learning","NLP","TensorFlow","PyTorch","SQL","Big Data","Cloud Computing","Flask","MongoDB"],
         "education":[{"degree":"Masters of Science in Data science","university":"University of California, Berkeley","years":"September 2021 - May 2023"},{"degree":"Bachelors of Technology in CS","university":"MIT","years":"JUNE 2018 - MAY 2021"}],
         "experience":[{"company":"Google","location":"Berkeley","title":"Data Scientist","years":"Jan 2023 - PRESENT","responsibilities":["Developed ML models for predicting user behavior","Implemented NLP techniques for text classification","Optimized recommendation systems using deep learning"]},{"company":"Facebook","location":"Texas","title":"Machine Learning Engineer","years":"June 2021 - Dec 2022","responsibilities":["Built end-to-end ML pipelines for production deployment","Implemented reinforcement learning models for ads optimization","Collaborated with data engineers to scale ML solutions"]}],
         "projects":[{"name":"Sentiment Analysis on Twitter Data","description":"Analysied the twitter tweets to have a positive or negative feedback using NLP."}],
         "certificates":["Tensorflow Developer Certificate","AWS Certified Machine Learning Speciality"],
         "jobRecommended":["Machine Learning Engineer","Data Scientist","NLP Engineer","Deep Learning Engineer","MLOps Engineer","AI Research Scientist"],
         "userId":"67ccac35d51d27d19ad8a701"}

job_posting = {"_id":{"$oid":"67cdb52deaefdda6dee82241"},
               "recruiter_id":"67ccb171e91d6ca7537640d4",
               "job_title":"Software Engineer",
               "company_name":"TechCorp Inc.",
               "company_website":"https://www.techcorp.com",
               "industry":"Information Technology",
               "location":"San Francisco, CA",
               "remote_option":"Hybrid",
               "job_type":"Full-time",
               "salary_range":"$80,000 - $120,000",
               "experience_required":"2+ years",
               "required_skills":"Python, JavaScript, React, Flask",
               "responsibilities":"Develop and maintain web applications, collaborate with the team.",
               "education_required":"Bachelor's degree in Computer Science or related field",
               "application_deadline":"2025-04-30",
               "description":"We are looking for a Software Engineer to join our team and help build high-quality applications.",
               "views":{"$numberInt":"0"},
               "applicants":[],
               "created_at":{"$date":{"$numberLong":"1741534509105"}}}

experience = calculate_experience(resume.get("experience", []))
education = match_education(resume.get("education", []), job_posting.get("education_required", []))
skills = match_skills(resume.get("skills", []), job_posting.get("required_skills", ""))
certifications = match_certifications(resume.get("certificates", []), job_posting.get("certifications_required", []))

response = {
    "missingSkills":skills.get("missing"),
    "matchSkills":skills.get("matched"),
    "experienceMatch": match_experience(experience, job_posting["experience_required"]),
    "educationMatch": education,
    "skillsMatch": skills.get("skills_match"),
    "certificationsMatch": certifications
}

print(response)
