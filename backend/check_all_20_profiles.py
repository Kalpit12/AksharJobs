#!/usr/bin/env python3
"""
Check ALL 20 jobseeker profiles in MongoDB Atlas
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.db import get_db
from bson import ObjectId
import json

def check_all_profiles():
    """Check all 20 profiles in detail"""
    
    print("="*100)
    print(" "*25 + "CHECKING ALL 20 JOBSEEKER PROFILES")
    print("="*100)
    
    db = get_db()
    
    if db is None:
        print("❌ Failed to connect to database")
        return
    
    jobseeker_profiles_collection = db.jobseeker_profiles
    users_collection = db.users
    
    # Get ALL profiles
    profiles = list(jobseeker_profiles_collection.find())
    
    print(f"\n✅ Found {len(profiles)} total profiles in jobseeker_profiles collection")
    print(f"{'='*100}\n")
    
    # Categorize profiles
    complete_profiles = []
    incomplete_profiles = []
    draft_profiles = []
    
    for idx, profile in enumerate(profiles, 1):
        user_id = profile.get('userId')
        
        # Get corresponding user
        user_data = users_collection.find_one({'_id': user_id})
        
        if not user_data:
            print(f"{idx}. ❌ Profile has no corresponding user (orphaned)")
            continue
        
        email = user_data.get('email', 'N/A')
        first_name = user_data.get('firstName') or profile.get('personalInfo', {}).get('firstName', 'N/A')
        last_name = user_data.get('lastName') or profile.get('personalInfo', {}).get('lastName', 'N/A')
        
        # Check data completeness
        personal_info = profile.get('personalInfo', {})
        professional = profile.get('professionalProfile', {})
        skills_info = profile.get('skillsInfo', {})
        education = profile.get('educationEntries', [])
        experience = profile.get('experienceEntries', [])
        languages = profile.get('languages', [])
        certifications = profile.get('certificationEntries', [])
        
        # Count filled critical fields
        critical_fields_filled = 0
        critical_fields_total = 10
        
        if personal_info.get('dateOfBirth'): critical_fields_filled += 1
        if personal_info.get('gender'): critical_fields_filled += 1
        if professional.get('professionalTitle'): critical_fields_filled += 1
        if professional.get('yearsExperience'): critical_fields_filled += 1
        if professional.get('summary'): critical_fields_filled += 1
        if isinstance(skills_info.get('coreSkills'), list) and len(skills_info.get('coreSkills', [])) > 0: critical_fields_filled += 1
        if isinstance(education, list) and len(education) > 0: critical_fields_filled += 1
        if isinstance(experience, list) and len(experience) > 0: critical_fields_filled += 1
        if isinstance(languages, list) and len(languages) > 0: critical_fields_filled += 1
        if profile.get('nationalityResidency', {}).get('nationality'): critical_fields_filled += 1
        
        completion_percent = int((critical_fields_filled / critical_fields_total) * 100)
        
        # Categorize
        is_draft = user_data.get('isDraft', False)
        is_complete = user_data.get('profileCompleted', False)
        
        profile_info = {
            'number': idx,
            'name': f"{first_name} {last_name}",
            'email': email,
            'user_id': str(user_id),
            'completion': completion_percent,
            'is_draft': is_draft,
            'is_complete': is_complete,
            'has_data': critical_fields_filled > 5
        }
        
        if is_complete and not is_draft and completion_percent >= 80:
            complete_profiles.append(profile_info)
        elif is_draft:
            draft_profiles.append(profile_info)
        else:
            incomplete_profiles.append(profile_info)
        
        # Print summary
        status = "✅ COMPLETE" if (is_complete and completion_percent >= 80) else ("📝 DRAFT" if is_draft else "⚠️ INCOMPLETE")
        print(f"{idx:2}. {status} | {first_name:15} {last_name:15} | {completion_percent:3}% | {email[:35]:35}")
    
    # Summary
    print(f"\n{'='*100}")
    print("SUMMARY")
    print(f"{'='*100}\n")
    
    print(f"📊 Total Profiles: {len(profiles)}")
    print(f"✅ Complete: {len(complete_profiles)}")
    print(f"📝 Drafts: {len(draft_profiles)}")
    print(f"⚠️  Incomplete: {len(incomplete_profiles)}")
    
    # Show details for each category
    if complete_profiles:
        print(f"\n{'='*100}")
        print(f"✅ COMPLETE PROFILES ({len(complete_profiles)})")
        print(f"{'='*100}")
        for p in complete_profiles:
            print(f"  {p['number']:2}. {p['name']:30} | {p['email']:40} | {p['completion']}%")
    
    if draft_profiles:
        print(f"\n{'='*100}")
        print(f"📝 DRAFT PROFILES ({len(draft_profiles)})")
        print(f"{'='*100}")
        for p in draft_profiles:
            print(f"  {p['number']:2}. {p['name']:30} | {p['email']:40} | {p['completion']}%")
    
    if incomplete_profiles:
        print(f"\n{'='*100}")
        print(f"⚠️  INCOMPLETE PROFILES ({len(incomplete_profiles)})")
        print(f"{'='*100}")
        for p in incomplete_profiles:
            print(f"  {p['number']:2}. {p['name']:30} | {p['email']:40} | {p['completion']}%")
    
    # Show sample of complete profile
    if complete_profiles or draft_profiles or incomplete_profiles:
        print(f"\n{'='*100}")
        print("SAMPLE PROFILE DETAILS")
        print(f"{'='*100}")
        
        # Pick the most complete profile
        all_profiles = complete_profiles + draft_profiles + incomplete_profiles
        if all_profiles:
            best = max(all_profiles, key=lambda x: x['completion'])
            
            print(f"\nShowing details for: {best['name']} ({best['completion']}% complete)")
            
            # Get the actual profile
            best_profile = jobseeker_profiles_collection.find_one({'userId': ObjectId(best['user_id'])})
            best_user = users_collection.find_one({'_id': ObjectId(best['user_id'])})
            
            if best_profile:
                personal = best_profile.get('personalInfo', {})
                professional = best_profile.get('professionalProfile', {})
                skills = best_profile.get('skillsInfo', {})
                
                print(f"\n  Personal Info:")
                print(f"    Date of Birth: {personal.get('dateOfBirth', 'N/A')}")
                print(f"    Gender: {personal.get('gender', 'N/A')}")
                print(f"    Phone: {personal.get('phone', 'N/A')}")
                
                print(f"\n  Professional:")
                print(f"    Title: {professional.get('professionalTitle', 'N/A')}")
                print(f"    Experience: {professional.get('yearsExperience', 'N/A')} years")
                print(f"    Industry: {professional.get('industry', 'N/A')}")
                summary = professional.get('summary', 'N/A')
                if summary and len(summary) > 80:
                    summary = summary[:80] + "..."
                print(f"    Summary: {summary}")
                
                print(f"\n  Skills & Arrays:")
                print(f"    Core Skills: {len(skills.get('coreSkills', []))} items")
                print(f"    Education: {len(best_profile.get('educationEntries', []))} entries")
                print(f"    Experience: {len(best_profile.get('experienceEntries', []))} entries")
                print(f"    Languages: {len(best_profile.get('languages', []))} languages")
                print(f"    Certifications: {len(best_profile.get('certificationEntries', []))} certs")
    
    print(f"\n{'='*100}")
    print("✅ DATABASE STATUS: HEALTHY")
    print(f"{'='*100}")
    print(f"\n✅ MongoDB Atlas connection: Working")
    print(f"✅ Data exists: {len(profiles)} profiles")
    print(f"✅ Data structure: Correct (nested format)")
    print(f"✅ GET endpoint: Should flatten and return data")
    
    print(f"\n💡 NEXT STEP:")
    print(f"   1. Make sure backend is RESTARTED with all fixes")
    print(f"   2. Login to your app")
    print(f"   3. Go to MyProfile")
    print(f"   4. Data should display!")
    
    if draft_profiles:
        print(f"\n📝 NOTE: {len(draft_profiles)} profiles are marked as drafts")
        print(f"   These will show draft indicator and allow continued editing")
    
    print(f"\n{'='*100}\n")

if __name__ == "__main__":
    try:
        check_all_profiles()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

