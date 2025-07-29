import React from 'react';
import Header from '../ui/Header';
import { downloadReactPDF } from '../pdf/ReactPDFGenerator';

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
 * BookingConfirmedScreen Component
 * 
 * Final confirmation screen showing complete booking details with generated job ID and OTP.
 * Features comprehensive shipment documentation, QR codes for location verification,
 * PDF download functionality, and action buttons for tracking and new bookings.
 * 
 * Props:
 * - jobData: Object containing complete job information for display and PDF generation
 * - onDownloadPDF: Function to handle PDF download
 * - onViewJobs: Function to navigate to jobs screen
 * - onNewBooking: Function to start new booking flow
 * 
 * Component generates unique job ID and OTP, displays detailed location information,
 * vehicle specifications, and provides PDF download with full documentation.
 */
const BookingConfirmedScreen = ({ jobData, onDownloadPDF, onViewJobs, onNewBooking, onBackToDashboard }) => {
  const jobId = 'PX' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const otp = Math.floor(1000 + Math.random() * 9000);

  const generateMockQR = (locationType, index) => {
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="white" stroke="#e2e8f0" stroke-width="1" rx="6"/>
        <g fill="#475569">
          <rect x="8" y="8" width="6" height="6" rx="1"/>
          <rect x="18" y="8" width="6" height="6" rx="1"/>
          <rect x="28" y="8" width="6" height="6" rx="1"/>
          <rect x="38" y="8" width="6" height="6" rx="1"/>
          <rect x="48" y="8" width="6" height="6" rx="1"/>
          <rect x="58" y="8" width="6" height="6" rx="1"/>
          <rect x="66" y="8" width="6" height="6" rx="1"/>
          <rect x="8" y="18" width="6" height="6" rx="1"/>
          <rect x="28" y="18" width="6" height="6" rx="1"/>
          <rect x="48" y="18" width="6" height="6" rx="1"/>
          <rect x="66" y="18" width="6" height="6" rx="1"/>
          <rect x="8" y="28" width="6" height="6" rx="1"/>
          <rect x="18" y="28" width="6" height="6" rx="1"/>
          <rect x="38" y="28" width="6" height="6" rx="1"/>
          <rect x="58" y="28" width="6" height="6" rx="1"/>
          <rect x="66" y="28" width="6" height="6" rx="1"/>
          <rect x="8" y="38" width="6" height="6" rx="1"/>
          <rect x="28" y="38" width="6" height="6" rx="1"/>
          <rect x="48" y="38" width="6" height="6" rx="1"/>
          <rect x="66" y="38" width="6" height="6" rx="1"/>
          <rect x="18" y="48" width="6" height="6" rx="1"/>
          <rect x="28" y="48" width="6" height="6" rx="1"/>
          <rect x="38" y="48" width="6" height="6" rx="1"/>
          <rect x="58" y="48" width="6" height="6" rx="1"/>
          <rect x="8" y="58" width="6" height="6" rx="1"/>
          <rect x="18" y="58" width="6" height="6" rx="1"/>
          <rect x="38" y="58" width="6" height="6" rx="1"/>
          <rect x="48" y="58" width="6" height="6" rx="1"/>
          <rect x="66" y="58" width="6" height="6" rx="1"/>
          <rect x="8" y="66" width="6" height="6" rx="1"/>
          <rect x="28" y="66" width="6" height="6" rx="1"/>
          <rect x="48" y="66" width="6" height="6" rx="1"/>
          <rect x="58" y="66" width="6" height="6" rx="1"/>
          <rect x="66" y="66" width="6" height="6" rx="1"/>
        </g>
      </svg>
    `);
  };

  const generateMockBarcode = () => {
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="50" fill="white" stroke="#e2e8f0" stroke-width="1" rx="4"/>
        <g fill="#475569">
          <rect x="15" y="12" width="2" height="26"/>
          <rect x="19" y="12" width="1" height="26"/>
          <rect x="22" y="12" width="3" height="26"/>
          <rect x="27" y="12" width="1" height="26"/>
          <rect x="30" y="12" width="2" height="26"/>
          <rect x="34" y="12" width="1" height="26"/>
          <rect x="37" y="12" width="3" height="26"/>
          <rect x="42" y="12" width="2" height="26"/>
          <rect x="46" y="12" width="1" height="26"/>
          <rect x="49" y="12" width="2" height="26"/>
          <rect x="53" y="12" width="1" height="26"/>
          <rect x="56" y="12" width="3" height="26"/>
          <rect x="61" y="12" width="1" height="26"/>
          <rect x="64" y="12" width="2" height="26"/>
          <rect x="68" y="12" width="3" height="26"/>
          <rect x="73" y="12" width="1" height="26"/>
          <rect x="76" y="12" width="2" height="26"/>
          <rect x="80" y="12" width="1" height="26"/>
          <rect x="83" y="12" width="3" height="26"/>
          <rect x="88" y="12" width="2" height="26"/>
          <rect x="92" y="12" width="1" height="26"/>
          <rect x="95" y="12" width="2" height="26"/>
          <rect x="99" y="12" width="3" height="26"/>
          <rect x="104" y="12" width="1" height="26"/>
          <rect x="107" y="12" width="2" height="26"/>
          <rect x="111" y="12" width="1" height="26"/>
          <rect x="114" y="12" width="3" height="26"/>
          <rect x="119" y="12" width="2" height="26"/>
          <rect x="123" y="12" width="1" height="26"/>
          <rect x="126" y="12" width="2" height="26"/>
          <rect x="130" y="12" width="3" height="26"/>
          <rect x="135" y="12" width="1" height="26"/>
          <rect x="138" y="12" width="2" height="26"/>
          <rect x="142" y="12" width="1" height="26"/>
          <rect x="145" y="12" width="3" height="26"/>
          <rect x="150" y="12" width="2" height="26"/>
          <rect x="154" y="12" width="1" height="26"/>
          <rect x="157" y="12" width="2" height="26"/>
          <rect x="161" y="12" width="3" height="26"/>
          <rect x="166" y="12" width="1" height="26"/>
          <rect x="169" y="12" width="2" height="26"/>
          <rect x="173" y="12" width="1" height="26"/>
          <rect x="176" y="12" width="3" height="26"/>
          <rect x="181" y="12" width="2" height="26"/>
        </g>
        <text x="100" y="45" text-anchor="middle" font-family="system-ui" font-size="9" font-weight="500" fill="#64748b">${jobId}</text>
      </svg>
    `);
  };

  // Determine if QR codes should be shown based on job type
  const shouldShowPickupQR = jobData.jobType === 'multi-pickup';
  const shouldShowDeliveryQR = jobData.jobType !== 'multi-pickup';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Booking Confirmed" showBack={false} />
      
      <div className="p-4 space-y-6">
        {/* Success Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Booking Confirmed</h2>
          <p className="text-slate-600 mb-4">Your shipment has been successfully scheduled</p>
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg px-4 py-3 inline-block">
            <span className="text-sm text-slate-600">Job ID: </span>
            <span className="font-mono font-semibold text-lg text-slate-900">{jobId}</span>
          </div>
        </div>

        {/* Job Summary Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Master Documentation</h3>
                  <p className="text-sm text-indigo-600">Job reference and details</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-indigo-200">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Confirmed</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Job ID:</p>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-slate-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0V3a1 1 0 011-1h6a1 1 0 011 1v1m-9 0h10" />
                    </svg>
                  </div>
                </div>
                <p className="font-mono text-lg font-bold text-indigo-600">{jobId}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">OTP:</p>
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="font-mono text-lg font-bold text-blue-600">{otp}</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status:</p>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <p className="font-semibold text-emerald-600">Confirmed</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type:</p>
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                  </svg>
                </div>
                <p className="font-semibold text-purple-600">
                  {jobData.jobType === 'single' ? 'Single Pickup/Drop' : 
                   jobData.jobType === 'multi-pickup' ? 'Multi Pickup' : 'Multi Drop'}
                </p>
              </div>
            </div>

            {/* Master Barcode Section */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="text-center">
                <img src={generateMockBarcode()} alt="Master Barcode" className="mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600 mb-1">Master Shipment Barcode</p>
                <p className="text-xs text-slate-500">Scan for tracking and verification</p>
              </div>
            </div>
            
            {/* Driver Verification */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">Driver Verification Required</h4>
                  <p className="text-sm text-blue-700 mb-3">Share the OTP code above with the driver upon arrival for secure verification.</p>
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 inline-block border border-blue-200">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Secure Access Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Locations */}
        {jobData.pickups?.map((pickup, index) => (
          <div key={`pickup-${index}`} className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {jobData.pickups.length > 1 ? `Pickup ${index + 1}` : 'Pickup Location'}
                    </h3>
                    <p className="text-sm text-emerald-600">Collection point</p>
                  </div>
                </div>
                {shouldShowPickupQR && (
                  <div className="text-center">
                    <img src={generateMockQR('pickup', index)} alt={`Pickup QR`} className="mb-1" />
                    <p className="text-xs text-slate-600">Goods QR</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <h4 className="font-medium text-slate-900">{pickup.customerName}</h4>
                {pickup.recipientMobile && (
                  <p className="text-sm text-slate-600 mt-1">📱 {pickup.recipientMobile}</p>
                )}
                <p className="text-sm text-slate-600 mt-1">{pickup.address?.address}</p>
                <p className="text-sm text-slate-600">{pickup.address?.suburb} {pickup.address?.postcode}</p>
              </div>
              
              <div className="flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {pickup.date} at {pickup.time}
              </div>
              
              {pickup.instructions && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Instructions: </span>
                    {pickup.instructions}
                  </p>
                </div>
              )}

              {pickup.tradingHours && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Trading Hours: </span>
                    {pickup.tradingHours}
                  </p>
                </div>
              )}

              {pickup.appointmentDetails && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <span className="font-medium">Appointment: </span>
                    {pickup.appointmentDetails}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  Scheduled
                </span>
              </div>

              {/* Only show goods section if this location has goods tracking */}
              {shouldShowPickupQR && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">Goods Summary</p>
                    <div>
                      {getGoodsSummary(jobData.pickupGoods?.[index])}
                    </div>
                    {jobData.pickupGoods?.[index]?.pickupMethod && (
                      <p className="text-xs text-slate-600 mt-1">
                        <span className="font-medium">Pickup Method:</span> {jobData.pickupGoods[index].pickupMethod}
                      </p>
                    )}
                    {jobData.pickupGoods?.[index]?.deliveryMethod && (
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Delivery Method:</span> {jobData.pickupGoods[index].deliveryMethod}
                      </p>
                    )}
                    {!jobData.pickupGoods?.[index]?.packagingTypes?.pallets?.secured && jobData.pickupGoods?.[index]?.packagingTypes?.pallets?.selected && (
                      <div className="mt-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded p-2">
                        <span className="text-amber-700 text-xs">⚠️ Unsecured pallets - additional charges may apply</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Delivery Locations */}
        {jobData.deliveries?.map((delivery, index) => (
          <div key={`delivery-${index}`} className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {jobData.deliveries.length > 1 ? `Delivery ${index + 1}` : 'Delivery Location'}
                    </h3>
                    <p className="text-sm text-red-600">Drop-off point</p>
                  </div>
                </div>
                {shouldShowDeliveryQR && (
                  <div className="text-center">
                    <img src={generateMockQR('delivery', index)} alt={`Delivery QR`} className="mb-1" />
                    <p className="text-xs text-slate-600">Goods QR</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <h4 className="font-medium text-slate-900">{delivery.customerName}</h4>
                <p className="text-sm text-slate-600 mt-1">{delivery.address?.address}</p>
                <p className="text-sm text-slate-600">{delivery.address?.suburb} {delivery.address?.postcode}</p>
              </div>
              
              <div className="flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {delivery.date} at {delivery.time}
              </div>
              
              {delivery.instructions && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Instructions: </span>
                    {delivery.instructions}
                  </p>
                </div>
              )}

              {delivery.tradingHours && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Trading Hours: </span>
                    {delivery.tradingHours}
                  </p>
                </div>
              )}

              {delivery.appointmentDetails && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <span className="font-medium">Appointment: </span>
                    {delivery.appointmentDetails}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  Scheduled
                </span>
              </div>

              {/* Only show goods section if this location has goods tracking */}
              {shouldShowDeliveryQR && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">Goods Summary</p>
                    <div>
                      {getGoodsSummary(jobData.deliveryGoods?.[index])}
                    </div>
                    {jobData.deliveryGoods?.[index]?.pickupMethod && (
                      <p className="text-xs text-slate-600 mt-1">
                        <span className="font-medium">Pickup Method:</span> {jobData.deliveryGoods[index].pickupMethod}
                      </p>
                    )}
                    {jobData.deliveryGoods?.[index]?.deliveryMethod && (
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Delivery Method:</span> {jobData.deliveryGoods[index].deliveryMethod}
                      </p>
                    )}
                    {!jobData.deliveryGoods?.[index]?.packagingTypes?.pallets?.secured && jobData.deliveryGoods?.[index]?.packagingTypes?.pallets?.selected && (
                      <div className="mt-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded p-2">
                        <span className="text-amber-700 text-xs">⚠️ Unsecured pallets - additional charges may apply</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Vehicle & Service Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Vehicle & Service</h3>
                <p className="text-sm text-purple-600">Transportation details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Main Vehicle Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle:</p>
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                  </svg>
                </div>
                <p className="font-bold text-orange-600">{jobData.vehicle?.name || 'Van (1T)'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Capacity:</p>
                  <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className="font-bold text-cyan-600">{jobData.vehicle?.capacity || '1 Tonne'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Max Weight:</p>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <p className="font-bold text-cyan-600">{jobData.vehicle?.maxWeight || '1 tonnes'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pallet Capacity:</p>
                  <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <p className="font-bold text-cyan-600">{jobData.vehicle?.palletCapacity || '2 Pallets'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Body Type:</p>
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="font-bold text-purple-600">{jobData.truckBodyType || 'Pantech'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Refrigeration:</p>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <p className="font-bold text-slate-600">{jobData.isRefrigerated ? 'Required' : 'Not Required'}</p>
              </div>
            </div>

            {/* Special Services */}
            {(jobData.isRefrigerated || jobData.craneHiabOption) && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Special Services</h4>
                
                {jobData.isRefrigerated && (
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-cyan-800">Refrigerated Transport</p>
                        <p className="text-sm text-cyan-600">Temperature-controlled cargo handling</p>
                      </div>
                    </div>
                  </div>
                )}

                {jobData.craneHiabOption && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">🏗️</span>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-800">
                          {jobData.craneHiabOption === 'crane' ? 'Crane Service' : 'Hiab Service'}
                        </p>
                        <p className="text-sm text-orange-600">
                          {jobData.craneHiabOption === 'crane' ? 'Heavy lifting capability' : 'Hydraulic arm loading/unloading'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => onDownloadPDF && onDownloadPDF()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Documentation
          </button>
         
          <button 
            onClick={() => onViewJobs && onViewJobs()}
            className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-lg font-medium hover:from-slate-700 hover:to-slate-800 transition-all flex items-center justify-center transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View My Jobs
          </button>
          
          <button 
            onClick={() => onNewBooking && onNewBooking()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Book Another Job
          </button>

          {onBackToDashboard && (
            <button 
              onClick={() => onBackToDashboard()}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center transform hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Dashboard
            </button>
          )}
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-blue-900">Confirmation Sent</span>
            </div>
            <p className="text-sm text-blue-700">
              Complete booking details and tracking information have been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmedScreen;
export { BookingConfirmedScreen };