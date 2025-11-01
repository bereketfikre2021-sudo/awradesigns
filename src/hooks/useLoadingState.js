/**
 * Granular Loading State Hook
 * Provides fine-grained loading states for different components and actions
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Main loading state hook
 */
export const useLoadingState = (initialState = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialState);
  const loadingTimers = useRef({});

  /**
   * Set loading state for a specific key
   */
  const setLoading = useCallback((key, value = true, delay = 0) => {
    if (delay > 0) {
      // Clear existing timer for this key
      if (loadingTimers.current[key]) {
        clearTimeout(loadingTimers.current[key]);
      }

      // Set loading after delay
      loadingTimers.current[key] = setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: value
        }));
      }, delay);
    } else {
      setLoadingStates(prev => ({
        ...prev,
        [key]: value
      }));
    }
  }, []);

  /**
   * Set multiple loading states at once
   */
  const setMultipleLoading = useCallback((states) => {
    setLoadingStates(prev => ({
      ...prev,
      ...states
    }));
  }, []);

  /**
   * Check if any of the provided keys are loading
   */
  const isLoading = useCallback((keys = null) => {
    if (keys === null) {
      // Check if any loading state is true
      return Object.values(loadingStates).some(state => state === true);
    }
    
    if (Array.isArray(keys)) {
      return keys.some(key => loadingStates[key] === true);
    }
    
    return loadingStates[keys] === true;
  }, [loadingStates]);

  /**
   * Reset all loading states
   */
  const resetLoading = useCallback(() => {
    // Clear all timers
    Object.values(loadingTimers.current).forEach(timer => clearTimeout(timer));
    loadingTimers.current = {};
    setLoadingStates(initialState);
  }, [initialState]);

  /**
   * Reset specific loading state
   */
  const resetLoadingKey = useCallback((key) => {
    if (loadingTimers.current[key]) {
      clearTimeout(loadingTimers.current[key]);
      delete loadingTimers.current[key];
    }
    setLoadingStates(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return {
    loadingStates,
    setLoading,
    setMultipleLoading,
    isLoading,
    resetLoading,
    resetLoadingKey,
  };
};

/**
 * Hook for component-level loading states
 */
export const useComponentLoading = (componentName) => {
  const { loadingStates, setLoading, isLoading } = useLoadingState({
    content: false,
    images: false,
    interactions: false,
  });

  return {
    isContentLoading: loadingStates.content,
    areImagesLoading: loadingStates.images,
    areInteractionsLoading: loadingStates.interactions,
    isAnyLoading: isLoading(['content', 'images', 'interactions']),
    setContentLoading: (value) => setLoading('content', value),
    setImagesLoading: (value) => setLoading('images', value),
    setInteractionsLoading: (value) => setLoading('interactions', value),
  };
};

/**
 * Hook for form loading states
 */
export const useFormLoading = (formName) => {
  const { loadingStates, setLoading, isLoading } = useLoadingState({
    submitting: false,
    validating: false,
    saving: false,
  });

  return {
    isSubmitting: loadingStates.submitting,
    isValidating: loadingStates.validating,
    isSaving: loadingStates.saving,
    isLoading: isLoading(['submitting', 'validating', 'saving']),
    setSubmitting: (value) => setLoading('submitting', value),
    setValidating: (value) => setLoading('validating', value),
    setSaving: (value) => setLoading('saving', value),
  };
};

/**
 * Hook for list/grid loading states
 */
export const useListLoading = () => {
  const { loadingStates, setLoading, isLoading } = useLoadingState({
    fetching: false,
    filtering: false,
    sorting: false,
    paginating: false,
    refreshing: false,
  });

  return {
    isFetching: loadingStates.fetching,
    isFiltering: loadingStates.filtering,
    isSorting: loadingStates.sorting,
    isPaginating: loadingStates.paginating,
    isRefreshing: loadingStates.refreshing,
    isLoading: isLoading(['fetching', 'filtering', 'sorting', 'paginating', 'refreshing']),
    setFetching: (value) => setLoading('fetching', value),
    setFiltering: (value) => setLoading('filtering', value),
    setSorting: (value) => setLoading('sorting', value),
    setPaginating: (value) => setLoading('paginating', value),
    setRefreshing: (value) => setLoading('refreshing', value),
  };
};

/**
 * Hook for async action loading states
 */
export const useActionLoading = () => {
  const { loadingStates, setLoading, isLoading } = useLoadingState({});

  const setActionLoading = useCallback((actionName, value = true) => {
    setLoading(actionName, value);
  }, [setLoading]);

  const isActionLoading = useCallback((actionName) => {
    return loadingStates[actionName] === true;
  }, [loadingStates]);

  return {
    loadingStates,
    setActionLoading,
    isActionLoading,
    isLoading: isLoading(),
  };
};

export default useLoadingState;

