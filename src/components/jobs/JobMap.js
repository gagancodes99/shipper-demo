import React, { useState, useEffect } from 'react';
import { useJobs } from '../../context/JobsContext';

/**
 * JobMap Component
 * Interactive map showing pickup/delivery locations with route visualization
 * Note: This is a mock implementation. In a real app, you would integrate with
 * Google Maps, Mapbox, or similar mapping service.
 */
const JobMap = ({ job, onBack, driverLocation = null }) => {
  const { JOB_STATUS_CONFIG } = useJobs();
  const [mapCenter, setMapCenter] = useState({ lat: -37.8136, lng: 144.9631 }); // Melbourne
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  // Mock coordinates for locations (in a real app, these would come from geocoding)
  const locationCoords = {
    pickup: { lat: -37.8136, lng: 144.9631 }, // Melbourne CBD
    delivery: { lat: -37.8235, lng: 144.9975 }, // South Melbourne
    driver: driverLocation || { lat: -37.8180, lng: 144.9700 } // Current driver position
  };

  // Format time for display
  const formatTime = (timeString) => {
    return timeString || 'TBD';
  };

  // Calculate distance (mock calculation)
  const calculateDistance = (coord1, coord2) => {
    // Mock distance calculation
    return '12.5 km';
  };

  // Calculate ETA (mock calculation)
  const calculateETA = () => {
    if (job.status === 'in_transit') {
      return '15 mins';
    } else if (job.status === 'assigned' || job.status === 'en_route_pickup') {
      return '25 mins to pickup';
    }
    return 'TBD';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            <h1 className="text-lg font-bold text-gray-900">Route Map</h1>
            <button
              onClick={() => setShowDirections(!showDirections)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100">
        {/* Mock Map Interface */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            <p className="text-gray-600 font-medium">Interactive Map</p>
            <p className="text-gray-400 text-sm">Google Maps/Mapbox integration</p>
          </div>
        </div>

        {/* Mock Location Markers */}
        <div className="absolute top-4 left-4">
          <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mt-1 text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded shadow">
            Pickup
          </div>
        </div>

        <div className="absolute bottom-4 right-4">
          <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mt-1 text-xs font-medium text-green-700 bg-white px-2 py-1 rounded shadow">
            Delivery
          </div>
        </div>

        {/* Driver Location (if available) */}
        {job.driver && (job.status === 'assigned' || job.status === 'picked_up' || job.status === 'in_transit') && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-purple-500 text-white p-2 rounded-full shadow-lg animate-pulse">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mt-1 text-xs font-medium text-purple-700 bg-white px-2 py-1 rounded shadow whitespace-nowrap">
              {job.driver.name}
            </div>
          </div>
        )}

        {/* Mock Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0.8}} />
              <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 0.8}} />
            </linearGradient>
          </defs>
          <path
            d="M 50 50 Q 150 100 250 200"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{calculateDistance(locationCoords.pickup, locationCoords.delivery)}</div>
            <div className="text-xs text-gray-500">Total Distance</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{calculateETA()}</div>
            <div className="text-xs text-gray-500">ETA</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${JOB_STATUS_CONFIG[job.status].color.split(' ')[1]}`}>
              {JOB_STATUS_CONFIG[job.status].label}
            </div>
            <div className="text-xs text-gray-500">Status</div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="px-4 py-4 space-y-4">
        {/* Pickup Locations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Pickup Location{job.pickups.length > 1 ? 's' : ''}
              </h3>
              <button
                onClick={() => setSelectedLocation(selectedLocation === 'pickup' ? null : 'pickup')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {selectedLocation === 'pickup' ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {job.pickups.map((pickup, index) => (
              <div key={index} className={`${index > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{pickup.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{pickup.address}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Scheduled: {formatTime(pickup.scheduledTime)}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => window.location.href = `tel:${pickup.contactPhone}`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        // Open directions in default map app
                        const address = encodeURIComponent(pickup.address);
                        window.location.href = `https://maps.google.com/?q=${address}`;
                      }}
                      className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {selectedLocation === 'pickup' && (
                  <div className="mt-3 bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-900">
                      <p><strong>Contact:</strong> {pickup.contactName}</p>
                      <p><strong>Phone:</strong> {pickup.contactPhone}</p>
                      <p><strong>Notes:</strong> Please call upon arrival</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Locations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Delivery Location{job.deliveries.length > 1 ? 's' : ''}
              </h3>
              <button
                onClick={() => setSelectedLocation(selectedLocation === 'delivery' ? null : 'delivery')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {selectedLocation === 'delivery' ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {job.deliveries.map((delivery, index) => (
              <div key={index} className={`${index > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{delivery.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{delivery.address}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Scheduled: {formatTime(delivery.scheduledTime)}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => window.location.href = `tel:${delivery.contactPhone}`}
                      className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        // Open directions in default map app
                        const address = encodeURIComponent(delivery.address);
                        window.location.href = `https://maps.google.com/?q=${address}`;
                      }}
                      className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {selectedLocation === 'delivery' && (
                  <div className="mt-3 bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-green-900">
                      <p><strong>Contact:</strong> {delivery.contactName}</p>
                      <p><strong>Phone:</strong> {delivery.contactPhone}</p>
                      <p><strong>Notes:</strong> Ring buzzer #12 for access</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Driver Information */}
        {job.driver && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Live Driver Location
            </h3>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900">{job.driver.name}</h4>
                    <p className="text-sm text-purple-700">{job.driver.vehicle}</p>
                    <p className="text-xs text-purple-600">Last updated: 2 mins ago</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `tel:${job.driver.phone}`}
                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.location.href = `sms:${job.driver.phone}`}
                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Map Options</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                // Center map on pickup
                setMapCenter(locationCoords.pickup);
              }}
              className="bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Show Pickup</span>
            </button>
            <button
              onClick={() => {
                // Center map on delivery
                setMapCenter(locationCoords.delivery);
              }}
              className="bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Show Delivery</span>
            </button>
            {job.driver && (
              <button
                onClick={() => {
                  // Center map on driver
                  setMapCenter(locationCoords.driver);
                }}
                className="bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center space-x-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Show Driver</span>
              </button>
            )}
            <button
              onClick={() => {
                // Show full route
                console.log('Show full route');
              }}
              className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
              <span>Full Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMap;