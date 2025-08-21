import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSave, 
  faTimes,
  faCheck,
  faStar,
  faCrown
} from '@fortawesome/free-solid-svg-icons';
import '../styles/PlanManagement.css';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly',
    description: '',
    features: [],
    limits: {
      jobPostings: 0,
      resumeViews: 0,
      matchScoreViews: 0,
      candidateSearches: 0,
      interviewSlots: 0
    },
    isPopular: false,
    isEnterprise: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/plans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
        console.log('Fetched plans:', data.plans);
      } else {
        console.error('Failed to fetch plans:', response.status);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPlan)
      });
      
      if (response.ok) {
        await fetchPlans();
        setShowAddForm(false);
        setNewPlan({
          name: '',
          price: '',
          billingCycle: 'monthly',
          description: '',
          features: [],
          limits: {
            jobPostings: 0,
            resumeViews: 0,
            matchScoreViews: 0,
            candidateSearches: 0,
            interviewSlots: 0
          },
          isPopular: false,
          isEnterprise: false
        });
        alert('Plan created successfully!');
      } else {
        throw new Error('Failed to create plan');
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePlan = async (planId) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/api/admin/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingPlan)
      });
      
      if (response.ok) {
        await fetchPlans();
        setEditingPlan(null);
        alert('Plan updated successfully!');
      } else {
        throw new Error('Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchPlans();
        alert('Plan deleted successfully!');
      } else {
        throw new Error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    }
  };

  const addFeature = () => {
    setNewPlan(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="loading">Loading Plans...</div>;
  }

  return (
    <div className="plan-management">
      <div className="plan-header">
        <h2>Subscription Plan Management</h2>
        <p>Create, edit, and manage pricing plans for your platform</p>
        <button 
          className="add-plan-btn"
          onClick={() => setShowAddForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add New Plan
        </button>
      </div>

      {showAddForm && (
        <div className="add-plan-form">
          <h3>Create New Plan</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Plan Name</label>
              <input
                type="text"
                value={newPlan.name}
                onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Basic, Premium, Enterprise"
              />
            </div>
            
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Billing Cycle</label>
              <select
                value={newPlan.billingCycle}
                onChange={(e) => setNewPlan(prev => ({ ...prev, billingCycle: e.target.value }))}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newPlan.description}
                onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this plan offers..."
                rows="3"
              />
            </div>
          </div>

          <div className="limits-section">
            <h4>Usage Limits</h4>
            <div className="limits-grid">
              <div className="limit-input">
                <label>Job Postings</label>
                <input
                  type="number"
                  value={newPlan.limits.jobPostings}
                  onChange={(e) => setNewPlan(prev => ({
                    ...prev,
                    limits: { ...prev.limits, jobPostings: parseInt(e.target.value) || 0 }
                  }))}
                  min="0"
                />
              </div>
              
              <div className="limit-input">
                <label>Resume Views</label>
                <input
                  type="number"
                  value={newPlan.limits.resumeViews}
                  onChange={(e) => setNewPlan(prev => ({
                    ...prev,
                    limits: { ...prev.limits, resumeViews: parseInt(e.target.value) || 0 }
                  }))}
                  min="0"
                />
              </div>
              
              <div className="limit-input">
                <label>Match Score Views</label>
                <input
                  type="number"
                  value={newPlan.limits.matchScoreViews}
                  onChange={(e) => setNewPlan(prev => ({
                    ...prev,
                    limits: { ...prev.limits, matchScoreViews: parseInt(e.target.value) || 0 }
                  }))}
                  min="0"
                />
              </div>
              
              <div className="limit-input">
                <label>Candidate Searches</label>
                <input
                  type="number"
                  value={newPlan.limits.candidateSearches}
                  onChange={(e) => setNewPlan(prev => ({
                    ...prev,
                    limits: { ...prev.limits, candidateSearches: parseInt(e.target.value) || 0 }
                  }))}
                  min="0"
                />
              </div>
              
              <div className="limit-input">
                <label>Interview Slots</label>
                <input
                  type="number"
                  value={newPlan.limits.interviewSlots}
                  onChange={(e) => setNewPlan(prev => ({
                    ...prev,
                    limits: { ...prev.limits, interviewSlots: parseInt(e.target.value) || 0 }
                  }))}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="features-section">
            <h4>Features</h4>
            {newPlan.features.map((feature, index) => (
              <div key={index} className="feature-input">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Enter feature description..."
                />
                <button 
                  className="remove-feature-btn"
                  onClick={() => removeFeature(index)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
            <button className="add-feature-btn" onClick={addFeature}>
              <FontAwesomeIcon icon={faPlus} />
              Add Feature
            </button>
          </div>

          <div className="plan-options">
            <label>
              <input
                type="checkbox"
                checked={newPlan.isPopular}
                onChange={(e) => setNewPlan(prev => ({ ...prev, isPopular: e.target.checked }))}
              />
              Mark as Popular Plan
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={newPlan.isEnterprise}
                onChange={(e) => setNewPlan(prev => ({ ...prev, isEnterprise: e.target.checked }))}
              />
              Enterprise Plan
            </label>
          </div>

          <div className="form-actions">
            <button 
              className="save-btn"
              onClick={handleAddPlan}
              disabled={saving || !newPlan.name || !newPlan.price}
            >
              <FontAwesomeIcon icon={faSave} />
              {saving ? 'Creating...' : 'Create Plan'}
            </button>
            
            <button 
              className="cancel-btn"
              onClick={() => setShowAddForm(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="plans-list">
        <h3>Existing Plans ({plans.length})</h3>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h4>No Plans Found</h4>
            <p>No subscription plans have been created yet. Click "Add New Plan" to create your first plan.</p>
          </div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
            <div key={plan._id} className={`plan-card ${plan.isPopular ? 'popular' : ''} ${plan.isEnterprise ? 'enterprise' : ''} ${plan.isRecommended ? 'recommended' : ''}`}>
              {plan.isPopular && (
                <div className="popular-badge">
                  <FontAwesomeIcon icon={faStar} />
                  Popular
                </div>
              )}
              
              {plan.isEnterprise && (
                <div className="enterprise-badge">
                  <FontAwesomeIcon icon={faCrown} />
                  Enterprise
                </div>
              )}
              
              {plan.isRecommended && (
                <div className="recommended-badge">
                  <FontAwesomeIcon icon={faStar} />
                  Recommended
                </div>
              )}
              
              <div className="plan-header">
                <h4>{plan.name}</h4>
                <div className="plan-price">
                  {plan.currency || '$'}{plan.price}
                  <span className="billing-cycle">/{plan.billingCycle}</span>
                </div>
                {plan.userType && (
                  <span className="plan-type-badge">{plan.userType === 'recruiter' ? '🏢 Recruiter' : '👤 Job Seeker'}</span>
                )}
              </div>
              
              <p className="plan-description">{plan.description}</p>
              
              <div className="plan-limits">
                <h5>Usage Limits</h5>
                <ul>
                  <li>Job Postings: {plan.limits.jobPostings === -1 ? 'Unlimited' : plan.limits.jobPostings}</li>
                  <li>Resume Views: {plan.limits.resumeViews === -1 ? 'Unlimited' : plan.limits.resumeViews}</li>
                  <li>Match Score Views: {plan.limits.matchScoreViews === -1 ? 'Unlimited' : plan.limits.matchScoreViews}</li>
                  <li>Candidate Searches: {plan.limits.candidateSearches === -1 ? 'Unlimited' : plan.limits.candidateSearches}</li>
                  <li>Interview Slots: {plan.limits.interviewSlots === -1 ? 'Unlimited' : plan.limits.interviewSlots}</li>
                </ul>
              </div>
              
              <div className="plan-features">
                <h5>Features</h5>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <FontAwesomeIcon icon={faCheck} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="plan-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setEditingPlan(plan)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>
                
                <button 
                  className="delete-btn"
                  onClick={() => handleDeletePlan(plan._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {editingPlan && (
        <div className="edit-plan-modal">
          <div className="modal-content">
            <h3>Edit Plan: {editingPlan.name}</h3>
            {/* Similar form structure for editing */}
            <div className="modal-actions">
              <button 
                className="save-btn"
                onClick={() => handleUpdatePlan(editingPlan._id)}
                disabled={saving}
              >
                <FontAwesomeIcon icon={faSave} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button 
                className="cancel-btn"
                onClick={() => setEditingPlan(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
