import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for managing focus within modals and other focus-trapped elements
 */
export const useFocusTrap = (isActive = false) => {
  const containerRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
      .filter(element => {
        // Check if element is visible
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
      });
  }, []);

  const trapFocus = useCallback((event) => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isActive, getFocusableElements]);

  const restoreFocus = useCallback(() => {
    if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
      previousActiveElementRef.current = null;
    }
  }, []);

  const saveFocus = useCallback(() => {
    previousActiveElementRef.current = document.activeElement;
  }, []);

  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLastElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  useEffect(() => {
    if (isActive) {
      saveFocus();
      document.addEventListener('keydown', trapFocus);
      
      // Focus first element after a short delay to ensure DOM is ready
      const timeoutId = setTimeout(focusFirstElement, 100);
      
      return () => {
        document.removeEventListener('keydown', trapFocus);
        clearTimeout(timeoutId);
      };
    } else {
      restoreFocus();
    }
  }, [isActive, trapFocus, saveFocus, restoreFocus, focusFirstElement]);

  return {
    containerRef,
    focusFirstElement,
    focusLastElement,
    getFocusableElements
  };
};

/**
 * Hook for managing focus restoration when components mount/unmount
 */
export const useFocusRestoration = (shouldRestore = true) => {
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (shouldRestore) {
      previousActiveElementRef.current = document.activeElement;
      
      return () => {
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [shouldRestore]);
};

/**
 * Hook for managing focus on specific elements
 */
export const useFocusManagement = () => {
  const focusElement = useCallback((element) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }, []);

  const focusElementById = useCallback((id) => {
    const element = document.getElementById(id);
    focusElement(element);
  }, [focusElement]);

  const focusElementBySelector = useCallback((selector) => {
    const element = document.querySelector(selector);
    focusElement(element);
  }, [focusElement]);

  const blurActiveElement = useCallback(() => {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  }, []);

  const getActiveElement = useCallback(() => {
    return document.activeElement;
  }, []);

  const isElementFocused = useCallback((element) => {
    return document.activeElement === element;
  }, []);

  const focusNextElement = useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    
    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus();
    }
  }, []);

  const focusPreviousElement = useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    
    if (focusableElements[previousIndex]) {
      focusableElements[previousIndex].focus();
    }
  }, []);

  return {
    focusElement,
    focusElementById,
    focusElementBySelector,
    blurActiveElement,
    getActiveElement,
    isElementFocused,
    focusNextElement,
    focusPreviousElement
  };
};

/**
 * Hook for managing focus on modal open/close
 */
export const useModalFocus = (isOpen, onClose) => {
  const { containerRef, focusFirstElement } = useFocusTrap(isOpen);
  const { focusElementById } = useFocusManagement();

  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape' && isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, handleEscapeKey]);

  return {
    containerRef,
    focusFirstElement
  };
};

/**
 * Hook for managing focus on dropdown menus
 */
export const useDropdownFocus = (isOpen, onClose) => {
  const { containerRef, focusFirstElement } = useFocusTrap(isOpen);
  const { focusElementById } = useFocusManagement();

  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape' && isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  const handleClickOutside = useCallback((event) => {
    if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleEscapeKey, handleClickOutside]);

  return {
    containerRef,
    focusFirstElement
  };
};

export default {
  useFocusTrap,
  useFocusRestoration,
  useFocusManagement,
  useModalFocus,
  useDropdownFocus
};
