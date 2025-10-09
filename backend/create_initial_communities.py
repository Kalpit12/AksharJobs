#!/usr/bin/env python3
"""
Script to create initial communities for the platform.
"""

from pymongo import MongoClient
from datetime import datetime

def create_initial_communities():
    """Create initial communities in the database"""
    
    # Connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['TalentMatchDB']
        communities_collection = db['communities']
        
        print("✅ Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        return False
    
    # Define initial communities - Professional and Community Organizations
    initial_communities = [
        {
            "name": "All Communities",
            "description": "Access to all job opportunities across all communities",
            "category": "General",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["all", "general", "unlimited"],
            "requirements": "Open to all users",
            "color": "#10B981",
            "icon": "🌍"
        },
        {
            "name": "Kenya Marketing (KM)",
            "description": "Kenya Marketing professionals and digital marketing experts",
            "category": "Professional",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["marketing", "digital", "kenya", "professional", "advertising"],
            "requirements": "Marketing professionals, digital marketers, advertising specialists",
            "color": "#FF6B35",
            "icon": "📈"
        },
        {
            "name": "UAB (United African Business)",
            "description": "United African Business community members and entrepreneurs",
            "category": "Business",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["business", "entrepreneur", "african", "united", "networking"],
            "requirements": "Business owners, entrepreneurs, African business community members",
            "color": "#059669",
            "icon": "🤝"
        },
        {
            "name": "Hindu Council Members",
            "description": "Official Hindu Council members and community leaders",
            "category": "Religious Leadership",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["hindu", "council", "leadership", "religious", "community"],
            "requirements": "Official Hindu Council members and verified community leaders",
            "color": "#F59E0B",
            "icon": "🕉️"
        },
        {
            "name": "Kenyan Sikh Community",
            "description": "Kenyan Sikh community members and followers of Sikhism",
            "category": "Religious",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["sikh", "kenyan", "religious", "community", "gurdwara"],
            "requirements": "Kenyan Sikh community members and Gurdwara attendees",
            "color": "#8B5CF6",
            "icon": "🦁"
        },
        {
            "name": "Kenya IT Professionals",
            "description": "Information Technology professionals and software developers in Kenya",
            "category": "Technology",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["it", "technology", "software", "developer", "kenya"],
            "requirements": "IT professionals, software developers, tech entrepreneurs",
            "color": "#3B82F6",
            "icon": "💻"
        },
        {
            "name": "Kenya Healthcare Workers",
            "description": "Healthcare professionals and medical workers in Kenya",
            "category": "Healthcare",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["healthcare", "medical", "nurse", "doctor", "kenya"],
            "requirements": "Doctors, nurses, healthcare professionals, medical workers",
            "color": "#F97316",
            "icon": "🏥"
        },
        {
            "name": "Kenya Education Network",
            "description": "Teachers, educators, and education professionals in Kenya",
            "category": "Education",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["education", "teacher", "school", "university", "kenya"],
            "requirements": "Teachers, lecturers, education administrators, school staff",
            "color": "#EF4444",
            "icon": "📚"
        },
        {
            "name": "Kenya Banking & Finance",
            "description": "Banking, finance, and accounting professionals in Kenya",
            "category": "Finance",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["banking", "finance", "accounting", "kenya", "professional"],
            "requirements": "Bankers, accountants, financial analysts, finance professionals",
            "color": "#10B981",
            "icon": "💰"
        },
        {
            "name": "Kenya Real Estate",
            "description": "Real estate agents, property developers, and construction professionals",
            "category": "Real Estate",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["real estate", "property", "construction", "kenya", "development"],
            "requirements": "Real estate agents, property developers, construction workers",
            "color": "#6366F1",
            "icon": "🏗️"
        },
        {
            "name": "Kenya Hospitality & Tourism",
            "description": "Hospitality, tourism, and service industry professionals",
            "category": "Hospitality",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["hospitality", "tourism", "hotel", "restaurant", "kenya"],
            "requirements": "Hotel staff, restaurant workers, tour guides, hospitality professionals",
            "color": "#EC4899",
            "icon": "🏨"
        },
        {
            "name": "Kenya Agriculture & Farming",
            "description": "Farmers, agricultural professionals, and agribusiness owners",
            "category": "Agriculture",
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "member_count": 0,
            "job_count": 0,
            "tags": ["agriculture", "farming", "agribusiness", "kenya", "crops"],
            "requirements": "Farmers, agricultural professionals, agribusiness owners",
            "color": "#84CC16",
            "icon": "🌾"
        }
    ]
    
    try:
        # Check if communities already exist
        existing_count = communities_collection.count_documents({})
        if existing_count > 0:
            print(f"⚠️ Communities already exist ({existing_count} found). Recreating with new communities...")
            # Clear existing communities
            result = communities_collection.delete_many({})
            print(f"🗑️ Deleted {result.deleted_count} existing communities")
        
        # Insert communities
        result = communities_collection.insert_many(initial_communities)
        print(f"✅ Successfully created {len(result.inserted_ids)} communities!")
        
        # Display created communities
        print("\n📋 Created Communities:")
        for i, community in enumerate(initial_communities, 1):
            print(f"{i}. {community['icon']} {community['name']} - {community['category']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating communities: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Creating initial communities...")
    success = create_initial_communities()
    
    if success:
        print("\n✅ Community setup completed successfully!")
    else:
        print("\n❌ Community setup failed!")
