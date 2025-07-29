/**
 * Authentication Screens Index
 * 
 * Centralized exports for all authentication-related screen components
 * in Phoenix Prime Shipper. This provides clean imports throughout the app.
 */

// Authentication screens
export { default as WelcomeScreen, WelcomeScreen } from './WelcomeScreen';
export { default as LoginScreen, LoginScreen } from './LoginScreen';
export { default as RegistrationSteps, RegistrationSteps } from './RegistrationSteps';
export { default as PhoneVerificationScreen, PhoneVerificationScreen } from './PhoneVerificationScreen';

// Re-export authentication context for convenience
export { useAuth, AuthProvider, AuthContext } from '../../../context/AuthContext';