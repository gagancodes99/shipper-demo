import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * ProfileScreen - User profile management and settings
 * 
 * Features:
 * - User profile information display and editing
 * - Account settings and preferences
 * - Notification preferences
 * - App settings and logout
 * - Mobile-optimized profile interface
 */

const ProfileScreen = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  const handleSave = async () => {
    const result = await updateProfile(editData);
    if (result.success) {
      setIsEditing(false);
    } else {
      // Handle error - in real app, show toast/alert
      console.error('Profile update failed:', result.error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      action: () => console.log('Navigate to notifications')
    },
    {
      icon: '💳',
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment options',
      action: () => console.log('Navigate to payment methods')
    },
    {
      icon: '📍',
      title: 'Saved Addresses',
      subtitle: 'Manage your frequent locations',
      action: () => console.log('Navigate to addresses')
    },
    {
      icon: '📋',
      title: 'Booking History',
      subtitle: 'View all your past bookings',
      action: () => console.log('Navigate to booking history')
    },
    {
      icon: '🛡️',
      title: 'Privacy & Security',
      subtitle: 'Account security settings',
      action: () => console.log('Navigate to security')
    },
    {
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      action: () => console.log('Navigate to help')
    },
    {
      icon: '⚙️',
      title: 'App Settings',
      subtitle: 'Theme, language and preferences',
      action: () => console.log('Navigate to settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-blue-100 mt-1">
              Manage your account and settings
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="text-xl font-bold text-gray-800 w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1"
                  placeholder="Your Name"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800">{user?.name || 'User'}</h2>
              )}
              <p className="text-gray-500 text-sm mt-1">Phoenix Prime Member</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              ) : (
                <p className="text-gray-800">{user?.email || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-gray-800">{user?.phone || 'Not provided'}</p>
                  {user?.phoneVerified && (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-xs text-gray-600">Total Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">8</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">4.8</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>

        {/* App Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">About</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">App Version</span>
              <span className="text-gray-800">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Build</span>
              <span className="text-gray-800">2025.01.29</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Terms of Service</span>
              <button className="text-blue-500">View</button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Privacy Policy</span>
              <button className="text-blue-500">View</button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;