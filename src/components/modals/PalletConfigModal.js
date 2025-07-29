import React, { useState } from 'react';

/**
 * PalletConfigModal Component
 * 
 * A specialized modal component for configuring pallet packaging with:
 * - Multiple pallet type selection (CHEP, LOSCAM, Plain Wood, Custom)
 * - Quantity management with increment/decrement controls
 * - Security option toggle with pricing indicator
 * - Weight input with validation
 * - Custom dimensions for "Other" pallet types
 * - Real-time summary display
 * 
 * Props:
 * - isOpen (boolean): Controls modal visibility
 * - onClose (function): Handler for closing the modal
 * - data (object): Initial configuration data with quantity, weight, secured, palletTypes, otherDimensions
 * - onSave (function): Handler for saving configuration
 */
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

export { PalletConfigModal };
export default PalletConfigModal;