import React, { useState } from 'react';

/**
 * GenericConfigModal Component
 * 
 * A versatile modal component for configuring various packaging types including:
 * - Boxes & Cartons
 * - Bags & Sacks  
 * - Other packaging types
 * 
 * Features:
 * - Quantity management with increment/decrement controls
 * - Weight input with validation
 * - Multi-dimensional input (Length x Width x Height)
 * - Dynamic title and type support
 * - Real-time summary display
 * 
 * Props:
 * - isOpen (boolean): Controls modal visibility
 * - onClose (function): Handler for closing the modal
 * - data (object): Initial configuration data with quantity, weight, dimensions
 * - onSave (function): Handler for saving configuration
 * - title (string): Modal title (e.g., "Boxes & Cartons", "Bags & Sacks")
 * - type (string): Package type for summary display (e.g., "boxes", "bags")
 */
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

export { GenericConfigModal };
export default GenericConfigModal;