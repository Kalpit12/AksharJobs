import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for auto-saving form data
 * @param {Object} initialData - Initial form data
 * @param {string} storageKey - Local storage key for saving data
 * @param {number} delay - Delay in milliseconds before saving (default: 1000)
 * @param {Function} onSave - Optional callback when data is saved
 * @returns {Object} - { formData, setFormData, isSaving, saveStatus, clearSavedData }
 */
export const useAutoSave = (initialData = {}, storageKey, delay = 1000, onSave = null) => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const timeoutRef = useRef(null);
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

  // Auto-save effect
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

  // Save form data function
  const saveFormData = useCallback(async () => {
    if (!storageKey) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(formData));
      
      // Optional: Save to backend
      if (onSave && typeof onSave === 'function') {
        await onSave(formData);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000); // Clear status after 2 seconds
    } catch (error) {
      console.error('Error saving form data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000); // Clear error status after 3 seconds
    } finally {
      setIsSaving(false);
    }
  }, [formData, storageKey, onSave]);

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
 * @returns {Object} - Combined form management object
 */
export const useFormManagement = (initialData = {}, storageKey, userData = {}, fieldMapping = {}, onSave = null, delay = 1000) => {
  // Get auto-filled data
  const autoFilledData = useAutoFill(userData, fieldMapping);
  
  // Combine initial data with auto-filled data
  const combinedInitialData = { ...initialData, ...autoFilledData };
  
  // Use auto-save hook
  const autoSaveHook = useAutoSave(combinedInitialData, storageKey, delay, onSave);

  return {
    ...autoSaveHook,
    autoFilledData,
    hasAutoFilledData: Object.keys(autoFilledData).length > 0
  };
};

export default useAutoSave;
