import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft,
  Box,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Lock,
  Check,
  Loader2
} from 'lucide-react';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    businessType: 'E-commerce Store',
    businessAddress: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
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
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
    else navigate('/welcome');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setErrors({});

    try {
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
      if (!success) setErrors({ general: 'Registration failed. Please try again.' });
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Box className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Phoenix Prime</span>
        </div>
        
        <div className="w-6"></div>
      </div>

      {/* Step Indicator */}
      <div className="px-6 py-6 bg-white">
        <div className="flex items-center justify-center space-x-6">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
              currentStep >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}>
              {currentStep > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            {/* <span className="text-xs mt-1">Personal</span> */}
          </div>
          
          <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'} transition-colors`}></div>
          
          <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
              currentStep >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}>
              {currentStep > 2 ? <Check className="h-5 w-5" /> : '2'}
            </div>
            {/* <span className="text-xs mt-1">Business</span> */}
          </div>
          
          <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'} transition-colors`}></div>
          
          <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
              currentStep >= 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}>
              3
            </div>
            {/* <span className="text-xs mt-1">Security</span> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-12">
        <div className="w-full mx-auto">
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Personal Information</h1>
                <p className="text-gray-500">Let's start with your basic details</p>
              </div>

              <div className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm mb-4">
                    {errors.general}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.fullName ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-2 ml-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.email ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.phone ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-2 ml-1">{errors.phone}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-md mt-8"
                >
                  Continue
                </button>

                <div className="text-center mt-8">
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
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Business Information</h1>
                <p className="text-gray-500">Tell us about your business</p>
              </div>

              <div className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm mb-4">
                    {errors.general}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Company Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.companyName ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter your company name"
                    />
                  </div>
                  {errors.companyName && <p className="text-red-500 text-xs mt-2 ml-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Business Type *</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300"
                  >
                    <option value="E-commerce Store">E-commerce Store</option>
                    <option value="Retail Business">Retail Business</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics Company">Logistics Company</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Business Address *</label>
                  <div className="relative">
                    <div className="absolute top-3 left-4 flex items-start pointer-events-none">
                      <MapPin className="text-gray-500 h-5 w-5" />
                    </div>
                    <textarea
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.businessAddress ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      rows="3"
                      placeholder="Enter your complete business address"
                    />
                  </div>
                  {errors.businessAddress && <p className="text-red-500 text-xs mt-2 ml-1">{errors.businessAddress}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-md mt-8"
                >
                  Continue
                </button>

                <div className="text-center mt-8">
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
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Security & Preferences</h1>
                <p className="text-gray-500">Set up your account security</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm mb-4">
                    {errors.general}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.password ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Create a strong password"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Confirm Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-2 ml-1">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                    <span className="text-gray-600 text-sm">
                      I agree to the{' '}
                      <button type="button" className="text-blue-600 font-medium hover:underline">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-blue-600 font-medium hover:underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-red-500 text-sm ml-8">{errors.acceptTerms}</p>}

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.acceptMarketing}
                      onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                      className="mt-1 w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                    <span className="text-gray-600 text-sm">
                      I'd like to receive promotional emails and updates
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center mt-8">
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