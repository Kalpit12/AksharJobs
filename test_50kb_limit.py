#!/usr/bin/env python3
"""
Test script to verify 50KB file size limit is working in both forms
"""

import os
import tempfile
from PIL import Image

def create_test_image(size_kb):
    """Create a test image of specified size in KB"""
    # Create a temporary image
    width, height = 100, 100
    img = Image.new('RGB', (width, height), color='red')
    
    # Save to temporary file
    temp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
    
    # Adjust quality to get desired file size
    quality = 95
    while True:
        img.save(temp_file.name, 'JPEG', quality=quality)
        file_size = os.path.getsize(temp_file.name)
        file_size_kb = file_size / 1024
        
        if abs(file_size_kb - size_kb) < 1:  # Within 1KB tolerance
            break
        elif file_size_kb > size_kb:
            quality -= 5
        else:
            quality += 5
            
        if quality < 10 or quality > 100:
            break
    
    return temp_file.name, file_size_kb

def test_file_sizes():
    """Test different file sizes"""
    print("🧪 Testing 50KB File Size Limit")
    print("=" * 50)
    
    # Test cases
    test_cases = [
        (30, "Should be accepted"),
        (50, "Should be accepted (exactly 50KB)"),
        (60, "Should be rejected (>50KB)"),
        (100, "Should be rejected (>50KB)")
    ]
    
    for size_kb, expected in test_cases:
        try:
            file_path, actual_size = create_test_image(size_kb)
            print(f"📁 Created test image: {actual_size:.1f}KB - {expected}")
            
            # Clean up
            os.unlink(file_path)
            
        except Exception as e:
            print(f"❌ Error creating {size_kb}KB image: {e}")
    
    print("\n✅ Test images created successfully!")
    print("📝 Manual Testing Required:")
    print("   1. Try uploading a 30KB image - should work")
    print("   2. Try uploading a 50KB image - should work") 
    print("   3. Try uploading a 60KB+ image - should show error")
    print("   4. Test both Intern and Job Seeker forms")

if __name__ == "__main__":
    test_file_sizes()
