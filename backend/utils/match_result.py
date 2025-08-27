import datetime
import re
from dateutil import parser
# Temporarily comment out scikit-learn imports to avoid dependency issues
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
from dateutil.relativedelta import relativedelta

# Simple TF-IDF implementation without scikit-learn
def simple_tfidf_similarity(text1, text2):
    """
    Simple text similarity using word overlap instead of TF-IDF
    """
    if not text1 or not text2:
        return 0.0
    
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    if not union:
        return 0.0
    
    return len(intersection) / len(union)

def cosine_similarity_simple(vec1, vec2):
    """
    Simple cosine similarity implementation
    """
    if not vec1 or not vec2:
        return 0.0
    
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = sum(a * a for a in vec1) ** 0.5
    norm2 = sum(b * b for b in vec2) ** 0.5
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return dot_product / (norm1 * norm2)

# Get current date
current_date = datetime.now().strftime('%b %Y')  


def extract_education_level(text):
    """
    Extracts the highest education level from a given text.

    Args:
        text (str): The input text containing educational qualifications.

    Returns:
        str: The extracted education level ('PhD', "Master's", "Bachelor's", 'School', or 'Unknown').
    """
    text = text.lower()  

    patterns = {
        "PhD": r"\b(ph\.?d|doctorate|doctoral)\b",
        "Master's": r"\b(m\.?sc|m\.?tech|m\.?engg|m\.?a|m\.?s|master['']?s|mba|mca|masters)\b",
        "Bachelor's": r"\b(b\.?sc|b\.?tech|b\.?engg|b\.?a|b\.?s|bachelor['']?s|be|bca|bachelors|bachelor)\b",
        "School": r"\b(high school|secondary school|diploma|hsc|ssc|12th|10th|cbse|icse)\b"
    }

    for level, pattern in patterns.items():
        if re.search(pattern, text):
            return level

    return "Unknown"

# Education hierarchy mapping
edu_hierarchy = {"High School": 1, "Bachelor's": 2, "Master's": 3, "PhD": 4}

def extract_month_year(date_str):
    """
    Extracts and standardizes the month and year from a given date string.

    Args:
        date_str (str): The input date string.

    Returns:
        str: A standardized date in the format 'Mon YYYY' (e.g., 'Dec 2023'), or 'Invalid Date' if parsing fails.
    """
    try:
        # Extract date using dateutil.parser
        date_obj = parser.parse(date_str, fuzzy=True)
        return date_obj.strftime('%b %Y')  
    except Exception:
        match = re.search(r'(?i)(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s*(\d{4})', date_str)
        if match:
            return f"{match}"
        return "Invalid Date"
    
def extract_experience_years(experiences):
    """
    Calculates the total work experience from a list of job experiences.

    Args:
        experiences (list): A list of dictionaries, each containing 'start_date' and 'end_date'.

    Returns:
        float: The total years of experience, including partial years.
    """
    total_experience = 0
    current_date = datetime.today().strftime("%b %Y")  

    for exp in experiences:
        try:
            start_year = exp.get("start_date", "")
            end_year = exp.get("end_date", "")
            duration = exp.get("duration", "")

            # If duration is provided, try to extract years from it
            if duration and duration != "null":
                # Look for patterns like "2 years", "6 months", "1 year 3 months"
                import re
                year_match = re.search(r'(\d+)\s*year', duration.lower())
                month_match = re.search(r'(\d+)\s*month', duration.lower())
                
                if year_match:
                    total_experience += int(year_match.group(1))
                if month_match:
                    total_experience += int(month_match.group(1)) / 12
                continue

            # If no duration, try to calculate from dates
            if not start_year or not end_year:  
                continue  

            start_year = extract_month_year(start_year)
            if end_year.lower() in ["ongoing", "present", "current", "null"]:
                end_year = current_date
            
            end_year = extract_month_year(end_year)

            if not start_year or not end_year:  
                continue  

            try:
                start_date = datetime.strptime(start_year, "%b %Y") 
                end_date = datetime.strptime(end_year, "%b %Y")
            
            except ValueError:
                start_date = datetime.strptime(start_year, "%B %Y")
                end_date = datetime.strptime(end_year, "%B %Y")

            diff = relativedelta(end_date, start_date)
            total_experience += diff.years + ((diff.months + 1) / 12)  

        except Exception as e:
            print(f"Skipping experience entry due to error: {e}")
            continue  
    
    print("Total exp", total_experience)
    return total_experience
            
    
