import logging
from dotenv import load_dotenv
import requests
import os
import sys
import json
import re

# Load environment variables
load_dotenv('.edn.local')

# Configure logging
logging.basicConfig(level=logging.INFO)

# Gemini Free API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

def call_gemini_free(prompt):
    """
    Call Gemini Free API for text generation.
    """
    if not GEMINI_API_KEY:
        logging.error("GEMINI_API_KEY not found in environment variables")
        return None
        
    try:
        response = requests.post(
            GEMINI_API_URL,
            params={"key": GEMINI_API_KEY},
            json={
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.1,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 2048,
                }
            },
            timeout=60
        )
        response.raise_for_status()
        result = response.json()
        
        if "candidates" in result and len(result["candidates"]) > 0:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            logging.error(f"Unexpected Gemini response format: {result}")
            return None
            
    except Exception as e:
        logging.error(f"Gemini API call failed: {e}")
        return None

def summarize_text(text, max_length=500):
    """
    Trims a long text string to a specified maximum length.
    
    Args:
        text (str): The text to be summarized.
        max_length (int): The maximum allowed length of the text.
    
    Returns:
        str: Trimmed text with "..." if truncated.
    """
    return text[:max_length] + "..." if len(text) > max_length else text

def generate_match_report(resume_summary, job_summary, match_score):
    """
    Generates a structured hiring evaluation report using Gemini Free API.

    Args:
        resume_data (dict): Candidate's resume data.
        job_data (dict): Job description data.
        match_score (str): Calculated match score (e.g., "84%").

    Returns:
        dict: Structured match report.
    """


    prompt = f"""
    You are a hiring committee member evaluating a candidate for a job role. 
    Analyze the given resume summary {resume_summary}, job description summary {job_summary}, match score from SBERT {match_score}
    then provide a structured hiring report with insights for both the candidate and recruiter.
    
    Output Format (JSON)
    ```json
    {{
      "education_match": "<Match Percentage>",
      "skills_match": "<Match Percentage>",
      "skill_score_why":"<Why this skills_match>",
      "experience_match": "<Match Percentage>",
      "overall_match_score":"<How well the resume suits the job description in percentage>", (Don't give % sign for any percentage for above)

      "job_seeker_insights": {{
        "overall_feedback": "<How well the candidate fits>",
        "strengths": ["<Top skills & experiences that match the job>"],
        "gaps": ["<Missing skills, qualifications, or experience>"],
        "improvement_suggestions": ["<How to improve their chances>"]
      }},

      "recruiter_insights": {{
        "key_qualifications": ["<Major strengths relevant to the job>"],
        "concerns": ["<Potential red flags or missing requirements>"],
        "hiring_recommendation": "<Strongly Recommended (if overall score>80) / Recommended with Reservations / Not Recommended>"
      }}
    }}
    ```
    
    Generate only the JSON output.
    """

    try:
        logging.info("Sending request to Gemini Free API...")
        response = call_gemini_free(prompt)

        if not response:
            logging.error("Gemini Free API returned an empty response.")
            return None

        match_report = response
        # Parse and return the JSON response
        #match_report = json.loads(response)
        
        match_report = re.sub(r'```json\n?', '', match_report)
        match_report = re.sub(r'```', '', match_report).strip()
        logging.info(f"Cleaned Gemini Output:\n{match_report}")
        return match_report
    
    except Exception as e:
        logging.error(f"Error generating match report: {e}")
        return None



