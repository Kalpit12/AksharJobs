#!/usr/bin/env python3
"""
Verify that both forms have 50KB file size limit properly implemented
"""

import re

def check_intern_form():
    """Check intern form for 50KB limit implementation"""
    print("🔍 Checking Intern Details Form...")
    
    try:
        with open('frontend/src/pages/InternDetailsForm.jsx', 'r') as f:
            content = f.read()
        
        # Check for 50KB limit
        if '50 * 1024' in content:
            print("✅ Intern form has 50KB limit (50 * 1024 bytes)")
        else:
            print("❌ Intern form missing 50KB limit")
            
        # Check for error message
        if 'Profile photo must be 50KB or smaller' in content:
            print("✅ Intern form has proper error message")
        else:
            print("❌ Intern form missing error message")
            
        # Check for file size check
        if 'file.size > 50 * 1024' in content:
            print("✅ Intern form checks file size correctly")
        else:
            print("❌ Intern form missing file size check")
            
    except Exception as e:
        print(f"❌ Error reading intern form: {e}")

def check_jobseeker_form():
    """Check job seeker form for 50KB limit implementation"""
    print("\n🔍 Checking Job Seeker Complete Profile Form...")
    
    try:
        with open('frontend/src/pages/JobSeekerRegistrationFormComprehensive.jsx', 'r') as f:
            content = f.read()
        
        # Check for 50KB limit
        if '50 * 1024' in content:
            print("✅ Job seeker form has 50KB limit (50 * 1024 bytes)")
        else:
            print("❌ Job seeker form missing 50KB limit")
            
        # Check for error message
        if 'Profile photo must be 50KB or smaller' in content:
            print("✅ Job seeker form has proper error message")
        else:
            print("❌ Job seeker form missing error message")
            
        # Check for file size check
        if 'file.size > 50 * 1024' in content:
            print("✅ Job seeker form checks file size correctly")
        else:
            print("❌ Job seeker form missing file size check")
            
    except Exception as e:
        print(f"❌ Error reading job seeker form: {e}")

def main():
    print("🧪 Verifying 50KB File Size Limit Implementation")
    print("=" * 60)
    
    check_intern_form()
    check_jobseeker_form()
    
    print("\n📋 Summary:")
    print("✅ Both forms should have 50KB file size limits")
    print("✅ Both forms should show error messages for oversized files")
    print("✅ Both forms should check file.size > 50 * 1024")
    print("\n🎯 Manual Testing:")
    print("   1. Upload a small image (<50KB) - should work")
    print("   2. Upload a large image (>50KB) - should show error")
    print("   3. Test both Intern and Job Seeker forms")

if __name__ == "__main__":
    main()
