import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * RegisterScreen - User registration screen with 3-step flow
 * 
 * Features:
 * - 3-step registration process
 * - Personal information, business details, and security setup
 * - Form validation and error handling
 * - Mobile-first design matching the app's clean aesthetic
 */
const RegisterScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    
    // Business Information
    companyName: '',
    businessType: 'E-commerce Store',
    businessAddress: '',
    
    // Security & Preferences
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate('/welcome');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Transform the data to match the expected format
      const registrationData = {
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        businessName: formData.companyName,
        businessAddress: formData.businessAddress,
        acceptMarketing: formData.acceptMarketing
      };

      const success = await register(registrationData);
      
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
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800"
        >
          ←
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-semibold">📦</span>
          </div>
          <span className="font-semibold text-gray-900">Phoenix Prime</span>
        </div>
        
        <div className="w-6"></div>
      </div>

      {/* Step Indicator */}
      <div className="px-4 py-6 bg-white">
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > 2 ? '✓' : '2'}
          </div>
          <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h1>
                <p className="text-gray-600 text-sm">Let's start with your basic details</p>
              </div>

              <div className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {errors.general}
                  </div>
                )}

                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">👤</span>
                    </div>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">✉️</span>
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📞</span>
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-8"
                >
                  Continue
                </button>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h1>
                <p className="text-gray-600 text-sm">Tell us about your business</p>
              </div>

              <div className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {errors.general}
                  </div>
                )}

                {/* Company Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🏢</span>
                    </div>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.companyName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your company name"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
                  )}
                </div>

                {/* Business Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="E-commerce Store">E-commerce Store</option>
                    <option value="Retail Business">Retail Business</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics Company">Logistics Company</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Business Address Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <span className="text-gray-400">📍</span>
                    </div>
                    <textarea
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.businessAddress ? 'border-red-300' : 'border-gray-300'
                      }`}
                      rows="3"
                      placeholder="Enter your complete business address"
                    />
                  </div>
                  {errors.businessAddress && (
                    <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-8"
                >
                  Continue
                </button>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Security & Preferences */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Security & Preferences</h1>
                <p className="text-gray-600 text-sm">Set up your account security</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {errors.general}
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Marketing Checkboxes */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-gray-600 text-sm">
                      I agree to the{' '}
                      <button type="button" className="text-blue-600 underline hover:no-underline">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-blue-600 underline hover:no-underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
                  )}

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.acceptMarketing}
                      onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-gray-600 text-sm">
                      I'd like to receive promotional emails and updates about Phoenix Prime services
                    </span>
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;