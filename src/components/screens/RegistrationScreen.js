import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * RegistrationScreen - User registration screen
 * 
 * Features:
 * - User registration form with validation
 * - Terms and conditions acceptance
 * - Email/password registration
 * - Social registration options (mock)
 * - Navigation to login
 * - Automatic redirect after successful registration
 */

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
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
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await register({
      name: formData.name.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    
    if (result.success) {
      // Navigate to phone verification
      navigate('/verify-phone', { 
        state: { 
          phone: formData.phone,
          fromRegistration: true 
        }
      });
    } else {
      setErrors({ general: result.error || 'Registration failed. Please try again.' });
    }
  };

  const handleSocialRegister = (provider) => {
    // Mock social registration - replace with actual implementation
    console.log(`Register with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 max-w-sm mx-auto">
      <div className="px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚚</div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Phoenix Prime</h1>
          <p className="text-blue-100">Create your account to get started</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Must contain uppercase, lowercase, and number (8+ characters)
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Acceptance */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 ${
                    errors.acceptTerms ? 'border-red-300' : ''
                  }`}
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-800 underline">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-800 underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or sign up with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Registration */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialRegister('google')}
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <span className="text-xl mr-2">🟦</span>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button
              onClick={() => handleSocialRegister('facebook')}
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <span className="text-xl mr-2">📘</span>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-blue-100">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white font-semibold underline hover:text-blue-200"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Back to Welcome */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-200 text-sm hover:text-white"
          >
            ← Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;