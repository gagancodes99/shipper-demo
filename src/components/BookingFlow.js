import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChartColumn,
  CreditCard,
  List,
  User
} from 'lucide-react';

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

const BottomNavigation = ({ currentPath, onNavigate }) => {
 const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <ChartColumn size={20} />, path: '/dashboard' },
    { id: 'jobs', label: 'Jobs', icon: <List size={20} />, path: '/jobs' },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard size={20} />, path: '/transactions' },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-0 py-2 z-40 max-w-sm mx-auto">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <span className={`mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {React.cloneElement(item.icon, {
                  className: isActive ? 'text-blue-600' : 'text-gray-500',
                  fill: isActive ? 'currentColor' : 'none'
                })}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BookingFlow = ({ onComplete, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    onCancel();
  };

  /**
   * Handle booking completion
   */
  const handleBookingComplete = () => {
    onComplete();
  };

  /**
   * Handle navigation from bottom nav
   */
  const handleBottomNavNavigate = (path) => {
    if (path !== location.pathname) {
      navigate(path);
      onCancel();
    }
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
    <div className="booking-flow pb-20"> {/* Added pb-20 for bottom nav spacing */}
      {renderCurrentScreen()}
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        currentPath={location.pathname}
        onNavigate={handleBottomNavNavigate}
      />
      
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