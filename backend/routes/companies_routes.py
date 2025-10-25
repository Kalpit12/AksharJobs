#!/usr/bin/env python3
"""
Companies Routes - Public endpoints to display partner companies
"""

from flask import Blueprint, jsonify
from utils.db import get_db

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('/list', methods=['GET'])
def get_companies_list():
    """
    Get list of all partner companies (recruiters) with their public information
    This is a public endpoint - no authentication required
    """
    try:
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Fetch all recruiters from users collection
        recruiters = db.users.find(
            {'role': 'recruiter'},
            {
                '_id': 1,
                'companyName': 1,
                'companyLogo': 1,
                'companyWebsite': 1,
                'companySize': 1,
                'yearFounded': 1,
                'industry': 1,
                'companyDescription': 1,
                'country': 1,
                'state': 1,
                'city': 1,
                'address': 1
            }
        ).sort('companyName', 1)
        
        companies_list = []
        for recruiter in recruiters:
            # Only include companies with a company name
            if recruiter.get('companyName'):
                company = {
                    '_id': str(recruiter['_id']),
                    'companyName': recruiter.get('companyName', ''),
                    'companyLogo': recruiter.get('companyLogo', ''),
                    'companyWebsite': recruiter.get('companyWebsite', ''),
                    'companySize': recruiter.get('companySize', ''),
                    'yearFounded': recruiter.get('yearFounded', ''),
                    'industry': recruiter.get('industry', ''),
                    'companyDescription': recruiter.get('companyDescription', ''),
                    'country': recruiter.get('country', ''),
                    'state': recruiter.get('state', ''),
                    'city': recruiter.get('city', ''),
                    'address': recruiter.get('address', '')
                }
                companies_list.append(company)
        
        print(f"✅ Fetched {len(companies_list)} companies")
        
        return jsonify({
            'success': True,
            'companies': companies_list,
            'count': len(companies_list)
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching companies: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to fetch companies',
            'details': str(e)
        }), 500


@companies_bp.route('/<company_id>', methods=['GET'])
def get_company_detail(company_id):
    """
    Get detailed information about a specific company
    """
    try:
        from bson import ObjectId
        
        if not company_id:
            return jsonify({'error': 'Company ID is required'}), 400
        
        db = get_db()
        if db is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        # Validate ObjectId format
        try:
            company_object_id = ObjectId(company_id)
        except Exception as e:
            print(f"Invalid company ID format: {company_id}")
            return jsonify({'error': 'Invalid company ID format'}), 400
        
        # Fetch company details
        company = db.users.find_one(
            {
                '_id': company_object_id,
                'role': 'recruiter'
            },
            {
                'password': 0  # Exclude password
            }
        )
        
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        # Convert ObjectId to string
        company['_id'] = str(company['_id'])
        
        # Get active job postings count for this company
        try:
            jobs_count = db.jobs.count_documents({
                'recruiter_id': company_id,
                'status': 'active'
            })
            company['activeJobs'] = jobs_count
        except Exception as e:
            print(f"Warning: Could not fetch job count: {e}")
            company['activeJobs'] = 0
        
        print(f"✅ Fetched company details: {company.get('companyName', 'Unknown')}")
        
        return jsonify({
            'success': True,
            'company': company
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching company details: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to fetch company details',
            'details': str(e)
        }), 500

