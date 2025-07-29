import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages authentication state across the application
 * 
 * Features:
 * - User authentication state management
 * - Login/logout functionality
 * - Token management with localStorage
 * - Loading states during auth operations
 * - Mock authentication for development
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          // In a real app, you would validate the token with your backend
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Mock login function - replace with actual API call
   */
  const login = async (credentials) => {
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - replace with actual API call
      const mockUser = {
        id: '1',
        name: credentials.name || 'John Doe',
        email: credentials.email || 'john@example.com',
        phone: credentials.phone || '+1234567890',
        avatar: null
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function - mock implementation
   */
  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: null
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates) => {
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updates };
      
      // Update localStorage
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Phone verification function
   */
  const verifyPhone = async (phoneNumber, verificationCode) => {
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification logic - in real app, verify with backend
      if (verificationCode === '123456') {
        const updatedUser = { ...user, phone: phoneNumber, phoneVerified: true };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid verification code' };
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      return { success: false, error: 'Verification failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    verifyPhone
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;