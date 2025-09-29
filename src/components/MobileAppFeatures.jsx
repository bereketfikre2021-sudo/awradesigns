import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const MobileAppFeatures = ({ onClose }) => {
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const features = [
    { id: 'camera', name: 'Camera Tools', icon: '📷', description: 'Photo capture and measurement tools' },
    { id: 'scan', name: 'QR Scanner', icon: '📱', description: 'Scan QR codes and barcodes' },
    { id: 'measure', name: 'Measure Tool', icon: '📏', description: 'AR measurement and dimensioning' },
    { id: 'offline', name: 'Offline Mode', icon: '📴', description: 'Work without internet connection' },
    { id: 'sync', name: 'Cloud Sync', icon: '☁️', description: 'Sync data across devices' },
    { id: 'push', name: 'Push Notifications', icon: '🔔', description: 'Real-time project updates' }
  ];

  useEffect(() => {
    // Get device information
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      onLine: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      touchSupport: 'ontouchstart' in window,
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator,
      vibration: 'vibrate' in navigator
    };
    setDeviceInfo(info);

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for this feature');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const newImage = {
        id: Date.now(),
        data: imageData,
        timestamp: new Date().toISOString(),
        location: null // Would get from geolocation
      };
      
      setCapturedImages(prev => [newImage, ...prev]);
      
      // Vibrate on capture (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
  };

  const startQRScan = () => {
    setIsScanning(true);
    // Simulate QR scanning
    setTimeout(() => {
      const mockResults = [
        { type: 'QR', data: 'https://awra-finishing.com/project/123', format: 'URL' },
        { type: 'QR', data: 'PROJECT:Kitchen Renovation - Client: Sarah M.', format: 'Text' },
        { type: 'Barcode', data: '1234567890123', format: 'EAN-13' }
      ];
      
      setScanResults(mockResults[Math.floor(Math.random() * mockResults.length)]);
      setIsScanning(false);
    }, 2000);
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location:', position.coords);
          // Update captured images with location
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const enableOfflineMode = () => {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  };

  const syncToCloud = () => {
    // Simulate cloud sync
    const syncData = {
      images: capturedImages,
      timestamp: new Date().toISOString(),
      deviceInfo: deviceInfo
    };
    
    console.log('Syncing to cloud:', syncData);
    alert('Data synced to cloud successfully!');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Awra Finishing', {
          body: 'You will now receive project updates and notifications!',
          icon: '/images/LOGO-1.png'
        });
      }
    }
  };

  const renderCameraTools = () => (
    <div className="camera-tools">
      <div className="camera-container">
        <video
          ref={videoRef}
          className="camera-feed"
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="capture-canvas"
          style={{ display: 'none' }}
        />
        
        {!isCameraActive && (
          <div className="camera-placeholder">
            <div className="placeholder-icon">📷</div>
            <p>Camera not active</p>
            <button className="btn btn-primary" onClick={startCamera}>
              Start Camera
            </button>
          </div>
        )}
      </div>

      <div className="camera-controls">
        <motion.button
          className="btn btn-primary"
          onClick={isCameraActive ? stopCamera : startCamera}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCameraActive ? 'Stop Camera' : 'Start Camera'}
        </motion.button>
        
        {isCameraActive && (
          <motion.button
            className="btn btn-secondary capture-btn"
            onClick={capturePhoto}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📸 Capture Photo
          </motion.button>
        )}
        
        <motion.button
          className="btn btn-secondary"
          onClick={requestLocation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📍 Get Location
        </motion.button>
      </div>

      {capturedImages.length > 0 && (
        <div className="captured-images">
          <h4>Captured Photos ({capturedImages.length})</h4>
          <div className="images-grid">
            {capturedImages.map((image) => (
              <div key={image.id} className="image-item">
                <img src={image.data} alt="Captured" />
                <div className="image-info">
                  <span className="timestamp">
                    {new Date(image.timestamp).toLocaleString()}
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => setCapturedImages(prev => 
                      prev.filter(img => img.id !== image.id)
                    )}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderQRScanner = () => (
    <div className="qr-scanner">
      <div className="scanner-container">
        <div className="scanner-viewfinder">
          <div className="viewfinder-frame">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
          </div>
          
          {isScanning && (
            <div className="scanning-line">
              <div className="scan-line"></div>
            </div>
          )}
        </div>
        
        <div className="scanner-instructions">
          <h4>Point camera at QR code or barcode</h4>
          <p>Hold steady and ensure good lighting</p>
        </div>
      </div>

      <div className="scanner-controls">
        <motion.button
          className="btn btn-primary"
          onClick={startQRScan}
          disabled={isScanning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </motion.button>
        
        <motion.button
          className="btn btn-secondary"
          onClick={() => setScanResults(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Results
        </motion.button>
      </div>

      {scanResults && (
        <div className="scan-results">
          <h4>Scan Results</h4>
          <div className="result-card">
            <div className="result-type">
              <span className="type-badge">{scanResults.type}</span>
              <span className="format-badge">{scanResults.format}</span>
            </div>
            <div className="result-data">
              <p>{scanResults.data}</p>
            </div>
            <div className="result-actions">
              <button className="btn btn-primary">Copy</button>
              <button className="btn btn-secondary">Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMeasureTool = () => (
    <div className="measure-tool">
      <div className="measure-container">
        <div className="measure-overlay">
          <div className="measure-grid">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="grid-point" />
            ))}
          </div>
          
          <div className="measure-instructions">
            <h4>AR Measurement Tool</h4>
            <p>Point camera at object to measure</p>
            <div className="measure-features">
              <div className="feature-item">
                <span className="feature-icon">📏</span>
                <span>Length & Width</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📐</span>
                <span>Angles</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Area Calculation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="measure-controls">
        <motion.button
          className="btn btn-primary"
          onClick={() => alert('Measurement feature requires AR framework')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Measurement
        </motion.button>
        
        <motion.button
          className="btn btn-secondary"
          onClick={() => alert('Calibration feature')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Calibrate
        </motion.button>
      </div>

      <div className="measure-results">
        <h4>Measurement Results</h4>
        <div className="results-grid">
          <div className="result-item">
            <span className="result-label">Length</span>
            <span className="result-value">2.5m</span>
          </div>
          <div className="result-item">
            <span className="result-label">Width</span>
            <span className="result-value">1.8m</span>
          </div>
          <div className="result-item">
            <span className="result-label">Area</span>
            <span className="result-value">4.5m²</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOfflineMode = () => (
    <div className="offline-mode">
      <div className="offline-status">
        <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="offline-features">
        <h4>Offline Capabilities</h4>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">📷</span>
            <div className="feature-info">
              <h5>Photo Capture</h5>
              <p>Take photos and store locally</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <div className="feature-info">
              <h5>Notes & Sketches</h5>
              <p>Create project notes offline</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📏</span>
            <div className="feature-info">
              <h5>Measurements</h5>
              <p>Record measurements locally</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <div className="feature-info">
              <h5>Auto Sync</h5>
              <p>Sync when connection restored</p>
            </div>
          </div>
        </div>
      </div>

      <div className="offline-controls">
        <motion.button
          className="btn btn-primary"
          onClick={enableOfflineMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enable Offline Mode
        </motion.button>
        
        <motion.button
          className="btn btn-secondary"
          onClick={syncToCloud}
          disabled={!isOnline}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sync to Cloud
        </motion.button>
      </div>

      <div className="offline-storage">
        <h4>Local Storage</h4>
        <div className="storage-info">
          <div className="storage-item">
            <span className="storage-label">Photos</span>
            <span className="storage-value">{capturedImages.length} items</span>
          </div>
          <div className="storage-item">
            <span className="storage-label">Cache Size</span>
            <span className="storage-value">2.3 MB</span>
          </div>
          <div className="storage-item">
            <span className="storage-label">Last Sync</span>
            <span className="storage-value">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCloudSync = () => (
    <div className="cloud-sync">
      <div className="sync-status">
        <h4>Cloud Sync Status</h4>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-icon">☁️</span>
            <span className="status-label">Cloud Storage</span>
            <span className="status-value">Active</span>
          </div>
          <div className="status-item">
            <span className="status-icon">🔄</span>
            <span className="status-label">Auto Sync</span>
            <span className="status-value">Enabled</span>
          </div>
          <div className="status-item">
            <span className="status-icon">📱</span>
            <span className="status-label">Devices</span>
            <span className="status-value">2 Connected</span>
          </div>
        </div>
      </div>

      <div className="sync-controls">
        <motion.button
          className="btn btn-primary"
          onClick={syncToCloud}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sync Now
        </motion.button>
        
        <motion.button
          className="btn btn-secondary"
          onClick={() => alert('Download all data')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Download All
        </motion.button>
      </div>

      <div className="sync-history">
        <h4>Sync History</h4>
        <div className="history-list">
          <div className="history-item">
            <span className="history-time">2 hours ago</span>
            <span className="history-action">Photos synced</span>
            <span className="history-status success">✓</span>
          </div>
          <div className="history-item">
            <span className="history-time">1 day ago</span>
            <span className="history-action">Project data synced</span>
            <span className="history-status success">✓</span>
          </div>
          <div className="history-item">
            <span className="history-time">3 days ago</span>
            <span className="history-action">Settings synced</span>
            <span className="history-status success">✓</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPushNotifications = () => (
    <div className="push-notifications">
      <div className="notification-status">
        <h4>Notification Settings</h4>
        <div className="permission-status">
          <span className="permission-icon">🔔</span>
          <span className="permission-text">
            {Notification.permission === 'granted' ? 'Notifications Enabled' : 'Notifications Disabled'}
          </span>
        </div>
      </div>

      <div className="notification-controls">
        <motion.button
          className="btn btn-primary"
          onClick={requestNotificationPermission}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enable Notifications
        </motion.button>
        
        <motion.button
          className="btn btn-secondary"
          onClick={() => alert('Test notification sent!')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Test Notification
        </motion.button>
      </div>

      <div className="notification-types">
        <h4>Notification Types</h4>
        <div className="types-list">
          <div className="type-item">
            <span className="type-icon">📅</span>
            <div className="type-info">
              <h5>Project Updates</h5>
              <p>Get notified about project milestones</p>
            </div>
            <div className="type-toggle">
              <input type="checkbox" defaultChecked />
            </div>
          </div>
          <div className="type-item">
            <span className="type-icon">💬</span>
            <div className="type-info">
              <h5>Messages</h5>
              <p>New messages from team members</p>
            </div>
            <div className="type-toggle">
              <input type="checkbox" defaultChecked />
            </div>
          </div>
          <div className="type-item">
            <span className="type-icon">📸</span>
            <div className="type-info">
              <h5>Photo Updates</h5>
              <p>New photos added to projects</p>
            </div>
            <div className="type-toggle">
              <input type="checkbox" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeviceInfo = () => (
    <div className="device-info">
      <h4>Device Information</h4>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Platform</span>
          <span className="info-value">{deviceInfo?.platform}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Screen</span>
          <span className="info-value">{deviceInfo?.screenWidth}x{deviceInfo?.screenHeight}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Touch Support</span>
          <span className="info-value">{deviceInfo?.touchSupport ? 'Yes' : 'No'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Camera</span>
          <span className="info-value">{deviceInfo?.camera ? 'Available' : 'Not Available'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Geolocation</span>
          <span className="info-value">{deviceInfo?.geolocation ? 'Available' : 'Not Available'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Vibration</span>
          <span className="info-value">{deviceInfo?.vibration ? 'Available' : 'Not Available'}</span>
        </div>
      </div>
    </div>
  );

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'camera':
        return renderCameraTools();
      case 'scan':
        return renderQRScanner();
      case 'measure':
        return renderMeasureTool();
      case 'offline':
        return renderOfflineMode();
      case 'sync':
        return renderCloudSync();
      case 'push':
        return renderPushNotifications();
      default:
        return renderCameraTools();
    }
  };

  return (
    <motion.div
      className="mobile-app-features"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="maf-header">
        <div className="maf-title">
          <h2>📱 Mobile App Features</h2>
          <p>Advanced mobile tools for on-site work</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="maf-content">
        <div className="maf-tabs">
          {features.map(feature => (
            <motion.button
              key={feature.id}
              className={`maf-tab ${activeFeature === feature.id ? 'active' : ''}`}
              onClick={() => setActiveFeature(feature.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="tab-icon">{feature.icon}</span>
              <div className="tab-info">
                <span className="tab-name">{feature.name}</span>
                <span className="tab-description">{feature.description}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="maf-tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderFeatureContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {renderDeviceInfo()}
      </div>
    </motion.div>
  );
};

export default MobileAppFeatures;
