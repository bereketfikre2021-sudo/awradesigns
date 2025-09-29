import { useEffect, useCallback } from 'react';

export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((event) => {
    // Skip to main content
    if (event.key === 'Tab' && event.shiftKey && event.target === document.body) {
      event.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    }

    // Close modals with Escape
    if (event.key === 'Escape') {
      const openModals = document.querySelectorAll('[role="dialog"]:not([aria-hidden="true"])');
      if (openModals.length > 0) {
        const lastModal = openModals[openModals.length - 1];
        const closeButton = lastModal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
        if (closeButton) {
          closeButton.click();
        }
      }
    }

    // Navigate with arrow keys in menus
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const activeElement = document.activeElement;
      const menu = activeElement.closest('[role="menu"], [role="menubar"]');
      
      if (menu) {
        event.preventDefault();
        const menuItems = Array.from(menu.querySelectorAll('[role="menuitem"]'));
        const currentIndex = menuItems.indexOf(activeElement);
        
        if (currentIndex !== -1) {
          let nextIndex;
          if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % menuItems.length;
          } else {
            nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
          }
          
          menuItems[nextIndex].focus();
        }
      }
    }

    // Activate with Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      const activeElement = document.activeElement;
      
      if (activeElement.tagName === 'BUTTON' || 
          activeElement.getAttribute('role') === 'button' ||
          activeElement.getAttribute('tabindex') === '0') {
        event.preventDefault();
        activeElement.click();
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { handleKeyDown };
};

export const useFocusManagement = () => {
  const trapFocus = useCallback((element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const restoreFocus = useCallback((previousElement) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  }, []);

  return { trapFocus, restoreFocus };
};

export const useScreenReaderAnnouncements = () => {
  const announce = useCallback((message, priority = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  return { announce };
};
