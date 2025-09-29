import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const ARFurniturePlacer = ({ onClose }) => {
  const { t } = useLanguage();
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const furnitureItems = [
    {
      id: 'sofa-1',
      name: 'Modern Sectional Sofa',
      category: 'seating',
      price: '$2,500',
      dimensions: '120" x 84" x 32"',
      image: '/images/work-samples-1.webp',
      model: 'sofa-model.glb'
    },
    {
      id: 'table-1',
      name: 'Glass Coffee Table',
      category: 'tables',
      price: '$800',
      dimensions: '48" x 24" x 18"',
      image: '/images/work-samples-2.webp',
      model: 'table-model.glb'
    },
    {
      id: 'chair-1',
      name: 'Ergonomic Office Chair',
      category: 'seating',
      price: '$450',
      dimensions: '26" x 26" x 42"',
      image: '/images/work-samples-3.webp',
      model: 'chair-model.glb'
    },
    {
      id: 'lamp-1',
      name: 'Modern Floor Lamp',
      category: 'lighting',
      price: '$200',
      dimensions: '12" x 12" x 65"',
      image: '/images/work-samples-4.webp',
      model: 'lamp-model.glb'
    },
    {
      id: 'bookshelf-1',
      name: 'Wall Bookshelf',
      category: 'storage',
      price: '$600',
      dimensions: '72" x 12" x 84"',
      image: '/images/work-samples-5.webp',
      model: 'bookshelf-model.glb'
    },
    {
      id: 'bed-1',
      name: 'Platform Bed',
      category: 'bedroom',
      price: '$1,200',
      dimensions: '80" x 60" x 12"',
      image: '/images/work-samples-6.webp',
      model: 'bed-model.glb'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '🏠' },
    { id: 'seating', name: 'Seating', icon: '🪑' },
    { id: 'tables', name: 'Tables', icon: '🪑' },
    { id: 'lighting', name: 'Lighting', icon: '💡' },
    { id: 'storage', name: 'Storage', icon: '📦' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Check AR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported);
      });
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera permission denied:', error);
      alert('Camera access is required for AR functionality');
    }
  };

  const startAR = async () => {
    if (!isARSupported) {
      alert('AR is not supported on this device');
      return;
    }

    if (!cameraPermission) {
      await requestCameraPermission();
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar');
      setIsARActive(true);
      
      // AR session handling would go here
      session.addEventListener('end', () => {
        setIsARActive(false);
      });
    } catch (error) {
      console.error('Failed to start AR:', error);
      alert('Failed to start AR mode');
    }
  };

  const stopAR = () => {
    setIsARActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const selectFurniture = (furniture) => {
    setSelectedFurniture(furniture);
  };

  const placeFurniture = (x, y) => {
    if (selectedFurniture) {
      const newFurniture = {
        ...selectedFurniture,
        id: `${selectedFurniture.id}-${Date.now()}`,
        position: { x, y },
        rotation: 0,
        scale: 1
      };
      setPlacedFurniture(prev => [...prev, newFurniture]);
    }
  };

  const removeFurniture = (id) => {
    setPlacedFurniture(prev => prev.filter(item => item.id !== id));
  };

  const clearAllFurniture = () => {
    setPlacedFurniture([]);
  };

  const filteredFurniture = selectedCategory === 'all' 
    ? furnitureItems 
    : furnitureItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <motion.div
        className="ar-furniture-placer"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="ar-loading">
          <div className="loading-animation">
            <div className="ar-icon">📱</div>
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          <h3>Loading AR Experience...</h3>
          <p>Preparing furniture placement tools</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="ar-furniture-placer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="ar-header">
        <div className="ar-title">
          <h2>📱 AR Furniture Placer</h2>
          <p>Place furniture in your space using augmented reality</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="ar-content">
        {/* AR Status */}
        <div className="ar-status">
          <div className={`status-indicator ${isARActive ? 'active' : 'inactive'}`}>
            <span className="status-dot"></span>
            <span>{isARActive ? 'AR Active' : 'AR Inactive'}</span>
          </div>
          
          {!isARSupported && (
            <div className="warning-message">
              ⚠️ AR not supported on this device. Use desktop mode for preview.
            </div>
          )}
        </div>

        {/* AR Controls */}
        <div className="ar-controls">
          {!isARActive ? (
            <motion.button
              className="btn btn-primary ar-start-btn"
              onClick={startAR}
              disabled={!isARSupported}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📱 Start AR Mode
            </motion.button>
          ) : (
            <motion.button
              className="btn btn-secondary ar-stop-btn"
              onClick={stopAR}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⏹️ Stop AR
            </motion.button>
          )}
          
          {placedFurniture.length > 0 && (
            <motion.button
              className="btn btn-secondary clear-btn"
              onClick={clearAllFurniture}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Clear All
            </motion.button>
          )}
        </div>

        {/* AR Viewer */}
        <div className="ar-viewer">
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
              className="ar-overlay"
            />
            
            {/* Placed Furniture Overlay */}
            {placedFurniture.map((furniture) => (
              <motion.div
                key={furniture.id}
                className="placed-furniture"
                style={{
                  left: `${furniture.position.x}%`,
                  top: `${furniture.position.y}%`,
                  transform: `rotate(${furniture.rotation}deg) scale(${furniture.scale})`
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="furniture-preview">
                  <img src={furniture.image} alt={furniture.name} />
                  <div className="furniture-info">
                    <h4>{furniture.name}</h4>
                    <p>{furniture.price}</p>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFurniture(furniture.id)}
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Furniture Categories */}
        <div className="furniture-categories">
          <h3>Categories</h3>
          <div className="category-tabs">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Furniture Grid */}
        <div className="furniture-grid">
          <h3>Select Furniture to Place</h3>
          <div className="furniture-items">
            {filteredFurniture.map((furniture) => (
              <motion.div
                key={furniture.id}
                className={`furniture-item ${selectedFurniture?.id === furniture.id ? 'selected' : ''}`}
                onClick={() => selectFurniture(furniture)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="furniture-image">
                  <img src={furniture.image} alt={furniture.name} />
                </div>
                <div className="furniture-details">
                  <h4>{furniture.name}</h4>
                  <p className="furniture-price">{furniture.price}</p>
                  <p className="furniture-dimensions">{furniture.dimensions}</p>
                </div>
                {selectedFurniture?.id === furniture.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AR Instructions */}
        <div className="ar-instructions">
          <h4>📱 How to Use AR</h4>
          <div className="instructions-grid">
            <div className="instruction">
              <span className="instruction-icon">📱</span>
              <div>
                <h5>Point Camera</h5>
                <p>Point your camera at a flat surface</p>
              </div>
            </div>
            <div className="instruction">
              <span className="instruction-icon">👆</span>
              <div>
                <h5>Tap to Place</h5>
                <p>Tap on the surface to place furniture</p>
              </div>
            </div>
            <div className="instruction">
              <span className="instruction-icon">🔄</span>
              <div>
                <h5>Move & Rotate</h5>
                <p>Drag to move, pinch to rotate</p>
              </div>
            </div>
            <div className="instruction">
              <span className="instruction-icon">📏</span>
              <div>
                <h5>True Scale</h5>
                <p>See actual furniture dimensions</p>
              </div>
            </div>
          </div>
        </div>

        {/* AR Features */}
        <div className="ar-features">
          <h4>✨ AR Features</h4>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">📐</span>
              <div>
                <h5>Accurate Measurements</h5>
                <p>See real furniture dimensions in your space</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <div>
                <h5>Material Preview</h5>
                <p>View textures and finishes realistically</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <div>
                <h5>Lighting Simulation</h5>
                <p>See how lighting affects your space</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div>
                <h5>Mobile Optimized</h5>
                <p>Works on iOS and Android devices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Placed Items Summary */}
        {placedFurniture.length > 0 && (
          <div className="placed-items-summary">
            <h4>📋 Your AR Room</h4>
            <div className="summary-items">
              {placedFurniture.map((furniture) => (
                <div key={furniture.id} className="summary-item">
                  <img src={furniture.image} alt={furniture.name} />
                  <div className="summary-details">
                    <h5>{furniture.name}</h5>
                    <p>{furniture.price}</p>
                  </div>
                  <button
                    className="remove-summary-btn"
                    onClick={() => removeFurniture(furniture.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <h5>Total: ${placedFurniture.reduce((sum, item) => 
                sum + parseInt(item.price.replace(/[$,]/g, '')), 0
              ).toLocaleString()}</h5>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ARFurniturePlacer;