def get_gemini_free_result(resume_data,job_data,match_score):
    """
    Generates a Gemini Free API-based hiring match evaluation report.

    Args:
        resume_data (list): List of dictionaries containing candidate's resume data.
        job_data (dict): Dictionary containing job description data.
        match_score (int): SBERT-generated match score.

    Returns:
        dict: The hiring evaluation report.
    """
    resume_summary = {
        "profileSummary":resume_data[0].get("profile_summary",""),
        "education": [edu["degree"] for edu in resume_data[0].get("education", [])],
        "skills": resume_data[0].get("skills", []),
        "experience": resume_data[0].get("experience",[]),
        "certificates": resume_data[0].get("certificates", []),
        "projects":resume_data[0].get("projects",[])
    }
    job_summary = {
        "job_title": job_data.get("job_title", "Unknown"),
        "required_skills": job_data.get("required_skills", "").split(", ") if isinstance(job_data.get("required_skills", ""), str) else job_data.get("required_skills", []),
        "education_required": job_data.get("education_required", "Not specified"),
        "industry":job_data.get("industry","Not specified"),
        "experience_required":job_data.get("experience_required","Not given"),
        "description":job_data.get("description","Not given"),
        "responsibilities":job_data.get("responsibilities","Not specified")
    }
    print("Getting AI insights...")
    result=json.loads(generate_match_report(resume_summary,job_summary,match_score))
    
    return result
#resume_data =[{"_id":{"$oid":"67cebf2be0fcced35933490d"},"name":"John Doe","profile_summary":"Experienced ML engineer and Data scientist","skills":["Python","Machine Learning","Deep Learning","NLP","TensorFlow","PyTorch","SQL","Big Data","Cloud Computing","Flask","MongoDB"],"education":[{"degree":"Masters of Science in Data science","university":"University of California, Berkeley","years":"September 2021 - May 2023"},{"degree":"Bachelors of Technology in CS","university":"MIT","years":"JUNE 2018 - MAY 2021"}],"experience":[{"title":"Data Scientist","company":"Google","location":"Berkeley","years":"Jan 2023 - PRESENT","responsibilities":["Developed ML models for predicting user behavior","Implemented NLP techniques for text classification","Optimized recommendation systems using deep learning"]},{"title":"Machine Learning Engineer","company":"Facebook","location":"Texas","years":"June 2021 - Dec 2022","responsibilities":["Built end-to-end ML pipelines for production deployment","Implemented reinforcement learning models for ads optimization","Collaborated with data engineers to scale ML solutions"]}],"projects":[{"name":"Sentiment Analysis on Twitter Data","description":"Analysied the twitter tweets to have a positive or negative feedback using NLP."}],"certificates":["Tensorflow Developer Certificate","AWS Certified Machine Learning Speciality"],"jobRecommended":["Machine Learning Engineer","Data Scientist","Senior Data Scientist","Lead Machine Learning Engineer","MLOps Engineer","NLP Engineer","Research Scientist"],"userId":"67ccac35d51d27d19ad8a701"}]
#job_data ={"_id":{"$oid":"67cdb794eaefdda6dee82242"},"recruiter_id":"67beff7a5297cf9b80b0f48a","job_title":"Data scientist","company_name":"AI Solutions Ltd.","company_website":"https://www.aisolutions.com","industry":"Artificial Intelligence & Machine Learning","location":"New York, NY","remote_option":"Remote","job_type":"Full-time","salary_range":"$110,000 - $140,000 per year","experience_required":"3-6 years","required_skills":"Python, SQL, Machine Learning, TensorFlow, Data Visualization","responsibilities":"- Build and deploy machine learning models.\n- Analyze large datasets to extract insights.\n- Collaborate with data engineers and product teams.","education_required":"Master's in Data Science or related field","application_deadline":"2025-03-15","description":"AI Solutions Ltd. is hiring a Data Scientist to work on cutting-edge AI and ML models. You will be responsible for building, testing, and deploying machine learning algorithms while working with big data. We offer remote work, competitive pay, and a fast-paced, innovative environment.","views":{"$numberInt":"0"},"applicants":[],"created_at":{"$date":{"$numberLong":"1741535124230"}}}
#match_score=84
#res=get_gemini_result(resume_data,job_data,match_score)
#print(res)
#print(resume_summary)

#print(job_summary)

#result=generate_match_report(resume_summary,job_summary,match_score)
#print(result)