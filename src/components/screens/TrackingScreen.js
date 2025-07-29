import React, { useState, useEffect } from 'react';

/**
 * TrackingScreen Component
 * Real-time tracking interface with timeline, status updates, and distance stats
 * Supports both standalone use and integration with job details tabbed interface
 */
const TrackingScreen = ({ 
  trackingData = null, 
  onTabChange = null, 
  activeTab = 'tracking',
  showTabs = true,
  onBack = null 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for real-time feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Default tracking data - can be overridden by props
  const defaultTrackingData = {
    currentStatus: {
      time: '2:30 PM',
      message: 'Package is out for destination',
      isLive: true
    },
    timeline: [
      {
        id: 1,
        title: 'Driver assigned',
        time: '8:01 AM',
        status: 'completed',
        description: 'Driver Mike Johnson assigned to your delivery'
      },
      {
        id: 2,
        title: 'Package picked up',
        time: '9:11 AM',
        status: 'completed',
        description: 'Package collected from pickup location'
      },
      {
        id: 3,
        title: 'In transit - Highway 101',
        time: '9:43 AM',
        status: 'completed',
        description: 'Package is on route via Highway 101'
      },
      {
        id: 4,
        title: 'Stopped for fuel',
        time: '11:32 AM',
        status: 'completed',
        description: 'Brief stop for vehicle refueling'
      },
      {
        id: 5,
        title: 'Estimated delivery time',
        time: '2:30 PM',
        status: 'current',
        description: 'Package arriving at destination'
      }
    ],
    stats: {
      totalDistance: '24.8 miles',
      estimatedDuration: '45 min',
      progress: 85
    }
  };

  const data = trackingData || defaultTrackingData;

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
      {['Overview', 'Tracking', 'Documents'].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange && onTabChange(tab.toLowerCase())}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.toLowerCase()
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  // Timeline item component
  const TimelineItem = ({ item, isLast }) => {
    const isCompleted = item.status === 'completed';
    const isCurrent = item.status === 'current';

    return (
      <div className="flex items-start relative">
        {/* Timeline line */}
        {!isLast && (
          <div className="absolute left-3 top-8 w-0.5 h-16 bg-gray-200"></div>
        )}
        
        {/* Status dot */}
        <div className="relative z-10 flex-shrink-0">
          <div
            className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
              isCompleted
                ? 'bg-green-500'
                : isCurrent
                ? 'bg-blue-500 animate-pulse'
                : 'bg-gray-300'
            }`}
          >
            {isCompleted && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="ml-4 pb-8 flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-semibold ${
              isCurrent ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {item.title}
            </h4>
            <span className={`text-sm font-medium ${
              isCurrent ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {item.time}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {item.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - only show if used as standalone */}
      {onBack && (
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Package Tracking</h1>
              <div className="w-10 h-10"></div> {/* Spacer */}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-4">
        {/* Tab Navigation */}
        {showTabs && <TabNavigation />}

        {/* Real-time Tracking Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Real-time Tracking</h2>
            {data.currentStatus.isLive && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-green-600">Live tracking active</span>
              </div>
            )}
          </div>

          {/* Current Status */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Current Status</p>
                <p className="text-lg font-bold text-blue-900">{data.currentStatus.message}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{data.currentStatus.time}</p>
                <p className="text-sm text-blue-500">Updated now</p>
              </div>
            </div>
          </div>

          {/* Distance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalDistance}</p>
              <p className="text-sm text-gray-600">Total Distance</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{data.stats.estimatedDuration}</p>
              <p className="text-sm text-gray-600">Est. Duration</p>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Timeline</h3>
          
          <div className="space-y-0">
            {data.timeline.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                isLast={index === data.timeline.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{data.stats.progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${data.stats.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Live Updates Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              Refresh
            </button>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <div>
                <p className="text-sm font-medium text-green-800">GPS tracking active</p>
                <p className="text-xs text-green-600">Last updated: {currentTime.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Driver Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Driver
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingScreen;