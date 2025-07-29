import React, { useState } from 'react';

/**
 * AddressBookModal Component
 * 
 * A modal component for managing address book functionality including:
 * - Displaying saved addresses with default address indication
 * - Adding new addresses with form validation
 * - Address selection for form auto-fill
 * 
 * Props:
 * - isOpen (boolean): Controls modal visibility
 * - onClose (function): Handler for closing the modal
 * - addresses (array): Array of address objects with id, name, address, suburb, postcode, isDefault
 * - onSelect (function): Handler for address selection
 * - onAdd (function): Handler for adding new address
 */
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

export { AddressBookModal };
export default AddressBookModal;