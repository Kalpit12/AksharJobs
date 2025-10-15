import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for auto-saving form data
 * @param {Object} initialData - Initial form data
 * @param {string} storageKey - Local storage key for saving data
 * @param {number} delay - Delay in milliseconds before saving (default: 1000)
 * @param {Function} onSave - Optional callback when data is saved
 * @param {boolean} enablePeriodicSave - Enable periodic auto-save every 2 minutes (default: false)
 * @returns {Object} - { formData, setFormData, isSaving, saveStatus, clearSavedData }
 */
export const useAutoSave = (initialData = {}, storageKey, delay = 1000, onSave = null, enablePeriodicSave = false) => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const timeoutRef = useRef(null);
  const periodicIntervalRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Load saved data on mount
  useEffect(() => {
    if (storageKey && isInitialLoad.current) {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(prevData => ({ ...prevData, ...parsedData }));
          setSaveStatus('loaded');
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
      isInitialLoad.current = false;
    }
  }, [storageKey]);

  // Save form data function
  const saveFormData = useCallback(async () => {
    if (!storageKey) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Save to localStorage
      const dataToSave = {
        ...formData,
        _lastSaved: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      
      // Optional: Save to backend
      if (onSave && typeof onSave === 'function') {
        await onSave(formData);
      }
      
      const saveTime = new Date();
      setLastSaveTime(saveTime);
      setSaveStatus('saved');
      console.log(`✅ Form auto-saved at ${saveTime.toLocaleTimeString()}`);
      
      setTimeout(() => setSaveStatus(null), 3000); // Clear status after 3 seconds
    } catch (error) {
      console.error('Error saving form data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 4000); // Clear error status after 4 seconds
    } finally {
      setIsSaving(false);
    }
  }, [formData, storageKey, onSave]);

  // Auto-save effect (debounced)
  useEffect(() => {
    if (!storageKey || isInitialLoad.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveFormData();
    }, delay);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, delay, storageKey]);

  // Periodic auto-save effect (every 2 minutes)
  useEffect(() => {
    if (!enablePeriodicSave || !storageKey || isInitialLoad.current) return;

    // Set up periodic save interval (2 minutes = 120000ms)
    periodicIntervalRef.current = setInterval(() => {
      console.log('🔄 Auto-saving form data (2-minute interval)...');
      saveFormData();
    }, 120000); // 2 minutes

    // Cleanup interval on unmount
    return () => {
      if (periodicIntervalRef.current) {
        clearInterval(periodicIntervalRef.current);
      }
    };
  }, [enablePeriodicSave, storageKey, saveFormData]);


  // Manual save function
  const manualSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveFormData();
  }, [saveFormData]);

  // Clear saved data function
  const clearSavedData = useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
      setFormData(initialData);
      setSaveStatus('cleared');
      setTimeout(() => setSaveStatus(null), 2000);
    }
  }, [storageKey, initialData]);

  // Update form data function
  const updateFormData = useCallback((updates) => {
    setFormData(prevData => ({
      ...prevData,
      ...updates
    }));
  }, []);

  return {
    formData,
    setFormData: updateFormData,
    isSaving,
    saveStatus,
    lastSaveTime,
    manualSave,
    clearSavedData
  };
};

/**
 * Hook for auto-filling forms with user registration data
 * @param {Object} userData - User data from registration/profile
 * @param {Object} fieldMapping - Mapping of user data fields to form fields
 * @returns {Object} - Auto-filled form data
 */
export const useAutoFill = (userData = {}, fieldMapping = {}) => {
  const [autoFilledData, setAutoFilledData] = useState({});

  useEffect(() => {
    if (userData && Object.keys(fieldMapping).length > 0) {
      const filled = {};
      
      Object.entries(fieldMapping).forEach(([formField, userField]) => {
        if (userData[userField] !== undefined && userData[userField] !== null) {
          filled[formField] = userData[userField];
        }
      });
      
      setAutoFilledData(filled);
    }
  }, [userData, fieldMapping]);

  return autoFilledData;
};

/**
 * Combined hook for auto-save and auto-fill functionality
 * @param {Object} initialData - Initial form data
 * @param {string} storageKey - Storage key for auto-save
 * @param {Object} userData - User data for auto-fill
 * @param {Object} fieldMapping - Field mapping for auto-fill
 * @param {Function} onSave - Save callback
 * @param {number} delay - Auto-save delay
 * @param {boolean} enablePeriodicSave - Enable periodic auto-save every 2 minutes
 * @returns {Object} - Combined form management object
 */
export const useFormManagement = (initialData = {}, storageKey, userData = {}, fieldMapping = {}, onSave = null, delay = 1000, enablePeriodicSave = false) => {
  // Get auto-filled data
  const autoFilledData = useAutoFill(userData, fieldMapping);
  
  // Combine initial data with auto-filled data
  const combinedInitialData = { ...initialData, ...autoFilledData };
  
  // Use auto-save hook with periodic save
  const autoSaveHook = useAutoSave(combinedInitialData, storageKey, delay, onSave, enablePeriodicSave);

  return {
    ...autoSaveHook,
    autoFilledData,
    hasAutoFilledData: Object.keys(autoFilledData).length > 0
  };
};

export default useAutoSave;
