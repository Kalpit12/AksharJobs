from datetime import datetime
import json

def parse_date(date_str):
    """Parse date string handling both short (%b) and full (%B) month formats."""
    for fmt in ("%b %Y", "%B %Y"):  # Jan 2022 or January 2022
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None  

def calculate_experience(experience_list):
    """Calculate total months of experience from the resume experience section."""
    if not experience_list:
        return 0

    current_date = datetime.now()
    total_months = 0  

    for exp in experience_list:
        if 'years' in exp and exp['years']:
            start_end = exp['years'].split(' - ')
            
            if len(start_end) == 2:
                start_date_str, end_date_str = start_end

                start_date = parse_date(start_date_str)
                end_date = parse_date(end_date_str) if end_date_str.lower() not in ["present", "ongoing", "current"] else current_date
                
                if start_date and end_date:
                    months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
                    total_months += max(0, months)  # Ensure no negative values
                else:
                    print(f"Skipping invalid date: {start_date_str} - {end_date_str}")
    
    return total_months

def match_experience(total_exp_months, job_experience_required):
    """Compare resume experience with job requirements."""
    total_exp_years = total_exp_months / 12  

    try:
        required_years = int(job_experience_required.split("+")[0].split()[0]) if job_experience_required else 0
    except (ValueError, IndexError):
        required_years = 0  

    missing_years = max(0, required_years - total_exp_years)

    if total_exp_years >= required_years:
        return "Experience Criteria Met"
    elif total_exp_years > 0:
        return f"Experience Partially Matches (Missing {round(missing_years, 1)} years)"
    else:
        return "Experience Criteria Not Met (No relevant experience)"

def match_education(resume_education, job_education_required):
    """Check if the candidate's education matches job requirements."""
    missing_education = list(job_education_required)
    for degree in resume_education:
        for required_degree in job_education_required:
            if required_degree.lower() in degree["degree"].lower():
                missing_education.remove(required_degree)
                return "Education Criteria Met"
    return f"Education Criteria Not Met (Missing {', '.join(missing_education)})"

def match_skills(resume_skills, job_skills_required):
    """Check if candidate skills match job skills."""
    job_skills_list = [skill.strip() for skill in job_skills_required.split(',')]
    matched = [skill for skill in job_skills_list if skill in resume_skills]
    missing = [skill for skill in job_skills_list if skill not in resume_skills]
    skills_match = ((len(matched) / len(job_skills_list)) * 100) if job_skills_list else 0
    return {
        "matched": matched,
        "missing": missing,
        "status": "Skills Criteria Met" if not missing else "Skills Criteria Partially Met",
        "skills_match": round(skills_match, 2)
    }

def match_certifications(resume_certifications, job_certifications_required):
    """Check if required certifications are present in the resume."""
    if not job_certifications_required:
        return "No Certifications Required"
    
    matched = [cert for cert in job_certifications_required if cert in resume_certifications]
    return "Certification Criteria Met" if matched else "Certification Criteria Not Met"
def format_experience(exp):
    """Formats experience entries correctly based on available fields."""
    years = exp.get("years", "Unknown")
    title = exp.get("title", "Unknown Title")
    company = exp.get("company", "Unknown Company")
    responsibilities = ", ".join(exp.get("responsibilities", [])) if exp.get("responsibilities") else "Responsibilities not specified"
    
    return f"{title} at {company} ({years}). {responsibilities}"