def get_score( candidate_exp, job_exp, candidate_edu, job_edu, candidate_skills,job_skills):
    """
    Gets the  score based on experience, education, and skill matching.

    Args:
        candidate_exp (float): The candidate's total experience in years.
        job_exp (int): The required job experience in years.
        candidate_edu (str): The candidate's highest education level.
        job_edu (str): The required education level for the job.
        candidate_skills (set): The set of skills listed in the candidate's resume.
        job_skills (set): The set of skills required for the job.

    Returns:
        dict: A dictionary containing experience, education, and skill match scores, along with missing skills.
    """
    experience_penalty = min(1, candidate_exp / job_exp) if job_exp > 0 else 1
    
    # Education penalty
    def find_highest_education_level(edu_list):
        highest_level = "School"
        for entry in edu_list:
            degree = entry.get("degree", "")
            level = extract_education_level(degree)
            if edu_hierarchy.get(level, 0) > edu_hierarchy.get(highest_level, 0):
                highest_level = level
        return highest_level

    candidate_edu_level = edu_hierarchy.get(find_highest_education_level(candidate_edu), 1)
    job_edu_level = edu_hierarchy.get(extract_education_level(job_edu), 1)
    edu_penalty = min(1, candidate_edu_level / job_edu_level)

    skill_match = 0
    if job_skills and len(job_skills) > 0:
        skill_match = len(job_skills & candidate_skills) / len(job_skills)
    else:
        skill_match = 0  # No skills required, so no penalty
    
    print("Experience", experience_penalty)
    print("Education:", candidate_edu_level, job_edu_level, edu_penalty)
    print("Skill", skill_match)
    
    result={
        "experience_score":round(experience_penalty*100,2),
        "education_score":round(edu_penalty*100,2),
        "skill_score":round(skill_match*100,2),
        "missing_skills":list(job_skills-candidate_skills)
    }
    return result


