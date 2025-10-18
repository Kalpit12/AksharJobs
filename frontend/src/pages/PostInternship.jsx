import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkedInStyleSelect from '../components/LinkedInStyleSelect';
import {
  countries,
  currencies,
  industries,
  allSkills,
  educationLevels,
  internshipDurations,
  stipendTypes,
  workingDaysPerWeek,
  visibilityOptions
} from '../data/formOptions';

const PostInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Details
    title: '',
    internshipType: 'Part-time',
    duration: '3 Months',
    stipendType: 'Paid',
    stipendAmount: '',
    stipendCurrency: 'USD',
    eligibility: 'Undergraduate',
    openings: 1,
    skills: [],
    industry: '',
    
    // Description
    about: '',
    responsibilities: '',
    learningOpportunities: '',
    mentorship: true,
    certificate: true,
    jobOfferPossible: false,
    
    // Location & Duration
    startDate: '',
    endDate: '',
    location: '',
    country: 'Kenya',
    city: '',
    workMode: 'On-site',
    workingDays: '5 days',
    workingHours: '9 AM - 5 PM',
    
    // Contact & Submission
    applicationDeadline: '',
    contactEmail: '',
    hrName: '',
    companyDescription: '',
    companyWebsite: '',
    companyLinkedIn: '',
    visibility: 'public'
  });

  const internshipTypes = ['Full-time', 'Part-time', 'Remote', 'On-site', 'Hybrid'];
  const workModes = ['On-site', 'Hybrid', 'Remote'];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.about || !formData.contactEmail) {
      alert('Please fill in all required fields: Internship Title, About, and Contact Email');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/internships/add', {
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
        alert('Internship posted successfully!');
        navigate('/recruiter-dashboard');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to post internship'}`);
      }
    } catch (error) {
      console.error('Error posting internship:', error);
      alert('An error occurred while posting the internship');
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
              }}>Post an Internship</h1>
              <p className="mt-2 text-sm" style={{
                background: 'linear-gradient(135deg, #FF8A65 0%, #20B2AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Create an internship opportunity to discover talented students and fresh graduates
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
          {/* Section 1: Basic Internship Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Internship Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Internship Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Internship Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Marketing Intern, AI Research Intern"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Internship Type */}
              <LinkedInStyleSelect
                label="Internship Type"
                value={formData.internshipType}
                onChange={(val) => handleChange('internshipType', val)}
                options={internshipTypes}
                required
              />

              {/* Duration */}
              <LinkedInStyleSelect
                label="Duration"
                value={formData.duration}
                onChange={(val) => handleChange('duration', val)}
                options={internshipDurations}
                required
              />

              {/* Stipend Type */}
              <LinkedInStyleSelect
                label="Stipend Type"
                value={formData.stipendType}
                onChange={(val) => handleChange('stipendType', val)}
                options={stipendTypes}
                required
              />

              {/* Stipend Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stipend Amount {formData.stipendType === 'Paid' && <span className="text-red-500">*</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.stipendAmount}
                    onChange={(e) => handleChange('stipendAmount', e.target.value)}
                    placeholder="e.g., 500"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={formData.stipendType === 'Paid'}
                  />
                  <select
                    value={formData.stipendCurrency}
                    onChange={(e) => handleChange('stipendCurrency', e.target.value)}
                    className="w-24 px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">Per month or total (specify in description)</p>
              </div>

              {/* Eligibility */}
              <LinkedInStyleSelect
                label="Eligibility"
                value={formData.eligibility}
                onChange={(val) => handleChange('eligibility', val)}
                options={educationLevels}
                required
              />

              {/* Openings Available */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Openings Available
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={(e) => handleChange('openings', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Skills Required */}
              <div className="md:col-span-2">
                <LinkedInStyleSelect
                  label="Skills Required"
                  value={formData.skills}
                  onChange={(val) => handleChange('skills', val)}
                  options={allSkills}
                  placeholder="Select required skills"
                  searchable
                  multiple
                />
              </div>

              {/* Industry/Domain */}
              <LinkedInStyleSelect
                label="Industry / Domain"
                value={formData.industry}
                onChange={(val) => handleChange('industry', val)}
                options={industries}
                placeholder="Select industry"
                searchable
                required
              />
            </div>
          </div>

          {/* Section 2: Internship Description */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Internship Description</h2>
            
            <div className="space-y-6">
              {/* About the Internship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About the Internship <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                  placeholder="Short summary + who would benefit from this internship"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities
                </label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => handleChange('responsibilities', e.target.value)}
                  placeholder="• Task 1&#10;• Task 2&#10;• Task 3&#10;(One responsibility per line)"
                  rows="5"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Learning Opportunities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Opportunities
                </label>
                <textarea
                  value={formData.learningOpportunities}
                  onChange={(e) => handleChange('learningOpportunities', e.target.value)}
                  placeholder="What skills and knowledge will the intern gain from this experience?"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Additional Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Benefits
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.mentorship}
                      onChange={(e) => handleChange('mentorship', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mentorship Provided</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certificate}
                      onChange={(e) => handleChange('certificate', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Certificate of Completion Provided</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.jobOfferPossible}
                      onChange={(e) => handleChange('jobOfferPossible', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Possible Job Offer After Internship</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Location & Duration */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Work Mode */}
              <LinkedInStyleSelect
                label="Work Mode"
                value={formData.workMode}
                onChange={(val) => handleChange('workMode', val)}
                options={workModes}
                required
              />

              {/* Country */}
              <LinkedInStyleSelect
                label="Country"
                value={formData.country}
                onChange={(val) => handleChange('country', val)}
                options={countries}
                searchable
                required
              />

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

              {/* Working Days per Week */}
              <LinkedInStyleSelect
                label="Working Days per Week"
                value={formData.workingDays}
                onChange={(val) => handleChange('workingDays', val)}
                options={workingDaysPerWeek}
              />

              {/* Working Hours */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Hours
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => handleChange('workingHours', e.target.value)}
                  placeholder="e.g., 9 AM - 3 PM or Flexible"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Submission Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact & Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  placeholder="e.g., Jane Smith"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Company Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => handleChange('companyWebsite', e.target.value)}
                  placeholder="https://www.company.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Company LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.companyLinkedIn}
                  onChange={(e) => handleChange('companyLinkedIn', e.target.value)}
                  placeholder="https://www.linkedin.com/company/..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Visibility */}
              <LinkedInStyleSelect
                label="Internship Visibility"
                value={formData.visibility}
                onChange={(val) => handleChange('visibility', val)}
                options={visibilityOptions}
              />

              {/* Company Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description
                </label>
                <textarea
                  value={formData.companyDescription}
                  onChange={(e) => handleChange('companyDescription', e.target.value)}
                  placeholder="Brief background about your company"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                  {loading ? 'Publishing...' : 'Publish Internship'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInternship;

