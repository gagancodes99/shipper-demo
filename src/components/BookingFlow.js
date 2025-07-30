import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import existing booking components and hooks
import { useJobData } from '../hooks/useJobData';
import { useJobValidation } from '../hooks/useJobValidation';
import { mockAddresses } from '../data/mockData';

// Import screen components
import JobTypeScreen from './screens/JobTypeScreen';
import LocationCountScreen from './screens/LocationCountScreen';
import LocationDetailsScreen from './screens/LocationDetailsScreen';
import GoodsDetailsScreen from './screens/GoodsDetailsScreen';
import VehicleSelectionScreen from './screens/VehicleSelectionScreen';
import TransferTypeScreen from './screens/TransferTypeScreen';
import ReviewScreen from './screens/ReviewScreen';
import PaymentScreen from './screens/PaymentScreen';
import BookingConfirmedScreen from './screens/BookingConfirmedScreen';
import { downloadReactPDF } from './pdf/ReactPDFGenerator';

// Import modal components
import AddressBookModal from './modals/AddressBookModal';

/**
 * BookingFlow - Wrapper component for the 8-step booking process
 * 
 * This component maintains the existing booking functionality while integrating
 * with the new navigation system. It provides:
 * - Back navigation to main app
 * - Isolated booking state management
 * - Integration with existing booking screens and logic
 */

const BookingFlow = () => {
  const navigate = useNavigate();
  
  // State for modal management
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [addresses, setAddresses] = useState(mockAddresses);

  // Initialize custom hooks for job data management and validation
  const {
    // State
    currentStep,
    jobData,
    currentLocationIndex,
    currentLocationType,
    currentGoodsIndex,
    currentGoodsType,
    
    // Handlers
    handleJobTypeSelect,
    handleLocationCountNext,
    handleLocationNext,
    handleGoodsNext,
    handleVehicleNext,
    handleBack,
    
    // Utilities
    setStep,
    
    // Advanced setters for edit functionality
    setCurrentLocationIndex,
    setCurrentLocationType
  } = useJobData();

  // Initialize validation hook
  const validation = useJobValidation(jobData);

  /**
   * Handle address book functionality
   */
  const handleAddressSelect = () => {
    setShowAddressBook(false);
  };

  const handleAddNewAddress = (newAddress) => {
    const addressWithId = { ...newAddress, id: Date.now() };
    setAddresses(prev => [...prev, addressWithId]);
    return addressWithId;
  };

  /**
   * Enhanced handlers for edit functionality from ReviewScreen
   */
  const handleEditPickup = (index) => {
    setCurrentLocationIndex(index);
    setCurrentLocationType('pickup');
    setStep('locations');
  };

  const handleEditDelivery = (index) => {
    setCurrentLocationIndex(index);
    setCurrentLocationType('delivery');
    setStep('locations');
  };

  const handleEditGoods = (locationIndex, goodsIndex) => {
    setCurrentLocationIndex(locationIndex);
    setStep('goods');
  };

  /**
   * Handle back navigation to main app
   */
  const handleBackToApp = () => {
    navigate('/dashboard');
  };

  /**
   * Handle booking completion
   */
  const handleBookingComplete = () => {
    // Navigate to jobs screen to see the new booking
    navigate('/jobs');
  };

  /**
   * Render the appropriate screen based on current step
   */
  const renderCurrentScreen = () => {
    const commonProps = {
      jobData,
      onBack: currentStep === 'jobType' ? handleBackToApp : handleBack,
      validation
    };

    switch (currentStep) {
      case 'jobType':
        return (
          <JobTypeScreen
            {...commonProps}
            onSelect={handleJobTypeSelect}
          />
        );
      
      case 'locationCount':
        return (
          <LocationCountScreen
            {...commonProps}
            onNext={handleLocationCountNext}
          />
        );
      
      case 'locations':
        return (
          <LocationDetailsScreen
            {...commonProps}
            currentLocationIndex={currentLocationIndex}
            currentLocationType={currentLocationType}
            addresses={addresses}
            onNext={handleLocationNext}
            onShowAddressBook={() => setShowAddressBook(true)}
            onAddNewAddress={handleAddNewAddress}
          />
        );
      
      case 'goods':
        return (
          <GoodsDetailsScreen
            {...commonProps}
            currentLocationIndex={currentLocationIndex}
            currentGoodsIndex={currentGoodsIndex}
            currentGoodsType={currentGoodsType}
            onNext={handleGoodsNext}
          />
        );
      
      case 'vehicle':
        return (
          <VehicleSelectionScreen
            {...commonProps}
            onNext={handleVehicleNext}
          />
        );
      
      case 'transfer':
        return (
          <TransferTypeScreen
            {...commonProps}
            onNext={() => setStep('review')}
          />
        );
      
      case 'review':
        return (
          <ReviewScreen
            {...commonProps}
            onNext={() => setStep('payment')}
            onEditPickup={handleEditPickup}
            onEditDelivery={handleEditDelivery}
            onEditGoods={handleEditGoods}
          />
        );
      
      case 'payment':
        return (
          <PaymentScreen
            {...commonProps}
            onNext={() => setStep('confirmed')}
          />
        );
      
      case 'confirmed':
        const jobId = 'PX' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const otp = Math.floor(1000 + Math.random() * 9000);
        
        return (
          <BookingConfirmedScreen
            {...commonProps}
            jobData={jobData}
            onDownloadPDF={() => downloadReactPDF(jobData, jobId, otp)}
            onComplete={handleBookingComplete}
          />
        );
      
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="text-white text-center">
              <h1 className="text-2xl font-bold mb-4">Invalid Step</h1>
              <button
                onClick={handleBackToApp}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="booking-flow">
      {renderCurrentScreen()}
      
      {/* Address Book Modal */}
      {showAddressBook && (
        <AddressBookModal
          addresses={addresses}
          onSelect={handleAddressSelect}
          onClose={() => setShowAddressBook(false)}
          onAddNew={handleAddNewAddress}
        />
      )}
    </div>
  );
};

export default BookingFlow;