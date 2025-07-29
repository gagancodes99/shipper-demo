import React, { useState, useEffect } from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';

// Mock data for addresses
const mockAddresses = [
  { id: 1, name: "John Smith", address: "123 Main St", suburb: "Sydney", postcode: "2000", isDefault: true },
  { id: 2, name: "ABC Warehouse", address: "456 Industrial Ave", suburb: "Melbourne", postcode: "3000", isDefault: false },
  { id: 3, name: "XYZ Logistics", address: "789 Transport Rd", suburb: "Brisbane", postcode: "4000", isDefault: false }
];

// Address Book Modal Component
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

/**
 * LocationDetailsScreen component allows users to enter pickup or delivery location details
 * 
 * @param {Object} props - Component props
 * @param {string} props.locationType - Type of location ('pickup' or 'delivery')
 * @param {number} props.locationIndex - Current location index
 * @param {number} props.totalLocations - Total number of locations
 * @param {Function} props.onNext - Callback function when continuing to next step
 * @param {Function} props.onBack - Callback function when going back to previous step
 * @param {Object} [props.initialData={}] - Initial form data
 * @param {string} [props.pickupDate=null] - Auto-selected date from previous locations
 * @returns {JSX.Element} Rendered location details screen
 */
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

  // Sync form data when initial data changes
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-book-user-icon lucide-book-user"
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

export { LocationDetailsScreen };
export default LocationDetailsScreen;