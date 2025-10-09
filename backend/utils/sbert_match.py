# Simplified version without heavy ML libraries
# from sentence_transformers import SentenceTransformer
# import numpy as np
from dotenv import load_dotenv
import os
import re

load_dotenv()

# Simple text similarity implementation
def simple_text_similarity(text1, text2):
    """
    Enhanced text similarity using word overlap and basic NLP techniques
    """
    if not text1 or not text2:
        return 0.0
    
    # Convert to lowercase and split into words
    words1 = set(re.findall(r'\b\w+\b', text1.lower()))
    words2 = set(re.findall(r'\b\w+\b', text2.lower()))
    
    if not words1 or not words2:
        return 0.0
    
    # Calculate Jaccard similarity
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    if not union:
        return 0.0
    
    jaccard_similarity = len(intersection) / len(union)
    
    # Boost similarity for common job-related terms and skills
    job_keywords = ['experience', 'skills', 'education', 'degree', 'work', 'job', 'position', 'role', 'responsibilities', 'requirements', 'qualifications', 'candidate', 'applicant', 'professional', 'career', 'development', 'management', 'team', 'project', 'communication', 'leadership', 'technical', 'analytical', 'creative', 'problem', 'solving', 'collaboration', 'innovation', 'growth', 'learning', 'adaptability', 'flexibility', 'initiative', 'motivation', 'dedication', 'commitment', 'excellence', 'quality', 'results', 'performance', 'achievement', 'success', 'goals', 'objectives', 'strategy', 'planning', 'execution', 'delivery', 'implementation', 'optimization', 'improvement', 'efficiency', 'productivity', 'value', 'impact', 'contribution', 'benefit', 'advantage', 'opportunity', 'challenge', 'solution', 'approach', 'method', 'technique', 'process', 'procedure', 'system', 'tool', 'technology', 'software', 'platform', 'application', 'database', 'programming', 'coding', 'development', 'design', 'analysis', 'research', 'testing', 'debugging', 'maintenance', 'support', 'service', 'customer', 'client', 'user', 'stakeholder', 'partner', 'vendor', 'supplier', 'contractor', 'consultant', 'advisor', 'mentor', 'coach', 'trainer', 'instructor', 'teacher', 'professor', 'expert', 'specialist', 'professional', 'engineer', 'developer', 'designer', 'analyst', 'manager', 'director', 'executive', 'leader', 'supervisor', 'coordinator', 'administrator', 'assistant', 'associate', 'junior', 'senior', 'principal', 'chief', 'head', 'vice', 'president', 'ceo', 'cto', 'cfo', 'cmo', 'coo', 'cpo', 'cso', 'cio', 'cdo', 'cgo', 'cbo', 'cmo', 'cpo', 'cso', 'cio', 'cdo', 'cgo', 'cbo']
    
    # Count common job-related terms
    common_job_terms = intersection.intersection(set(job_keywords))
    job_term_boost = len(common_job_terms) * 0.1  # Boost by 0.1 for each common job term
    
    # Apply boost but cap at reasonable maximum
    boosted_similarity = min(jaccard_similarity + job_term_boost, 0.9)
    
    return boosted_similarity

def get_embedding(text):
    """
    Placeholder function that returns a simple text representation
    """
    if not text:
        return ""
    return text.lower()

def compute_similarity(text1, text2):
    """
    Compute similarity between two texts using simple NLP techniques.
    
    Args:
        text1 (str): First input text.
        text2 (str): Second input text.

    Returns:
        float: Similarity score between 0 and 1.
    """
    print("Getting simple similarity score...")
    try:
        # Use simple text similarity instead of SBERT
        similarity = simple_text_similarity(text1, text2)
        return similarity
    except Exception as e:
        print(f"❌ Error computing similarity: {e}")
        # Return a default similarity score if computation fails
        return 0.5  # Neutral similarity score

