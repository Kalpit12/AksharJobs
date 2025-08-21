# AI-Based Resume and Job Description Matcher

## Project Overview
The AI-Based Resume and Job Description Matcher is an intelligent web-based platform that automates and enhances the recruitment process. It leverages Natural Language Processing (NLP) and AI models to semantically compare resumes and job descriptions, enabling recruiters to identify top candidates and job seekers to discover suitable opportunities.
This platform supports both job seekers and recruiters through dedicated dashboards, providing features like resume parsing, personalized recommendations, application tracking, visual analytics, and interview scheduling.

## Features
- 📂 **Resume Upload**: Upload resumes in PDF/DOCX format.
- 🔍 **Text Extraction**: Extract structured data using Gemini AI (skills, education, experience).
- 🧠 **Intelligent Matching**: Calculate match scores using Fine-Tuned SBERT model.
- 📊 **Analytics**: Visualizations like match distribution, application status, and candidate comparisons.
- 👥 **Role-Based Dashboards**: Separate UIs for job seekers and recruiters.
- 🗃️ **Database Storage**: Uses MongoDB with GridFS to store structured and raw resume data.
- 🌐 **REST APIs**: Flask-based modular APIs for all major operations.
- 📅 **Interview Scheduling**: Built-in feature for recruiters to schedule interviews.
- 🔒 **JWT Authentication**: Secure login and role-based route access.

## Tech Stack
- ⚙️ Backend
  - Python (Flask)
  - MongoDB Atlas + GridFS
  - Google Gemini API (LLM-based parsing)
  - PyMongo, pdfplumber, python-docx
  - SBERT (Fine-Tuned)
  - JWT, bcrypt (authentication & security)

- 💻 Frontend
  - React.js
  - Axios (API communication)
  - Chart.js / Recharts (data visualization)
  - Cloudinary (image storage and CDN)

## Model Performance
| Model	| R² Score	| MSE |
|-------|-----------|-----|
|Fine-tuned SBERT	|0.753	|0.0068|
|DistilBERT	|0.659	|0.0094|
|RoBERTa	|0.630	|0.0102|
|Random Forest	|0.621	|0.0104|
|TF-IDF	|-13.891	|0.4118|

**Fine-tuned SBERT** is the most accurate model used in this project.


## How It Works
1. Resume Upload → Extract text → Parse structured data via Gemini API.
2. Job Description Posting → Stored by recruiters with filters and metadata.
3. Matching Engine → Compute semantic similarity using fine-tuned SBERT and rule-based scores (skills, education, experience).
4. Analytics → Interactive dashboards help recruiters and job seekers make informed decisions.
5. Applications and Interview Flow → Track statuses, schedule interviews, and monitor performance.
