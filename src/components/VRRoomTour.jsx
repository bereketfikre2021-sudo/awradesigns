import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const VRRoomTour = ({ onClose }) => {
  const { t } = useLanguage();
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile, vr
  const vrContainerRef = useRef(null);

  const rooms = [
    {
      id: 'living-room',
      name: 'Modern Living Room',
      description: 'Contemporary design with clean lines and natural lighting',
      image: '/images/work-samples-1.webp',
      hotspots: [
        { x: 30, y: 40, label: 'Sectional Sofa', description: 'Premium fabric, modular design' },
        { x: 70, y: 60, label: 'Coffee Table', description: 'Glass top with wooden base' },
        { x: 20, y: 80, label: 'Floor Lamp', description: 'Adjustable lighting for reading' }
      ]
    },
    {
      id: 'kitchen',
      name: 'Modern Kitchen',
      description: 'Open concept kitchen with premium appliances',
      image: '/images/work-samples-2.webp',
      hotspots: [
        { x: 50, y: 30, label: 'Island Counter', description: 'Quartz surface with seating' },
        { x: 80, y: 50, label: 'Stainless Appliances', description: 'Energy-efficient, modern design' },
        { x: 20, y: 70, label: 'Custom Cabinets', description: 'Soft-close doors, ample storage' }
      ]
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom',
      description: 'Luxurious bedroom with walk-in closet',
      image: '/images/work-samples-3.webp',
      hotspots: [
        { x: 40, y: 50, label: 'Platform Bed', description: 'Built-in storage, modern design' },
        { x: 70, y: 30, label: 'Dresser', description: 'Mirrored surface, soft-close drawers' },
        { x: 20, y: 80, label: 'Reading Chair', description: 'Comfortable seating with ottoman' }
      ]
    },
    {
      id: 'office',
      name: 'Home Office',
      description: 'Productive workspace with natural light',
      image: '/images/work-samples-4.webp',
      hotspots: [
        { x: 50, y: 40, label: 'Standing Desk', description: 'Adjustable height, cable management' },
        { x: 30, y: 70, label: 'Ergonomic Chair', description: 'Lumbar support, breathable mesh' },
        { x: 80, y: 60, label: 'Storage Unit', description: 'Filing system, display shelves' }
      ]
    }
  ];

  useEffect(() => {
    // Check VR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported);
      });
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const enterVR = async () => {
    if (!navigator.xr || !isVRSupported) {
      alert('VR is not supported on this device');
      return;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-vr');
      setViewMode('vr');
      
      // VR session handling would go here
      session.addEventListener('end', () => {
        setViewMode('desktop');
      });
    } catch (error) {
      console.error('Failed to enter VR:', error);
      alert('Failed to enter VR mode');
    }
  };

  const enterFullscreen = () => {
    if (vrContainerRef.current) {
      if (vrContainerRef.current.requestFullscreen) {
        vrContainerRef.current.requestFullscreen();
      } else if (vrContainerRef.current.webkitRequestFullscreen) {
        vrContainerRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const nextRoom = () => {
    setCurrentRoom((prev) => (prev + 1) % rooms.length);
  };

  const prevRoom = () => {
    setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const currentRoomData = rooms[currentRoom];

  if (isLoading) {
    return (
      <motion.div
        className="vr-room-tour"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="vr-loading">
          <div className="loading-animation">
            <div className="vr-icon">🥽</div>
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          <h3>Loading VR Experience...</h3>
          <p>Preparing immersive room tour</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="vr-room-tour"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      ref={vrContainerRef}
    >
      <div className="vr-header">
        <div className="vr-title">
          <h2>🥽 VR Room Tour</h2>
          <p>Explore our designs in immersive 360°</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="vr-content">
        {/* Room Navigation */}
        <div className="room-navigation">
          <button 
            className="nav-btn prev" 
            onClick={prevRoom}
            disabled={currentRoom === 0}
          >
            ←
          </button>
          
          <div className="room-info">
            <h3>{currentRoomData.name}</h3>
            <p>{currentRoomData.description}</p>
          </div>
          
          <button 
            className="nav-btn next" 
            onClick={nextRoom}
            disabled={currentRoom === rooms.length - 1}
          >
            →
          </button>
        </div>

        {/* VR Viewer */}
        <div className="vr-viewer">
          <div className="room-image-container">
            <img 
              src={currentRoomData.image} 
              alt={currentRoomData.name}
              className="room-image"
            />
            
            {/* Hotspots */}
            {currentRoomData.hotspots.map((hotspot, index) => (
              <motion.div
                key={index}
                className="hotspot"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.2 }}
              >
                <div className="hotspot-marker">📍</div>
                <div className="hotspot-tooltip">
                  <h4>{hotspot.label}</h4>
                  <p>{hotspot.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* VR Controls */}
          <div className="vr-controls">
            <div className="control-buttons">
              <motion.button
                className="control-btn vr-btn"
                onClick={enterVR}
                disabled={!isVRSupported}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🥽 Enter VR
              </motion.button>
              
              <motion.button
                className="control-btn fullscreen-btn"
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isFullscreen ? '⤓ Exit Fullscreen' : '⤢ Fullscreen'}
              </motion.button>
              
              <motion.button
                className="control-btn mobile-btn"
                onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📱 {viewMode === 'mobile' ? 'Desktop View' : 'Mobile View'}
              </motion.button>
            </div>

            {/* View Mode Indicator */}
            <div className="view-mode-indicator">
              <span className={`mode ${viewMode === 'desktop' ? 'active' : ''}`}>🖥️ Desktop</span>
              <span className={`mode ${viewMode === 'mobile' ? 'active' : ''}`}>📱 Mobile</span>
              <span className={`mode ${viewMode === 'vr' ? 'active' : ''}`}>🥽 VR</span>
            </div>
          </div>
        </div>

        {/* Room Thumbnails */}
        <div className="room-thumbnails">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              className={`thumbnail ${currentRoom === index ? 'active' : ''}`}
              onClick={() => setCurrentRoom(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={room.image} alt={room.name} />
              <div className="thumbnail-overlay">
                <h4>{room.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VR Instructions */}
        <div className="vr-instructions">
          <h4>🎮 How to Navigate</h4>
          <div className="instructions-grid">
            <div className="instruction">
              <span className="instruction-icon">🖱️</span>
              <div>
                <h5>Mouse/Touch</h5>
                <p>Click and drag to look around</p>
              </div>
            </div>
            <div className="instruction">
              <span className="instruction-icon">⌨️</span>
              <div>
                <h5>Keyboard</h5>
                <p>Use arrow keys to navigate</p>
              </div>
            </div>
            <div className="instruction">
              <span className="instruction-icon">🥽</span>
              <div>
                <h5>VR Headset</h5>
                <p>Look around naturally in VR</p>
              </div>
            </div>
            <div className="instruction">
              <span className="instruction-icon">📍</span>
              <div>
                <h5>Hotspots</h5>
                <p>Click markers for details</p>
              </div>
            </div>
          </div>
        </div>

        {/* VR Features */}
        <div className="vr-features">
          <h4>✨ VR Features</h4>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <div>
                <h5>360° View</h5>
                <p>Explore every angle of our designs</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📏</span>
              <div>
                <h5>True Scale</h5>
                <p>Experience actual room proportions</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <div>
                <h5>Material Details</h5>
                <p>See textures and finishes up close</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <div>
                <h5>Lighting Effects</h5>
                <p>Experience natural and artificial lighting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VRRoomTour;
