import React from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';

/**
 * Helper function to get goods summary
 * Formats goods data into a readable list with icons and details
 */
const getGoodsSummary = (goods) => {
  if (!goods || !goods.packagingTypes) return 'No goods specified';
  
  const selectedTypes = Object.entries(goods.packagingTypes)
    .filter(([_, data]) => data.selected)
    .map(([type, data]) => {
      const icon = type === 'pallets' ? '🟫' : type === 'boxes' ? '📦' : type === 'bags' ? '🛍️' : '📋';
      let summary = `${icon} ${data.quantity} ${type} (${data.weight}kg)`;
      if (data.dimensions && data.dimensions.trim()) {
        summary += ` - ${data.dimensions}cm`;
      }
      return summary;
    });
  
  if (selectedTypes.length === 0) return 'No goods specified';
  
  return (
    <ul className="text-sm text-slate-600 space-y-1">
      {selectedTypes.map((item, index) => (
        <li key={index}>• {item}</li>
      ))}
    </ul>
  );
};

/**
 * ReviewScreen Component
 * 
 * Comprehensive review and confirmation screen showing all job details.
 * Displays pickup/delivery locations, goods, vehicle selection, and cost estimate.
 * Provides edit buttons for each section to allow modifications before confirmation.
 * 
 * Props:
 * - jobData: Object containing complete job information
 * - onNext: Function to proceed to payment
 * - onBack: Function to go back to transfer type
 * - onEditPickup: Function to edit pickup details (receives index)
 * - onEditDelivery: Function to edit delivery details (receives index)
 * - onEditVehicle: Function to edit vehicle selection
 * 
 * Features detailed cost calculation and displays important terms.
 */
