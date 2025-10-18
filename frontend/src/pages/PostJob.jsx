import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkedInStyleSelect from '../components/LinkedInStyleSelect';
import { 
  countries,
  currencies,
  industries,
  departments,
  allSkills,
  jobTypes,
  workModes,
  experienceLevels,
  educationLevels,
  benefits,
  salaryTypes,
  applyMethods,
  visibilityOptions
} from '../data/formOptions';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    jobType: 'Full-time',
    workMode: 'On-site',
    experienceLevel: '',
    vacancies: 1,
    industry: '',
    department: '',
    skills: [],
    tools: [],
    education: 'Any',
    
    // Job Description
    summary: '',
    responsibilities: '',
    desiredProfile: '',
    companyOverview: '',
    
    // Salary & Benefits
    salaryType: 'Negotiable',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    benefits: [],
    perks: [],
    
    // Location
    country: 'Kenya',
    state: '',
    city: '',
    officeAddress: '',
    postalCode: '',
    
    // Application Details
    applicationDeadline: '',
    preferredJoiningDate: '',
    applyMethod: 'Apply through platform',
    contactEmail: '',
    hrName: '',
    visibility: 'public'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.industry || !formData.summary || !formData.contactEmail) {
      alert('Please fill in all required fields: Job Title, Industry, Summary, and Contact Email');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/add_job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
        ...formData,
          postedAt: new Date().toISOString(),
          status: 'active'
        })
      });

      if (response.ok) {
        alert('Job posted successfully!');
      navigate('/recruiter-dashboard');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to post job'}`);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred while posting the job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{
                background: 'linear-gradient(135deg, #FF8A65 0%, #20B2AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Post a Job</h1>
              <p className="mt-2 text-sm" style={{
                background: 'linear-gradient(135deg, #FF8A65 0%, #20B2AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Create a detailed job posting to attract the best candidates
              </p>
          </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/recruiter-dashboard')}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                  background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                  border: '2px solid transparent',
                  backgroundClip: 'padding-box'
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => navigate('/recruiter-dashboard')}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                  background: 'linear-gradient(135deg, #20B2AA 0%, #17a2b8 100%)',
                  border: '2px solid transparent',
                  backgroundClip: 'padding-box'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Job Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Job Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                      <input
                        type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Senior Full Stack Developer"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
              {/* Job Type */}
              <LinkedInStyleSelect
                label="Job Type"
                value={formData.jobType}
                onChange={(val) => handleChange('jobType', val)}
                options={jobTypes}
                required
              />

              {/* Work Mode */}
              <LinkedInStyleSelect
                label="Work Mode"
                value={formData.workMode}
                onChange={(val) => handleChange('workMode', val)}
                options={workModes}
                required
              />

              {/* Experience Level */}
              <LinkedInStyleSelect
                label="Experience Level"
                value={formData.experienceLevel}
                onChange={(val) => handleChange('experienceLevel', val)}
                options={experienceLevels}
                placeholder="Select experience level"
                        required
                      />

              {/* Vacancies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Vacancies
                </label>
                      <input
                  type="number"
                  min="1"
                  value={formData.vacancies}
                  onChange={(e) => handleChange('vacancies', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
              {/* Industry */}
              <LinkedInStyleSelect
                label="Industry / Sector"
                        value={formData.industry}
                onChange={(val) => handleChange('industry', val)}
                options={industries}
                placeholder="Select industry"
                searchable
                        required
              />

              {/* Department */}
              <LinkedInStyleSelect
                label="Department / Functional Area"
                value={formData.department}
                onChange={(val) => handleChange('department', val)}
                options={departments}
                placeholder="Select department"
                searchable
              />

              {/* Skills Required */}
              <div className="md:col-span-2">
                <LinkedInStyleSelect
                  label="Skills Required"
                  value={formData.skills}
                  onChange={(val) => handleChange('skills', val)}
                  options={allSkills}
                  placeholder="Select skills"
                  searchable
                  multiple
                />
                    </div>
                    
              {/* Tools / Technologies */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tools / Technologies
                </label>
                        <input
                          type="text"
                  value={formData.tools.join(', ')}
                  onChange={(e) => handleChange('tools', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="e.g., AWS, Docker, Kubernetes, Figma (comma separated)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                  </div>
                  
              {/* Education Requirement */}
              <LinkedInStyleSelect
                label="Education Requirement"
                value={formData.education}
                onChange={(val) => handleChange('education', val)}
                options={educationLevels}
              />
                  </div>
                </div>

          {/* Section 2: Job Description & Responsibilities */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Description & Responsibilities</h2>
            
            <div className="space-y-6">
              {/* Job Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  placeholder="Brief overview of the role (2-4 sentences)"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
              {/* Key Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Responsibilities
                </label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => handleChange('responsibilities', e.target.value)}
                  placeholder="• Main duty 1&#10;• Main duty 2&#10;• Main duty 3&#10;(One responsibility per line)"
                  rows="6"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                  </div>
                  
              {/* Desired Candidate Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desired Candidate Profile
                </label>
                    <textarea
                  value={formData.desiredProfile}
                  onChange={(e) => handleChange('desiredProfile', e.target.value)}
                  placeholder="Ideal experience, skills, and personal qualities we're looking for"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
              {/* Company Overview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Overview
                </label>
                <textarea
                  value={formData.companyOverview}
                  onChange={(e) => handleChange('companyOverview', e.target.value)}
                  placeholder="About your company, culture, and mission"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                    </div>
                  </div>
                </div>

          {/* Section 3: Salary & Benefits */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Salary & Benefits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Salary Type */}
              <LinkedInStyleSelect
                label="Salary Type"
                value={formData.salaryType}
                onChange={(val) => handleChange('salaryType', val)}
                options={salaryTypes}
              />

              {/* Currency */}
              <LinkedInStyleSelect
                label="Currency"
                value={formData.currency}
                onChange={(val) => handleChange('currency', val)}
                options={currencies}
                searchable
              />

              {/* Salary Min */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary
                </label>
                      <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleChange('salaryMin', e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
              {/* Salary Max */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleChange('salaryMax', e.target.value)}
                  placeholder="e.g., 80000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                    </div>
                    
              {/* Benefits */}
              <div className="md:col-span-2">
                <LinkedInStyleSelect
                  label="Benefits Offered"
                  value={formData.benefits}
                  onChange={(val) => handleChange('benefits', val)}
                  options={benefits}
                  placeholder="Select benefits"
                  searchable
                  multiple
                      />
                    </div>
                  </div>
                </div>

          {/* Section 4: Job Location */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Country */}
              <LinkedInStyleSelect
                label="Country"
                value={formData.country}
                onChange={(val) => handleChange('country', val)}
                options={countries}
                searchable
                        required
              />

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="e.g., Nairobi County"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                    </div>
                    
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                      <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g., Nairobi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                      <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="e.g., 00100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                  </div>
                  
              {/* Office Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Office Address (Optional)
                </label>
                      <input
                        type="text"
                  value={formData.officeAddress}
                  onChange={(e) => handleChange('officeAddress', e.target.value)}
                  placeholder="Street address (for on-site or hybrid roles)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                    </div>
                  </div>
                </div>

          {/* Section 5: Application Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                      <input
                        type="date"
                        value={formData.applicationDeadline}
                  onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
              {/* Preferred Joining Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Joining Date
                </label>
                <input
                  type="date"
                  value={formData.preferredJoiningDate}
                  onChange={(e) => handleChange('preferredJoiningDate', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                    </div>
                    
              {/* Application Method */}
              <LinkedInStyleSelect
                label="Application Method"
                value={formData.applyMethod}
                onChange={(val) => handleChange('applyMethod', val)}
                options={applyMethods}
              />

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                />
                  </div>
                  
              {/* HR Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HR / Recruiter Name
                </label>
                      <input
                        type="text"
                  value={formData.hrName}
                  onChange={(e) => handleChange('hrName', e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                  </div>
                  
              {/* Visibility */}
              <LinkedInStyleSelect
                label="Job Visibility"
                value={formData.visibility}
                onChange={(val) => handleChange('visibility', val)}
                options={visibilityOptions}
              />
                      </div>
                    </div>
                    
          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                * Required fields must be filled
              </p>
              <div className="flex gap-4">
                    <button
                      type="button"
                  onClick={() => navigate('/recruiter-dashboard')}
                  className="px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{
                    background: 'linear-gradient(135deg, #20B2AA 0%, #17a2b8 100%)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box'
                  }}
                >
                  Cancel
                      </button>
                      <button
                        type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box'
                  }}
                >
                  {loading ? 'Publishing...' : 'Publish Job'}
                      </button>
                  </div>
                </div>
              </div>
            </form>
      </div>
    </div>
  );
};

export default PostJob;
