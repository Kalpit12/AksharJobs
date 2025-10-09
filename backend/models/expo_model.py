from pymongo import MongoClient, ASCENDING, DESCENDING
from datetime import datetime
from bson import ObjectId
from utils.db import get_db

# Don't initialize database connection at module import time
_expo_db = None
_registrations = None
_referrals = None
_referral_clicks = None
_share_records = None

def _get_expo_collections():
    """Lazy-load expo database collections when needed"""
    global _expo_db, _registrations, _referrals, _referral_clicks, _share_records
    
    if _expo_db is None:
        try:
            # Get the main database connection
            main_db = get_db()
            if main_db is None:
                print("[ERROR] Failed to connect to main database")
                return None, None, None, None
            
            # Get client from the main database connection
            client = main_db.client
            
            # Connect to EXPO_REGISTRATION database
            _expo_db = client['EXPO_REGISTRATION']
            
            # Get collections
            _registrations = _expo_db['registrations']
            _referrals = _expo_db['referral_tracking']
            _referral_clicks = _expo_db['referral_clicks']
            _share_records = _expo_db['share_records']  # NEW: Individual share tracking
            
            # Create indexes for better performance
            _registrations.create_index([("email", ASCENDING)], unique=True)
            _registrations.create_index([("role", ASCENDING)])
            _registrations.create_index([("timestamp", DESCENDING)])
            
            _referrals.create_index([("referrerEmail", ASCENDING)])
            _referrals.create_index([("timestamp", DESCENDING)])
            
            _referral_clicks.create_index([("referrerEmail", ASCENDING), ("referredEmail", ASCENDING)])
            
            # NEW: Index for individual share records
            _share_records.create_index([("referrerEmail", ASCENDING)])
            _share_records.create_index([("platform", ASCENDING)])
            _share_records.create_index([("timestamp", DESCENDING)])
            
            print("[OK] EXPO_REGISTRATION database connected successfully!")
            
        except Exception as e:
            print(f"[ERROR] Failed to connect to EXPO_REGISTRATION database: {e}")
            return None, None, None, None
    
    return _registrations, _referrals, _referral_clicks, _share_records


