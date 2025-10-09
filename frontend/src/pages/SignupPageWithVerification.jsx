import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../config/api";
import InputField from "../components/InputField";
import Button from "../components/Button";
import PhoneVerification from "../components/PhoneVerification";
import EmailVerification from "../components/EmailVerification";
import "../styles/Signup.css";

const SignupPageWithVerification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    phone: { verified: false, value: "" },
    email: { verified: false, value: "" }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneVerification = (verifiedPhone) => {
    setPhoneVerified(true);
    setVerificationStatus(prev => ({
      ...prev,
      phone: { verified: true, value: verifiedPhone }
    }));
    setShowPhoneVerification(false);
  };

  const handleEmailVerification = (verifiedEmail) => {
    setEmailVerified(true);
    setVerificationStatus(prev => ({
      ...prev,
      email: { verified: true, value: verifiedEmail }
    }));
    setShowEmailVerification(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!phoneVerified) {
      setErrors({ phone: "Please verify your phone number first" });
      return;
    }

    if (!emailVerified) {
      setErrors({ email: "Please verify your email address first" });
      return;
    }

    setIsLoading(true);

    try {
              const response = await axios.post(buildApiUrl("/api/signup"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: verificationStatus.email.value,
        phone: verificationStatus.phone.value,
        password: formData.password,
      });

      if (response.status === 201) {
        // Redirect to login page or dashboard
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || "Signup failed";
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>🚀 Join RocketJobs</h1>
          <p>Create your account and start matching with opportunities</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <InputField
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <InputField
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-group">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter your email address"
            />
            <div className="verification-status">
              {emailVerified ? (
                <span className="verified-badge">✅ Email Verified</span>
              ) : (
                <button
                  type="button"
                  className="verify-email-btn"
                  onClick={() => setShowEmailVerification(true)}
                >
                  📧 Verify Email
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <InputField
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="Enter your phone number"
            />
            <div className="verification-status">
              {phoneVerified ? (
                <span className="verified-badge">✅ Phone Verified</span>
              ) : (
                <button
                  type="button"
                  className="verify-phone-btn"
                  onClick={() => setShowPhoneVerification(true)}
                >
                  📱 Verify Phone
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Create a strong password"
            />
          </div>

          <div className="form-group">
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
            />
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <Button
            type="submit"
            className="signup-button"
            disabled={isLoading || !phoneVerified || !emailVerified}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerification
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        onVerificationComplete={handlePhoneVerification}
      />

      {/* Email Verification Modal */}
      <EmailVerification
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        onVerificationComplete={handleEmailVerification}
      />
    </div>
  );
};

export default SignupPageWithVerification;
