import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { 
  WelcomeScreen, 
  LoginScreen, 
  RegistrationSteps, 
  PhoneVerificationScreen 
} from '../screens/auth';

/**
 * AuthTest component - Test component to verify all auth components compile correctly
 * 
 * This component imports and renders all authentication components to ensure
 * there are no compilation errors or missing dependencies.
 */
const AuthTest = () => {
  const mockProps = {
    onBack: () => console.log('Back clicked'),
    onSignIn: () => console.log('Sign in clicked'),
    onGetStarted: () => console.log('Get started clicked'),
    onLogin: async () => console.log('Login attempted'),
    onComplete: async () => console.log('Registration completed'),
    onVerify: async () => console.log('OTP verification attempted'),
    onResendOTP: async () => console.log('OTP resend requested'),
    onForgotPassword: () => console.log('Forgot password clicked'),
    onCreateAccount: () => console.log('Create account clicked'),
    phoneNumber: '+919876543210',
    isLoading: false,
    error: null,
  };

  return (
    <AuthProvider>
      <div className="space-y-8 p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Authentication Components Test</h1>
          <p className="text-slate-600">All components compiled successfully!</p>
        </div>
        
        {/* Test each component in a hidden container */}
        <div style={{ display: 'none' }}>
          <WelcomeScreen {...mockProps} />
          <LoginScreen {...mockProps} />
          <RegistrationSteps {...mockProps} />
          <PhoneVerificationScreen {...mockProps} />
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-green-600 text-2xl mb-2">✓</div>
          <p className="text-green-800 font-semibold">All authentication components are ready!</p>
          <p className="text-green-700 text-sm mt-2">
            AuthContext, WelcomeScreen, LoginScreen, RegistrationSteps, and PhoneVerificationScreen
            have been successfully created and are ready for integration.
          </p>
        </div>
      </div>
    </AuthProvider>
  );
};

export default AuthTest;