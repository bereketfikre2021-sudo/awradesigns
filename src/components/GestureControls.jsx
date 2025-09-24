import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GestureControls = ({ showModal }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [gestures, setGestures] = useState([]);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [sensitivity, setSensitivity] = useState(50);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const gestureCommands = {
    'thumbs_up': '👍 Like this design',
    'peace_sign': '✌️ Save to favorites',
    'ok_hand': '👌 Perfect choice',
    'point_up': '👆 Select this item',
    'wave': '👋 Switch to next design',
    'clap': '👏 Share this design',
    'rock_on': '🤘 Add to cart',
    'heart': '❤️ Love this style'
  };

  const enableGestureControl = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsEnabled(true);
          startGestureDetection();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        showModal('Camera Access Required', 'Camera access is required for gesture controls. Please allow camera permissions.', 'warning');
      }
    } else {
      showModal('Camera Not Supported', 'Camera is not supported on this device.', 'error');
    }
  };

  const disableGestureControl = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsEnabled(false);
    setCurrentGesture(null);
  };

  const startGestureDetection = () => {
    // Simulate gesture detection
    const interval = setInterval(() => {
      if (!isEnabled) {
        clearInterval(interval);
        return;
      }

      const detectedGestures = Object.keys(gestureCommands);
      const randomGesture = detectedGestures[Math.floor(Math.random() * detectedGestures.length)];
      
      if (Math.random() > 0.7) { // 30% chance of detecting a gesture
        setCurrentGesture(randomGesture);
        
        const newGesture = {
          id: Date.now(),
          type: randomGesture,
          command: gestureCommands[randomGesture],
          timestamp: new Date(),
          confidence: Math.floor(Math.random() * 30) + 70 // 70-100% confidence
        };
        
        setGestures(prev => [newGesture, ...prev.slice(0, 9)]);
        
        // Execute gesture command
        executeGestureCommand(randomGesture);
        
        // Clear current gesture after 2 seconds
        setTimeout(() => setCurrentGesture(null), 2000);
      }
    }, 3000);
  };

  const executeGestureCommand = (gesture) => {
    const commands = {
      'thumbs_up': () => showModal('Design Liked!', '👍 Design liked!', 'success'),
      'peace_sign': () => showModal('Saved to Favorites!', '✌️ Design saved to favorites!', 'success'),
      'ok_hand': () => showModal('Perfect Choice!', '👌 Perfect choice confirmed!', 'success'),
      'point_up': () => showModal('Item Selected!', '👆 Item selected!', 'success'),
      'wave': () => showModal('Switching Design!', '👋 Switching to next design...', 'info'),
      'clap': () => showModal('Design Shared!', '👏 Design shared!', 'success'),
      'rock_on': () => showModal('Added to Cart!', '🤘 Added to cart!', 'success'),
      'heart': () => showModal('Style Loved!', '❤️ Style loved!', 'success')
    };
    
    if (commands[gesture]) {
      commands[gesture]();
    }
  };

  const getGestureIcon = (gesture) => {
    const icons = {
      'thumbs_up': '👍',
      'peace_sign': '✌️',
      'ok_hand': '👌',
      'point_up': '👆',
      'wave': '👋',
      'clap': '👏',
      'rock_on': '🤘',
      'heart': '❤️'
    };
    return icons[gesture] || '👋';
  };

  return (
    <motion.div
      className="gesture-controls"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="gesture-header">
        <h3>🎮 Advanced Gesture Controls</h3>
        <p>Control your design experience with hand gestures</p>
      </div>

      <div className="gesture-controls-panel">
        <div className="control-settings">
          <div className="setting-item">
            <label>Sensitivity: {sensitivity}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
            />
          </div>
          
          <motion.button
            className={`gesture-btn ${isEnabled ? 'enabled' : 'disabled'}`}
            onClick={isEnabled ? disableGestureControl : enableGestureControl}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEnabled ? '🔴 Disable Gestures' : '🟢 Enable Gestures'}
          </motion.button>
        </div>

        {isEnabled && (
          <div className="camera-feed">
            <div className="video-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="gesture-video"
              />
              <canvas
                ref={canvasRef}
                className="gesture-canvas"
              />
              
              {currentGesture && (
                <motion.div
                  className="gesture-overlay"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <div className="gesture-icon">
                    {getGestureIcon(currentGesture)}
                  </div>
                  <div className="gesture-text">
                    {gestureCommands[currentGesture]}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="gesture-commands">
        <h4>Available Gesture Commands:</h4>
        <div className="commands-grid">
          {Object.entries(gestureCommands).map(([gesture, command]) => (
            <motion.div
              key={gesture}
              className={`command-item ${currentGesture === gesture ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="command-icon">{getGestureIcon(gesture)}</div>
              <div className="command-text">{command}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {isEnabled && (
        <div className="gesture-history">
          <h4>Recent Gesture Detections:</h4>
          <div className="history-list">
            <AnimatePresence>
              {gestures.map((gesture) => (
                <motion.div
                  key={gesture.id}
                  className="history-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="history-icon">{getGestureIcon(gesture.type)}</div>
                  <div className="history-content">
                    <div className="history-command">{gesture.command}</div>
                    <div className="history-time">
                      {gesture.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="history-confidence">
                    {gesture.confidence}%
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {!isEnabled && (
        <div className="gesture-instructions">
          <h4>How to Use Gesture Controls:</h4>
          <div className="instructions-grid">
            <div className="instruction">
              <div className="instruction-icon">📹</div>
              <h5>Enable Camera</h5>
              <p>Click "Enable Gestures" to start your camera</p>
            </div>
            <div className="instruction">
              <div className="instruction-icon">👋</div>
              <h5>Make Gestures</h5>
              <p>Use natural hand gestures in front of the camera</p>
            </div>
            <div className="instruction">
              <div className="instruction-icon">⚡</div>
              <h5>Instant Response</h5>
              <p>See immediate feedback and execute commands</p>
            </div>
            <div className="instruction">
              <div className="instruction-icon">🎯</div>
              <h5>Adjust Sensitivity</h5>
              <p>Fine-tune gesture detection to your preference</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GestureControls;