def evaluate_application(resume_list, job_data):
    """Evaluate the resume against job requirements."""
    if not resume_list or not isinstance(resume_list, list):
        return {"error": "Invalid resume data"}

    resume = resume_list[0]  

    # Safely access resume fields with default values
    profile_summary = resume.get('profile_summary', 'No profile summary available')
    skills = resume.get('skills', [])
    education = resume.get('education', [])
    experience = resume.get('experience', [])
    projects = resume.get('projects', [])
    certificates = resume.get('certificates', [])

    resume_text = f"{profile_summary} {', '.join(skills) if skills else 'No skills specified'}. "\
              f"{' '.join([edu.get('degree', 'Unknown degree') for edu in education]) if education else 'No education specified'}. "\
              f"{' '.join([format_experience(exp) for exp in experience]) if experience else 'No experience specified'}. "\
              f"{' '.join([pro.get('title', 'Unknown project') + ': ' + pro.get('description', 'No description') for pro in projects]) if projects else 'No projects specified'}. "\
              f"{', '.join([cert.get('name', 'Unknown certificate') for cert in certificates]) if certificates else 'No certificates specified'}."

    job_text = f"{job_data.get('job_title', 'Unknown job')} "\
               f" Experience Required: {job_data.get('experience_required', 'Not specified')}. "\
               f"Education Required: {job_data.get('education_required', 'Not specified')}. Skills Required: {job_data.get('required_skills', 'Not specified')}. "\
               f"Job Description: {job_data.get('description', 'No description available')}. Responsibilities: {job_data.get('responsibilities', 'Not specified')}."

    
    return {
        "resume_text": resume_text, 
        "job_text": job_text,
      }

    
    

"""
resume_data = [{'name': 'John Doe', 'profile_summary': 'Experienced ML engineer and Data scientist', 'skills': ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch', 'SQL', 'Big Data', 'Cloud Computing', 'Flask', 'MongoDB'], 'education': [{'degree': 'Masters of Science in Data science', 'university': 'University of California, Berkeley', 'years': 'September 2021 - May 2023'}, {'degree': 'Bachelors of Technology in CS', 'university': 'MIT', 'years': 'JUNE 2018 - MAY 2021'}], 'experience': [{'company': 'Google', 'location': 'Berkeley', 'title': 'Data Scientist', 'years': 'Jan 2023 - PRESENT', 'responsibilities': ['Developed ML models for predicting user behavior', 'Implemented NLP techniques for text classification', 'Optimized recommendation systems using deep learning']}, {'company': 'Facebook', 'location': 'Texas', 'title': 'Machine Learning Engineer', 'years': 'June 2021 - Dec 2022', 'responsibilities': ['Built end-to-end ML pipelines for production deployment', 'Implemented reinforcement learning models for ads optimization', 'Collaborated with data engineers to scale ML solutions']}], 'projects': [{'name': 'Sentiment Analysis on Twitter Data', 'description': 'Analysied the twitter tweets to have a positive or negative feedback using NLP.'}], 'certificates': ['Tensorflow Developer Certificate', 'AWS Certified Machine Learning Speciality'], 'jobRecommended': ['Machine Learning Engineer', 'Data Scientist', 'NLP Engineer', 'Deep Learning Engineer', 'MLOps Engineer', 'AI Research Scientist'], 'userId': '67ccac35d51d27d19ad8a701'}]

# Sample Job Data
job_data ={'_id': '67cdb52deaefdda6dee82241', 'recruiter_id': '67ccb171e91d6ca7537640d4', 'job_title': 'Software Engineer', 'company_name': 'TechCorp Inc.', 'company_website': 'https://www.techcorp.com', 'industry': 'Information Technology', 'location': 'San Francisco, CA', 'remote_option': 'Hybrid', 'job_type': 'Full-time', 'salary_range': '$80,000 - $120,000', 'experience_required': '2+ years', 'required_skills': 'Python, JavaScript, React, Flask', 'responsibilities': 'Develop and maintain web applications, collaborate with the team.', 'education_required': "Bachelor's degree in Computer Science or related field", 'application_deadline': '2025-04-30', 'description': 'We are looking for a Software Engineer to join our team and help build high-quality applications.', 'views': 0, 'applicants': []}

# Running the function
result = evaluate_application(resume_data, job_data)

# Print the output
print(json.dumps(result, indent=4))
"""