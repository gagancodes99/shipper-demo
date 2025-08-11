import { useState } from 'react';
import { defaultJobData } from '../data/mockData';

/**
 * Custom hook for managing job data state and navigation
 * Handles the complex multi-step form flow for shipping job creation
 * 
 * @returns {Object} Job data state and handlers
 */
export const useJobData = () => {
  // Main state management
  const [currentStep, setCurrentStep] = useState('jobType');
  const [jobData, setJobData] = useState(defaultJobData);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [currentLocationType, setCurrentLocationType] = useState('pickup'); // 'pickup' or 'delivery'
  const [currentGoodsIndex, setCurrentGoodsIndex] = useState(0);
  const [currentGoodsType, setCurrentGoodsType] = useState('pickup'); // 'pickup' or 'delivery'

  /**
   * Handle job type selection - Step 1
   * @param {string} jobType - The selected job type ('single', 'multi-pickup', 'multi-drop')
   */
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

  /**
   * Handle location count selection - Step 2
   * @param {number} count - Number of locations for multi-pickup or multi-drop
   */
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

  /**
   * Handle location details submission - Step 3
   * @param {Object} locationData - Location form data
   */
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
      
      // For multi-pickup: delivery doesn't need goods, move to pickups after 1 delivery
      // For single and multi-drop: delivery needs goods
      if (jobData.jobType === 'multi-pickup') {
        // Multi-pickup always has deliveryCount=1, so after first delivery, go to pickups
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

  /**
   * Handle goods details submission - Step 3 (goods sub-step)
   * @param {Object} goodsData - Goods form data including packaging details
   */
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

  /**
   * Handle vehicle selection - Step 4
   * @param {Object} vehicleData - Vehicle selection data
   */
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

  /**
   * Check if current job has pallets that require transfer type selection
   * @returns {boolean} True if job has pallets selected
   */
  const hasSelectedPallets = () => {
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

  /**
   * Handle back navigation with complex multi-step logic
   */
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
        if (hasSelectedPallets()) {
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

  /**
   * Move to next step (generic handler)
   * @param {string} step - The step to move to
   */
  const setStep = (step) => {
    setCurrentStep(step);
  };

  /**
   * Reset all job data to initial state
   */
  const resetJobData = () => {
    setJobData(defaultJobData);
    setCurrentStep('jobType');
    setCurrentLocationIndex(0);
    setCurrentLocationType('pickup');
    setCurrentGoodsIndex(0);
    setCurrentGoodsType('pickup');
  };

  /**
   * Update job data partially
   * @param {Object} updates - Partial job data updates
   */
  const updateJobData = (updates) => {
    setJobData(prev => ({ ...prev, ...updates }));
  };

  return {
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
    resetJobData,
    updateJobData,
    hasSelectedPallets,
    
    // Setters for advanced control
    setCurrentLocationIndex,
    setCurrentLocationType,
    setCurrentGoodsIndex,
    setCurrentGoodsType
  };
};