class ExpoRegistration:
    """Model for Expo Registration"""
    
    @staticmethod
    def create_registration(data):
        """Create a new expo registration"""
        registrations, _, _, _ = _get_expo_collections()
        if registrations is None:
            raise Exception("Database connection failed")
        
        # Check for duplicate email
        existing = registrations.find_one({"email": data.get("email")})
        if existing:
            return {
                "success": False,
                "error": "Email already registered",
                "message": "This email address is already registered. Please use a different email or contact support if you need help.",
                "duplicate": True,
                "existingEmail": existing.get("email"),
                "existingName": existing.get("fullName"),
                "registeredAt": existing.get("timestamp")
            }
        
        # Prepare registration document
        registration = {
            "timestamp": datetime.utcnow(),
            "fullName": data.get("fullName") or data.get("name"),
            "email": data.get("email"),
            "phone": data.get("phone"),
            "role": data.get("role"),
            
            # Job Seeker fields
            "experience": data.get("experience", ""),
            "skills": data.get("skills", ""),
            "location": data.get("location", ""),
            "jobType": data.get("jobType", ""),
            "industry": data.get("industry", ""),
            
            # Recruiter fields
            "company": data.get("company", ""),
            "position": data.get("position", ""),
            "companySize": data.get("companySize", ""),
            "hiringVolume": data.get("hiringVolume", ""),
            
            # Mentor fields
            "expertise": data.get("expertise", ""),
            "mentorshipType": data.get("mentorshipType", ""),
            "bio": data.get("bio", ""),
            
            # Trainer fields
            "specialization": data.get("specialization", ""),
            "trainingFormat": data.get("trainingFormat", ""),
            "certifications": data.get("certifications", ""),
            
            # Consultant fields
            "consultantSpecialization": data.get("consultantSpecialization", ""),
            "consultantExperience": data.get("consultantExperience", ""),
            "consultantType": data.get("consultantType", ""),
            "industryFocus": data.get("industryFocus", ""),
            
            # Volunteer fields
            "volunteerInterests": data.get("volunteerInterests", ""),
            "volunteerAvailability": data.get("volunteerAvailability", ""),
            "volunteerMotivation": data.get("volunteerMotivation", ""),
            
            # Intern fields
            "university": data.get("university", ""),
            "field": data.get("field", ""),
            "internshipType": data.get("internshipType", ""),
            "graduationYear": data.get("graduationYear", ""),
            
            # Community fields
            "communityOrganization": data.get("communityOrganization", ""),
            "communityInterests": data.get("communityInterests", ""),
            "communityRole": data.get("communityRole", ""),
            "communityExperience": data.get("communityExperience", ""),
            "communityDescription": data.get("communityDescription", ""),
            
            # University fields
            "universityName": data.get("universityName", ""),
            "department": data.get("department", ""),
            "universityType": data.get("universityType", ""),
            "studentCount": data.get("studentCount", ""),
            
            # Additional fields
            "notificationStatus": "Pending Notification",
            "registrationType": data.get("type", "registration")
        }
        
        # Insert into database
        result = registrations.insert_one(registration)
        registration["_id"] = str(result.inserted_id)
        
        return {
            "success": True,
            "message": "Registration saved successfully",
            "timestamp": registration["timestamp"].isoformat(),
            "registrationId": str(result.inserted_id)
        }
    
    @staticmethod
    def get_registrations_by_role(role=None, limit=100):
        """Get registrations filtered by role"""
        registrations, _, _, _ = _get_expo_collections()
        if registrations is None:
            raise Exception("Database connection failed")
        
        query = {"role": role} if role else {}
        results = registrations.find(query).sort("timestamp", DESCENDING).limit(limit)
        
        registrations_list = []
        for reg in results:
            reg["_id"] = str(reg["_id"])
            reg["timestamp"] = reg["timestamp"].isoformat() if reg.get("timestamp") else None
            registrations_list.append(reg)
        
        return registrations_list
    
    @staticmethod
    def get_registration_by_email(email):
        """Get registration by email"""
        registrations, _, _, _ = _get_expo_collections()
        if registrations is None:
            raise Exception("Database connection failed")
        
        registration = registrations.find_one({"email": email})
        if registration:
            registration["_id"] = str(registration["_id"])
            registration["timestamp"] = registration["timestamp"].isoformat() if registration.get("timestamp") else None
        
        return registration
    
    @staticmethod
    def get_registration_stats():
        """Get registration statistics"""
        registrations, _, _, _ = _get_expo_collections()
        if registrations is None:
            raise Exception("Database connection failed")
        
        # Count total registrations
        total = registrations.count_documents({})
        
        # Count by role
        pipeline = [
            {"$group": {"_id": "$role", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        by_role = list(registrations.aggregate(pipeline))
        
        return {
            "total": total,
            "byRole": by_role
        }


class ReferralTracking:
    """Model for Referral Tracking and Coin Management"""
    
    # Coin rewards configuration
    SHARE_COINS = 3  # Coins for sharing referral link
    REGISTRATION_COINS = 1  # Bonus coins when someone registers via referral
    
    @staticmethod
    def track_referral(data):
        """Track referral share or registration - ALLOWS UNLIMITED SHARES"""
        _, referrals, referral_clicks, share_records = _get_expo_collections()
        if referrals is None or referral_clicks is None or share_records is None:
            raise Exception("Database connection failed")
        
        referrer_email = data.get("referrerEmail")
        referred_email = data.get("referredEmail")
        platform = data.get("platform", "unknown")
        timestamp = datetime.utcnow()
        
        # Determine action type and coins to award
        if not referred_email or referred_email in ['', 'unknown']:
            # User is sharing the referral link - ALLOW UNLIMITED SHARES
            coins_to_award = ReferralTracking.SHARE_COINS
            action_type = 'share'
            should_increment_count = False
            
            # ✅ TRACK EVERY INDIVIDUAL SHARE (No duplicate prevention)
            share_record = {
                "referrerName": data.get("referrerName", "Anonymous"),
                "referrerEmail": referrer_email,
                "referrerPhone": data.get("referrerPhone", ""),
                "referrerRole": data.get("referrerRole", "unknown"),
                "platform": platform,
                "coinsEarned": coins_to_award,
                "timestamp": timestamp,
                "referralCode": data.get("referralCode", "AKSHAR2025"),
                "actionType": "share",
                "totalShares": data.get("totalShares", 0),
                "shareCount": data.get("shareCount", 1),
                "source": data.get("source", "referral_page")
            }
            share_records.insert_one(share_record)
            print(f"✅ Tracked share: {referrer_email} shared on {platform}")
            
        else:
            # Someone registered via referral link
            # Check if this specific referral click has already been processed
            existing_click = referral_clicks.find_one({
                "referrerEmail": referrer_email,
                "referredEmail": referred_email
            })
            
            if existing_click:
                return {
                    "success": True,
                    "message": "Referral registration already processed",
                    "alreadyProcessed": True,
                    "timestamp": timestamp.isoformat()
                }
            
            coins_to_award = ReferralTracking.REGISTRATION_COINS
            action_type = 'registration'
            should_increment_count = True
            
            # Record this referral click to prevent duplicates
            referral_clicks.insert_one({
                "referrerEmail": referrer_email,
                "referredEmail": referred_email,
                "referredName": data.get("referredName", ""),
                "timestamp": timestamp,
                "coinsAwarded": coins_to_award
            })
            print(f"✅ Tracked registration: {referred_email} registered via {referrer_email}")
        
        # Find or create referrer summary record (aggregated stats)
        referrer = referrals.find_one({"referrerEmail": referrer_email})
        
        if referrer:
            # Update existing record
            new_referral_count = referrer.get("referralCount", 0) + (1 if should_increment_count else 0)
            new_total_coins = referrer.get("totalCoins", 0) + coins_to_award
            
            # Count total shares from share_records
            total_shares = share_records.count_documents({"referrerEmail": referrer_email})
            
            referrals.update_one(
                {"referrerEmail": referrer_email},
                {
                    "$set": {
                        "referrerName": data.get("referrerName"),
                        "referrerPhone": data.get("referrerPhone", ""),
                        "referrerRole": data.get("referrerRole", "unknown"),
                        "referralCount": new_referral_count,
                        "totalCoins": new_total_coins,
                        "totalShares": total_shares,
                        "lastActivity": timestamp,
                        "referralCode": data.get("referralCode", "AKSHAR2025"),
                        "lastPlatform": platform
                    }
                }
            )
        else:
            # Create new record
            new_referral_count = 1 if should_increment_count else 0
            new_total_coins = coins_to_award
            total_shares = 1 if action_type == 'share' else 0
            
            referrals.insert_one({
                "referrerName": data.get("referrerName"),
                "referrerEmail": referrer_email,
                "referrerPhone": data.get("referrerPhone", ""),
                "referrerRole": data.get("referrerRole", "unknown"),
                "referralCount": new_referral_count,
                "totalCoins": new_total_coins,
                "totalShares": total_shares,
                "timestamp": timestamp,
                "lastActivity": timestamp,
                "referralCode": data.get("referralCode", "AKSHAR2025"),
                "lastPlatform": platform
            })
        
        # Prepare response message
        if action_type == 'share':
            message = f"Referral shared via {platform}! You earned {coins_to_award} coins. Share unlimited times!"
        else:
            message = f"Someone registered via your referral! You earned {coins_to_award} bonus coin."
        
        return {
            "success": True,
            "message": message,
            "actionType": action_type,
            "timestamp": timestamp.isoformat(),
            "coinsEarned": coins_to_award,
            "totalCoins": new_total_coins if referrer else coins_to_award,
            "referralCount": new_referral_count if referrer else (1 if should_increment_count else 0),
            "platform": platform
        }
    
    @staticmethod
    def get_referral_data(email=None):
        """Get referral tracking data"""
        _, referrals, _, _ = _get_expo_collections()
        if referrals is None:
            raise Exception("Database connection failed")
        
        query = {"referrerEmail": email} if email else {}
        results = referrals.find(query).sort("totalCoins", DESCENDING).limit(100)
        
        records = []
        for record in results:
            record["_id"] = str(record["_id"])
            record["timestamp"] = record["timestamp"].isoformat() if record.get("timestamp") else None
            record["lastActivity"] = record["lastActivity"].isoformat() if record.get("lastActivity") else None
            records.append(record)
        
        return {
            "success": True,
            "message": f"Found {len(records)} referral record(s)",
            "records": records
        }
    
    @staticmethod
    def get_leaderboard(limit=50):
        """Get referral leaderboard sorted by coins"""
        _, referrals, _, _ = _get_expo_collections()
        if referrals is None:
            raise Exception("Database connection failed")
        
        results = referrals.find().sort("totalCoins", DESCENDING).limit(limit)
        
        leaderboard = []
        for idx, record in enumerate(results, 1):
            leaderboard.append({
                "rank": idx,
                "name": record.get("referrerName"),
                "email": record.get("referrerEmail"),
                "totalCoins": record.get("totalCoins", 0),
                "referralCount": record.get("referralCount", 0),
                "role": record.get("referrerRole", "unknown")
            })
        
        return {
            "success": True,
            "leaderboard": leaderboard
        }
    
    @staticmethod
    def get_user_stats(email):
        """Get detailed stats for a specific user"""
        _, referrals, referral_clicks, share_records = _get_expo_collections()
        if referrals is None or referral_clicks is None or share_records is None:
            raise Exception("Database connection failed")
        
        # Get user's referral record
        user = referrals.find_one({"referrerEmail": email})
        
        if not user:
            return {
                "success": False,
                "message": "No referral data found for this user"
            }
        
        # Get all referral clicks for this user
        clicks = list(referral_clicks.find({"referrerEmail": email}))
        
        # Count successful registrations
        successful_registrations = len(clicks)
        
        # Get all individual share records
        shares = list(share_records.find({"referrerEmail": email}).sort("timestamp", DESCENDING))
        total_shares = len(shares)
        
        # Group shares by platform
        platform_counts = {}
        for share in shares:
            platform = share.get("platform", "unknown")
            platform_counts[platform] = platform_counts.get(platform, 0) + 1
        
        return {
            "success": True,
            "name": user.get("referrerName"),
            "email": user.get("referrerEmail"),
            "totalCoins": user.get("totalCoins", 0),
            "referralCount": user.get("referralCount", 0),
            "totalShares": total_shares,
            "successfulRegistrations": successful_registrations,
            "platformCounts": platform_counts,
            "referralCode": user.get("referralCode", "AKSHAR2025"),
            "memberSince": user.get("timestamp").isoformat() if user.get("timestamp") else None,
            "lastActivity": user.get("lastActivity").isoformat() if user.get("lastActivity") else None
        }

