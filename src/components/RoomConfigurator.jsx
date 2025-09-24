import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const Room = ({ selectedFurniture, setSelectedFurniture }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const furnitureItems = [
    { id: 'sofa', position: [-2, 0, -3], rotation: [0, Math.PI / 4, 0], color: '#8B4513' },
    { id: 'table', position: [0, 0, -2], rotation: [0, 0, 0], color: '#654321' },
    { id: 'chair1', position: [2, 0, -3], rotation: [0, -Math.PI / 4, 0], color: '#8B4513' },
    { id: 'chair2', position: [-1, 0, -1], rotation: [0, Math.PI / 2, 0], color: '#8B4513' },
    { id: 'lamp', position: [1, 1, -1], rotation: [0, 0, 0], color: '#FFD700' },
    { id: 'bookshelf', position: [4, 0, 0], rotation: [0, -Math.PI / 2, 0], color: '#654321' },
  ];

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.8} />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2, -10]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#E6E6FA" />
      </mesh>
      
      <mesh position={[10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#E6E6FA" />
      </mesh>
      
      <mesh position={[-10, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#E6E6FA" />
      </mesh>
      
      {/* Furniture */}
      {furnitureItems.map((item) => (
        <Float
          key={item.id}
          speed={2}
          rotationIntensity={0.1}
          floatIntensity={0.1}
        >
          <mesh
            position={item.position}
            rotation={item.rotation}
            onClick={() => setSelectedFurniture(item.id)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {item.id === 'sofa' && <boxGeometry args={[3, 1, 1.5]} />}
            {item.id === 'table' && <cylinderGeometry args={[1, 1, 0.1, 8]} />}
            {item.id === 'chair1' && <boxGeometry args={[1, 1.5, 1]} />}
            {item.id === 'chair2' && <boxGeometry args={[1, 1.5, 1]} />}
            {item.id === 'lamp' && <cylinderGeometry args={[0.1, 0.1, 2, 8]} />}
            {item.id === 'bookshelf' && <boxGeometry args={[0.5, 3, 2]} />}
            
            <meshStandardMaterial 
              color={selectedFurniture === item.id ? '#FFD700' : item.color}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
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