const ReviewScreen = ({ jobData, onNext, onBack, onEditPickup, onEditDelivery, onEditVehicle }) => {
  const calculateEstimate = () => {
    const baseRate = jobData.vehicle?.id === 'van' ? 80 : 150;
    const distanceMultiplier = 1.5;
    return Math.round(baseRate * distanceMultiplier);
  };

  const estimatedCost = calculateEstimate();
  const estimatedTime = "2-4 hours";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Review & Confirm" onBack={onBack} />
      <ProgressBar currentStep={6} totalSteps={8} stepNames={['Job Type', 'Location Count', 'Location & Goods', 'Vehicle', 'Transfer', 'Review', 'Payment', 'Confirmation']} />
      
      <div className="p-6 space-y-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Review & Confirmation</h2>
              <p className="text-sm opacity-90">Please review your shipment details</p>
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        {jobData.pickups?.map((pickup, index) => (
          <div key={`pickup-${index}`} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-emerald-500 mr-2">📍</span>
                {jobData.pickups.length > 1 ? `Pickup ${index + 1}` : 'Pickup Details'}
              </div>
              <button 
                onClick={() => onEditPickup(index)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Edit pickup details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </h3>
            <div className="space-y-2">
              <p><span className="text-slate-600">Customer:</span> {pickup.customerName}</p>
              {pickup.recipientMobile && (
                <p><span className="text-slate-600">Mobile:</span> {pickup.recipientMobile}</p>
              )}
              <p><span className="text-slate-600">Address:</span> {pickup.address?.address}</p>
              <p><span className="text-slate-600">Date & Time:</span> {pickup.date} at {pickup.time}</p>
              {pickup.instructions && (
                <p><span className="text-slate-600">Instructions:</span> {pickup.instructions}</p>
              )}
              {pickup.tradingHours && (
                <p><span className="text-slate-600">Trading Hours:</span> {pickup.tradingHours}</p>
              )}
              {pickup.appointmentDetails && (
                <p><span className="text-slate-600">Appointment:</span> {pickup.appointmentDetails}</p>
              )}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-1">📦 Goods:</p>
                {jobData.jobType === 'multi-drop' || jobData.jobType === 'single' ? (
                  <p className="text-sm text-slate-500 italic">Goods details tracked at delivery locations</p>
                ) : (
                  <div>
                    {getGoodsSummary(jobData.pickupGoods?.[index])}
                    {jobData.pickupGoods?.[index]?.pickupMethod && (
                      <p className="text-sm text-slate-600 mt-2">
                        <span className="font-medium">Pickup Method:</span> {jobData.pickupGoods[index].pickupMethod}
                      </p>
                    )}
                    {jobData.pickupGoods?.[index]?.deliveryMethod && (
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Delivery Method:</span> {jobData.pickupGoods[index].deliveryMethod}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Delivery Information */}
        {jobData.deliveries?.map((delivery, index) => (
          <div key={`delivery-${index}`} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">📍</span>
                {jobData.deliveries.length > 1 ? `Delivery ${index + 1}` : 'Delivery Details'}
              </div>
              <button 
                onClick={() => onEditDelivery(index)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Edit delivery details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </h3>
            <div className="space-y-2">
              <p><span className="text-slate-600">Customer:</span> {delivery.customerName}</p>
              <p><span className="text-slate-600">Address:</span> {delivery.address?.address}</p>
              <p><span className="text-slate-600">Date & Time:</span> {delivery.date} at {delivery.time}</p>
              {delivery.instructions && (
                <p><span className="text-slate-600">Instructions:</span> {delivery.instructions}</p>
              )}
              {delivery.tradingHours && (
                <p><span className="text-slate-600">Trading Hours:</span> {delivery.tradingHours}</p>
              )}
              {delivery.appointmentDetails && (
                <p><span className="text-slate-600">Appointment:</span> {delivery.appointmentDetails}</p>
              )}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-1">📦 Goods:</p>
                {jobData.jobType === 'multi-pickup' ? (
                  <p className="text-sm text-slate-500 italic">Goods details tracked at pickup locations</p>
                ) : (
                  <div>
                    {getGoodsSummary(jobData.deliveryGoods?.[index])}
                    {jobData.deliveryGoods?.[index]?.pickupMethod && (
                      <p className="text-sm text-slate-600 mt-2">
                        <span className="font-medium">Pickup Method:</span> {jobData.deliveryGoods[index].pickupMethod}
                      </p>
                    )}
                    {jobData.deliveryGoods?.[index]?.deliveryMethod && (
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Delivery Method:</span> {jobData.deliveryGoods[index].deliveryMethod}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Vehicle Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">🚚</span>
              Vehicle & Service
            </div>
            <button 
              onClick={onEditVehicle}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit vehicle selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </h3>
          <div className="space-y-2">
            <p><span className="text-slate-600">Vehicle:</span> {jobData.vehicle?.name}</p>
            <p><span className="text-slate-600">Capacity:</span> {jobData.vehicle?.capacity}</p>
            {jobData.truckBodyType && (
              <p><span className="text-slate-600">Body Type:</span> {jobData.truckBodyType}</p>
            )}
            {jobData.isRefrigerated && (
              <p><span className="text-slate-600">Special:</span> ❄️ Refrigerated</p>
            )}
            {jobData.craneHiabOption && (
              <p><span className="text-slate-600">Loading/Unloading:</span> 🏗️ {jobData.craneHiabOption === 'crane' ? 'Crane Service' : 'Hiab Service'}</p>
            )}
            <p><span className="text-slate-600">Service:</span> Transfer</p>
          </div>
        </div>

        {/* Cost Estimate */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Estimated Cost & Time</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">${estimatedCost}</p>
              <p className="text-sm opacity-90">Estimated cost</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">{estimatedTime}</p>
              <p className="text-sm opacity-90">Estimated time</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-amber-600 mt-1 mr-2">⚠️</span>
            <div>
              <p className="text-amber-800 font-medium">Important</p>
              <p className="text-amber-700 text-sm">
                Final pricing may vary based on actual distance, traffic conditions, and additional services required.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ReviewScreen;
export { ReviewScreen };