import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * JobsContext - Manages job data, CRUD operations, and job lifecycle
 * 
 * Features:
 * - Job data management and persistence
 * - CRUD operations for jobs
 * - Job status tracking and updates
 * - Integration with existing booking flow data structures
 * - Search and filter functionality
 * - Real-time job updates
 */

const JobsContext = createContext(null);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

// Job status constants
export const JOB_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Job priority constants
export const JOB_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const JobsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Load jobs from localStorage on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserJobs();
    }
  }, [isAuthenticated, user]);

  /**
   * Load jobs from localStorage for the current user
   */
  const loadUserJobs = () => {
    try {
      setIsLoading(true);
      const storageKey = `phoenixPrime_jobs_${user.id}`;
      const storedJobs = localStorage.getItem(storageKey);
      
      if (storedJobs) {
        const jobsData = JSON.parse(storedJobs);
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save jobs to localStorage
   * @param {Array} jobsToSave - Jobs array to save
   */
  const saveJobsToStorage = (jobsToSave) => {
    if (!user) return;
    
    try {
      const storageKey = `phoenixPrime_jobs_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(jobsToSave));
    } catch (error) {
      console.error('Error saving jobs:', error);
    }
  };

  /**
   * Create a new job from booking flow data
   * @param {Object} bookingData - Complete booking flow data
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} - Created job object
   */
  const createJob = async (bookingData, paymentData = null) => {
    try {
      const newJob = {
        id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        
        // Basic job information
        jobType: bookingData.jobType,
        status: paymentData ? JOB_STATUS.CONFIRMED : JOB_STATUS.DRAFT,
        priority: JOB_PRIORITY.MEDIUM,
        
        // Location and goods data (preserving existing structure)
        pickupCount: bookingData.pickupCount,
        deliveryCount: bookingData.deliveryCount,
        pickups: bookingData.pickups || [],
        deliveries: bookingData.deliveries || [],
        pickupGoods: bookingData.pickupGoods || [],
        deliveryGoods: bookingData.deliveryGoods || [],
        
        // Vehicle information
        vehicle: bookingData.vehicle,
        truckBodyType: bookingData.truckBodyType,
        isRefrigerated: bookingData.isRefrigerated,
        craneHiabOption: bookingData.craneHiabOption,
        
        // Financial information
        totalCost: bookingData.totalCost || 0,
        paymentData: paymentData,
        
        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        scheduledDate: getEarliestScheduledDate(bookingData),
        
        // Additional metadata
        reference: generateJobReference(),
        notes: bookingData.notes || '',
        
        // Tracking information
        trackingCode: generateTrackingCode(),
        estimatedDuration: calculateEstimatedDuration(bookingData),
        
        // Contact information
        customerInfo: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          businessName: user.businessName
        }
      };

      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);
      
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  /**
   * Update an existing job
   * @param {string} jobId - Job ID to update
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} - Updated job object
   */
  const updateJob = async (jobId, updates) => {
    try {
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return job;
      });

      setJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);
      
      return updatedJobs.find(job => job.id === jobId);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  /**
   * Update job status
   * @param {string} jobId - Job ID
   * @param {string} newStatus - New status
   * @returns {Promise<Object>} - Updated job
   */
  const updateJobStatus = async (jobId, newStatus) => {
    return await updateJob(jobId, { status: newStatus });
  };

  /**
   * Delete a job
   * @param {string} jobId - Job ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  const deleteJob = async (jobId) => {
    try {
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      setJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  };

  /**
   * Get filtered and searched jobs
   * @returns {Array} - Filtered jobs array
   */
  const getFilteredJobs = () => {
    let filteredJobs = [...jobs];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.reference.toLowerCase().includes(query) ||
        job.trackingCode.toLowerCase().includes(query) ||
        job.customerInfo.name.toLowerCase().includes(query) ||
        (job.customerInfo.businessName && job.customerInfo.businessName.toLowerCase().includes(query)) ||
        job.pickups.some(pickup => 
          pickup.address?.toLowerCase().includes(query) ||
          pickup.suburb?.toLowerCase().includes(query)
        ) ||
        job.deliveries.some(delivery => 
          delivery.address?.toLowerCase().includes(query) ||
          delivery.suburb?.toLowerCase().includes(query)
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filteredJobs = filteredJobs.filter(job => {
        const jobDate = new Date(job.scheduledDate);
        return jobDate >= dateRange.start && jobDate <= dateRange.end;
      });
    }

    // Sort by creation date (newest first)
    return filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  /**
   * Get jobs by status
   * @param {string} status - Job status
   * @returns {Array} - Jobs with specified status
   */
  const getJobsByStatus = (status) => {
    return jobs.filter(job => job.status === status);
  };

  /**
   * Get job statistics
   * @returns {Object} - Job statistics
   */
  const getJobStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => 
      [JOB_STATUS.CONFIRMED, JOB_STATUS.IN_TRANSIT].includes(job.status)
    ).length;
    
    const completedJobs = jobs.filter(job => job.status === JOB_STATUS.DELIVERED).length;
    const pendingJobs = jobs.filter(job => job.status === JOB_STATUS.PENDING).length;
    
    const totalRevenue = jobs
      .filter(job => job.status === JOB_STATUS.DELIVERED)
      .reduce((total, job) => total + (job.totalCost || 0), 0);

    return {
      totalJobs,
      activeJobs,
      completedJobs,
      pendingJobs,
      totalRevenue
    };
  };

  /**
   * Get upcoming jobs (next 7 days)
   * @returns {Array} - Upcoming jobs
   */
  const getUpcomingJobs = () => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return jobs.filter(job => {
      const scheduledDate = new Date(job.scheduledDate);
      const now = new Date();
      return scheduledDate >= now && scheduledDate <= sevenDaysFromNow &&
             [JOB_STATUS.CONFIRMED, JOB_STATUS.IN_TRANSIT].includes(job.status);
    }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  };

  // Helper functions
  
  /**
   * Generate job reference number
   * @returns {string} - Job reference
   */
  const generateJobReference = () => {
    const prefix = 'PP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  /**
   * Generate tracking code
   * @returns {string} - Tracking code
   */
  const generateTrackingCode = () => {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
  };

  /**
   * Get earliest scheduled date from booking data
   * @param {Object} bookingData - Booking data
   * @returns {string} - ISO date string
   */
  const getEarliestScheduledDate = (bookingData) => {
    const dates = [];
    
    // Collect all scheduled dates
    if (bookingData.pickups) {
      bookingData.pickups.forEach(pickup => {
        if (pickup.scheduledDate) {
          dates.push(new Date(pickup.scheduledDate));
        }
      });
    }
    
    if (bookingData.deliveries) {
      bookingData.deliveries.forEach(delivery => {
        if (delivery.scheduledDate) {
          dates.push(new Date(delivery.scheduledDate));
        }
      });
    }
    
    // Return earliest date or current date if none found
    if (dates.length === 0) {
      return new Date().toISOString();
    }
    
    return new Date(Math.min.apply(null, dates)).toISOString();
  };

  /**
   * Calculate estimated duration for job
   * @param {Object} bookingData - Booking data
   * @returns {number} - Estimated duration in hours
   */
  const calculateEstimatedDuration = (bookingData) => {
    // Base time
    let estimatedHours = 1;
    
    // Add time for each location
    const totalLocations = (bookingData.pickupCount || 0) + (bookingData.deliveryCount || 0);
    estimatedHours += totalLocations * 0.5;
    
    // Add time for goods complexity
    const totalGoods = (bookingData.pickupGoods?.length || 0) + (bookingData.deliveryGoods?.length || 0);
    estimatedHours += totalGoods * 0.25;
    
    return Math.max(1, Math.round(estimatedHours * 10) / 10); // Round to 1 decimal
  };

  const contextValue = {
    // State
    jobs,
    isLoading,
    searchQuery,
    statusFilter,
    dateRange,
    
    // Actions
    createJob,
    updateJob,
    updateJobStatus,
    deleteJob,
    
    // Filters and Search
    setSearchQuery,
    setStatusFilter,
    setDateRange,
    getFilteredJobs,
    getJobsByStatus,
    
    // Statistics and Analytics
    getJobStats,
    getUpcomingJobs,
    
    // Constants
    JOB_STATUS,
    JOB_PRIORITY
  };

  return (
    <JobsContext.Provider value={contextValue}>
      {children}
    </JobsContext.Provider>
  );
};

export default JobsContext;