import React, { useState } from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';

/**
 * VehicleSelectionScreen Component
 * 
 * Handles vehicle selection based on goods requirements with validation.
 * Features truck body type selection, refrigeration options, and crane/hiab services.
 * 
 * Props:
 * - onNext: Function to proceed to next step with vehicle data
 * - onBack: Function to go back to previous step
 * - initialData: Object containing previously selected vehicle data
 * - jobData: Object containing complete job information for requirements calculation
 * 
 * Component manages vehicle capacity validation against goods requirements
 * and provides truck-specific configuration options.
 */
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

export default VehicleSelectionScreen;
export { VehicleSelectionScreen };