/**
 * Authentication Components Index
 * 
 * Centralized exports for authentication system components and utilities
 * in Phoenix Prime Shipper.
 */

// Main authentication components
export { default as AuthDemo, AuthDemo, AuthDemoWrapper } from './AuthDemo';
export { default as AuthIntegrationGuide, AuthIntegrationGuide } from './AuthIntegrationGuide';

// Re-export auth screens for convenience
export * from '../screens/auth';

// Re-export auth context for convenience
export { useAuth, AuthProvider, AuthContext } from '../../context/AuthContext';