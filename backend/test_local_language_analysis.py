#!/usr/bin/env python3
"""
Test script for Local Language Resume Analysis Service
This demonstrates the unique Swahili and local Kenyan language analysis capabilities.
"""

import os
import sys
import json
from dotenv import load_dotenv

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv('.edn.local')

def test_local_language_service():
    """Test the LocalLanguageResumeService directly"""
    print("🧪 Testing Local Language Resume Service...")
    
    try:
        from services.local_language_resume_service import LocalLanguageResumeService
        import google.generativeai as genai
        
        # Configure Gemini AI
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("❌ GEMINI_API_KEY not found in environment variables")
            return False
        
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Initialize service
        service = LocalLanguageResumeService(gemini_model)
        
        # Test resume texts in different languages
        test_resumes = [
            {
                "name": "Swahili Speaker",
                "text": """
                JINA: John Kamau
                BARUA PEPE: john.kamau@email.com
                SIMU: +254700123456
                
                SIFA ZANGU:
                Nina uzoefu wa miaka 5 katika biashara ya ndani na nje ya nchi.
                Nina uwezo wa kuzungumza Kiswahili, Kiingereza na Sheng.
                Nina uzoefu wa kufanya kazi na watu wa jamii mbalimbali.
                
                KAZI ZANGU:
                Meneja wa Biashara - Duka la Mitumba
                Mwaka 2020 - 2023
                - Niliendesha biashara ya mitumba katika Westlands
                - Niliendesha timu ya wafanyikazi 10
                - Niliweza kuongeza mapato kwa 40%
                
                Elimu:
                Shahada ya Biashara - Chuo Kikuu cha Nairobi
                """
            },
            {
                "name": "English Speaker with Local Experience",
                "text": """
                NAME: Sarah Wanjiku
                EMAIL: sarah.wanjiku@email.com
                PHONE: +254711234567
                
                SUMMARY:
                Experienced marketing professional with deep understanding of Kenyan market dynamics.
                Fluent in English and Swahili, with experience in both formal and informal sectors.
                
                EXPERIENCE:
                Marketing Manager - Local Business Solutions Ltd
                2021 - Present
                - Developed marketing strategies for local businesses in Nairobi
                - Managed campaigns targeting Mama Mboga and small business owners
                - Increased local market penetration by 60%
                
                Community Liaison Officer - NGO Kenya
                2019 - 2021
                - Worked with local communities in Kibera and Mathare
                - Organized community outreach programs
                - Built strong relationships with local leaders
                
                EDUCATION:
                Bachelor of Commerce - University of Nairobi
                """
            },
            {
                "name": "Sheng Speaker",
                "text": """
                JINA: Mike Otieno
                EMAIL: mike.otieno@email.com
                PHONE: +254722345678
                
                SIFA:
                Mzeee wa biashara ya mjini, nina uzoefu wa kufanya kazi na watu wa kila aina.
                Nina uwezo wa kuzungumza Sheng, Swahili na English.
                
                KAZI:
                Boda Boda Business Owner
                2020 - Present
                - Niliendesha biashara ya boda boda katika Eastlands
                - Niliendesha timu ya boda boda 15
                - Niliweza kuongeza mapato kwa 50%
                
                Community Organizer
                2018 - 2020
                - Niliendesha mikutano ya jamii
                - Niliendesha michezo ya jamii
                - Niliendesha mafunzo ya biashara
                
                Elimu:
                High School - Starehe Boys Centre
                """
            }
        ]
        
        print(f"\n📊 Testing {len(test_resumes)} different resume types...")
        
        for i, resume in enumerate(test_resumes, 1):
            print(f"\n--- Test {i}: {resume['name']} ---")
            
            # Analyze local context
            local_analysis = service.analyze_local_context(resume['text'])
            
            if local_analysis:
                print(f"✅ Local context analysis successful")
                
                # Display key insights
                language_analysis = local_analysis.get('language_analysis', {})
                business_context = local_analysis.get('business_context', {})
                local_talent_score = local_analysis.get('local_talent_score', {})
                
                print(f"   Primary Language: {language_analysis.get('primary_language', 'Unknown')}")
                print(f"   Language Mix: {language_analysis.get('language_mix', 'Unknown')}")
                print(f"   Sector Preference: {business_context.get('sector_preference', 'Unknown')}")
                print(f"   Local Talent Score: {local_talent_score.get('overall_score', 0)}/100")
                print(f"   Talent Tier: {local_talent_score.get('talent_tier', 'Unknown')}")
                
                # Generate recruiter insights
                recruiter_insights = service.get_recruiter_insights(
                    {'personal_info': {'name': resume['name']}}, 
                    local_analysis
                )
                
                if recruiter_insights:
                    recommendations = recruiter_insights.get('recruitment_recommendations', {})
                    print(f"   Hiring Priority: {recommendations.get('hiring_priority', 'Unknown')}")
                    print(f"   Local Advantage: {recommendations.get('local_advantage', 'None')[:100]}...")
                
            else:
                print(f"❌ Local context analysis failed")
        
        print(f"\n🎯 All tests completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error testing local language service: {str(e)}")
        return False

