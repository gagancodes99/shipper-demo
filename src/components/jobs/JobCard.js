import React from 'react';
import { useJobs } from '../../context/JobsContext';

/**
 * JobCard Component
 * Displays a compact job summary with key information and quick actions
 */
const JobCard = ({ job, onViewDetails, onTrack }) => {
  const { JOB_STATUS_CONFIG } = useJobs();

  const statusConfig = JOB_STATUS_CONFIG[job.status];
  
  // Get primary pickup and delivery locations
  const primaryPickup = job.pickups[0];
  const primaryDelivery = job.deliveries[0];
  
  // Format date display
  const formatDate = (date) => {
    const jobDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (jobDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (jobDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return jobDate.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  // Truncate address for display
  const truncateAddress = (address, maxLength = 30) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };

  // Get job type display
  const getJobTypeDisplay = () => {
    switch (job.jobType) {
      case 'single':
        return '1 → 1';
      case 'multi-pickup':
        return `${job.pickups.length} → 1`;
      case 'multi-drop':
        return `1 → ${job.deliveries.length}`;
      default:
        return '1 → 1';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 hover:shadow-md transition-shadow">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-900">{job.id}</span>
          <div className="flex items-center space-x-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} mr-1`}></div>
              {statusConfig.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900">${job.totalPrice}</div>
          <div className="text-xs text-gray-500">{formatDate(job.scheduledDate)}</div>
        </div>
      </div>

      {/* Route Information */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="font-medium">{primaryPickup.name}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium">{primaryDelivery.name}</span>
          </div>
        </div>
        
        <div className="mt-1 text-xs text-gray-500">
          <div>{truncateAddress(primaryPickup.address)}</div>
          <div className="flex items-center mt-0.5">
            <span>{truncateAddress(primaryDelivery.address)}</span>
            {(job.pickups.length > 1 || job.deliveries.length > 1) && (
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {getJobTypeDisplay()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Package Info & Payment Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
            </svg>
            {job.packageCount} packages
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            {job.totalWeight}kg
          </div>
        </div>
        
        <div className="flex items-center">
          {job.paymentStatus === 'paid' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Paid
            </span>
          )}
          {job.paymentStatus === 'pending' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Driver Information (if assigned) */}
      {job.driver && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium text-blue-900">{job.driver.name}</div>
                <div className="text-xs text-blue-600">{job.driver.vehicle}</div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${job.driver.phone}`;
              }}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {(job.status === 'picked_up' || job.status === 'in_transit') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTrack(job);
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Track</span>
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(job);
          }}
          className={`${
            (job.status === 'picked_up' || job.status === 'in_transit') ? 'flex-1' : 'w-full'
          } bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default JobCard;