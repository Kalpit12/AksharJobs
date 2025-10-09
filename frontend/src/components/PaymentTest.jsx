import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentTest = () => {
  const navigate = useNavigate();
  
  // Test plans with actual Pesapal product codes
  const testPlans = [
    {
      id: 'starter-rec',
      planName: 'Starter',
      amount: '3,500',
      currency: 'KSH',
      userRole: 'recruiter',
      pesapalProductCode: '12f90718-bd75-4f58-99ca-2cd1952163cd'
    },
    {
      id: 'professional-rec',
      planName: 'Professional',
      amount: '7,500',
      currency: 'KSH',
      userRole: 'recruiter',
      pesapalProductCode: '355a90e6-e207-4657-822b-407db98d152f'
    },
    {
      id: 'enterprise-rec',
      planName: 'Enterprise',
      amount: '15,000',
      currency: 'KSH',
      userRole: 'recruiter',
      pesapalProductCode: 'cbaef385-750f-44d6-9de1-2e6e802edb8d'
    },
    {
      id: 'starter-js',
      planName: 'Starter',
      amount: '1,500',
      currency: 'KSH',
      userRole: 'jobseeker',
      pesapalProductCode: '1440504c-a199-4dab-8fc5-6a609e6c4358'
    },
    {
      id: 'professional-js',
      planName: 'Professional',
      amount: '3,500',
      currency: 'KSH',
      userRole: 'jobseeker',
      pesapalProductCode: '1440504c-a199-4dab-8fc5-6a609e6c4358'
    },
    {
      id: 'premium-js',
      planName: 'Premium',
      amount: '5,500',
      currency: 'KSH',
      userRole: 'jobseeker',
      pesapalProductCode: '1440504c-a199-4dab-8fc5-6a609e6c4358'
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState(testPlans[0]);

  const handleTestPayment = (plan) => {
    // Direct redirect to Pesapal (same as the actual flow)
    if (plan.pesapalProductCode) {
      const url = `https://store.pesapal.com/shop/cptjqn-rocketmatch?productCode=${plan.pesapalProductCode}`;
      window.location.href = url;
    } else {
      window.location.href = 'https://store.pesapal.com/aksharjobs';
    }
  };

  const handleDirectPesapal = (plan) => {
    if (plan.pesapalProductCode) {
      const url = `https://store.pesapal.com/shop/cptjqn-rocketmatch?productCode=${plan.pesapalProductCode}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h2>🚀 Pesapal Payment Integration Test</h2>
      <p>Test the complete payment flow with all your RocketMatch plans:</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem'
      }}>
        {testPlans.map((plan, index) => (
          <div key={plan.id} style={{ 
            background: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>
              {plan.planName} ({plan.userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'})
            </h3>
            <p><strong>Amount:</strong> {plan.currency} {plan.amount}/month</p>
            <p><strong>Product Code:</strong> {plan.pesapalProductCode}</p>
            
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginTop: '1rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => handleTestPayment(plan)}
                style={{
                  padding: '0.8rem 1.2rem',
                  backgroundColor: '#2c5aa0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Test Payment
              </button>
              
              <button 
                onClick={() => handleDirectPesapal(plan)}
                style={{
                  padding: '0.8rem 1.2rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  flex: 1
                }}
              >
                Direct Pesapal
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem',
        backgroundColor: '#e7f3ff',
        borderRadius: '10px',
        textAlign: 'left'
      }}>
        <h4>🧪 Test Instructions:</h4>
        <ol>
          <li><strong>Test Payment:</strong> Click to redirect directly to the Pesapal product page</li>
          <li><strong>Direct Pesapal:</strong> Opens the specific Pesapal product page in a new tab</li>
          <li>Verify that each plan redirects to the correct Pesapal product URL</li>
          <li>Check that the correct amount and plan details are shown on Pesapal</li>
          <li>Test that free plans show the alert instead of redirecting</li>
        </ol>
        
        <h4>🔗 Pesapal Product URLs:</h4>
        <ul style={{ fontSize: '0.9rem', color: '#666' }}>
          <li>Recruiter Starter: <code>12f90718-bd75-4f58-99ca-2cd1952163cd</code></li>
          <li>Recruiter Professional: <code>355a90e6-e207-4657-822b-407db98d152f</code></li>
          <li>Recruiter Enterprise: <code>cbaef385-750f-44d6-9de1-2e6e802edb8d</code></li>
          <li>Job Seeker Plans: <code>1440504c-a199-4dab-8fc5-6a609e6c4358</code></li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentTest;