def hybrid_score(sbert_score, resume_data, job_data):
    """
    Computes a final hybrid score for resume-job matching using SBERT, experience, education, and skill-based adjustments.

    Args:
        sbert_score (float): The initial SBERT similarity score.
        resume_data (dict): The parsed resume data containing education, experience, and skills.
        job_data (dict): The job posting data with required qualifications.

    Returns:
        dict: A dictionary containing experience, education, skill scores, and missing skills.
    """
    try:
        candidate_exp = extract_experience_years(resume_data.get("experience", []))
        print(f"Candidate experience: {candidate_exp}")
        
        # More robust job experience extraction
        job_exp_text = job_data.get("experience_required", "0")
        job_exp = 0
        if job_exp_text:
            # Try to extract numbers from various formats like "2 Years", "3-6 years", "5+ years"
            import re
            numbers = re.findall(r'\d+', job_exp_text)
            if numbers:
                # Take the first number found, or average if range like "3-6"
                if len(numbers) >= 2:
                    job_exp = (int(numbers[0]) + int(numbers[1])) // 2
                else:
                    job_exp = int(numbers[0])
        print(f"Job experience required: {job_exp}")
        
        candidate_edu = resume_data.get("education", [])
        job_edu = job_data.get("education_required", "High School")

        candidate_skills = set(resume_data.get("skills", []))
        job_skills_raw = job_data.get("required_skills", "")
        
        # Handle both string and list types for required_skills
        if isinstance(job_skills_raw, str):
            job_skills = {skill.strip().lower() for skill in job_skills_raw.split(",") if skill.strip()}
        elif isinstance(job_skills_raw, list):
            job_skills = {skill.strip().lower() for skill in job_skills_raw if skill.strip()}
        else:
            job_skills = set()
        
        candidate_skills = {skill.lower() for skill in candidate_skills if skill}
        
        print(f"Candidate skills: {candidate_skills}")
        print(f"Job skills: {job_skills}")
        print("Getting all scores and missing skills...")
        
        # Rule-based score adjustment
        result = get_score(candidate_exp, job_exp, candidate_edu, job_edu, candidate_skills, job_skills)
        print(f"Score result: {result}")
        
        return result
        
    except Exception as e:
        print(f"Error in hybrid_score: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return a default result to prevent crashes
        return {
            "experience_score": 0.0,
            "education_score": 0.0,
            "skill_score": 0.0,
            "missing_skills": []
        }

# Example usage
"""resume_data = {
    "certificates":[{"name":"Career Essentials for Data Analysis Certificate","issuer":"LinkedIn and Microsoft"}],
    "education":[{"degree":"BE in Computer Science","university":"Maharaja Sayajirao University, Baroda, Gujarat","year":"final year","grade":"72.5%"},{"degree":"HSC","university":"","year":"2021","grade":"94%"},{"degree":"SSC","university":"","year":"2019","grade":"93%"}],
    "experience":[{"title":"Data science intern","company":"TechElecon","start_date":"Dec 2024","end_date":"ongoing","description":"null","location":"null"}],
    "jobRecommended":["Data Scientist","Data Analyst","Machine Learning Engineer","Software Engineer","Front-End Developer","Back-End Developer","Full-Stack Developer","Web Developer"],
    "name":"Vidhi Patel",
    "profile_summary":"I am a final year Computer Science Engineering student with strong problem-solving abilities and a passion for learning and upskilling. Equipped with excellent teamwork, active listening, and communication skills, I excel in delivering innovative solutions to real-world challenges. Eager to contribute to dynamic teams, leveraging my technical expertise and creativity to make a meaningful impact.",
    "projects":[{"title":"Sentiment Analysis on Twitter data","tools":["Python","Pandas","Numpy","Sklearn","Logistic regression"],"description":"Used python and its libraries - Pandas, Numpy, and Sklearn along with a machine learning algorithm - Logistic regression to classify the tweet as positive or negative."},{"title":"PG Dissertation Project","tools":["React.js","Node.js","Python","SQL"],"description":"Developed a robust Guide Dashboard featuring functionalities like accepting student requests, assigning tasks, and managing past/current students. Designed and implemented an Admin Module to add tools/instruments and manage departments. Created advanced Search Functionality for finding templates, guides, students, and tools."},{"title":"Personal Finance Manager","tools":["Python","Tkinter"],"description":"Engineered a desktop application for managing personal finances with an intuitive GUI. Enabled users to track expenses, generate insightful reports. Incorporated multiple features to facilitate secure and seamless expense tracking."}],"skills":["Python","Java","JavaScript","HTML/CSS","SQL","Node.js","React.js","C","Tkinter","Bootstrap","MongoDB","Express.js","Git","Data visualization","Data analysis"]
               }

job_data = {"_id":{"$oid":"67cdb794eaefdda6dee82242"},"recruiter_id":"67beff7a5297cf9b80b0f48a","job_title":"Data scientist","company_name":"AI Solutions Ltd.","company_website":"https://www.aisolutions.com","industry":"Artificial Intelligence & Machine Learning","location":"New York, NY","remote_option":"Remote","job_type":"Full-time","salary_range":"$110,000 - $140,000 per year","experience_required":"3-6 years","required_skills":"Python, SQL, Machine Learning, TensorFlow, Data Visualization","responsibilities":"- Build and deploy machine learning models.\n- Analyze large datasets to extract insights.\n- Collaborate with data engineers and product teams.","education_required":"Master's in Data Science or related field","application_deadline":"2025-03-15","description":"AI Solutions Ltd. is hiring a Data Scientist to work on cutting-edge AI and ML models. You will be responsible for building, testing, and deploying machine learning algorithms while working with big data. We offer remote work, competitive pay, and a fast-paced, innovative environment.","views":{"$numberInt":"1"},"applicants":[],"created_at":{"$date":{"$numberLong":"1741535124230"}}}
sbert_score = 0.81  # Assume precomputed SBERT score
#Actual ans around 40
print(hybrid_score(sbert_score, resume_data, job_data))  # Returns adjusted score
"""