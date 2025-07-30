import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginScreen - User authentication screen
 * 
 * Features:
 * - Email/password login form
 * - Remember me functionality
 * - Social login options (mock)
 * - Forgot password link
 * - Navigation to registration
 * - Redirect to intended destination after login
 */

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  // Get the intended destination (if redirected from protected route)
  const from = location.state?.from?.pathname || '/dashboard';

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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await login(formData);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setErrors({ general: 'Login failed. Please try again.' });
    }
  };

  const handleSocialLogin = (provider) => {
    // Mock social login - replace with actual implementation
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
      <div className="px-4 py-8 flex flex-col justify-center min-h-screen max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Phoenix Prime Logo */}
          <div className="mb-6">
            <svg width="80" height="40" viewBox="0 0 200 100" className="mx-auto mb-4">
              {/* Orange arrow part */}
              <path d="M20 30 L80 30 L100 50 L80 70 L20 70 L40 50 Z" fill="#FF6B35"/>
              <path d="M30 40 L70 40 L80 50 L70 60 L30 60 L40 50 Z" fill="#FF6B35"/>
              <path d="M40 45 L65 45 L70 50 L65 55 L40 55 L45 50 Z" fill="#FF6B35"/>
              {/* Dark blue arrow part */}
              <path d="M90 30 L150 30 L170 50 L150 70 L90 70 L110 50 Z" fill="#2C3E50"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to your Phoenix Prime account</p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

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
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => console.log('Navigate to forgot password')}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Back to Welcome */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              ← Back to Welcome
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;