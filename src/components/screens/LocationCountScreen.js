import React, { useState } from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';

/**
 * LocationCountScreen component allows users to configure the number of pickup or delivery locations
 * 
 * @param {Object} props - Component props
 * @param {string} props.jobType - The type of job ('single', 'multi-pickup', or 'multi-drop')
 * @param {Function} props.onNext - Callback function when continuing to next step
 * @param {Function} props.onBack - Callback function when going back to previous step
 * @param {Object} [props.jobData={}] - Current job data for validation
 * @returns {JSX.Element} Rendered location count configuration screen
 */
const LocationCountScreen = ({ jobType, onNext, onBack, jobData = {} }) => {
  const [locationCount, setLocationCount] = useState(2);

  const isMultiPickup = jobType === 'multi-pickup';
  const isMultiDrop = jobType === 'multi-drop';

  const getTitle = () => {
    if (isMultiPickup) return 'How Many Pickup Locations?';
    if (isMultiDrop) return 'How Many Delivery Locations?';
    return 'Location Setup';
  };

  const getDescription = () => {
    if (isMultiPickup) return 'Select the number of pickup locations you need (Maximum 10)';
    if (isMultiDrop) return 'Select the number of delivery locations you need (Maximum 10)';
    return 'Configure your locations';
  };

  const handleNext = () => {
    // For multi-pickup jobs, validate packaging type limits if goods are already configured
    if (isMultiPickup) {
      // Check if any goods are already configured to determine limits
      const existingGoods = jobData.pickupGoods || [];
      
      if (existingGoods.length > 0) {
        const hasLimitedCapacityItems = existingGoods.some(goods => 
          goods && goods.packagingTypes && 
          (goods.packagingTypes.pallets.selected || goods.packagingTypes.bags.selected)
        );
        
        const hasHighCapacityItems = existingGoods.some(goods => 
          goods && goods.packagingTypes && 
          (goods.packagingTypes.boxes.selected || goods.packagingTypes.others.selected)
        );
        
        if (hasLimitedCapacityItems && locationCount > 10) {
          alert('Pallets and Bags are limited to maximum 10 pickup locations. Please reduce the number of pickup locations or change packaging type.');
          return;
        }
        
        if (hasHighCapacityItems && locationCount > 30) {
          alert('Maximum 30 pickup locations allowed for Boxes and Loose Items.');
          return;
        }
      }
    }
    
    onNext(locationCount);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title={getTitle()} onBack={onBack} />
      <ProgressBar currentStep={2} totalSteps={8} stepNames={['Job Type', 'Location Count', 'Location & Goods', 'Vehicle', 'Transfer', 'Review', 'Payment', 'Confirmation']} />
      
      <div className="p-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Location Configuration</h2>
              <p className="text-sm opacity-90">{getDescription()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {isMultiPickup ? '📦 Pickup Locations' : '📍 Delivery Locations'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Number of {isMultiPickup ? 'pickup' : 'delivery'} locations:
              </label>
              
              <select
                value={locationCount}
                onChange={(e) => setLocationCount(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-slate-700 bg-white"
              >
                {Array.from({ length: 29 }, (_, i) => i + 2).map((count) => (
                  <option key={count} value={count}>
                    {count} locations
                  </option>
                ))}
              </select>
              
              {/* Conditional text based on quantity ranges */}
              <div className="mt-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="text-sm text-slate-600">
                  <p className="font-medium mb-2">Available packaging types for {locationCount} locations:</p>
                  {locationCount >= 2 && locationCount <= 10 && (
                    <div className="space-y-2">
                      <div className="text-green-700 bg-green-50 p-2 rounded border border-green-200">
                        ✅ <strong>All packaging types:</strong> Pallets, Bags, Boxes, and Loose Items
                      </div>
                    </div>
                  )}
                  {locationCount >= 11 && locationCount <= 30 && (
                    <div className="space-y-2">
                      <div className="text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                        ✅ <strong>Boxes and Loose Items:</strong> Available for 2-30 locations
                      </div>
                      <div className="text-red-700 bg-red-50 p-2 rounded border border-red-200">
                        ❌ <strong>Pallets and Bags:</strong> Limited to 2-10 locations only
                      </div>
                    </div>
                  )}
                  {locationCount > 30 && (
                    <div className="text-red-700 bg-red-50 p-2 rounded border border-red-200">
                      ❌ <strong>Maximum limit exceeded:</strong> Please select 30 or fewer locations
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-blue-600 mt-1 mr-2">ℹ️</span>
                <div>
                  <p className="text-blue-800 font-medium">Job Summary</p>
                  <p className="text-blue-700 text-sm">
                    {isMultiPickup 
                      ? `${locationCount} pickup locations → 1 delivery location`
                      : `1 pickup location → ${locationCount} delivery locations`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Continue to Location Details
        </button>
      </div>
    </div>
  );
};

export { LocationCountScreen };
export default LocationCountScreen;