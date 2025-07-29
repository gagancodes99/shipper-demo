import React from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';

/**
 * JobTypeScreen component allows users to select the type of shipping service they need
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSelect - Callback function when a job type is selected
 * @param {Function} props.onViewTransactions - Callback function to navigate to transactions
 * @returns {JSX.Element} Rendered job type selection screen
 */
const JobTypeScreen = ({ onSelect, onViewTransactions }) => {
  const jobTypes = [
    { id: 'single', label: 'Single Pickup/Drop', icon: '🚚', desc: 'One pickup, one delivery' },
    { id: 'multi-pickup', label: 'Multi-Pickup', icon: '📦', desc: 'Multiple pickups, one delivery' },
    { id: 'multi-drop', label: 'Multi-Drop', icon: '📍', desc: 'One pickup, multiple deliveries' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Phoenix Prime Shipper" showBack={false} />
      <ProgressBar currentStep={1} totalSteps={8} stepNames={['Job Type', 'Location Count', 'Location & Goods', 'Vehicle', 'Transfer', 'Review', 'Payment', 'Confirmation']} />
      
      <div className="p-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Create New Shipment</h2>
              <p className="text-sm opacity-90">Select the type of shipping service you need</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {jobTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className="w-full bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg mr-4 text-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                  {type.icon}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{type.label}</h3>
                  <p className="text-slate-600 text-sm">{type.desc}</p>
                </div>
                <span className="text-slate-400 text-xl group-hover:text-blue-500 transition-colors">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        {onViewTransactions && (
          <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <button
              onClick={onViewTransactions}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold">View Transactions</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { JobTypeScreen };
export default JobTypeScreen;