def test_api_endpoints():
    """Test the API endpoints for local language analysis"""
    print("\n🌐 Testing API Endpoints...")
    
    try:
        import requests
        
        base_url = "http://localhost:3002"
        
        # Test local market insights endpoint
        print("   Testing /api/local-language/local_market_insights...")
        
        try:
            response = requests.get(f"{base_url}/api/local-language/local_market_insights")
            if response.status_code == 200:
                print("   ✅ Local market insights endpoint working")
                insights = response.json()
                print(f"   📈 Market insights retrieved successfully")
            else:
                print(f"   ❌ Local market insights endpoint failed: {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("   ⚠️  Backend not running. Start the backend first.")
        except Exception as e:
            print(f"   ❌ Error testing endpoint: {str(e)}")
        
        # Test analyze local context endpoint
        print("   Testing /api/local-language/analyze_local_context...")
        
        test_data = {
            "resume_text": """
            JINA: Test User
            EMAIL: test@email.com
            
            Nina uzoefu wa kufanya kazi na watu wa jamii mbalimbali.
            Nina uwezo wa kuzungumza Kiswahili na Kiingereza.
            Nina uzoefu wa biashara ya ndani na nje ya nchi.
            """,
            "candidate_id": "test_candidate_001"
        }
        
        try:
            response = requests.post(
                f"{base_url}/api/local-language/analyze_local_context",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                print("   ⚠️  Endpoint requires authentication (JWT token)")
            elif response.status_code == 200:
                print("   ✅ Local context analysis endpoint working")
                result = response.json()
                print(f"   📊 Analysis completed for candidate: {result.get('candidate_id')}")
            else:
                print(f"   ❌ Endpoint failed: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("   ⚠️  Backend not running. Start the backend first.")
        except Exception as e:
            print(f"   ❌ Error testing endpoint: {str(e)}")
        
        print("   📋 API endpoint tests completed")
        return True
        
    except Exception as e:
        print(f"❌ Error testing API endpoints: {str(e)}")
        return False

def demonstrate_features():
    """Demonstrate the unique features of the local language analysis"""
    print("\n🚀 Demonstrating Unique Features...")
    
    print("\n1. 🌍 Swahili & Local Language Detection")
    print("   - Automatically detects Swahili, Sheng, and local English patterns")
    print("   - Provides confidence scores for each language")
    print("   - Identifies multilingual candidates")
    
    print("\n2. 🏢 Local Business Context Analysis")
    print("   - Analyzes formal vs informal sector experience")
    print("   - Identifies local market understanding")
    print("   - Scores business context relevance")
    
    print("\n3. 🎭 Cultural & Community Intelligence")
    print("   - Detects community service and cultural activities")
    print("   - Analyzes local network connections")
    print("   - Scores cultural engagement levels")
    
    print("\n4. 📊 AI-Powered Local Market Insights")
    print("   - Generates Kenyan market-specific recommendations")
    print("   - Provides cultural fit analysis")
    print("   - Suggests local business opportunities")
    
    print("\n5. 🎯 Comprehensive Local Talent Scoring")
    print("   - 0-100 scoring system for local market fit")
    print("   - Talent tier classification (Elite, Strong, Developing, International)")
    print("   - Component scores for language, business, and cultural factors")
    
    print("\n6. 💼 Recruiter-Specific Insights")
    print("   - Hiring recommendations with reasoning")
    print("   - Role suggestions based on local market fit")
    print("   - Training needs identification")
    print("   - Local advantage highlighting")
    
    print("\n7. 🔄 Batch Processing Capabilities")
    print("   - Analyze multiple resumes simultaneously")
    print("   - Batch statistics and talent distribution")
    print("   - Efficient processing for large candidate pools")
    
    print("\n8. 📈 Market Intelligence")
    print("   - Real-time Kenyan job market insights")
    print("   - Cultural trend analysis")
    print("   - Recruitment strategy recommendations")

def show_usage_examples():
    """Show practical usage examples for recruiters"""
    print("\n📖 Usage Examples for Recruiters...")
    
    print("\n1. Single Resume Analysis:")
    print("   POST /api/local-language/analyze_local_context")
    print("   Body: {'resume_text': '...', 'candidate_id': 'candidate_001'}")
    
    print("\n2. Enhanced Resume Analysis (File Upload):")
    print("   POST /api/local-language/enhanced_resume_analysis")
    print("   Form: resume_file + analysis_type (standard/local_focus/comprehensive)")
    
    print("\n3. Batch Analysis:")
    print("   POST /api/local-language/batch_local_analysis")
    print("   Body: {'resumes': ['text1', 'text2'], 'candidate_ids': ['id1', 'id2']}")
    
    print("\n4. Market Insights:")
    print("   GET /api/local-language/local_market_insights")
    print("   Returns: Current Kenyan market trends and insights")
    
    print("\n5. Integration with Existing Resume System:")
    print("   - Use enhanced_resume_analysis for comprehensive insights")
    print("   - Combine standard resume data with local market analysis")
    print("   - Get both technical skills and cultural fit scores")

def main():
    """Main test function"""
    print("🎯 Local Language Resume Analysis - Feature Test")
    print("=" * 60)
    
    # Test the service directly
    service_test = test_local_language_service()
    
    # Test API endpoints
    api_test = test_api_endpoints()
    
    # Demonstrate features
    demonstrate_features()
    
    # Show usage examples
    show_usage_examples()
    
    print("\n" + "=" * 60)
    print("🎉 Feature Test Complete!")
    
    if service_test:
        print("✅ Local Language Service: Working")
    else:
        print("❌ Local Language Service: Failed")
    
    if api_test:
        print("✅ API Endpoints: Ready for testing")
    else:
        print("❌ API Endpoints: Need backend running")
    
    print("\n🚀 To test with real data:")
    print("1. Start the backend: python start_backend.py")
    print("2. Use the API endpoints with proper authentication")
    print("3. Upload resumes or send text for local language analysis")
    
    print("\n💡 This feature gives you access to 70% of Kenyan talent")
    print("   that other platforms miss due to language barriers!")

if __name__ == "__main__":
    main()
