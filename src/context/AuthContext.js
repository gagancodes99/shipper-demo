import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages user authentication state and user data
 * 
 * Features:
 * - User authentication state management
 * - User profile data storage
 * - Business information management
 * - Login/logout functionality
 * - Local storage persistence
 */

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication data on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('phoenixPrime_user');
        const storedAuth = localStorage.getItem('phoenixPrime_isAuthenticated');
        
        if (storedUser && storedAuth === 'true') {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear corrupted data
        localStorage.removeItem('phoenixPrime_user');
        localStorage.removeItem('phoenixPrime_isAuthenticated');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login function - authenticates user and stores data
   * @param {Object} userData - User data from login/registration
   * @returns {Promise<boolean>} - Success status
   */
  const login = async (userData) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate authentication
      
      const userWithDefaults = {
        id: userData.id || Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        businessName: userData.businessName || '',
        abn: userData.abn || '',
        businessAddress: userData.businessAddress || '',
        businessPhone: userData.businessPhone || '',
        avatar: userData.avatar || null,
        createdAt: userData.createdAt || new Date().toISOString(),
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false,
          ...userData.preferences
        }
      };

      setUser(userWithDefaults);
      setIsAuthenticated(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('phoenixPrime_user', JSON.stringify(userWithDefaults));
      localStorage.setItem('phoenixPrime_isAuthenticated', 'true');
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Register function - creates new user account
   * @param {Object} registrationData - User registration data
   * @returns {Promise<boolean>} - Success status
   */
  const register = async (registrationData) => {
    try {
      // In a real app, this would make an API call to create the user
      const newUser = {
        id: Date.now(),
        email: registrationData.email,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        phone: registrationData.phone,
        businessName: registrationData.businessName,
        abn: registrationData.abn,
        businessAddress: registrationData.businessAddress,
        businessPhone: registrationData.businessPhone,
        avatar: null,
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false
        }
      };

      return await login(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  /**
   * Update user profile information
   * @param {Object} updates - Profile updates
   * @returns {Promise<boolean>} - Success status
   */
  const updateProfile = async (updates) => {
    try {
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      setUser(updatedUser);
      localStorage.setItem('phoenixPrime_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  /**
   * Update user preferences
   * @param {Object} newPreferences - Updated preferences
   * @returns {Promise<boolean>} - Success status
   */
  const updatePreferences = async (newPreferences) => {
    try {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...newPreferences
        },
        updatedAt: new Date().toISOString()
      };

      setUser(updatedUser);
      localStorage.setItem('phoenixPrime_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Preferences update error:', error);
      return false;
    }
  };

  /**
   * Logout function - clears user data and authentication state
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('phoenixPrime_user');
    localStorage.removeItem('phoenixPrime_isAuthenticated');
  };

  /**
   * Get user display name
   * @returns {string} - User's display name
   */
  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.businessName) {
      return user.businessName;
    }
    
    return `${user.firstName} ${user.lastName}`.trim();
  };

  /**
   * Check if user has business information
   * @returns {boolean} - Whether user has business details
   */
  const hasBusiness = () => {
    return user && (user.businessName || user.abn);
  };

  const contextValue = {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    
    // Utilities
    getUserDisplayName,
    hasBusiness
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Phoenix Prime...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;