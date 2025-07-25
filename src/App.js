import React, { useState, useEffect } from 'react';
import { downloadReactPDF} from './components/pdf/ReactPDFGenerator';

// Mock data for addresses
const mockAddresses = [
  { id: 1, name: "John Smith", address: "123 Main St", suburb: "Sydney", postcode: "2000", isDefault: true },
  { id: 2, name: "ABC Warehouse", address: "456 Industrial Ave", suburb: "Melbourne", postcode: "3000", isDefault: false },
  { id: 3, name: "XYZ Logistics", address: "789 Transport Rd", suburb: "Brisbane", postcode: "4000", isDefault: false }
];

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps, stepNames }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="bg-white p-4 shadow-sm border-b border-slate-200">
      <div className="mb-2">
        <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="font-medium text-blue-600">{stepNames[currentStep - 1]}</span>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ title, onBack, showBack = true }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 p-4 text-white shadow-lg">
      <div className="flex items-center">
        {showBack && (
          <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-white/20 text-xl">
            ←
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
};

// Step 1: Job Type Selection Screen
const JobTypeScreen = ({ onSelect }) => {
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
      </div>
    </div>
  );
};

// Step 2: Location Count Selection Screen (for multi jobs only)
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

// Address Book Modal
const AddressBookModal = ({ isOpen, onClose, addresses, onSelect, onAdd }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '', address: '', suburb: '', postcode: ''
  });

  const handleAdd = () => {
    if (newAddress.name && newAddress.address && newAddress.suburb && newAddress.postcode) {
      onAdd(newAddress);
      setNewAddress({ name: '', address: '', suburb: '', postcode: '' });
      setShowAddForm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-200 shadow-xl">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Address Book</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-xl transition-colors">
              ×
            </button>
          </div>
        </div>
        
        {!showAddForm ? (
          <div className="p-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <span className="mr-2">+</span> Add New Address
            </button>
            
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => onSelect(addr)}
                  className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer relative hover:bg-slate-50 transition-all"
                >
                  {addr.isDefault && (
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                  <h4 className="font-medium text-slate-800">{addr.name}</h4>
                  <p className="text-sm text-slate-600">{addr.address}</p>
                  <p className="text-sm text-slate-600">{addr.suburb} {addr.postcode}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h4 className="font-medium text-slate-800 mb-4">Add New Address</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer Name"
                value={newAddress.name}
                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Suburb"
                value={newAddress.suburb}
                onChange={(e) => setNewAddress({...newAddress, suburb: e.target.value})}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Postcode (4 digits)"
                value={newAddress.postcode}
                onChange={(e) => setNewAddress({...newAddress, postcode: e.target.value})}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                maxLength={6}
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 p-3 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Add Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 3: Location Details Screen
const LocationDetailsScreen = ({ 
  locationType, // 'pickup' or 'delivery'
  locationIndex, 
  totalLocations,
  onNext, 
  onBack,
  initialData = {},
  pickupDate = null // For auto-selecting date from previous locations
}) => {
  const [formData, setFormData] = useState({
    customerName: initialData.customerName || '',
    address: initialData.address || null,
    recipientMobile: initialData.recipientMobile || '', // NEW: Mobile number field
    instructions: initialData.instructions || '',
    date: initialData.date || (pickupDate ? pickupDate : ''),
    time: initialData.time || '',
    flexibleTiming: initialData.flexibleTiming || false,
    tradingHours: initialData.tradingHours || '',
    appointmentDetails: initialData.appointmentDetails || '' // NEW: Appointment details field
  });
  
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showAddressBook, setShowAddressBook] = useState(false);

  // Reset form data when location type or index changes to prevent cache issues
  useEffect(() => {
    setFormData({
      customerName: initialData.customerName || '',
      address: initialData.address || null,
      recipientMobile: initialData.recipientMobile || '', // NEW
      instructions: initialData.instructions || '',
      date: initialData.date || (pickupDate ? pickupDate : ''),
      time: initialData.time || '',
      flexibleTiming: initialData.flexibleTiming || false,
      tradingHours: initialData.tradingHours || '',
      appointmentDetails: initialData.appointmentDetails || '' // NEW
    });
  }, [locationType, locationIndex, initialData, pickupDate]);

  const tradingHoursOptions = [
    '9 AM to 5 PM',
    '10 AM to 8 PM',
    '24/7',
    'On Appointment'
  ];

  const handleAddressSelect = (address) => {
    setFormData({...formData, address, customerName: address.name});
    setShowAddressBook(false);
  };

  const handleAddAddress = (newAddr) => {
    const newAddress = { ...newAddr, id: Date.now(), isDefault: false };
    setAddresses([...addresses, newAddress]);
    setFormData({...formData, address: newAddress, customerName: newAddress.name});
    setShowAddressBook(false);
  };

  const handleNext = () => {
    if (formData.customerName && formData.address && formData.date && formData.time && 
        (locationType === 'pickup' ? formData.recipientMobile : true) &&
        (formData.tradingHours === 'On Appointment' ? formData.appointmentDetails : true)) { // Mobile required for pickup only
      onNext(formData);
    }
  };

  const getTitle = () => {
    if (locationType === 'pickup') {
      return totalLocations > 1 ? `Pickup ${locationIndex + 1} of ${totalLocations}` : 'Pickup Details';
    } else {
      return totalLocations > 1 ? `Delivery ${locationIndex + 1} of ${totalLocations}` : 'Delivery Details';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title={getTitle()} onBack={onBack} />
      <ProgressBar
        currentStep={3}
        totalSteps={8}
        stepNames={[
          "Job Type",
          "Location Count",
          "Location & Goods",
          "Vehicle",
          "Transfer",
          "Review",
          "Payment",
          "Confirmation",
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {locationType === "pickup"
                  ? `Pickup & Collection ( ${
                      locationIndex + 1
                    } of ${totalLocations})`
                  : "Delivery & Drop-off"}
              </h2>
              <p className="text-sm opacity-90">
                {locationType === "pickup"
                  ? "Where to collect your shipment"
                  : "Where to deliver your shipment"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {locationType === "pickup"
              ? "Collection Information"
              : "Delivery Information"}
          </h3>

          <div className="space-y-5">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                <svg
                  className="w-4 h-4 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Customer Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                <svg
                  className="w-4 h-4 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {locationType === "pickup"
                  ? "Pickup Address"
                  : "Delivery Address"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <div
                    onClick={() => setShowAddressBook(true)}
                    className="w-full p-4 border border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 bg-slate-50 hover:bg-slate-100 transition-all min-h-[56px] flex items-center"
                  >
                    {formData.address ? (
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">
                          {formData.address.address}
                        </div>
                        <div className="text-sm text-slate-600">
                          {formData.address.suburb} {formData.address.postcode}
                        </div>
                        {formData.address.isDefault && (
                          <span className="inline-block bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 text-xs px-2 py-1 rounded-full mt-1">
                            Default
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">
                        Select from address book
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowAddressBook(true)}
                  className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-book-user-icon lucide-book-user"
                  >
                    <path d="M15 13a3 3 0 1 0-6 0" />
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    <circle cx="12" cy="8" r="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* NEW: Recipient Mobile Number (only for pickup) - Moved after address */}
            {locationType === "pickup" && (
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                  <svg
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Recipient Mobile Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.recipientMobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recipientMobile: e.target.value,
                    })
                  }
                  className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="Enter mobile number (for OTP verification)"
                />
                <p className="text-xs text-slate-500 mt-1">
                  We'll send an OTP to this number for pickup verification
                </p>
              </div>
            )}

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                <svg
                  className="w-4 h-4 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v7a2 2 0 01-2 2h-1l-4 4z"
                  />
                </svg>
                {locationType === "pickup"
                  ? "Pickup Instructions"
                  : "Delivery Instructions"}
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder={`Special instructions for ${locationType}`}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center mb-4">
            <svg
              className="w-5 h-5 text-blue-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800">Schedule</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                  <svg
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                  disabled={pickupDate !== null}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                  <svg
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Time
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => {
                    const now = new Date();
                    const selectedTime = e.target.value;
                    const selectedHours = parseInt(
                      selectedTime.split(":")[0],
                      10
                    );
                    const selectedMinutes = parseInt(
                      selectedTime.split(":")[1],
                      10
                    );

                    if (
                      formData.date === new Date().toISOString().split("T")[0]
                    ) {
                      const currentHours = now.getHours();
                      const currentMinutes = now.getMinutes();

                      if (
                        selectedHours < currentHours ||
                        (selectedHours === currentHours &&
                          selectedMinutes < currentMinutes)
                      ) {
                        return;
                      }
                    }
                    setFormData({ ...formData, time: e.target.value });
                  }}
                  min={
                    formData.date === new Date().toISOString().split("T")[0]
                      ? `${String(new Date().getHours()).padStart(
                          2,
                          "0"
                        )}:${String(new Date().getMinutes()).padStart(2, "0")}`
                      : undefined
                  }
                  className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="flexible"
                checked={formData.flexibleTiming}
                onChange={(e) =>
                  setFormData({ ...formData, flexibleTiming: e.target.checked })
                }
                className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4 rounded"
              />
              <label
                htmlFor="flexible"
                className="text-sm text-slate-700 flex items-center"
              >
                <svg
                  className="w-4 h-4 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Flexible Timing
              </label>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                <svg
                  className="w-4 h-4 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Trading Hours
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.tradingHours}
                onChange={(e) =>
                  setFormData({ ...formData, tradingHours: e.target.value })
                }
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
              >
                <option value="">Select trading hours</option>
                {tradingHoursOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* NEW: Appointment Details field when "On Appointment" is selected */}
            {formData.tradingHours === "On Appointment" && (
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                  <svg
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Appointment Details
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={formData.appointmentDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentDetails: e.target.value,
                    })
                  }
                  className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="Please provide appointment details, contact person, phone number, etc."
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={
            !formData.customerName ||
            !formData.address ||
            !formData.date ||
            !formData.time ||
            !formData.tradingHours ||
            (locationType === "pickup" && !formData.recipientMobile) ||
            (formData.tradingHours === "On Appointment" &&
              !formData.appointmentDetails)
          }
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
        >
          Continue
        </button>
      </div>

      <AddressBookModal
        isOpen={showAddressBook}
        onClose={() => setShowAddressBook(false)}
        addresses={addresses}
        onSelect={handleAddressSelect}
        onAdd={handleAddAddress}
      />
    </div>
  );
};

// Configuration Modals
const PalletConfigModal = ({ isOpen, onClose, data, onSave }) => {
  const [config, setConfig] = useState(data || {
    quantity: 0,
    weight: 0,
    secured: true,
    palletTypes: { CHEP: 0, LOSCAM: 0, Plain: 0, Other: 0 },
    otherDimensions: ''
  });

  const palletTypeData = [
    { id: 'CHEP', name: 'CHEP', description: 'Blue standard pallets' },
    { id: 'LOSCAM', name: 'LOSCAM', description: 'White standard pallets' },
    { id: 'Plain', name: 'Plain Wood', description: 'Wooden pallets' },
    { id: 'Other', name: 'Custom', description: 'Other pallet types' }
  ];

  const updatePalletType = (palletType, quantity) => {
    const newQuantity = parseInt(quantity) || 0;
    const newPalletTypes = {
      ...config.palletTypes,
      [palletType]: newQuantity
    };
    
    const totalPallets = Object.values(newPalletTypes).reduce((sum, qty) => sum + qty, 0);
    
    setConfig(prev => ({
      ...prev,
      quantity: totalPallets,
      palletTypes: newPalletTypes
    }));
  };

  const handleSave = () => {
    if (config.quantity > 0 && config.weight > 0) {
      onSave(config);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Configure Pallets</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-xl transition-colors">×</button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Pallet Types */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Packaging Type
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {palletTypeData.map((palletType) => (
                <div key={palletType.id} className="space-y-3">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-xl border border-slate-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="font-medium text-sm text-slate-900">{palletType.name}</p>
                      <p className="text-xs text-slate-600">{palletType.description}</p>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center text-xs font-medium text-slate-700 mb-2">
                      <svg className="w-3 h-3 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m-3 0a1.5 1.5 0 003 0" />
                      </svg>
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => updatePalletType(palletType.id, Math.max(0, config.palletTypes[palletType.id] - 1))}
                        className="w-8 h-8 rounded-l-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-medium transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={config.palletTypes[palletType.id]}
                        onChange={(e) => updatePalletType(palletType.id, e.target.value)}
                        className="w-16 h-8 border-t border-b border-slate-300 text-center text-sm font-medium focus:outline-none focus:border-blue-500 bg-white"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => updatePalletType(palletType.id, config.palletTypes[palletType.id] + 1)}
                        className="w-8 h-8 rounded-r-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-medium transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Toggle */}
          <div className={`p-4 rounded-xl border transition-all ${
            config.secured ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100' : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50'
          }`}>
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.secured}
                  onChange={(e) => setConfig({...config, secured: e.target.checked})}
                  className={`w-4 h-4 border-slate-300 rounded focus:ring-2 ${config.secured ? 'text-emerald-600 focus:ring-emerald-500' : 'text-orange-600 focus:ring-orange-500'}`}
                />
                <span className="ml-3 font-medium text-sm">
                  {config.secured ? 'Secured pallets' : 'Unsecured pallets'}
                </span>
              </div>
              {!config.secured && (
                <span className="text-xs text-orange-700 font-medium">+$5/pallet</span>
              )}
            </label>
            <p className="text-xs text-slate-600 mt-2 ml-7">
              {config.secured ? 'Wrapped and properly secured' : 'Additional handling charges apply'}
            </p>
          </div>

          {/* Weight */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-3m-3 3l-3-3" />
              </svg>
              Total Weight (kg)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              value={config.weight}
              onChange={(e) => setConfig({...config, weight: parseFloat(e.target.value) || 0})}
              className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
              min="0"
              step="0.1"
              placeholder="250"
            />
          </div>

          {/* Custom Dimensions */}
          {config.palletTypes.Other > 0 && (
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 8v8a2 2 0 002 2h2m0-16h8m-8 16h8m0-16v2a2 2 0 002 2h2m-2 14v-2a2 2 0 00-2-2h-2" />
                </svg>
                Dimensions (cm) - Optional
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Length"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white text-center"
                />
                <input
                  type="text"
                  placeholder="Width"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white text-center"
                />
                <input
                  type="text"
                  placeholder="Height"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white text-center"
                />
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">Summary</p>
            <p className="text-sm text-blue-700">{config.quantity} pallets • {config.weight}kg</p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 p-3 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={config.quantity === 0 || config.weight === 0}
              className="flex-1 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GenericConfigModal = ({ isOpen, onClose, data, onSave, title, type }) => {
  const [config, setConfig] = useState(data || {
    quantity: 0,
    weight: 0,
    dimensions: ''
  });

  const handleSave = () => {
    if (config.quantity > 0 && config.weight > 0) {
      onSave(config);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Configure {title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-xl transition-colors">×</button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Quantity */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m-3 0a1.5 1.5 0 003 0" />
              </svg>
              Quantity
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setConfig({...config, quantity: Math.max(0, config.quantity - 1)})}
                className="w-12 h-12 rounded-l-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-medium transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={config.quantity}
                onChange={(e) => setConfig({...config, quantity: parseInt(e.target.value) || 0})}
                className="flex-1 h-12 border-t border-b border-slate-300 text-center font-medium focus:outline-none focus:border-blue-500 bg-white text-lg"
                min="0"
                placeholder="5"
              />
              <button
                type="button"
                onClick={() => setConfig({...config, quantity: config.quantity + 1})}
                className="w-12 h-12 rounded-r-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-medium transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-3m-3 3l-3-3" />
              </svg>
              Total Weight (kg)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              value={config.weight}
              onChange={(e) => setConfig({...config, weight: parseFloat(e.target.value) || 0})}
              className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
              min="0"
              step="0.1"
              placeholder="250"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 8v8a2 2 0 002 2h2m0-16h8m-8 16h8m0-16v2a2 2 0 002 2h2m-2 14v-2a2 2 0 00-2-2h-2" />
              </svg>
              Dimensions (cm) - Optional
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Length"
                value={config.dimensions.split('x')[0]?.trim() || ''}
                onChange={(e) => {
                  const parts = config.dimensions.split('x').map(p => p.trim());
                  parts[0] = e.target.value;
                  setConfig({...config, dimensions: parts.filter(p => p).join(' x ')});
                }}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white text-center"
              />
              <input
                type="text"
                placeholder="Width"
                value={config.dimensions.split('x')[1]?.trim() || ''}
                onChange={(e) => {
                  const parts = config.dimensions.split('x').map(p => p.trim());
                  parts[1] = e.target.value;
                  setConfig({...config, dimensions: parts.filter(p => p).join(' x ')});
                }}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white text-center"
              />
              <input
                type="text"
                placeholder="Height"
                value={config.dimensions.split('x')[2]?.trim() || ''}
                onChange={(e) => {
                  const parts = config.dimensions.split('x').map(p => p.trim());
                  parts[2] = e.target.value;
                  setConfig({...config, dimensions: parts.filter(p => p).join(' x ')});
                }}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white text-center"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">Summary</p>
            <p className="text-sm text-blue-700">{config.quantity} {type} • {config.weight}kg</p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 p-3 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={config.quantity === 0 || config.weight === 0}
              className="flex-1 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Professional Goods Details Screen
const GoodsDetailsScreen = ({ 
  locationType, 
  locationIndex, 
  totalLocations,
  locationData,
  onNext, 
  onBack,
  initialGoods = null,
  jobData = {}
}) => {
  const [goods, setGoods] = useState(initialGoods || {
    description: '',
    pickupMethod: '', // NEW: Pickup method dropdown
    deliveryMethod: '', // NEW: Delivery method dropdown
    packagingTypes: {
      pallets: { selected: false, quantity: 0, weight: 0, secured: true, palletTypes: { CHEP: 0, LOSCAM: 0, Plain: 0, Other: 0 }, otherDimensions: '' },
      boxes: { selected: false, quantity: 0, weight: 0, dimensions: '' },
      bags: { selected: false, quantity: 0, weight: 0, dimensions: '' },
      others: { selected: false, quantity: 0, weight: 0, dimensions: '' }
    }
  });
  

  const [activeModal, setActiveModal] = useState(null);

  const locationName = locationData?.address?.address || 'Location';

  // NEW: Method options for pickup and delivery
  const methodOptions = ['Tailgate', 'Loading Dock', 'Hand Carry', 'Crane/Hiab'];

  const handlePackagingToggle = (type) => {
    // Check if the packaging type is allowed
    const packagingType = packagingTypes.find(pt => pt.id === type);
    if (!packagingType || !packagingType.allowed) {
      return; // Don't allow toggle if not allowed
    }

    setGoods(prev => ({
      ...prev,
      packagingTypes: {
        ...prev.packagingTypes,
        [type]: {
          ...prev.packagingTypes[type],
          selected: !prev.packagingTypes[type].selected,
          quantity: !prev.packagingTypes[type].selected ? 0 : prev.packagingTypes[type].quantity
        }
      }
    }));
  };

  const handleConfigSave = (type, config) => {
    setGoods(prev => ({
      ...prev,
      packagingTypes: {
        ...prev.packagingTypes,
        [type]: {
          ...prev.packagingTypes[type],
          ...config,
          selected: true
        }
      }
    }));
  };

  const handleNext = () => {
    if (goods.description && goods.pickupMethod && goods.deliveryMethod && 
        Object.values(goods.packagingTypes).some(p => p.selected && p.quantity > 0)) {
      
      // Validate packaging type limits
      const hasHighCapacityItems = goods.packagingTypes.boxes.selected || goods.packagingTypes.others.selected;
      const hasLimitedCapacityItems = goods.packagingTypes.pallets.selected || goods.packagingTypes.bags.selected;
      
      // Get total number of drop-offs for this job type
      const getDropOffCount = () => {
        if (locationType === 'pickup') {
          // For pickup goods in multi-pickup, check pickup count
          return totalLocations; // Number of pickup locations
        } else {
          // For delivery goods, this is the drop-off location
          return totalLocations; // Number of delivery locations
        }
      };
      
      const dropOffCount = getDropOffCount();
      
      // Apply validation for multi-pickup (pickup locations) and multi-drop (delivery locations)
      if ((locationType === 'pickup' && totalLocations > 1) || (locationType === 'delivery' && totalLocations > 1)) {
        if (hasLimitedCapacityItems && dropOffCount > 10) {
          const locationType_label = locationType === 'pickup' ? 'pickup' : 'drop-off';
          alert(`Pallets and Bags are limited to maximum 10 ${locationType_label} locations. Please reduce the number of ${locationType_label} locations or change packaging type.`);
          return;
        }
        if (hasHighCapacityItems && dropOffCount > 30) {
          const locationType_label = locationType === 'pickup' ? 'pickup' : 'drop-off';
          alert(`Maximum 30 ${locationType_label} locations allowed for Boxes and Loose Items.`);
          return;
        }
      }
      
      onNext(goods);
    }
  };

  // Get the relevant location count for filtering
  const getRelevantLocationCount = () => {
    if (locationType === 'pickup' && jobData.pickupCount) {
      return jobData.pickupCount;
    } else if (locationType === 'delivery' && jobData.deliveryCount) {
      return jobData.deliveryCount;
    }
    return totalLocations;
  };

  const relevantLocationCount = getRelevantLocationCount();

  // Helper function to check if a packaging type is allowed based on location count
  const isPackagingTypeAllowed = (packagingId) => {
    if (relevantLocationCount <= 30) {
      // 2-10 locations: all packaging types available
      // 11-30 locations: only boxes and loose items available (pallets and bags not available)
      if (relevantLocationCount <= 10) {
        return true; // All types available for 2-10 locations
      } else {
        return ['boxes', 'others'].includes(packagingId); // Only boxes and loose items for 11-30
      }
    }
    // Above 30 locations: none available (shouldn't happen with UI restrictions)
    return false;
  };

  const packagingTypes = [
    { 
      id: 'pallets', 
      name: 'Pallets', 
      icon: '🟫', 
      description: 'Standard shipping pallets',
      allowed: isPackagingTypeAllowed('pallets')
    },
    { 
      id: 'boxes', 
      name: 'Boxes & Cartons', 
      icon: '📦', 
      description: 'Packaged boxes and cartons',
      allowed: isPackagingTypeAllowed('boxes')
    },
    { 
      id: 'bags', 
      name: 'Bags & Sacks', 
      icon: '🛍️', 
      description: 'Bagged or sacked items',
      allowed: isPackagingTypeAllowed('bags')
    },
    { 
      id: 'others', 
      name: 'Loose items', 
      icon: '📋', 
      description: 'Other packaging types',
      allowed: isPackagingTypeAllowed('others')
    }
  ];

  const getTitle = () => {
    if (locationType === 'pickup') {
      return totalLocations > 1 ? `Goods for Pickup ${locationIndex + 1}` : 'Goods for Pickup';
    } else {
      return totalLocations > 1 ? `Goods for Delivery ${locationIndex + 1}` : 'Goods for Delivery';
    }
  };

  const getTotalWeight = () => {
    return Object.values(goods.packagingTypes)
      .filter(p => p.selected)
      .reduce((sum, p) => sum + (p.weight || 0), 0);
  };

  const getTotalItems = () => {
    return Object.values(goods.packagingTypes)
      .filter(p => p.selected)
      .reduce((sum, p) => sum + (p.quantity || 0), 0);
  };

  const getSelectedCount = () => {
    return Object.values(goods.packagingTypes).filter(p => p.selected).length;
  };

  const isConfigured = (type) => {
    const pkg = goods.packagingTypes[type];
    return pkg.selected && pkg.quantity > 0 && pkg.weight > 0;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title={getTitle()} onBack={onBack} />
      <ProgressBar
        currentStep={3}
        totalSteps={8}
        stepNames={[
          "Job Type",
          "Location Count",
          "Location & Goods",
          "Vehicle",
          "Transfer",
          "Review",
          "Payment",
          "Confirmation",
        ]}
      />

      <div className="p-4 space-y-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="flex gap-3">
              <div>
                <h2 className="text-lg font-semibold">Goods Description </h2>
                <p className="text-sm opacity-90">What are you shipping?</p>
              </div>
              <div className='mt-1'>
                {" "}
                <span>{`(${locationIndex + 1} of ${totalLocations})`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Shipment Details
              </h3>
              <p className="text-sm text-slate-600 mt-1">{locationName}</p>
            </div>
            {(getTotalItems() > 0 || getTotalWeight() > 0) && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-200">
                <p className="text-xs text-blue-600 font-medium">Summary</p>
                <p className="text-sm font-semibold text-blue-900">
                  {getTotalItems()} items • {getTotalWeight()}kg
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
              <svg
                className="w-4 h-4 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v7a2 2 0 01-2 2h-1l-4 4z"
                />
              </svg>
              What are you shipping?
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={goods.description}
              onChange={(e) =>
                setGoods({ ...goods, description: e.target.value })
              }
              className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none transition-all bg-slate-50 focus:bg-white"
              placeholder="e.g., Office furniture, Electronic equipment, Food products..."
              rows={3}
            />
          </div>
        </div>

        {/* NEW: Pickup and Delivery Methods */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Handling Methods
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                <svg
                  className="w-4 h-4 text-emerald-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                Pickup Method
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={goods.pickupMethod}
                onChange={(e) =>
                  setGoods({ ...goods, pickupMethod: e.target.value })
                }
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
              >
                <option value="">Select pickup method</option>
                {methodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-3">
                <svg
                  className="w-4 h-4 text-red-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Delivery Method
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={goods.deliveryMethod}
                onChange={(e) =>
                  setGoods({ ...goods, deliveryMethod: e.target.value })
                }
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white"
              >
                <option value="">Select delivery method</option>
                {methodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Packaging Types Selection Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900">
                Packaging Type
              </h3>
              <span className="text-red-500 ml-1">*</span>
            </div>
            {getSelectedCount() > 0 && (
              <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {getSelectedCount()} selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {packagingTypes.map((type) => (
              <div key={type.id} className="space-y-3">
                <button
                  onClick={() => handlePackagingToggle(type.id)}
                  disabled={!type.allowed}
                  className={`w-full p-4 rounded-xl border transition-all text-left relative ${
                    !type.allowed
                      ? "border-red-200 bg-red-50 cursor-not-allowed opacity-60"
                      : goods.packagingTypes[type.id].selected
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {goods.packagingTypes[type.id].selected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {type.id === "pallets" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        )}
                        {type.id === "boxes" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        )}
                        {type.id === "bags" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                          />
                        )}
                        {type.id === "others" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        )}
                      </svg>
                    </div>
                    <div className="font-medium text-slate-900 text-sm">
                      {type.name}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 ml-11">
                    {type.description}
                  </div>
                  {!type.allowed && (
                    <div className="text-xs text-red-600 ml-11 mt-1 font-medium">
                      ❌ Not available for {relevantLocationCount} locations
                    </div>
                  )}
                </button>

                {goods.packagingTypes[type.id].selected && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveModal(type.id)}
                      className={`w-full p-3 rounded-lg border text-sm font-medium transition-all ${
                        isConfigured(type.id)
                          ? "border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200"
                          : "border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200"
                      }`}
                    >
                      {isConfigured(type.id) ? (
                        <div>
                          <div>✓ Configured</div>
                          <div className="text-xs">
                            {goods.packagingTypes[type.id].quantity} items •{" "}
                            {goods.packagingTypes[type.id].weight}kg
                          </div>
                        </div>
                      ) : (
                        "Configure Details"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <button
            onClick={handleNext}
            disabled={
              !goods.description ||
              !goods.pickupMethod ||
              !goods.deliveryMethod ||
              !Object.values(goods.packagingTypes).some(
                (p) => p.selected && p.quantity > 0
              )
            }
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
          >
            {getTotalItems() > 0
              ? `Continue with ${getTotalItems()} items (${getTotalWeight()}kg)`
              : "Continue"}
          </button>
        </div>
      </div>

      {/* Configuration Modals */}
      <PalletConfigModal
        isOpen={activeModal === "pallets"}
        onClose={() => setActiveModal(null)}
        data={goods.packagingTypes.pallets}
        onSave={(config) => handleConfigSave("pallets", config)}
      />

      <GenericConfigModal
        isOpen={activeModal === "boxes"}
        onClose={() => setActiveModal(null)}
        data={goods.packagingTypes.boxes}
        onSave={(config) => handleConfigSave("boxes", config)}
        title="Boxes & Cartons"
        type="boxes"
      />

      <GenericConfigModal
        isOpen={activeModal === "bags"}
        onClose={() => setActiveModal(null)}
        data={goods.packagingTypes.bags}
        onSave={(config) => handleConfigSave("bags", config)}
        title="Bags & Sacks"
        type="bags"
      />

      <GenericConfigModal
        isOpen={activeModal === "others"}
        onClose={() => setActiveModal(null)}
        data={goods.packagingTypes.others}
        onSave={(config) => handleConfigSave("others", config)}
        title="Others"
        type="items"
      />
    </div>
  );
};

// Vehicle Selection Screen
const VehicleSelectionScreen = ({ onNext, onBack, initialData = {}, jobData }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(initialData.vehicle || null);
  const [truckBodyType, setTruckBodyType] = useState(initialData.truckBodyType || '');
  const [isRefrigerated, setIsRefrigerated] = useState(initialData.isRefrigerated || false);
  const [craneHiabOption, setCraneHiabOption] = useState(initialData.craneHiabOption || '');

  const vehicles = [
    { id: 'van', name: 'Van (1T)', capacity: '1 Tonne', pallets: '2 Pallets', icon: '🚐', maxWeight: 1, maxPallets: 2 },
    { id: '4t', name: '4T Truck', capacity: '4 Tonnes', pallets: '8 Pallets', icon: '🚚', maxWeight: 4, maxPallets: 8 },
    { id: '6t', name: '6T Truck', capacity: '6 Tonnes', pallets: '12 Pallets', icon: '🚛', maxWeight: 6, maxPallets: 12 },
    { id: '8t', name: '8T Truck', capacity: '8 Tonnes', pallets: '16 Pallets', icon: '🚛', maxWeight: 8, maxPallets: 16 },
    { id: '12t', name: '12T Truck', capacity: '12 Tonnes', pallets: '24 Pallets', icon: '🚛', maxWeight: 12, maxPallets: 24 },
    { id: 'semi', name: 'Semi-Trailer', capacity: '25 Tonnes', pallets: '34 Pallets', icon: '🚜', maxWeight: 25, maxPallets: 34 },
    { id: 'bdouble', name: 'B-Double', capacity: '45 Tonnes', pallets: '68 Pallets', icon: '🚜', maxWeight: 45, maxPallets: 68 }
  ];

  // Calculate total goods requirements
  const calculateGoodsRequirements = () => {
    let totalWeight = 0;
    let totalPallets = 0;
    let goodsData = [];

    // Get goods data based on job type
    if (jobData.jobType === 'multi-pickup') {
      goodsData = jobData.pickupGoods || [];
    } else {
      // For single and multi-drop, goods are tracked at deliveries
      goodsData = jobData.deliveryGoods || [];
    }

    goodsData.forEach(goods => {
      if (goods && goods.packagingTypes) {
        Object.values(goods.packagingTypes).forEach(pkg => {
          if (pkg.selected) {
            // Convert kg to tonnes for weight calculation
            totalWeight += (pkg.weight || 0) / 1000;
            if (pkg.palletTypes) {
              // For pallets, sum all pallet types
              totalPallets += Object.values(pkg.palletTypes).reduce((sum, qty) => sum + (qty || 0), 0);
            }
          }
        });
      }
    });

    return { 
      totalWeight: Math.round(totalWeight * 100) / 100, // Round to 2 decimal places
      totalPallets 
    };
  };

  const { totalWeight, totalPallets } = calculateGoodsRequirements();

  const isVehicleValid = (vehicle) => {
    // If no goods are configured yet, all vehicles are valid
    if (totalWeight === 0 && totalPallets === 0) {
      return true;
    }
    
    const weightValid = totalWeight <= vehicle.maxWeight;
    const palletsValid = totalPallets <= vehicle.maxPallets;
    return weightValid && palletsValid;
  };

  const getValidationMessage = (vehicle) => {
    // If no goods are configured, no validation message needed
    if (totalWeight === 0 && totalPallets === 0) {
      return '';
    }
    
    const weightExceeded = totalWeight > vehicle.maxWeight;
    const palletsExceeded = totalPallets > vehicle.maxPallets;
    
    if (weightExceeded && palletsExceeded) {
      return `Exceeds weight (${totalWeight}t > ${vehicle.maxWeight}t) & pallets (${totalPallets} > ${vehicle.maxPallets})`;
    } else if (weightExceeded) {
      return `Exceeds weight limit (${totalWeight}t > ${vehicle.maxWeight}t)`;
    } else if (palletsExceeded) {
      return `Exceeds pallet capacity (${totalPallets} > ${vehicle.maxPallets} pallets)`;
    }
    return '';
  };

  const truckBodyTypes = ['Pantech', 'Curtain Sider', 'Flatbed'];

  // Check if crane/hiab handling method is selected
  const hasCraneHiabMethod = () => {
    let goodsData = [];
    
    // Get goods data based on job type
    if (jobData.jobType === 'multi-pickup') {
      goodsData = jobData.pickupGoods || [];
    } else {
      // For single and multi-drop, goods are tracked at deliveries
      goodsData = jobData.deliveryGoods || [];
    }
    
    // Check if any goods has crane/hiab method selected
    return goodsData.some(goods => 
      goods?.pickupMethod === 'Crane/Hiab' || goods?.deliveryMethod === 'Crane/Hiab'
    );
  };

  // Show all truck body types (no filtering based on refrigeration)
  const getAvailableTruckBodyTypes = () => {
    return truckBodyTypes;
  };

  // Check if refrigeration should be disabled based on selected truck body type
  const isRefrigerationDisabled = () => {
    return truckBodyType === 'Curtain Sider' || truckBodyType === 'Flatbed';
  };

  const handleVehicleSelect = (vehicle) => {
    if (isVehicleValid(vehicle)) {
      setSelectedVehicle(vehicle);
      if (vehicle.id === 'van') {
        setTruckBodyType('');
      }
    }
  };

  const handleNext = () => {
    if (selectedVehicle && (selectedVehicle.id === 'van' || truckBodyType)) {
      onNext({ 
        vehicle: selectedVehicle, 
        truckBodyType: selectedVehicle.id === 'van' ? null : truckBodyType,
        isRefrigerated,
        craneHiabOption
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Vehicle Selection" onBack={onBack} />
      <ProgressBar currentStep={4} totalSteps={8} stepNames={['Job Type', 'Location Count', 'Location & Goods', 'Vehicle', 'Transfer', 'Review', 'Payment', 'Confirmation']} />
      
      <div className="p-6 space-y-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Vehicle Selection</h2>
              <p className="text-sm opacity-90">Choose the right vehicle for your shipment</p>
            </div>
          </div>
        </div>

        {/* Goods Summary */}
        {(totalWeight > 0 || totalPallets > 0) ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Your Shipment Requirements</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalWeight}t</p>
                <p className="text-sm text-blue-700">Total Weight</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalPallets}</p>
                <p className="text-sm text-blue-700">Total Pallets</p>
              </div>
            </div>
            <p className="text-xs text-blue-600 text-center">✓ Vehicles are filtered based on your goods requirements</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2">⚠️ No Goods Data</h4>
            <p className="text-sm text-amber-700">Vehicle recommendations will be shown after goods details are provided.</p>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800">Vehicle Type</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {vehicles.map((vehicle) => {
              const isValid = isVehicleValid(vehicle);
              const validationMessage = getValidationMessage(vehicle);
              
              return (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`p-4 border rounded-xl transition-all relative ${
                    !isValid 
                      ? 'border-red-200 bg-red-50 opacity-60 cursor-not-allowed' 
                      : selectedVehicle?.id === vehicle.id 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 cursor-pointer' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{vehicle.icon}</span>
                    </div>
                    <h4 className={`font-medium text-sm mb-1 ${!isValid ? 'text-red-600' : 'text-slate-800'}`}>
                      {vehicle.name}
                    </h4>
                    <p className={`text-xs mb-2 ${!isValid ? 'text-red-500' : 'text-slate-600'}`}>
                      {vehicle.capacity}
                    </p>
                    <p className={`text-xs ${!isValid ? 'text-red-500' : 'text-slate-500'}`}>
                      {vehicle.pallets}
                    </p>
                    
                    {selectedVehicle?.id === vehicle.id && isValid && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    {!isValid && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    
                    {!isValid && validationMessage && (
                      <p className="text-xs text-red-600 mt-2 font-medium leading-tight">
                        {validationMessage}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedVehicle && selectedVehicle.id !== 'van' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-800">Truck Body Type</h3>
              <span className="text-red-500 ml-1">*</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {getAvailableTruckBodyTypes().map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setTruckBodyType(type);
                    // Clear refrigeration if selecting incompatible body type
                    if ((type === 'Curtain Sider' || type === 'Flatbed') && isRefrigerated) {
                      setIsRefrigerated(false);
                    }
                  }}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    truckBodyType === type 
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="font-medium text-slate-800">{type}</span>
                    </div>
                    {truckBodyType === type && (
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800">Additional Options</h3>
          </div>
          
          <div className={`flex items-center p-4 rounded-xl border ${
            isRefrigerationDisabled() 
              ? 'bg-slate-100 border-slate-300 opacity-60' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <input
              type="checkbox"
              id="refrigerated"
              checked={isRefrigerated}
              disabled={isRefrigerationDisabled()}
              onChange={(e) => {
                setIsRefrigerated(e.target.checked);
              }}
              className={`mr-3 w-4 h-4 rounded ${
                isRefrigerationDisabled()
                  ? 'text-slate-400 focus:ring-slate-300 cursor-not-allowed'
                  : 'text-blue-600 focus:ring-blue-500'
              }`}
            />
            <label 
              htmlFor="refrigerated" 
              className={`flex items-center ${
                isRefrigerationDisabled() 
                  ? 'text-slate-400 cursor-not-allowed' 
                  : 'text-slate-700'
              }`}
            >
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Refrigerated Transport
              {isRefrigerationDisabled() && (
                <span className="ml-2 text-xs text-slate-500">(Not available with Curtain Sider or Flatbed)</span>
              )}
            </label>
          </div>

          {/* Crane Service Option - Show only when crane/hiab method is selected */}
          {hasCraneHiabMethod() && (
            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 mt-4">
              <input
                type="checkbox"
                id="crane-service"
                checked={craneHiabOption === 'crane'}
                onChange={(e) => setCraneHiabOption(e.target.checked ? 'crane' : '')}
                className="mr-3 text-orange-600 focus:ring-orange-500 w-4 h-4 rounded"
              />
              <label htmlFor="crane-service" className="text-slate-700 flex items-center">
                <span className="text-lg mr-2">🏗️</span>
                Crane Service
              </label>
            </div>
          )}

          {/* Hiab Service Option - Show only when crane/hiab method is selected */}
          {hasCraneHiabMethod() && (
            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 mt-4">
              <input
                type="checkbox"
                id="hiab-service"
                checked={craneHiabOption === 'hiab'}
                onChange={(e) => setCraneHiabOption(e.target.checked ? 'hiab' : '')}
                className="mr-3 text-orange-600 focus:ring-orange-500 w-4 h-4 rounded"
              />
              <label htmlFor="hiab-service" className="text-slate-700 flex items-center">
                <span className="text-lg mr-2">🚛</span>
                Hiab Service
              </label>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedVehicle || !isVehicleValid(selectedVehicle) || (selectedVehicle.id !== 'van' && !truckBodyType)}
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
        >
          Continue to Transfer Details
        </button>
      </div>
    </div>
  );
};

// Transfer Type Screen
const TransferTypeScreen = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50">
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

// Helper function to get goods summary
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

// Review Screen
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

// Payment Screen
const PaymentScreen = ({ jobData, onNext, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const calculateTotal = () => {
    const baseRate = jobData.vehicle?.id === 'van' ? 80 : 150;
    const distanceMultiplier = 1.5;
    const subtotal = Math.round(baseRate * distanceMultiplier);
    const gst = Math.round(subtotal * 0.1);
    return { subtotal, gst, total: subtotal + gst };
  };

  const { subtotal, gst, total } = calculateTotal();

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    setTimeout(() => {
      const success = Math.random() > 0.3;
      
      if (success) {
        onNext();
      } else {
        setPaymentError('Payment failed. Please check your card details and try again.');
      }
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Payment" onBack={onBack} />
      <ProgressBar currentStep={7} totalSteps={8} stepNames={['Job Type', 'Location Count', 'Location & Goods', 'Vehicle', 'Transfer', 'Review', 'Payment', 'Confirmation']} />
      
      <div className="p-6 space-y-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Secure Payment</h2>
              <p className="text-sm opacity-90">Complete your booking with secure payment</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Shipping Service</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>GST (10%)</span>
              <span>${gst}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Method</h3>
          
          <div className="space-y-3 mb-6">
            <div
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border-2 rounded-lg cursor-pointer flex items-center transition-all ${
                paymentMethod === 'card' ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100' : 'border-slate-200'
              }`}
            >
              <span className="mr-3 text-xl">💳</span>
              <span>Credit/Debit Card</span>
              {paymentMethod === 'card' && <span className="ml-auto text-blue-500">✅</span>}
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="John Smith"
                />
              </div>
            </div>
          )}
        </div>

        {paymentError && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
            <div className="flex items-center text-red-800">
              <span className="mr-2">❌</span>
              <span className="font-medium">Payment Failed</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{paymentError}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isProcessing || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center justify-center transform hover:scale-105 disabled:transform-none"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <span className="mr-2">💳</span>
              Pay ${total}
            </>
          )}
        </button>

        <button
          onClick={onNext}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-slate-500 to-slate-600 text-white p-4 rounded-lg font-medium hover:from-slate-600 hover:to-slate-700 transition-all flex items-center justify-center transform hover:scale-105 mt-3"
        >
          <span className="mr-2">📋</span>
          Pay Later - Confirm Booking
        </button>
      </div>
    </div>
  );
};

const BookingConfirmedScreen = ({ jobData }) => {
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
            onClick={() => downloadReactPDF(jobData, jobId, otp)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Documentation
          </button>
         
          <button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-lg font-medium hover:from-slate-700 hover:to-slate-800 transition-all flex items-center justify-center transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Track Shipment
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Job
          </button>
          
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

// Main App Component
const App = () => {
  const [currentStep, setCurrentStep] = useState('jobType');
  const [jobData, setJobData] = useState({
    jobType: '',
    pickupCount: 1,
    deliveryCount: 1,
    pickups: [],
    deliveries: [],
    pickupGoods: [],
    deliveryGoods: [],
    vehicle: null,
    truckBodyType: '',
    isRefrigerated: false,
    craneHiabOption: ''
  });

  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [currentLocationType, setCurrentLocationType] = useState('pickup'); // 'pickup' or 'delivery'
  const [currentGoodsIndex, setCurrentGoodsIndex] = useState(0);
  const [currentGoodsType, setCurrentGoodsType] = useState('pickup'); // 'pickup' or 'delivery'

  const handleJobTypeSelect = (jobType) => {
    setJobData({ ...jobData, jobType });
    if (jobType === 'single') {
      setJobData(prev => ({ ...prev, jobType, pickupCount: 1, deliveryCount: 1 }));
      setCurrentStep('locations');
      setCurrentLocationType('pickup');
      setCurrentLocationIndex(0);
    } else {
      setCurrentStep('locationCount');
    }
  };

  const handleLocationCountNext = (count) => {
    let newJobData;
    let initialLocationType;
    
    if (jobData.jobType === 'multi-pickup') {
      newJobData = { ...jobData, pickupCount: count, deliveryCount: 1 };
      // For multi-pickup: delivery first, then pickups
      initialLocationType = 'delivery';
    } else {
      newJobData = { ...jobData, pickupCount: 1, deliveryCount: count };
      // For multi-drop: pickup first, then deliveries
      initialLocationType = 'pickup';
    }
    
    setJobData(newJobData);
    setCurrentStep('locations');
    setCurrentLocationType(initialLocationType);
    setCurrentLocationIndex(0);
  };

  const handleLocationNext = (locationData) => {
    const newJobData = { ...jobData };
    
    if (currentLocationType === 'pickup') {
      if (!newJobData.pickups) newJobData.pickups = [];
      newJobData.pickups[currentLocationIndex] = locationData;
      
      // For single and multi-drop: pickup doesn't need goods, skip to next step
      // For multi-pickup: pickup needs goods
      if (jobData.jobType === 'single' || jobData.jobType === 'multi-drop') {
        // Skip goods for pickup in single and multi-drop, move to deliveries
        setCurrentStep('locations');
        setCurrentLocationType('delivery');
        setCurrentLocationIndex(0);
      } else {
        // Go to goods for this pickup (multi-pickup only)
        setCurrentStep('goods');
        setCurrentGoodsType('pickup');
        setCurrentGoodsIndex(currentLocationIndex);
      }
    } else {
      // delivery
      if (!newJobData.deliveries) newJobData.deliveries = [];
      newJobData.deliveries[currentLocationIndex] = locationData;
      
      // For multi-pickup: delivery doesn't need goods, skip to pickups
      // For single and multi-drop: delivery needs goods
      if (jobData.jobType === 'multi-pickup') {
        // Skip goods for delivery in multi-pickup, move to pickups
        setCurrentStep('locations');
        setCurrentLocationType('pickup');
        setCurrentLocationIndex(0);
      } else {
        // Go to goods for this delivery (single or multi-drop)
        setCurrentStep('goods');
        setCurrentGoodsType('delivery');
        setCurrentGoodsIndex(currentLocationIndex);
      }
    }
    
    setJobData(newJobData);
  };

  const handleGoodsNext = (goodsData) => {
    const newJobData = { ...jobData };
    
    if (currentGoodsType === 'pickup') {
      if (!newJobData.pickupGoods) newJobData.pickupGoods = [];
      newJobData.pickupGoods[currentGoodsIndex] = goodsData;
      
      if (jobData.jobType === 'multi-pickup') {
        // Multi-pickup: check if we need more pickups
        if (currentLocationIndex < jobData.pickupCount - 1) {
          // More pickups to go - go to next pickup
          setCurrentStep('locations');
          setCurrentLocationType('pickup');
          setCurrentLocationIndex(currentLocationIndex + 1);
        } else {
          // All pickups done, we're finished (delivery was done first without goods)
          setCurrentStep('vehicle');
        }
      } else if (jobData.jobType === 'single') {
        // Single job: pickup goods done, move to delivery
        setCurrentStep('locations');
        setCurrentLocationType('delivery');
        setCurrentLocationIndex(0);
      }
    } else {
      // delivery goods
      if (!newJobData.deliveryGoods) newJobData.deliveryGoods = [];
      newJobData.deliveryGoods[currentGoodsIndex] = goodsData;
      
      if (jobData.jobType === 'multi-drop') {
        // Multi-drop: check if we need more deliveries
        if (currentLocationIndex < jobData.deliveryCount - 1) {
          // More deliveries to go - go to next delivery
          setCurrentStep('locations');
          setCurrentLocationType('delivery');
          setCurrentLocationIndex(currentLocationIndex + 1);
        } else {
          // All deliveries done, we're finished (pickup was done first without goods)
          setCurrentStep('vehicle');
        }
      } else if (jobData.jobType === 'single') {
        // Single job: delivery goods done, move to vehicle
        setCurrentStep('vehicle');
      }
    }
    
    setJobData(newJobData);
  };

  const handleVehicleNext = (vehicleData) => {
    setJobData({ ...jobData, ...vehicleData });
    
    // Check if pallets are selected in any goods
    const hasPallets = () => {
      let goodsData = [];
      
      if (jobData.jobType === 'multi-pickup') {
        goodsData = jobData.pickupGoods || [];
      } else {
        goodsData = jobData.deliveryGoods || [];
      }
      
      return goodsData.some(goods => 
        goods && goods.packagingTypes && goods.packagingTypes.pallets && goods.packagingTypes.pallets.selected
      );
    };
    
    // Skip transfer screen if no pallets selected
    if (hasPallets()) {
      setCurrentStep('transfer');
    } else {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'locationCount':
        setCurrentStep('jobType');
        break;
      case 'locations':
        if (jobData.jobType === 'multi-pickup') {
          // Multi-pickup: delivery first (no goods), then pickups (with goods)
          if (currentLocationType === 'delivery' && currentLocationIndex === 0) {
            // First delivery, go back to location count
            setCurrentStep('locationCount');
          } else if (currentLocationType === 'pickup' && currentLocationIndex === 0) {
            // First pickup, go back to delivery location (no goods screen)
            setCurrentStep('locations');
            setCurrentLocationType('delivery');
            setCurrentLocationIndex(0);
          } else {
            // Go back to previous pickup's goods
            setCurrentStep('goods');
            setCurrentGoodsType('pickup');
            setCurrentGoodsIndex(currentLocationIndex - 1);
          }
        } else if (jobData.jobType === 'multi-drop') {
          // Multi-drop: pickup first (no goods), then deliveries (with goods)
          if (currentLocationType === 'pickup' && currentLocationIndex === 0) {
            // First pickup, go back to location count
            setCurrentStep('locationCount');
          } else if (currentLocationType === 'delivery' && currentLocationIndex === 0) {
            // First delivery, go back to pickup location (no goods screen)
            setCurrentStep('locations');
            setCurrentLocationType('pickup');
            setCurrentLocationIndex(0);
          } else {
            // Go back to previous delivery's goods
            setCurrentStep('goods');
            setCurrentGoodsType('delivery');
            setCurrentGoodsIndex(currentLocationIndex - 1);
          }
        } else {
          // Single job
          if (currentLocationType === 'pickup' && currentLocationIndex === 0) {
            setCurrentStep('jobType');
          } else if (currentLocationType === 'delivery' && currentLocationIndex === 0) {
            // Go back to pickup location (no goods for pickup in single jobs)
            setCurrentStep('locations');
            setCurrentLocationType('pickup');
            setCurrentLocationIndex(0);
          }
        }
        break;
      case 'goods':
        // Go back to the location screen for this same location
        setCurrentStep('locations');
        setCurrentLocationType(currentGoodsType);
        setCurrentLocationIndex(currentGoodsIndex);
        break;
      case 'vehicle':
        // Go back to last completed step based on job type
        if (jobData.jobType === 'multi-pickup') {
          // Last would be pickup goods
          setCurrentStep('goods');
          setCurrentGoodsType('pickup');
          setCurrentGoodsIndex(jobData.pickupCount - 1);
        } else if (jobData.jobType === 'multi-drop') {
          // Last would be delivery goods
          setCurrentStep('goods');
          setCurrentGoodsType('delivery');
          setCurrentGoodsIndex(jobData.deliveryCount - 1);
        } else {
          // Single job - last would be delivery goods
          setCurrentStep('goods');
          setCurrentGoodsType('delivery');
          setCurrentGoodsIndex(0);
        }
        break;
      case 'transfer':
        setCurrentStep('vehicle');
        break;
      case 'review':
        // Check if transfer screen was shown (only if pallets selected)
        const hasPallets = () => {
          let goodsData = [];
          
          if (jobData.jobType === 'multi-pickup') {
            goodsData = jobData.pickupGoods || [];
          } else {
            goodsData = jobData.deliveryGoods || [];
          }
          
          return goodsData.some(goods => 
            goods && goods.packagingTypes && goods.packagingTypes.pallets && goods.packagingTypes.pallets.selected
          );
        };
        
        if (hasPallets()) {
          setCurrentStep('transfer');
        } else {
          setCurrentStep('vehicle');
        }
        break;
      case 'payment':
        setCurrentStep('review');
        break;
      default:
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 'jobType':
        return <JobTypeScreen onSelect={handleJobTypeSelect} />;
      
      case 'locationCount':
        return (
          <LocationCountScreen 
            jobType={jobData.jobType}
            onNext={handleLocationCountNext}
            onBack={handleBack}
            jobData={jobData}
          />
        );
      
      case 'locations':
        const totalLocations = currentLocationType === 'pickup' ? jobData.pickupCount : jobData.deliveryCount;
        const currentLocationData = currentLocationType === 'pickup' 
          ? jobData.pickups?.[currentLocationIndex] 
          : jobData.deliveries?.[currentLocationIndex];
        
        // Get date for auto-selection based on job type and location type
        let inheritedDate = null;
        
        if (jobData.jobType === 'single' || jobData.jobType === 'multi-drop') {
          // For single and multi-drop: use pickup date for delivery screens
          if (currentLocationType === 'delivery') {
            inheritedDate = jobData.pickups?.[0]?.date || null;
          }
        } else if (jobData.jobType === 'multi-pickup') {
          if (currentLocationType === 'pickup' && currentLocationIndex > 0) {
            // For multi-pickup: use first pickup date for subsequent pickups
            inheritedDate = jobData.pickups?.[0]?.date || null;
          } else if (currentLocationType === 'delivery') {
            // For multi-pickup delivery: use last pickup date
            const lastPickupIndex = (jobData.pickupCount || 1) - 1;
            inheritedDate = jobData.pickups?.[lastPickupIndex]?.date || null;
          }
        }
        
        return (
          <LocationDetailsScreen 
            key={`${currentLocationType}-${currentLocationIndex}`}
            locationType={currentLocationType}
            locationIndex={currentLocationIndex}
            totalLocations={totalLocations}
            onNext={handleLocationNext}
            onBack={handleBack}
            initialData={currentLocationData || {}}
            pickupDate={inheritedDate}
          />
        );
      
      case 'goods':
        const totalGoodsLocations = currentGoodsType === 'pickup' ? jobData.pickupCount : jobData.deliveryCount;
        const currentLocationForGoods = currentGoodsType === 'pickup' 
          ? jobData.pickups?.[currentGoodsIndex] 
          : jobData.deliveries?.[currentGoodsIndex];
        const currentGoodsData = currentGoodsType === 'pickup' 
          ? jobData.pickupGoods?.[currentGoodsIndex] 
          : jobData.deliveryGoods?.[currentGoodsIndex];
        
        return (
          <GoodsDetailsScreen 
            key={`${currentGoodsType}-goods-${currentGoodsIndex}`}
            locationType={currentGoodsType}
            locationIndex={currentGoodsIndex}
            totalLocations={totalGoodsLocations}
            locationData={currentLocationForGoods}
            onNext={handleGoodsNext}
            onBack={handleBack}
            initialGoods={currentGoodsData}
            jobData={jobData}
          />
        );
      
      case 'vehicle':
        return (
          <VehicleSelectionScreen 
            onNext={handleVehicleNext}
            onBack={handleBack}
            initialData={jobData}
            jobData={jobData}
          />
        );
      
      case 'transfer':
        return (
          <TransferTypeScreen 
            onNext={() => setCurrentStep('review')}
            onBack={handleBack}
          />
        );
      
      case 'review':
        return (
          <ReviewScreen 
            jobData={jobData}
            onNext={() => setCurrentStep('payment')}
            onBack={handleBack}
            onEditPickup={(index) => {
              setCurrentLocationIndex(index);
              setCurrentLocationType('pickup');
              setCurrentStep('locations');
            }}
            onEditDelivery={(index) => {
              setCurrentLocationIndex(index);
              setCurrentLocationType('delivery');
              setCurrentStep('locations');
            }}
            onEditVehicle={() => {
              setCurrentStep('vehicle');
            }}
          />
        );
      
      case 'payment':
        return (
          <PaymentScreen 
            jobData={jobData}
            onNext={() => setCurrentStep('confirmed')}
            onBack={handleBack}
          />
        );
      
      case 'confirmed':
        return <BookingConfirmedScreen jobData={jobData} />;
      
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default App;