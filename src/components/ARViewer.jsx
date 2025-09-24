import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ARViewer = ({ onClose, showModal }) => {
  const [isARActive, setIsARActive] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [furniturePosition, setFurniturePosition] = useState({ x: 0, y: 0 });
  const [furnitureScale, setFurnitureScale] = useState(1);
  const [furnitureRotation, setFurnitureRotation] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const furnitureItems = [
    { 
      id: 1, 
      name: 'Modern Sofa', 
      image: '/images/Work Samples -1.webp', 
      scale: 1.2,
      color: '#8B4513',
      dimensions: '200cm x 80cm x 85cm'
    },
    { 
      id: 2, 
      name: 'Dining Table', 
      image: '/images/Work Samples -2.webp', 
      scale: 0.8,
      color: '#654321',
      dimensions: '150cm x 90cm x 75cm'
    },
    { 
      id: 3, 
      name: 'Coffee Table', 
      image: '/images/Work Samples -3.webp', 
      scale: 0.6,
      color: '#A0522D',
      dimensions: '120cm x 60cm x 45cm'
    },
    { 
      id: 4, 
      name: 'Bookshelf', 
      image: '/images/Work Samples -4.webp', 
      scale: 1.0,
      color: '#8B4513',
      dimensions: '80cm x 30cm x 200cm'
    },
    { 
      id: 5, 
      name: 'Floor Lamp', 
      image: '/images/Work Samples -5.webp', 
      scale: 0.4,
      color: '#2F4F4F',
      dimensions: '30cm x 30cm x 180cm'
    },
    { 
      id: 6, 
      name: 'Accent Chair', 
      image: '/images/Work Samples -6.webp', 
      scale: 0.7,
      color: '#8B4513',
      dimensions: '70cm x 70cm x 90cm'
    },
  ];

  useEffect(() => {
    if (isARActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isARActive]);

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
        videoRef.current.play();
        startARLoop();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      showModal('Camera Access Required', 'Camera access is required for AR preview. Please allow camera permissions and try again.', 'warning');
      setIsARActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const startARLoop = () => {
    const drawAR = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw furniture if selected
        if (selectedFurniture && isPlacing) {
          drawFurniture(ctx, canvas.width, canvas.height);
        }
      }
      animationFrameRef.current = requestAnimationFrame(drawAR);
    };
    drawAR();
  };

  const drawFurniture = (ctx, canvasWidth, canvasHeight) => {
    const centerX = canvasWidth / 2 + furniturePosition.x;
    const centerY = canvasHeight / 2 + furniturePosition.y;
    const size = 100 * furnitureScale;
    
    // Save context state
    ctx.save();
    
    // Move to center and rotate
    ctx.translate(centerX, centerY);
    ctx.rotate(furnitureRotation);
    
    // Draw furniture shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-size/2 + 5, -size/2 + 5, size, size);
    
    // Draw furniture placeholder (since we don't have 3D models)
    ctx.fillStyle = selectedFurniture.color;
    ctx.fillRect(-size/2, -size/2, size, size);
    
    // Draw furniture border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(-size/2, -size/2, size, size);
    
    // Draw furniture name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(selectedFurniture.name, 0, -size/2 - 10);
    
    // Restore context state
    ctx.restore();
  };

  const handleCanvasClick = (e) => {
    if (!selectedFurniture) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to relative position
    const relativeX = (x - canvas.width / 2) / canvas.width * 2;
    const relativeY = (y - canvas.height / 2) / canvas.height * 2;
    
    setFurniturePosition({ x: relativeX * 200, y: relativeY * 200 });
    setIsPlacing(true);
  };

  const handleCanvasTouch = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('click', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      handleCanvasClick(mouseEvent);
    } else if (e.touches.length === 2) {
      // Handle pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (distance > 100) {
        setFurnitureScale(Math.min(2, furnitureScale + 0.1));
      } else if (distance < 50) {
        setFurnitureScale(Math.max(0.5, furnitureScale - 0.1));
      }
    }
  };

  const resetFurniture = () => {
    setSelectedFurniture(null);
    setFurniturePosition({ x: 0, y: 0 });
    setFurnitureScale(1);
    setFurnitureRotation(0);
    setIsPlacing(false);
  };

  const saveARScene = () => {
    if (selectedFurniture && isPlacing) {
      const sceneData = {
        furniture: selectedFurniture,
        position: furniturePosition,
        scale: furnitureScale,
        rotation: furnitureRotation,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage
      const savedScenes = JSON.parse(localStorage.getItem('arScenes') || '[]');
      savedScenes.push(sceneData);
      localStorage.setItem('arScenes', JSON.stringify(savedScenes));
      
      showModal('AR Scene Saved!', `${selectedFurniture.name} has been added to your saved scenes.`, 'success');
    }
  };

  return (
    <motion.div
      className="ar-viewer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="ar-header">
        <div className="ar-title">
          <div className="ar-icon">📱</div>
          <div>
            <h3>AR Room Preview</h3>
            <p>{isARActive ? 'Live Camera Feed' : 'Ready to Start'}</p>
          </div>
        </div>
        <motion.button
          className="close-btn"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </div>

      <div className="ar-content">
        {!isARActive ? (
          <div className="ar-setup">
            <div className="ar-preview">
              <div className="ar-placeholder">
                <span className="ar-icon-large">✨</span>
                <h4>Visualize Your Space</h4>
                <p>See furniture and designs in your real room using augmented reality.</p>
                <div className="ar-features">
                  <div className="feature-item">
                    <span className="feature-icon">📐</span>
                    <span>Real-time measurements</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎨</span>
                    <span>Color matching</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💾</span>
                    <span>Save scenes</span>
                  </div>
                </div>
              </div>
            </div>
            <motion.button
              className="btn btn-primary"
              onClick={() => setIsARActive(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start AR Experience
            </motion.button>
            <p className="ar-warning">
              *Requires camera access. Best experienced on mobile devices.
            </p>
          </div>
        ) : (
          <div className="ar-active">
            <div className="ar-camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="ar-video"
                style={{ display: 'none' }}
              />
              <canvas
                ref={canvasRef}
                className="ar-canvas"
                onClick={handleCanvasClick}
                onTouchStart={handleCanvasTouch}
                onTouchMove={handleCanvasTouch}
              />
              
              {selectedFurniture && isPlacing && (
                <motion.div
                  className="ar-furniture-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="furniture-details">
                    <h4>{selectedFurniture.name}</h4>
                    <p>Dimensions: {selectedFurniture.dimensions}</p>
                    <div className="furniture-controls">
                      <button onClick={() => setFurnitureScale(Math.max(0.5, furnitureScale - 0.1))}>
                        🔍-
                      </button>
                      <span>Scale: {furnitureScale.toFixed(1)}x</span>
                      <button onClick={() => setFurnitureScale(Math.min(2, furnitureScale + 0.1))}>
                        🔍+
                      </button>
                    </div>
                    <div className="furniture-controls">
                      <button onClick={() => setFurnitureRotation(furnitureRotation - 0.1)}>
                        ↻
                      </button>
                      <span>Rotate</span>
                      <button onClick={() => setFurnitureRotation(furnitureRotation + 0.1)}>
                        ↺
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="ar-instructions">
              <div className="instruction-item">
                <span className="instruction-icon">👆</span>
                <span>Tap to place/move</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">🤏</span>
                <span>Pinch to scale</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">🔄</span>
                <span>Use buttons to rotate</span>
              </div>
            </div>

            <div className="ar-furniture-panel">
              <h4>Select Furniture</h4>
              <div className="furniture-grid">
                {furnitureItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`furniture-item ${selectedFurniture?.id === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedFurniture(item);
                      setIsPlacing(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="furniture-image"
                      style={{ 
                        backgroundImage: `url(${item.image})`,
                        backgroundColor: item.color
                      }}
                    />
                    <span className="furniture-name">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="ar-actions">
              <motion.button
                className="btn btn-secondary"
                onClick={resetFurniture}
                disabled={!selectedFurniture}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Item
              </motion.button>
              <motion.button
                className="btn btn-primary"
                onClick={saveARScene}
                disabled={!selectedFurniture || !isPlacing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Scene
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                onClick={() => setIsARActive(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Stop AR
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ARViewer;