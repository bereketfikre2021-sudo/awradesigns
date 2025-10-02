// Offline Manager for PWA functionality
class OfflineManager {
  constructor() {
    this.cacheName = 'awra-designs-v1';
    this.offlinePages = [
      '/',
      '/offline',
      '/about',
      '/services',
      '/contact'
    ];
    this.cacheableResources = [
      '/images/hero-image.webp',
      '/images/LOGO-1.png',
      '/images/LOGO-2.png',
      '/manifest.webmanifest',
      '/sw.js'
    ];
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Online/Offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });

    // Service Worker registration
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
  }

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async cacheResources() {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      
      // Cache critical resources
      await cache.addAll(this.cacheableResources);
      
      // Cache offline pages
      for (const page of this.offlinePages) {
        try {
          await cache.add(page);
        } catch (error) {
          console.warn(`Failed to cache ${page}:`, error);
        }
      }
      
      console.log('Resources cached successfully');
    } catch (error) {
      console.error('Caching failed:', error);
    }
  }

  async getCachedResponse(request) {
    if (!('caches' in window)) return null;

    try {
      const cache = await caches.open(this.cacheName);
      return await cache.match(request);
    } catch (error) {
      console.error('Cache retrieval failed:', error);
      return null;
    }
  }

  async cacheResponse(request, response) {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      await cache.put(request, response.clone());
    } catch (error) {
      console.error('Cache storage failed:', error);
    }
  }

  handleOnline() {
    // Show online notification
    this.showNotification('You are back online!', 'success');
    
    // Sync any pending data
    this.syncPendingData();
    
    // Update UI
    document.body.classList.remove('offline');
    document.body.classList.add('online');
  }

  handleOffline() {
    // Show offline notification
    this.showNotification('You are offline. Some features may be limited.', 'warning');
    
    // Update UI
    document.body.classList.remove('online');
    document.body.classList.add('offline');
  }

  async syncPendingData() {
    // Get pending data from IndexedDB
    const pendingData = await this.getPendingData();
    
    if (pendingData.length > 0) {
      for (const data of pendingData) {
        try {
          await this.syncData(data);
          await this.removePendingData(data.id);
        } catch (error) {
          console.error('Sync failed for data:', data, error);
        }
      }
    }
  }

  async getPendingData() {
    return new Promise((resolve) => {
      const request = indexedDB.open('AwraDesignsDB', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingData'], 'readonly');
        const store = transaction.objectStore('pendingData');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result);
        };
        
        getAllRequest.onerror = () => {
          resolve([]);
        };
      };
      
      request.onerror = () => {
        resolve([]);
      };
    });
  }

  async savePendingData(data) {
    return new Promise((resolve) => {
      const request = indexedDB.open('AwraDesignsDB', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('pendingData')) {
          db.createObjectStore('pendingData', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingData'], 'readwrite');
        const store = transaction.objectStore('pendingData');
        store.add(data);
        resolve();
      };
      
      request.onerror = () => {
        resolve();
      };
    });
  }

  async removePendingData(id) {
    return new Promise((resolve) => {
      const request = indexedDB.open('AwraDesignsDB', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingData'], 'readwrite');
        const store = transaction.objectStore('pendingData');
        store.delete(id);
        resolve();
      };
      
      request.onerror = () => {
        resolve();
      };
    });
  }

  async syncData(data) {
    // Implement your sync logic here
    // This would typically send data to your server
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Sync failed');
    }
    
    return response.json();
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `offline-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <h4>Update Available</h4>
        <p>A new version of the app is available.</p>
        <button onclick="window.location.reload()" class="btn btn-primary">
          Update Now
        </button>
      </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      zIndex: '10000',
      transform: 'translateY(100%)',
      transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);
  }

  // Background sync for form submissions
  async handleFormSubmission(formData) {
    if (this.isOnline) {
      try {
        await this.submitForm(formData);
      } catch (error) {
        // If online submission fails, save for later
        await this.savePendingData({
          type: 'form_submission',
          data: formData,
          timestamp: Date.now()
        });
        throw error;
      }
    } else {
      // Save for later sync
      await this.savePendingData({
        type: 'form_submission',
        data: formData,
        timestamp: Date.now()
      });
      this.showNotification('Form saved offline. Will sync when online.', 'info');
    }
  }

  async submitForm(formData) {
    // Use the main Formspree endpoint for all form types
    const endpoint = 'https://formspree.io/f/mrbykzlb';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('Form submission failed');
    }
    
    return response.json();
  }
}

// Initialize offline manager
const offlineManager = new OfflineManager();

// Cache resources on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    offlineManager.cacheResources();
  });
} else {
  offlineManager.cacheResources();
}

export default offlineManager;
