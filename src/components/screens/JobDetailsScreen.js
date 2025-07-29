import React, { useState } from 'react';
import { useJobs } from '../../context/JobsContext';

/**
 * JobDetailsScreen Component
 * Comprehensive job details view with map, tracking, and driver information
 * Based on mobile-first design with tabbed interface
 */
const JobDetailsScreen = ({ job, onBack, onTrackJob, onCancelJob, onRescheduleJob }) => {
  const { JOB_STATUS_CONFIG, cancelJob } = useJobs();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const statusConfig = JOB_STATUS_CONFIG[job.status];

  // Mock data for comprehensive view - in real app this would come from job data
  const mockJobData = {
    id: '#PP1001',
    status: 'En Route',
    createdAt: 'Today, 5:30 AM',
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
      description: 'Leather computers (2 units) - Cost 30% TS fragile',
      isFragile: true
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

  // Format date and time
  const formatDateTime = (date) => {
    const jobDate = new Date(date);
    return {
      date: jobDate.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: jobDate.toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  // Handle cancel job
  const handleCancelJob = () => {
    if (cancelReason.trim()) {
      cancelJob(job.id, cancelReason);
      setShowCancelModal(false);
      onCancelJob && onCancelJob();
    }
  };

  // Map Placeholder Component
  const MapPlaceholder = () => (
    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"></div>
      <div className="relative z-10 text-center">
        <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
          </svg>
        </div>
        <p className="text-gray-600 text-sm">Interactive Map</p>
        <p className="text-gray-500 text-xs">Route visualization available</p>
      </div>
      
      {/* Mock route points */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-16 bg-blue-400 rounded-full opacity-60 rotate-45"></div>
    </div>
  );

  // Cancel Modal Component
  const CancelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Job</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to cancel this job? This action cannot be undone.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for cancellation (optional)
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please provide a reason for cancelling..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCancelModal(false)}
            className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Keep Job
          </button>
          <button
            onClick={handleCancelJob}
            className="flex-1 bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancel Job
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <div className="flex space-x-2">
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
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{mockJobData.id}</h2>
              <p className="text-sm text-gray-500">Created {mockJobData.createdAt}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                {mockJobData.status}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Delivery Progress</span>
              <span className="text-sm text-gray-500">ETA: {mockJobData.eta}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockJobData.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium">{mockJobData.progress}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Route Map</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              Full Map
            </button>
          </div>
          
          <MapPlaceholder />
          
          {/* Tab Navigation */}
          <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
            {['Overview', 'Tracking', 'Documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
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
        </div>

        {/* Driver Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Driver Information
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-semibold text-blue-900 mr-3">{mockJobData.driver.name}</h4>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-800">{mockJobData.driver.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-blue-700">{mockJobData.driver.vehicle} - {mockJobData.driver.experience} of experience</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.location.href = `tel:${mockJobData.driver.phone}`}
                  className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button
                  onClick={() => window.location.href = `sms:${mockJobData.driver.phone}`}
                  className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
          
          {/* Pickup Location */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-900">Pickup Location</h4>
            </div>
            <div className="ml-7 space-y-2">
              <p className="font-medium text-gray-900">{mockJobData.pickup.location}</p>
              <p className="text-sm text-gray-600">{mockJobData.pickup.address}</p>
              <p className="text-sm text-gray-600">{mockJobData.pickup.contact} • {mockJobData.pickup.phone}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Scheduled: {mockJobData.pickup.scheduledTime}</p>
                <p className="text-sm text-green-600 font-medium">Arrived: {mockJobData.pickup.arrivalTime}</p>
              </div>
              <p className="text-xs text-gray-500 italic">{mockJobData.pickup.status}</p>
            </div>
          </div>

          {/* Destination */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-900">Destination</h4>
            </div>
            <div className="ml-7 space-y-2">
              <p className="font-medium text-gray-900">{mockJobData.destination.location}</p>
              <p className="text-sm text-gray-600">{mockJobData.destination.address}</p>
              <p className="text-sm text-gray-600">{mockJobData.destination.contact} • {mockJobData.destination.phone}</p>
              <p className="text-sm text-gray-500">Scheduled: {mockJobData.destination.scheduledTime}</p>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Details</h3>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-semibold text-orange-900 mr-2">{mockJobData.package.type}</h4>
                  {mockJobData.package.isFragile && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Fragile
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Weight</p>
                    <p className="text-lg font-bold text-orange-900">{mockJobData.package.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Dimensions</p>
                    <p className="text-lg font-bold text-orange-900">{mockJobData.package.dimensions}</p>
                  </div>
                </div>
                <p className="text-sm text-orange-800">{mockJobData.package.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Base Rate</span>
              <span className="font-medium">${mockJobData.pricing.baseRate.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Distance ({mockJobData.pricing.distanceMiles} miles)</span>
              <span className="font-medium">${mockJobData.pricing.distance.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Priority Fee</span>
              <span className="font-medium">${mockJobData.pricing.priorityFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${mockJobData.pricing.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">${mockJobData.pricing.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {mockJobData.pricing.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onTrackJob && onTrackJob(job)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Track Live</span>
            </button>
            
            <button
              onClick={() => setShowCancelModal(true)}
              className="bg-white border border-red-200 text-red-600 font-medium py-3 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && <CancelModal />}
    </div>
  );
};

export default JobDetailsScreen;