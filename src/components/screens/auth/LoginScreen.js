import React, { useState } from 'react';
import Header from '../../ui/Header';

/**
 * LoginScreen component - User authentication interface
 * 
 * Provides email/phone and password login functionality with form validation,
 * loading states, and forgot password option. Designed to match Phoenix Prime
 * Shipper's mobile-first design patterns and gradient theme.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {Function} props.onLogin - Callback when login is attempted with credentials
 * @param {Function} props.onForgotPassword - Callback when forgot password is clicked
 * @param {Function} props.onCreateAccount - Callback when create account link is clicked
 * @param {boolean} [props.isLoading=false] - Loading state for login
 * @param {string} [props.error] - Error message to display
 * @returns {JSX.Element} Rendered login screen component
 */
const LoginScreen = ({ 
  onBack, 
  onLogin, 
  onForgotPassword, 
  onCreateAccount,
  isLoading = false,
  error 
}) => {
  // Form data state
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Show/hide password state
  const [showPassword, setShowPassword] = useState(false);

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
   * Validate form fields
   * 
   * @returns {boolean} True if validation passes
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      // Check if it's an email or phone number
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrPhone);
      const isPhone = /^\+91[6-9]\d{9}$/.test(formData.emailOrPhone);
      
      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone = 'Please enter a valid email or phone number (+91xxxxxxxxxx)';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await onLogin(formData.emailOrPhone.trim(), formData.password);
  };

  /**
   * Format input as phone number if it looks like one
   */
  const formatInput = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If it starts with 91 and has more than 11 digits, treat as phone
    if (digits.startsWith('91') && digits.length <= 12) {
      return `+91${digits.slice(2)}`;
    }
    
    // If it's all digits and starts with 6-9, treat as phone
    if (/^[6-9]\d*$/.test(digits) && digits.length <= 10) {
      return `+91${digits}`;
    }
    
    // Otherwise return as-is (for email)
    return value;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Sign In" onBack={onBack} />
      
      <div className="p-6">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Welcome Back</h2>
              <p className="text-sm opacity-90">Sign in to continue to Phoenix Prime</p>
            </div>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Global error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={formData.emailOrPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only format if it looks like a phone number
                  const formatted = /^\d/.test(value) ? formatInput(value) : value;
                  handleInputChange('emailOrPhone', formatted);
                }}
                placeholder="Enter email or +91xxxxxxxxxx"
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                  errors.emailOrPhone
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                } focus:ring-2 focus:outline-none`}
                disabled={isLoading}
              />
              {errors.emailOrPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                    errors.password
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  } focus:ring-2 focus:outline-none`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:underline"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Create account section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <button
              onClick={onCreateAccount}
              className="text-blue-600 font-semibold hover:underline"
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Additional help */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-3 mt-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 mb-1">Need Help?</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• You can sign in with your email or phone number</li>
                <li>• Use the same credentials from your account creation</li>
                <li>• Contact support if you're having trouble accessing your account</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LoginScreen };
export default LoginScreen;