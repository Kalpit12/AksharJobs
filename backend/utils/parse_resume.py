import requests
from dotenv import load_dotenv
import logging
import os
import json  
import random
import re
import sys

load_dotenv('.edn.local')

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
                    "temperature": 0.0,  # Set to 0 for completely deterministic results
                    "topK": 1,           # Use only the most likely token
                    "topP": 0.1,         # Reduce randomness further
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

def parse_resume_with_gemini_free(text):
    """
    Uses Gemini Free API to extract structured details from resume text and format them as JSON.

    Args:
        text (str): Raw resume text extracted from a file.

    Returns:
        dict: Parsed resume details in JSON format or None if extraction fails.
    """

    """Use Gemini Free API to extract structured details from resume text and format as JSON."""

    prompt = f"""Extract the following details from this text which is extracted from a resume:\n\n{text}\n\n
    And also give job roles recommended as per the resume.
    You must return a valid JSON object with the following structure:

    {{
      "name": "",
      "profile_summary": "",
      "skills": [],
      "education": [
        {{
      "degree": "",
      "university": "",
      "year": "",
      "grade": ""
    }}
      ],
      "experience": [
         {{
      "title": "",
      "company": "",
      "start_date": "In %b %Y format only",
      "end_date": "in %b %Y format or present, current, ongoing only",
      "description": "",
      "location": ""
    }}
        ],
      "projects": [
        {{
      "title": "",
      "tools": [],
      "description": ""
    }}
      ],
      "certificates": [
        {{
      "name": "",
      "issuer": ""
    }}
      ],
      "jobRecommended:[]
    }}
    Ensure the JSON is properly formatted. The format should be this only if anything is not there give empty "".
    """
    
    logging.info("Sending request to Gemini Free API...")
    response = call_gemini_free(prompt)

    if not response:
        logging.error("Gemini Free API returned an empty response.")
        return None

    gemini_output = response
    #logging.info(f"Raw Gemini Output:\n{gemini_output}")

    # Remove ```json```
    gemini_output = re.sub(r'```json\n?', '', gemini_output)
    gemini_output = re.sub(r'```', '', gemini_output).strip()
    logging.info(f"Cleaned Gemini Output:\n")

    try:
        structured_data = json.loads(gemini_output)
        # Generate CandidateID:
        return structured_data

    except json.JSONDecodeError as e:
        logging.error(f"Error decoding JSON: {e}")
        logging.error(f"Gemini Output (cleaned):\n{gemini_output}")
        logging.error(f"Gemini Output (raw):\n{response}")
        return None  

"""# Test Resume Text
resume_text = John Doe
Experienced ML engineer and Data scientist

California, Berkeley 12345
(123) 456-7890
john.doe@gmail.com
EXPERIENCE
Google, Berkeley — Data Scientist
Jan 2023 - PRESENT
Developed ML models for predicting user behavior
Implemented NLP techniques for text classification
Optimized recommendation systems using deep learning
Facebook, Texas — Machine Learning Engineer
June 2021 - Dec 2022
Built end-to-end ML pipelines for production deployment
Implemented reinforcement learning models for ads optimization
Collaborated with data engineers to scale ML solutions
EDUCATION
Masters of Science in Data science
University of California, Berkeley
September 2021 - May 2023
Bachelors of Technology in CS
MIT
JUNE 2018 - MAY 2021
PROJECTS
Sentiment Analysis on Twitter Data
Analysed the twitter tweets to have a positive or negative feedback using NLP.
SKILLS
Python
Machine Learning
Deep Learning
NLP
TensorFlow
PyTorch
SQL
Big Data
Cloud Computing
Flask
MongoDB
AWARDS
Tensorflow Developer Certificate
AWS Certified Machine Learning Speciality
LANGUAGES
English
Hindi
French
German

extracted_data = parse_resume_with_gemini_free(resume_text)
logging.info(f"Extracted Data:\n{extracted_data}")
"""