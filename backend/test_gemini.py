#!/usr/bin/env python3
"""
Test Script for Gemini Free API
This script tests if the Gemini Free API is working correctly.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_setup():
    """Test if Gemini Free API is properly configured."""
    print("🧪 Testing Gemini Free API Setup")
    print("=" * 40)
    
    # Check if API key exists
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        print("📝 Please add GEMINI_API_KEY to your .env file")
        return False
    
    print(f"✅ GEMINI_API_KEY found: {api_key[:10]}...")
    
    # Test the parse_resume function
    try:
        from utils.parse_resume import parse_resume_with_gemini_free
        
        # Test with sample resume text
        test_resume = """
        John Doe
        Software Engineer
        
        EXPERIENCE
        Google - Senior Software Engineer
        Jan 2023 - Present
        Developed scalable web applications using React and Node.js
        
        SKILLS
        Python, JavaScript, React, Node.js, MongoDB
        
        EDUCATION
        BS Computer Science - MIT
        2018-2022
        """
        
        print("\n📄 Testing resume parsing...")
        result = parse_resume_with_gemini_free(test_resume)
        
        if result:
            print("✅ Resume parsing successful!")
            print(f"📊 Parsed data keys: {list(result.keys())}")
            return True
        else:
            print("❌ Resume parsing failed")
            return False
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def main():
    """Main test function."""
    success = test_gemini_setup()
    
    if success:
        print("\n🎉 All tests passed! Gemini Free API is working correctly.")
        print("\n📝 Next steps:")
        print("1. Start your backend server")
        print("2. Test resume upload through the frontend")
        print("3. Check backend logs for Gemini API calls")
    else:
        print("\n❌ Tests failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
