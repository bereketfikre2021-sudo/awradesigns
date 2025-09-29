import React, { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html, useGLTF, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import * as THREE from 'three';

// Physics-enabled furniture components
const PhysicsFurniture = ({ position, rotation, color, type, onClick }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    rotation,
    args: type === 'sofa' ? [2, 0.5, 1] : type === 'table' ? [1.5, 0.05, 0.9] : [0.5, 0.5, 0.5],
    material: { friction: 0.4, restitution: 0.3 }
  }));

  const handleClick = useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  return (
    <Box
      ref={ref}
      args={type === 'sofa' ? [2, 0.5, 1] : type === 'table' ? [1.5, 0.05, 0.9] : [0.5, 0.5, 0.5]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <meshStandardMaterial color={color} />
    </Box>
  );
};

// Interactive floor with physics
const PhysicsFloor = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
    material: { friction: 0.4, restitution: 0.1 }
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#F5F5DC" roughness={0.8} />
    </mesh>
  );
};

const Room = ({ selectedFurniture, setSelectedFurniture }) => {
  const groupRef = useRef();
  const [furnitureItems, setFurnitureItems] = useState([
    { id: 'sofa', position: [-2, 0, -3], rotation: [0, Math.PI / 4, 0], color: '#8B4513', type: 'sofa' },
    { id: 'table', position: [0, 0, -2], rotation: [0, 0, 0], color: '#654321', type: 'table' },
    { id: 'chair1', position: [2, 0, -3], rotation: [0, -Math.PI / 4, 0], color: '#8B4513', type: 'chair' },
    { id: 'chair2', position: [-1, 0, -1], rotation: [0, Math.PI / 2, 0], color: '#8B4513', type: 'chair' },
    { id: 'lamp', position: [1, 1, -1], rotation: [0, 0, 0], color: '#FFD700', type: 'lamp' },
    { id: 'bookshelf', position: [4, 0, 0], rotation: [0, -Math.PI / 2, 0], color: '#654321', type: 'bookshelf' },
  ]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const handleFurnitureClick = useCallback((furnitureId) => {
    setSelectedFurniture(furnitureId);
  }, [setSelectedFurniture]);

  const addFurniture = useCallback((type) => {
    const newFurniture = {
      id: `${type}_${Date.now()}`,
      position: [Math.random() * 4 - 2, 0, Math.random() * 4 - 2],
      rotation: [0, Math.random() * Math.PI * 2, 0],
      color: type === 'sofa' ? '#8B4513' : type === 'table' ? '#654321' : '#FFD700',
      type
    };
    setFurnitureItems(prev => [...prev, newFurniture]);
  }, []);

  const removeFurniture = useCallback((id) => {
    setFurnitureItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <Physics gravity={[0, -9.81, 0]} defaultContactMaterial={{ friction: 0.4, restitution: 0.3 }}>
      <group ref={groupRef}>
        {/* Physics Floor */}
        <PhysicsFloor />
        
        {/* Walls */}
        <mesh position={[0, 2, -10]} receiveShadow>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#E6E6FA" />
        </mesh>
        
        <mesh position={[10, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#E6E6FA" />
        </mesh>
        
        <mesh position={[-10, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#E6E6FA" />
        </mesh>
        
        {/* Physics-enabled Furniture */}
        {furnitureItems.map((item) => (
          <PhysicsFurniture
            key={item.id}
            position={item.position}
            rotation={item.rotation}
            color={selectedFurniture === item.id ? '#FFD700' : item.color}
            type={item.type}
            onClick={() => handleFurnitureClick(item.id)}
          />
        ))}
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />
      </group>
    </Physics>
  );
};

// Beautiful Modal Component
const Modal = ({ isOpen, onClose, title, children, type = 'info' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header" style={{ borderBottomColor: getColor() }}>
            <div className="modal-title">
              <span className="modal-icon" style={{ color: getColor() }}>
                {getIcon()}
              </span>
              <h3>{title}</h3>
            </div>
            <motion.button
              className="modal-close"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Screenshot Component
const ScreenshotButton = ({ onScreenshot }) => {
  const { gl, scene, camera } = useThree();
  
  const takeScreenshot = useCallback(() => {
    const canvas = gl.domElement;
    const dataURL = canvas.toDataURL('image/png');
    onScreenshot(dataURL);
  }, [gl, onScreenshot]);

  return (
    <Html position={[0, 0, 0]} center>
      <motion.button
        className="screenshot-btn"
        onClick={takeScreenshot}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        📸
      </motion.button>
    </Html>
  );
};

const RoomConfigurator = ({ onClose }) => {
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#8B4513');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });
  const [lighting, setLighting] = useState(70);
  const [ambient, setAmbient] = useState(50);
  const [shadows, setShadows] = useState(40);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [showFurniturePanel, setShowFurniturePanel] = useState(true);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [roomType, setRoomType] = useState('living-room');

  const colorOptions = [
    { name: 'Brown', value: '#8B4513' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Blue', value: '#4169E1' },
    { name: 'Green', value: '#228B22' },
    { name: 'Red', value: '#DC143C' },
    { name: 'Gray', value: '#696969' },
  ];

  const styleOptions = [
    { name: 'Modern', value: 'modern' },
    { name: 'Traditional', value: 'traditional' },
    { name: 'Minimalist', value: 'minimalist' },
    { name: 'Industrial', value: 'industrial' },
    { name: 'Scandinavian', value: 'scandinavian' },
  ];

  const roomTypes = [
    { name: 'Living Room', value: 'living-room', icon: '🛋️' },
    { name: 'Bedroom', value: 'bedroom', icon: '🛏️' },
    { name: 'Kitchen', value: 'kitchen', icon: '🍳' },
    { name: 'Office', value: 'office', icon: '💼' },
    { name: 'Dining Room', value: 'dining-room', icon: '🍽️' },
  ];

  const furnitureTypes = [
    { name: 'Sofa', type: 'sofa', icon: '🛋️', price: '25,000 ETB' },
    { name: 'Dining Table', type: 'table', icon: '🍽️', price: '15,000 ETB' },
    { name: 'Chair', type: 'chair', icon: '🪑', price: '8,000 ETB' },
    { name: 'Bookshelf', type: 'bookshelf', icon: '📚', price: '12,000 ETB' },
    { name: 'Lamp', type: 'lamp', icon: '💡', price: '5,000 ETB' },
    { name: 'Coffee Table', type: 'coffee-table', icon: '☕', price: '10,000 ETB' },
    { name: 'TV Stand', type: 'tv-stand', icon: '📺', price: '18,000 ETB' },
    { name: 'Wardrobe', type: 'wardrobe', icon: '👔', price: '35,000 ETB' },
  ];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const showModalMessage = (title, message, type = 'info') => {
    setModalContent({ title, message, type });
    setShowModal(true);
  };

  const handleSaveDesign = () => {
    const design = {
      id: Date.now(),
      name: `Design ${savedDesigns.length + 1}`,
      furniture: selectedFurniture,
      color: selectedColor,
      style: selectedStyle,
      lighting,
      ambient,
      shadows,
      timestamp: new Date().toLocaleString()
    };
    
    setSavedDesigns(prev => [...prev, design]);
    showModalMessage(
      'Design Saved! 🎉',
      `Your "${design.name}" has been saved successfully. You can access it anytime from your saved designs.`,
      'success'
    );
  };

  const handleScreenshot = (dataURL) => {
    // Create download link
    const link = document.createElement('a');
    link.download = `room-design-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    showModalMessage(
      'Screenshot Captured! 📸',
      'Your 3D room design has been saved as an image. You can now share it with our team or use it for reference.',
      'success'
    );
  };

  const handleAddFurniture = (furnitureType) => {
    showModalMessage(
      'Furniture Added! 🪑',
      `A ${furnitureType.name} has been added to your room. You can drag it around and customize its position.`,
      'success'
    );
  };

  const handleRoomTypeChange = (newRoomType) => {
    setRoomType(newRoomType);
    showModalMessage(
      'Room Type Changed! 🏠',
      `Switched to ${roomTypes.find(r => r.value === newRoomType)?.name}. The room layout has been updated accordingly.`,
      'info'
    );
  };

  const calculateTotalCost = () => {
    // This would calculate based on selected furniture
    return furnitureTypes.reduce((total, furniture) => {
      const price = parseInt(furniture.price.replace(/[^\d]/g, ''));
      return total + price;
    }, 0);
  };

  const resetRoom = () => {
    setSelectedFurniture(null);
    setSelectedColor('#8B4513');
    setSelectedStyle('modern');
    setLighting(70);
    setAmbient(50);
    setShadows(40);
    showModalMessage(
      'Room Reset! 🔄',
      'Your room has been reset to default settings. All customizations have been cleared.',
      'info'
    );
  };

  return (
    <motion.div
      className={`room-configurator ${isFullscreen ? 'fullscreen' : ''}`}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="configurator-header">
        <div className="configurator-title">
          <div className="configurator-icon">🎮</div>
          <div>
            <h3>3D Room Configurator</h3>
            <p>Design your space in real-time</p>
          </div>
        </div>
        <div className="configurator-controls">
          <motion.button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </motion.button>
          <motion.button
            className="close-btn"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>
      </div>

      <div className="configurator-content">
        <div className="configurator-3d">
          <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
            <ambientLight intensity={ambient / 100} />
            <directionalLight position={[10, 10, 5]} intensity={lighting / 100} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <Room 
              selectedFurniture={selectedFurniture}
              setSelectedFurniture={setSelectedFurniture}
            />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={20}
            />
            
            <Environment preset="sunset" />
            <ContactShadows opacity={shadows / 100} scale={10} blur={2} far={4.5} />
            
            <ScreenshotButton onScreenshot={handleScreenshot} />
          </Canvas>
          
          <div className="d3-controls">
            <motion.button
              className="control-btn reset-btn"
              onClick={resetRoom}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Reset Room"
            >
              🔄
            </motion.button>
          </div>
        </div>

        <div className="configurator-panel">
          <div className="panel-section">
            <h4>Selected Furniture</h4>
            <div className="selected-item">
              {selectedFurniture ? (
                <div className="item-info">
                  <div className="item-icon">🪑</div>
                  <span>{selectedFurniture.charAt(0).toUpperCase() + selectedFurniture.slice(1)}</span>
                </div>
              ) : (
                <p>Click on furniture to select</p>
              )}
            </div>
          </div>

          <div className="panel-section">
            <h4>Color Scheme</h4>
            <div className="color-options">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.value}
                  className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h4>Design Style</h4>
            <div className="style-options">
              {styleOptions.map((style) => (
                <motion.button
                  key={style.value}
                  className={`style-option ${selectedStyle === style.value ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(style.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {style.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h4>Room Type</h4>
            <div className="room-type-options">
              {roomTypes.map((room) => (
                <motion.button
                  key={room.value}
                  className={`room-type-option ${roomType === room.value ? 'selected' : ''}`}
                  onClick={() => handleRoomTypeChange(room.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="room-icon">{room.icon}</span>
                  <span className="room-name">{room.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h4>Add Furniture</h4>
            <div className="furniture-grid">
              {furnitureTypes.map((furniture) => (
                <motion.button
                  key={furniture.type}
                  className="furniture-option"
                  onClick={() => handleAddFurniture(furniture)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="furniture-icon">{furniture.icon}</div>
                  <div className="furniture-name">{furniture.name}</div>
                  <div className="furniture-price">{furniture.price}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h4>Physics & Effects</h4>
            <div className="physics-controls">
              <div className="control-item">
                <label>
                  <input
                    type="checkbox"
                    checked={physicsEnabled}
                    onChange={(e) => setPhysicsEnabled(e.target.checked)}
                  />
                  Enable Physics
                </label>
              </div>
              <div className="control-item">
                <label>
                  <input
                    type="checkbox"
                    checked={showFurniturePanel}
                    onChange={(e) => setShowFurniturePanel(e.target.checked)}
                  />
                  Show Furniture Panel
                </label>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h4>Room Settings</h4>
            <div className="room-settings">
              <div className="setting-item">
                <label>Lighting: {lighting}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={lighting}
                  onChange={(e) => setLighting(parseInt(e.target.value))}
                />
              </div>
              <div className="setting-item">
                <label>Ambient: {ambient}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={ambient}
                  onChange={(e) => setAmbient(parseInt(e.target.value))}
                />
              </div>
              <div className="setting-item">
                <label>Shadows: {shadows}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={shadows}
                  onChange={(e) => setShadows(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h4>Cost Calculator</h4>
            <div className="cost-calculator">
              <div className="cost-breakdown">
                <div className="cost-item">
                  <span>Furniture:</span>
                  <span>{calculateTotalCost().toLocaleString()} ETB</span>
                </div>
                <div className="cost-item">
                  <span>Design Fee:</span>
                  <span>25,000 ETB</span>
                </div>
                <div className="cost-item">
                  <span>Installation:</span>
                  <span>15,000 ETB</span>
                </div>
                <div className="cost-total">
                  <span>Total:</span>
                  <span>{(calculateTotalCost() + 40000).toLocaleString()} ETB</span>
                </div>
              </div>
              <motion.button
                className="btn btn-primary cost-btn"
                onClick={() => showModalMessage(
                  'Get Quote! 💰',
                  'Would you like to get a detailed quote for this design? Our team will contact you within 24 hours.',
                  'info'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Detailed Quote
              </motion.button>
            </div>
          </div>

          {savedDesigns.length > 0 && (
            <div className="panel-section">
              <h4>Saved Designs ({savedDesigns.length})</h4>
              <div className="saved-designs">
                {savedDesigns.slice(-3).map((design) => (
                  <div key={design.id} className="saved-design-item">
                    <span className="design-name">{design.name}</span>
                    <span className="design-time">{design.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="panel-actions">
            <motion.button
              className="btn btn-secondary"
              onClick={handleSaveDesign}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 Save Design
            </motion.button>
            
            <motion.button
              className="btn btn-primary"
              onClick={() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  const dataURL = canvas.toDataURL('image/png');
                  handleScreenshot(dataURL);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📸 Screenshot
            </motion.button>
          </div>
        </div>
      </div>

      <div className="configurator-instructions">
        <div className="instruction-item">
          <span className="instruction-icon">🖱️</span>
          <span>Click and drag to rotate</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-icon">🔍</span>
          <span>Scroll to zoom</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-icon">👆</span>
          <span>Click furniture to select</span>
        </div>
      </div>

      {/* Beautiful Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        type={modalContent.type}
      >
        <p>{modalContent.message}</p>
        <div className="modal-actions">
          <motion.button
            className="btn btn-primary"
            onClick={() => setShowModal(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Got it!
          </motion.button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default RoomConfigurator;
