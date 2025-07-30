import React, { useState } from 'react';
import Header from '../../ui/Header';
import ProgressBar from '../../ui/ProgressBar';

/**
 * RegistrationSteps component - Multi-step user registration form
 * 
 * Provides a 3-step registration process:
 * - Step 1: Personal Information (Name, Email, Phone)
 * - Step 2: Business Information (Company, GST, Address)  
 * - Step 3: Security (Password, Confirm Password)
 * 
 * Features comprehensive form validation, progress tracking, and mobile-first design
 * matching the existing Phoenix Prime Shipper app patterns.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {Function} props.onComplete - Callback when registration is completed with user data
 * @returns {JSX.Element} Rendered registration steps component
 */
const RegistrationSteps = ({ onBack, onComplete }) => {
  // Current step state (1-3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: '',
    email: '',
    phone: '',
    
    // Step 2: Business Info
    company: '',
    gst: '',
    address: '',
    
    // Step 3: Security
    password: '',
    confirmPassword: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const stepNames = ['Personal Info', 'Business Info', 'Security'];

  /**
   * Handle input field changes with real-time validation
   * 
   * @param {string} field - Field name to update
   * @param {string} value - New field value
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  /**
   * Validate current step fields
   * 
   * @param {number} step - Step number to validate
   * @returns {boolean} True if validation passes
   */
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Personal Info validation
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!formData.phone.startsWith('+91')) {
        newErrors.phone = 'Phone number must start with +91';
      } else if (!/^\+91[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid Indian mobile number';
      }
    }

    if (step === 2) {
      // Business Info validation
      if (!formData.company.trim()) {
        newErrors.company = 'Company name is required';
      } else if (formData.company.trim().length < 2) {
        newErrors.company = 'Company name must be at least 2 characters';
      }

      // GST is optional but if provided should be valid
      if (formData.gst.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) {
        newErrors.gst = 'Please enter a valid GST number';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Business address is required';
      } else if (formData.address.trim().length < 10) {
        newErrors.address = 'Please enter a complete address';
      }
    }

    if (step === 3) {
      // Security validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle next step navigation
   */
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleComplete();
      }
    }
  };

  /**
   * Handle previous step navigation
   */
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  /**
   * Handle form completion
   */
  const handleComplete = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    
    try {
      // Prepare user data for registration
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        gst: formData.gst.trim() || null,
        address: formData.address.trim(),
        password: formData.password,
      };

      await onComplete(userData);
    } catch (error) {
      console.error('Registration completion error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Format phone number as user types
   */
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If empty, return +91
    if (digits === '') return '+91';
    
    // If starts with 91, add + and format
    if (digits.startsWith('91')) {
      return `+91${digits.slice(2)}`;
    }
    
    // If doesn't start with 91, assume it's a mobile number and add +91
    return `+91${digits}`;
  };

  /**
   * Render Step 1: Personal Information
   */
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="text-sm opacity-90">Enter your basic details to get started</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.name
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.email
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
            placeholder="+91xxxxxxxxxx"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.phone
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            We'll send a verification code to this number
          </p>
        </div>
      </div>
    </div>
  );

  /**
   * Render Step 2: Business Information
   */
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Business Information</h2>
            <p className="text-sm opacity-90">Tell us about your business</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Enter your company name"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.company
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            GST Number (Optional)
          </label>
          <input
            type="text"
            value={formData.gst}
            onChange={(e) => handleInputChange('gst', e.target.value.toUpperCase())}
            placeholder="Enter GST number if applicable"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.gst
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.gst && (
            <p className="mt-1 text-sm text-red-600">{errors.gst}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Required for business accounts and invoicing
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Business Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your complete business address"
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none ${
              errors.address
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  );

  /**
   * Render Step 3: Security
   */
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Security Setup</h2>
            <p className="text-sm opacity-90">Create a secure password for your account</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.password
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.confirmPassword
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-sm mx-auto">
      <Header title="Create Account" onBack={handlePrevStep} />
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={3} 
        stepNames={stepNames} 
      />
      
      <div className="p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Action buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handlePrevStep}
            className="flex-1 bg-white text-slate-700 py-3 px-6 rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 active:scale-[0.98]"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          <button
            onClick={handleNextStep}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : currentStep === 3 ? 'Complete Registration' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { RegistrationSteps };
export default RegistrationSteps;