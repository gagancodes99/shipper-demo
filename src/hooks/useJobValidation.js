import { useMemo } from 'react';

/**
 * Custom hook for job data validation and business logic
 * Handles form validation, vehicle capacity validation, and business rules
 * 
 * @param {Object} jobData - Current job data state
 * @returns {Object} Validation functions and computed values
 */
export const useJobValidation = (jobData) => {
  
  /**
   * Calculate total weight from all goods in the job
   * @returns {number} Total weight in tonnes
   */
  const totalWeight = useMemo(() => {
    let weight = 0;
    
    // Add pickup goods weight (for multi-pickup jobs)
    if (jobData.pickupGoods && Array.isArray(jobData.pickupGoods)) {
      jobData.pickupGoods.forEach(goods => {
        if (goods && goods.packagingTypes) {
          const types = goods.packagingTypes;
          
          // Add pallet weights
          if (types.pallets && types.pallets.selected && types.pallets.configurations) {
            types.pallets.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0);
            });
          }
          
          // Add box weights
          if (types.boxes && types.boxes.selected && types.boxes.configurations) {
            types.boxes.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0) / 1000; // Convert kg to tonnes
            });
          }
          
          // Add bag weights
          if (types.bags && types.bags.selected && types.bags.configurations) {
            types.bags.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0) / 1000; // Convert kg to tonnes
            });
          }
          
          // Add loose items weights
          if (types.looseItems && types.looseItems.selected && types.looseItems.configurations) {
            types.looseItems.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0) / 1000; // Convert kg to tonnes
            });
          }
        }
      });
    }
    
    // Add delivery goods weight (for single and multi-drop jobs)
    if (jobData.deliveryGoods && Array.isArray(jobData.deliveryGoods)) {
      jobData.deliveryGoods.forEach(goods => {
        if (goods && goods.packagingTypes) {
          const types = goods.packagingTypes;
          
          // Add pallet weights
          if (types.pallets && types.pallets.selected && types.pallets.configurations) {
            types.pallets.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0);
            });
          }
          
          // Add box weights
          if (types.boxes && types.boxes.selected && types.boxes.configurations) {
            types.boxes.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0) / 1000; // Convert kg to tonnes
            });
          }
          
          // Add bag weights
          if (types.bags && types.bags.selected && types.bags.configurations) {
            types.bags.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0) / 1000; // Convert kg to tonnes
            });
          }
          
          // Add loose items weights
          if (types.looseItems && types.looseItems.selected && types.looseItems.configurations) {
            types.looseItems.configurations.forEach(config => {
              weight += (config.weight || 0) * (config.quantity || 0) / 1000; // Convert kg to tonnes
            });
          }
        }
      });
    }
    
    return Math.round(weight * 100) / 100; // Round to 2 decimal places
  }, [jobData.pickupGoods, jobData.deliveryGoods]);

  /**
   * Calculate total pallets from all goods in the job
   * @returns {number} Total number of pallets
   */
  const totalPallets = useMemo(() => {
    let pallets = 0;
    
    // Add pickup goods pallets
    if (jobData.pickupGoods && Array.isArray(jobData.pickupGoods)) {
      jobData.pickupGoods.forEach(goods => {
        if (goods && goods.packagingTypes && goods.packagingTypes.pallets && 
            goods.packagingTypes.pallets.selected && goods.packagingTypes.pallets.configurations) {
          goods.packagingTypes.pallets.configurations.forEach(config => {
            pallets += config.quantity || 0;
          });
        }
      });
    }
    
    // Add delivery goods pallets
    if (jobData.deliveryGoods && Array.isArray(jobData.deliveryGoods)) {
      jobData.deliveryGoods.forEach(goods => {
        if (goods && goods.packagingTypes && goods.packagingTypes.pallets && 
            goods.packagingTypes.pallets.selected && goods.packagingTypes.pallets.configurations) {
          goods.packagingTypes.pallets.configurations.forEach(config => {
            pallets += config.quantity || 0;
          });
        }
      });
    }
    
    return pallets;
  }, [jobData.pickupGoods, jobData.deliveryGoods]);

  /**
   * Validate if a vehicle can handle the current job requirements
   * @param {Object} vehicle - Vehicle object with maxWeight and maxPallets
   * @returns {boolean} True if vehicle is valid for the job
   */
  const isVehicleValid = (vehicle) => {
    // If no goods are configured yet, all vehicles are valid
    if (totalWeight === 0 && totalPallets === 0) {
      return true;
    }
    
    const weightValid = totalWeight <= vehicle.maxWeight;
    const palletsValid = totalPallets <= vehicle.maxPallets;
    return weightValid && palletsValid;
  };

  /**
   * Get validation message for a vehicle
   * @param {Object} vehicle - Vehicle object with maxWeight and maxPallets
   * @returns {string} Validation message or empty string if valid
   */
  const getVehicleValidationMessage = (vehicle) => {
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

  /**
   * Validate location form data
   * @param {Object} formData - Location form data
   * @param {string} locationType - 'pickup' or 'delivery'
   * @returns {boolean} True if location data is valid
   */
  const isLocationDataValid = (formData, locationType) => {
    const requiredFields = [
      'customerName',
      'address', 
      'date', 
      'time'
    ];
    
    // Mobile number is required for pickup locations only
    if (locationType === 'pickup') {
      requiredFields.push('recipientMobile');
    }
    
    // Appointment details required if trading hours is 'On Appointment'
    const appointmentValid = formData.tradingHours === 'On Appointment' 
      ? Boolean(formData.appointmentDetails) 
      : true;
    
    // Check all required fields are present and not empty
    const fieldsValid = requiredFields.every(field => 
      formData[field] && formData[field].toString().trim() !== ''
    );
    
    return fieldsValid && appointmentValid;
  };

  /**
   * Validate goods/packaging data
   * @param {Object} goodsData - Goods form data
   * @returns {boolean} True if goods data is valid
   */
  const isGoodsDataValid = (goodsData) => {
    if (!goodsData || !goodsData.packagingTypes) {
      return false;
    }
    
    const types = goodsData.packagingTypes;
    
    // At least one packaging type must be selected
    const hasSelectedType = types.pallets?.selected || 
                           types.boxes?.selected || 
                           types.bags?.selected || 
                           types.looseItems?.selected;
    
    if (!hasSelectedType) {
      return false;
    }
    
    // Validate each selected type has valid configurations
    if (types.pallets?.selected) {
      const configs = types.pallets.configurations || [];
      if (configs.length === 0 || !configs.every(config => 
        config.quantity > 0 && config.weight > 0 && config.type
      )) {
        return false;
      }
    }
    
    if (types.boxes?.selected) {
      const configs = types.boxes.configurations || [];
      if (configs.length === 0 || !configs.every(config => 
        config.quantity > 0 && config.weight > 0 && 
        config.length > 0 && config.width > 0 && config.height > 0
      )) {
        return false;
      }
    }
    
    if (types.bags?.selected) {
      const configs = types.bags.configurations || [];
      if (configs.length === 0 || !configs.every(config => 
        config.quantity > 0 && config.weight > 0 && 
        config.length > 0 && config.width > 0 && config.height > 0
      )) {
        return false;
      }
    }
    
    if (types.looseItems?.selected) {
      const configs = types.looseItems.configurations || [];
      if (configs.length === 0 || !configs.every(config => 
        config.quantity > 0 && config.weight > 0 && config.description
      )) {
        return false;
      }
    }
    
    return true;
  };

  /**
   * Check if packaging type limits are enforced for multi-location jobs
   * @param {string} jobType - Job type ('single', 'multi-pickup', 'multi-drop')
   * @param {string} locationType - 'pickup' or 'delivery'
   * @param {number} totalLocations - Total number of locations of this type
   * @returns {Object} Validation rules for packaging types
   */
  const getPackagingLimits = (jobType, locationType, totalLocations) => {
    const isMultiLocation = totalLocations > 1;
    const shouldEnforceLimits = (locationType === 'pickup' && jobType === 'multi-pickup') || 
                               (locationType === 'delivery' && jobType === 'multi-drop');
    
    return {
      enforceCapacityLimits: isMultiLocation && shouldEnforceLimits,
      maxDropOffCount: 10, // Business rule: max 10 drop-offs for limited capacity items
      limitedCapacityTypes: ['boxes', 'bags', 'looseItems'] // Types that have capacity limits
    };
  };

  /**
   * Validate packaging against business rules
   * @param {Object} packagingTypes - Selected packaging types
   * @param {Object} limits - Packaging limits from getPackagingLimits
   * @param {number} dropOffCount - Number of drop-off locations
   * @returns {Object} Validation result with isValid and message
   */
  const validatePackagingLimits = (packagingTypes, limits, dropOffCount) => {
    if (!limits.enforceCapacityLimits) {
      return { isValid: true, message: '' };
    }
    
    const hasLimitedCapacityItems = limits.limitedCapacityTypes.some(type => 
      packagingTypes[type]?.selected
    );
    
    if (hasLimitedCapacityItems && dropOffCount > limits.maxDropOffCount) {
      const locationType = limits.enforceCapacityLimits ? 'pickup' : 'drop-off';
      return {
        isValid: false,
        message: `Limited capacity items (boxes, bags, loose items) are restricted to ${limits.maxDropOffCount} ${locationType} locations maximum.`
      };
    }
    
    return { isValid: true, message: '' };
  };

  /**
   * Check if job data is complete and ready for review
   * @returns {boolean} True if job is complete
   */
  const isJobComplete = () => {
    // Basic job data must be present
    if (!jobData.jobType || !jobData.vehicle) {
      return false;
    }
    
    // All locations must be configured
    const requiredPickups = jobData.pickupCount || 0;
    const requiredDeliveries = jobData.deliveryCount || 0;
    const configuredPickups = (jobData.pickups || []).length;
    const configuredDeliveries = (jobData.deliveries || []).length;
    
    if (configuredPickups !== requiredPickups || configuredDeliveries !== requiredDeliveries) {
      return false;
    }
    
    // Goods must be configured for locations that require them
    if (jobData.jobType === 'multi-pickup') {
      // Multi-pickup: pickups need goods
      const requiredGoods = jobData.pickupCount;
      const configuredGoods = (jobData.pickupGoods || []).length;
      return configuredGoods === requiredGoods;
    } else {
      // Single and multi-drop: deliveries need goods
      const requiredGoods = jobData.deliveryCount;
      const configuredGoods = (jobData.deliveryGoods || []).length;
      return configuredGoods === requiredGoods;
    }
  };

  return {
    // Computed values
    totalWeight,
    totalPallets,
    
    // Vehicle validation
    isVehicleValid,
    getVehicleValidationMessage,
    
    // Form validation
    isLocationDataValid,
    isGoodsDataValid,
    
    // Business rules
    getPackagingLimits,
    validatePackagingLimits,
    
    // Job completion
    isJobComplete
  };
};