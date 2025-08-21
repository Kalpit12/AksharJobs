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
    Simple text similarity using word overlap and basic NLP techniques
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
    
    return len(intersection) / len(union)

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

