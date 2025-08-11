import React, { useState } from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';

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

/**
 * GoodsDetailsScreen component allows users to enter detailed information about goods being shipped
 * 
 * @param {Object} props - Component props
 * @param {string} props.locationType - Type of location ('pickup' or 'delivery')
 * @param {number} props.locationIndex - Current location index
 * @param {number} props.totalLocations - Total number of locations
 * @param {Object} props.locationData - Data about the current location
 * @param {Function} props.onNext - Callback function when continuing to next step
 * @param {Function} props.onBack - Callback function when going back to previous step
 * @param {Object} [props.initialGoods=null] - Initial goods data
 * @param {Object} [props.jobData={}] - Current job data
 * @returns {JSX.Element} Rendered goods details screen
 */
const GoodsDetailsScreen = ({ 
  locationType = 'delivery', 
  locationIndex = 0, 
  totalLocations = 1,
  locationData = {},
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
  const methodOptions = ['Forklift', 'Loading Dock', 'Hand Carry', 'Crane/Hiab'];

  const handlePackagingToggle = (type) => {
    // Check if the packaging type is allowed
    const packagingType = packagingTypes.find(pt => pt.id === type);
    if (!packagingType || !packagingType.allowed) {
      return;
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
    // allowed: relevantLocationCount <= 10 // Pallets only allowed for up to 10 locations
    allowed: true // Pallets only allowed for up to 10 locations
  },
  { 
    id: 'boxes', 
    name: 'Boxes & Cartons', 
    icon: '📦', 
    description: 'Packaged boxes and cartons',
    allowed: true // Always allowed
  },
  { 
    id: 'bags', 
    name: 'Bags & Sacks', 
    icon: '🛍️', 
    description: 'Bagged or sacked items',
    allowed:true// Bags only allowed for up to 10 locations
    // allowed: relevantLocationCount <= 10 // Bags only allowed for up to 10 locations
  },
  { 
    id: 'others', 
    name: 'Loose items', 
    icon: '📋', 
    description: 'Other packaging types',
    allowed: true // Always allowed
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
    <div className="min-h-screen bg-slate-50 max-w-sm mx-auto">
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
      onClick={() => type.allowed && handlePackagingToggle(type.id)}
      disabled={!type.allowed}
      className={`w-full p-4 rounded-xl border transition-all text-left relative ${
        !type.allowed
          ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
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

export { GoodsDetailsScreen };
export default GoodsDetailsScreen;