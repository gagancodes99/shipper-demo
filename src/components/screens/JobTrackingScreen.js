import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * JobTrackingScreen - Real-time job tracking page matching exact design specifications
 * 
 * Features:
 * - Clean mobile-first design with white background
 * - Job header with status and progress
 * - Interactive map with route visualization
 * - Tabbed interface (Full Map, Tracking, Documents)
 * - Driver information with contact options
 * - Detailed route information
 * - Package details and pricing breakdown
 */

const JobTrackingScreen = ({ onBack }) => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [activeTab, setActiveTab] = useState('tracking');

  // Mock job data matching the design
  const jobData = {
    id: jobId || '#PP1001',
    createdAt: 'Today, 5:30 AM',
    status: 'En Route',
    progress: 65,
    eta: '45 min',
    driver: {
      name: 'Mike Johnson',
      rating: 4.6,
      experience: '4 years',
      vehicle: 'Ute',
      phone: '+61 424 567 890'
    },
    pickup: {
      location: 'John Williams St, Downtown',
      address: '123 John Williams St, Downtown, Sydney NSW 2000',
      contact: 'John Smith',
      phone: '+61 424 123 456',
      scheduledTime: '10:00 AM',
      arrivalTime: '9:45 AM',
      status: 'Trip started 3-4 hr, pending since information'
    },
    destination: {
      location: '444 Customer Ave, Uptown, Security Hills',
      address: '444 Customer Ave, Uptown, Security Hills, Sydney NSW 2154',
      contact: 'Sarah Williams',
      phone: '+61 424 789 012',
      scheduledTime: '12:00 PM - 2:00 PM'
    },
    package: {
      type: 'Electronics Package',
      weight: '15 kgs',
      dimensions: '12" x 8" x 6"',
      value: '$1,345',
      description: 'Leather computers (2 units) - Cost 30% TS fragile'
    },
    pricing: {
      baseRate: 45.00,
      distance: 8.50,
      distanceMiles: 24.8,
      priorityFee: 12.00,
      tax: 65.50,
      total: 131.00,
      status: 'Pending'
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // In a real app, this would navigate to different views
    if (tab === 'documents') {
      console.log('Navigate to documents');
    } else if (tab === 'fullmap') {
      console.log('Navigate to full map');
    }
  };

  // Map Placeholder Component
  const MapSection = () => (
    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
      {/* Map background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
      
      {/* Route visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Pickup point (green) */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg z-10"></div>
        
        {/* Destination point (red) */}
        <div className="absolute bottom-6 right-6 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg z-10"></div>
        
        {/* Current location (blue) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg z-10 animate-pulse"></div>
        
        {/* Route line */}
        <div className="absolute top-8 left-8 w-32 h-24 border-2 border-dashed border-blue-400 rounded-br-full opacity-60"></div>
      </div>
      
      {/* Map icon overlay */}
      <div className="relative z-10 text-center opacity-40">
        <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Job Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{jobData.id}</h2>
              <p className="text-sm text-gray-500">Created {jobData.createdAt}</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
              En Route
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Delivery Progress</span>
              <span className="text-sm text-gray-500">ETA: {jobData.eta}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${jobData.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium">{jobData.progress}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg border border-gray-100">
          <MapSection />
          
          {/* Tab Navigation */}
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => handleTabChange('fullmap')}
              className="flex-1 py-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-r border-gray-100"
            >
              Full Map
            </button>
            <button
              onClick={() => handleTabChange('tracking')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-r border-gray-100 ${
                activeTab === 'tracking' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tracking
            </button>
            <button
              onClick={() => handleTabChange('documents')}
              className="flex-1 py-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Documents
            </button>
          </div>
        </div>

        {/* Driver Information */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Driver Information</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-lg">MJ</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{jobData.driver.name}</h4>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{jobData.driver.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{jobData.driver.vehicle} • {jobData.driver.experience}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = `tel:${jobData.driver.phone}`}
                className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button
                onClick={() => window.location.href = `sms:${jobData.driver.phone}`}
                className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
          
          {/* Pickup Location */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-900">Pickup Location</h4>
            </div>
            <div className="ml-7 space-y-1">
              <p className="font-medium text-gray-900">{jobData.pickup.location}</p>
              <p className="text-sm text-gray-600">{jobData.pickup.contact} • {jobData.pickup.phone}</p>
              <p className="text-sm text-gray-500">Scheduled: {jobData.pickup.scheduledTime} • Arrived: <span className="text-green-600 font-medium">{jobData.pickup.arrivalTime}</span></p>
              <p className="text-xs text-gray-500 italic">{jobData.pickup.status}</p>
            </div>
          </div>

          {/* Destination */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-900">Destination</h4>
            </div>
            <div className="ml-7 space-y-1">
              <p className="font-medium text-gray-900">{jobData.destination.location}</p>
              <p className="text-sm text-gray-600">{jobData.destination.contact} • {jobData.destination.phone}</p>
              <p className="text-sm text-gray-500">Scheduled: {jobData.destination.scheduledTime}</p>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
            </svg>
            Package Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-gray-900">{jobData.package.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium text-gray-900">{jobData.package.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dimensions:</span>
              <span className="font-medium text-gray-900">{jobData.package.dimensions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Value:</span>
              <span className="font-medium text-gray-900">{jobData.package.value}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">{jobData.package.description}</p>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Pricing Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Rate</span>
              <span className="font-medium">${jobData.pricing.baseRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance ({jobData.pricing.distanceMiles} miles)</span>
              <span className="font-medium">${jobData.pricing.distance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Priority Fee</span>
              <span className="font-medium">${jobData.pricing.priorityFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${jobData.pricing.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">${jobData.pricing.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {jobData.pricing.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTrackingScreen;