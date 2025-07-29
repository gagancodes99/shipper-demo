import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * RegisterScreen - User registration screen
 * 
 * Features:
 * - Multi-step registration form
 * - Personal and business information
 * - Form validation
 * - Error handling
 */
const RegisterScreen = ({ onBack, onLogin }) => {
  const { register } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Business Information (optional)
    businessName: '',
    abn: '',
    businessAddress: '',
    businessPhone: '',
    
    // Terms
    acceptTerms: false,
    acceptMarketing: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    // Business information is optional, but if ABN is provided, business name should be too
    if (formData.abn && !formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required when ABN is provided';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const success = await register(formData);
      
      if (!success) {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
      // If successful, the AuthContext will handle navigation
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBack}
          className="text-white/80 hover:text-white flex items-center gap-2"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/80">
              {currentStep === 1 ? 'Let\'s start with your personal information' : 'Business details (optional)'}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-4">
                {errors.general}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
                        errors.firstName ? 'border-red-500/50' : 'border-white/20'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-200 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
                        errors.lastName ? 'border-red-500/50' : 'border-white/20'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-200 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
                      errors.email ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-200 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
                      errors.phone ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="+61 400 123 456"
                  />
                  {errors.phone && (
                    <p className="text-red-200 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
                      errors.password ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="At least 6 characters"
                  />
                  {errors.password && (
                    <p className="text-red-200 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
                      errors.confirmPassword ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="Repeat your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-200 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className={`w-full p-3 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
                      errors.businessName ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="Your Business Name"
                  />
                  {errors.businessName && (
                    <p className="text-red-200 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    ABN (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.abn}
                    onChange={(e) => handleInputChange('abn', e.target.value)}
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30"
                    placeholder="12345678901"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Business Address (Optional)
                  </label>
                  <textarea
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30"
                    rows="2"
                    placeholder="Business address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Business Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30"
                    placeholder="+61 2 1234 5678"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-white/80 text-sm">
                      I agree to the{' '}
                      <button type="button" className="text-white underline hover:no-underline">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-white underline hover:no-underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-red-200 text-sm">{errors.acceptTerms}</p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptMarketing}
                      onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-white/80 text-sm">
                      I'd like to receive updates about new features and services (optional)
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-white/80">
              Already have an account?{' '}
              <button
                onClick={onLogin}
                className="text-white font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-white/40 text-xs">
          Join thousands of businesses using Phoenix Prime
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;