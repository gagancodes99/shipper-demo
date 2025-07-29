import React, { useState } from 'react';
import { 
  WelcomeScreen, 
  LoginScreen, 
  RegistrationSteps, 
  PhoneVerificationScreen,
  useAuth 
} from '../screens/auth';

/**
 * AuthDemo component - Complete authentication flow demonstration
 * 
 * This component demonstrates the complete authentication system integration
 * for Phoenix Prime Shipper. It shows how to navigate between different auth
 * screens and handle the authentication flow.
 * 
 * This is intended as a reference implementation - in a real app, you would
 * integrate this with a router like React Router.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onAuthComplete - Callback when authentication is completed
 * @returns {JSX.Element} Rendered authentication demo component
 */
const AuthDemo = ({ onAuthComplete }) => {
  // Authentication context
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    phoneVerificationRequired,
    pendingUser,
    login, 
    register, 
    verifyOTP, 
    sendOTP,
    resetPassword,
    clearError 
  } = useAuth();

  // Current screen state
  const [currentScreen, setCurrentScreen] = useState('welcome');
  
  // Local loading states for specific operations
  const [localLoading, setLocalLoading] = useState({
    login: false,
    register: false,
    verify: false,
    resend: false,
  });

  // Handle screen navigation
  const handleScreenChange = (screen) => {
    clearError();
    setCurrentScreen(screen);
  };

  // Handle welcome screen actions
  const handleGetStarted = () => {
    handleScreenChange('register');
  };

  const handleSignIn = () => {
    handleScreenChange('login');
  };

  // Handle login
  const handleLogin = async (emailOrPhone, password) => {
    setLocalLoading(prev => ({ ...prev, login: true }));
    
    try {
      const success = await login(emailOrPhone, password);
      if (success) {
        onAuthComplete?.();
      }
    } finally {
      setLocalLoading(prev => ({ ...prev, login: false }));
    }
  };

  // Handle registration completion
  const handleRegistrationComplete = async (userData) => {
    setLocalLoading(prev => ({ ...prev, register: true }));
    
    try {
      const success = await register(userData);
      if (success) {
        // Registration triggers phone verification requirement
        handleScreenChange('phoneVerification');
      }
    } finally {
      setLocalLoading(prev => ({ ...prev, register: false }));
    }
  };

  // Handle OTP verification
  const handleOTPVerification = async (otp) => {
    setLocalLoading(prev => ({ ...prev, verify: true }));
    
    try {
      const success = await verifyOTP(otp);
      if (success) {
        onAuthComplete?.();
      }
    } finally {
      setLocalLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // Handle OTP resend
  const handleResendOTP = async (phoneNumber) => {
    setLocalLoading(prev => ({ ...prev, resend: true }));
    
    try {
      return await sendOTP(phoneNumber);
    } finally {
      setLocalLoading(prev => ({ ...prev, resend: false }));
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    // This would typically navigate to a password reset screen
    // For now, we'll just show an alert
    alert('Password reset functionality would be implemented here. This would typically involve sending a reset email or SMS.');
  };

  // Handle back navigation
  const handleBack = () => {
    switch (currentScreen) {
      case 'login':
      case 'register':
        handleScreenChange('welcome');
        break;
      case 'phoneVerification':
        handleScreenChange('register');
        break;
      default:
        handleScreenChange('welcome');
    }
  };

  // Auto-redirect to phone verification if required
  React.useEffect(() => {
    if (phoneVerificationRequired && currentScreen !== 'phoneVerification') {
      handleScreenChange('phoneVerification');
    }
  }, [phoneVerificationRequired, currentScreen]);

  // Auto-complete if authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      onAuthComplete?.();
    }
  }, [isAuthenticated, isLoading, onAuthComplete]);

  // Show loading spinner during initial auth check
  if (isLoading && currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render current screen
  switch (currentScreen) {
    case 'welcome':
      return (
        <WelcomeScreen
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      );

    case 'login':
      return (
        <LoginScreen
          onBack={handleBack}
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onCreateAccount={handleGetStarted}
          isLoading={localLoading.login}
          error={error}
        />
      );

    case 'register':
      return (
        <RegistrationSteps
          onBack={handleBack}
          onComplete={handleRegistrationComplete}
          isLoading={localLoading.register}
          error={error}
        />
      );

    case 'phoneVerification':
      return (
        <PhoneVerificationScreen
          phoneNumber={pendingUser?.phone || '+91xxxxxxxxxx'}
          onBack={handleBack}
          onVerify={handleOTPVerification}
          onResendOTP={handleResendOTP}
          isLoading={localLoading.verify}
          error={error}
        />
      );

    default:
      return (
        <WelcomeScreen
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      );
  }
};

/**
 * AuthDemoWrapper - Wrapper component that provides authentication context
 * 
 * This wrapper ensures the AuthDemo has access to the authentication context.
 * In a real app, the AuthProvider would typically wrap your entire app at a higher level.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onAuthComplete - Callback when authentication is completed
 * @returns {JSX.Element} Wrapped authentication demo component
 */
const AuthDemoWrapper = ({ onAuthComplete }) => {
  return (
    <AuthDemo onAuthComplete={onAuthComplete} />
  );
};

export { AuthDemo, AuthDemoWrapper };
export default AuthDemoWrapper;