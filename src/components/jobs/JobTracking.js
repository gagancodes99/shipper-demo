import React, { useState, useEffect } from 'react';
import { useJobs } from '../../context/JobsContext';

/**
 * JobTracking Component
 * Real-time job tracking with timeline and map integration
 */
const JobTracking = ({ job, onBack, onViewMap }) => {
  const { JOB_STATUS_CONFIG } = useJobs();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [estimatedArrival, setEstimatedArrival] = useState(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calculate estimated arrival time (mock)
  useEffect(() => {
    if (job.status === 'in_transit') {
      // Simulate ETA calculation
      const eta = new Date();
      eta.setMinutes(eta.getMinutes() + 45); // 45 minutes from now
      setEstimatedArrival(eta);
    }
  }, [job.status]);

  // Generate detailed tracking timeline
  const getTrackingTimeline = () => {
    const now = new Date();
    const timeline = [];

    // Job created
    timeline.push({
      id: 'created',
      title: 'Job Created',
      description: 'Your shipment request has been submitted',
      time: job.createdAt,
      completed: true,
      icon: 'document',
      color: 'blue'
    });

    // Job confirmed
    timeline.push({
      id: 'confirmed',
      title: 'Job Confirmed',
      description: 'Payment processed and booking confirmed',
      time: job.createdAt,
      completed: ['confirmed', 'assigned', 'picked_up', 'in_transit', 'delivered'].includes(job.status),
      icon: 'check',
      color: 'green'
    });

    // Driver assigned
    if (job.driver) {
      timeline.push({
        id: 'assigned',
        title: 'Driver Assigned',
        description: `${job.driver.name} has been assigned to your job`,
        time: job.createdAt,
        completed: ['assigned', 'picked_up', 'in_transit', 'delivered'].includes(job.status),
        icon: 'user',
        color: 'indigo',
        driver: job.driver
      });
    }

    // Driver en route to pickup
    if (['assigned', 'picked_up', 'in_transit', 'delivered'].includes(job.status)) {
      timeline.push({
        id: 'en_route_pickup',
        title: 'Driver En Route to Pickup',
        description: `Driver is heading to ${job.pickups[0].name}`,
        time: new Date(job.createdAt.getTime() + 30 * 60000), // 30 mins after created
        completed: ['picked_up', 'in_transit', 'delivered'].includes(job.status),
        icon: 'truck',
        color: 'orange'
      });
    }

    // Pickup completed
    if (['picked_up', 'in_transit', 'delivered'].includes(job.status)) {
      timeline.push({
        id: 'picked_up',
        title: 'Pickup Completed',
        description: `Items collected from ${job.pickups[0].name}`,
        time: new Date(job.createdAt.getTime() + 60 * 60000), // 1 hour after created
        completed: ['picked_up', 'in_transit', 'delivered'].includes(job.status),
        icon: 'package',
        color: 'purple'
      });
    }

    // In transit
    if (['in_transit', 'delivered'].includes(job.status)) {
      timeline.push({
        id: 'in_transit',
        title: 'In Transit',
        description: `Items on the way to ${job.deliveries[0].name}`,
        time: new Date(job.createdAt.getTime() + 90 * 60000), // 1.5 hours after created
        completed: ['in_transit', 'delivered'].includes(job.status),
        icon: 'location',
        color: 'blue',
        isActive: job.status === 'in_transit'
      });
    }

    // Delivered
    if (job.status === 'delivered') {
      timeline.push({
        id: 'delivered',
        title: 'Delivered Successfully',
        description: `Items delivered to ${job.deliveries[0].name}`,
        time: new Date(job.createdAt.getTime() + 120 * 60000), // 2 hours after created
        completed: true,
        icon: 'check-circle',
        color: 'green'
      });
    }

    return timeline;
  };

  const timeline = getTrackingTimeline();

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
  const formatDate = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get icon component
  const getIcon = (iconType) => {
    const iconClasses = "w-5 h-5";
    
    switch (iconType) {
      case 'document':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'check':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'user':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'truck':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'package':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
          </svg>
        );
      case 'location':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <div className="w-2 h-2 rounded-full bg-current"></div>
        );
    }
  };

  // Get color classes for timeline items
  const getColorClasses = (color, completed, isActive) => {
    if (isActive) {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: 'bg-blue-500 text-white',
        border: 'border-blue-300'
      };
    }
    
    if (completed) {
      const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'bg-blue-500 text-white', border: 'border-blue-200' },
        green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'bg-green-500 text-white', border: 'border-green-200' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'bg-indigo-500 text-white', border: 'border-indigo-200' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'bg-orange-500 text-white', border: 'border-orange-200' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'bg-purple-500 text-white', border: 'border-purple-200' }
      };
      return colors[color] || colors.blue;
    }
    
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      icon: 'bg-gray-300 text-gray-500',
      border: 'border-gray-200'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Live Tracking</h1>
            <button
              onClick={() => onViewMap && onViewMap(job)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            </button>
          </div>

          {/* Job Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">{job.id}</h2>
              <div className="text-right">
                <div className="text-sm opacity-90">Current Time</div>
                <div className="font-semibold">{formatTime(currentTime)}</div>
              </div>
            </div>
            <div className="text-sm opacity-90">
              {job.pickups[0].name} → {job.deliveries[0].name}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Current Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${JOB_STATUS_CONFIG[job.status].color}`}>
              <div className={`w-2 h-2 rounded-full ${JOB_STATUS_CONFIG[job.status].dotColor} mr-2`}></div>
              {JOB_STATUS_CONFIG[job.status].label}
            </div>
          </div>

          {job.status === 'in_transit' && estimatedArrival && (
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-blue-900">Estimated Arrival</div>
                  <div className="text-xs text-blue-600">At {job.deliveries[0].name}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-900">
                    {formatTime(estimatedArrival)}
                  </div>
                  <div className="text-xs text-blue-600">
                    {formatDate(estimatedArrival)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {job.driver && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{job.driver.name}</div>
                    <div className="text-sm text-gray-600">{job.driver.vehicle}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `tel:${job.driver.phone}`}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.location.href = `sms:${job.driver.phone}`}
                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Map Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Live Location</h3>
            <button
              onClick={() => onViewMap && onViewMap(job)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Full Map
            </button>
          </div>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
              <p className="text-gray-500 text-sm">Interactive map will be displayed here</p>
              <p className="text-gray-400 text-xs">Tap "View Full Map" for detailed tracking</p>
            </div>
          </div>
        </div>

        {/* Detailed Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
          
          <div className="space-y-4">
            {timeline.map((item, index) => {
              const colorClasses = getColorClasses(item.color, item.completed, item.isActive);
              
              return (
                <div key={item.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses.icon} ${
                      item.isActive ? 'animate-pulse' : ''
                    }`}>
                      {getIcon(item.icon)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`p-3 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${colorClasses.text}`}>
                          {item.title}
                          {item.isActive && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Live
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(item.time)}
                        </span>
                      </div>
                      <p className={`text-sm ${item.completed ? 'text-gray-600' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                      
                      {item.driver && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>{item.driver.name} • {item.driver.vehicle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Instructions (if in transit) */}
        {job.status === 'in_transit' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Instructions</h3>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800">Please be available</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      The driver will arrive soon. Please ensure someone is available to receive the delivery.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Delivery Address:</strong> {job.deliveries[0].address}</p>
                <p><strong>Contact Person:</strong> {job.deliveries[0].contactName}</p>
                <p><strong>Contact Phone:</strong> {job.deliveries[0].contactPhone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTracking;