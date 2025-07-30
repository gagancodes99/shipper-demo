import React from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';

/**
 * TransferTypeScreen Component
 * 
 * Simple transfer type confirmation screen for standard freight service.
 * Currently shows a static transfer service with no pallet exchange option.
 * 
 * Props:
 * - onNext: Function to proceed to next step (review)
 * - onBack: Function to go back to previous step (vehicle selection)
 * 
 * This is a simplified screen that could be extended in the future
 * to support different transfer types and pallet exchange options.
 */
const TransferTypeScreen = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 max-w-sm mx-auto">
      <Header title="Transfer Type" onBack={onBack} />
      <ProgressBar currentStep={5} totalSteps={8} stepNames={['Job Type', 'Location Count', 'Location & Goods', 'Vehicle', 'Transfer', 'Review', 'Payment', 'Confirmation']} />
      
      <div className="p-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Service Type</h2>
              <p className="text-sm opacity-90">Standard freight transfer service</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl">
              🚚
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Transfer Service</h3>
            <p className="text-slate-600 mb-6">Standard freight transfer service</p>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-amber-800">
                <span className="mr-2">⚠️</span>
                <span className="font-medium">Note</span>
              </div>
              <p className="text-amber-700 text-sm mt-1">
                Pallet exchange is not available at this stage. Standard delivery terms apply.
              </p>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-slate-600">Service Type:</span>
                <span className="font-medium">Transfer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pallet Exchange:</span>
                <span className="text-red-500">Not Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery Method:</span>
                <span className="font-medium">Standard</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default TransferTypeScreen;
export { TransferTypeScreen };