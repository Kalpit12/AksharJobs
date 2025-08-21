import requests
from dotenv import load_dotenv
import logging
import os
load_dotenv()
import json  
import random
import re

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
  
resume_data="""
{"_id":{"$oid":"67beff7a5297cf9b80b0f48a"},"CandidateID":"VIDH1884","name":"Vidhi Patel","profile_summary":"I am a final year Computer Science Engineering student with strong problem-solving abilities and a passion for learning and upskilling. Equipped with excellent teamwork, active listening, and communication skills, I excel in delivering innovative solutions to real-world challenges. Eager to contribute to dynamic teams, leveraging my technical expertise and creativity to make a meaningful impact.","skills":["Python","Java","JavaScript","HTML/CSS","SQL","Node.js","React.js","C","Tkinter","Bootstrap","MongoDB","Express.js","Git","Data visualization","Data analysis"],"education":[{"degree":"BE in Computer Science","university":"Maharaja Sayajirao University, Baroda, Gujarat","status":"final year","aggregate":"72.5%"},{"degree":"HSC","year":"2021","score":"94%"},{"degree":"SSC","year":"2019","score":"93%"}],"experience":[{"Title":"Data science intern","Company":"TechElecon","Location":null,"Dates":""}],"projects":[{"name":"Sentiment Analysis on Twitter data","tools":"Python, ML algorithms","description":"Used python and its libraries - Pandas, Numpy, and Sklearn along with a machine learning algorithm - Logistic regression to classify the tweet as positive or negative."},{"name":"PG Dissertation Project","tools":"React.js, Node.js, Python, SQL","description":"Developed a robust Guide Dashboard featuring functionalities like accepting student requests, assigning tasks, and managing past/current students. Designed and implemented an Admin Module to add tools/instruments and manage departments. Created advanced Search Functionality for finding templates, guides, students, and tools."},{"name":"Personal Finance Manager","tools":"Python, Tkinter","description":"Engineered a desktop application for managing personal finances with an intuitive GUI. Enabled users to track expenses, generate insightful reports. Incorporated multiple features to facilitate secure and seamless expense tracking."}],"certificates":["Career Essentials for Data Analysis Certificate"]}
"""

jd_data="""
{
  "job_title": "Senior Data Scientist",
  "company": "Amazon",
  "location": "Seattle, WA",
  "required_skills": [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "TensorFlow",
    "PyTorch",
    "SQL",
    "Big Data",
    "Cloud Computing",
    "AWS"
  ],
  "responsibilities": [
    "Design and implement ML models for business intelligence.",
    "Analyze large datasets to extract actionable insights.",
    "Develop NLP models for customer sentiment analysis.",
    "Optimize deep learning models for high performance.",
    "Collaborate with cross-functional teams to improve AI solutions."
  ],
  "qualifications": [
    "Master's or PhD in Data Science, Computer Science, or related field.",
    "3+ years of experience in data science and machine learning.",
    "Strong proficiency in Python and deep learning frameworks.",
    "Experience with big data technologies and cloud platforms."
  ]
}
"""
def matched_score_from_gemini_free(resume_data,jd_data):
    """Use Gemini Free API to extract structured details from resume text and format as JSON."""

    # Improved prompt to instruct Gemini to return proper JSON
    prompt = f"""You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality. 
    Your task is to evaluate the resume against the provided job description. 
    Give me the percentage match for the resume matches the job description. 
    Resume data :{resume_data}, job description data: {jd_data}
    """

    prompt1 = f"""Given this job description {jd_data} and this resume {resume_data}, provide a match score (%), a list of matched skills with specific examples from the resume, and a list of key skills missing from the resume."""
    
    prompt2 = f"""You are a skilled ATS (Applicant Tracking System) scanner. Provide a detailed analysis of the match between the job description {jd_data} and the resume {resume_data}. Explain the reasoning behind the match score, and offer specific, actionable suggestions on how the candidate could improve their resume to better align with the job description. Give percentage match score on basis of this analysis"""
    
    response = call_gemini_free(prompt2)
    gemini_output = response
    print(gemini_output)
    

matched_score_from_gemini_free(resume_data,jd_data)

#First, output the match percentage,and how you calculated it,skills score, if education and experience is matched, then list missing keywords, and finally, provide final thoughts.
    