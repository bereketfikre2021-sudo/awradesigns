import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const AdvancedAnimations = ({ onClose }) => {
  const { t } = useLanguage();
  const [activeDemo, setActiveDemo] = useState('particles');
  const [animationSettings, setAnimationSettings] = useState({
    speed: 1,
    intensity: 0.5,
    direction: 'normal',
    easing: 'easeInOut'
  });
  const [particles, setParticles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const demos = [
    { id: 'particles', name: 'Particle System', icon: '✨', description: 'Interactive particle effects' },
    { id: 'morphing', name: 'Shape Morphing', icon: '🔄', description: 'Smooth shape transformations' },
    { id: 'physics', name: 'Physics Simulation', icon: '⚡', description: 'Realistic physics animations' },
    { id: 'scroll', name: 'Scroll Animations', icon: '📜', description: 'Advanced scroll-triggered effects' },
    { id: 'gestures', name: 'Gesture Controls', icon: '👆', description: 'Touch and mouse gestures' },
    { id: 'transitions', name: 'Page Transitions', icon: '🌊', description: 'Smooth page transitions' }
  ];

  const easingOptions = [
    { value: 'easeInOut', label: 'Ease In Out' },
    { value: 'easeIn', label: 'Ease In' },
    { value: 'easeOut', label: 'Ease Out' },
    { value: 'linear', label: 'Linear' },
    { value: 'circIn', label: 'Circular In' },
    { value: 'circOut', label: 'Circular Out' },
    { value: 'backIn', label: 'Back In' },
    { value: 'backOut', label: 'Back Out' }
  ];

  useEffect(() => {
    // Generate particles for particle system
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        direction: Math.random() * 360,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      }));
      setParticles(newParticles);
    };

    if (activeDemo === 'particles') {
      generateParticles();
    }
  }, [activeDemo]);

  useEffect(() => {
    if (isAnimating && activeDemo === 'particles') {
      const interval = setInterval(() => {
        setParticles(prev => prev.map(particle => ({
          ...particle,
          x: (particle.x + Math.cos(particle.direction * Math.PI / 180) * particle.speed * animationSettings.speed) % 100,
          y: (particle.y + Math.sin(particle.direction * Math.PI / 180) * particle.speed * animationSettings.speed) % 100
        })));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAnimating, animationSettings.speed, activeDemo]);

  const renderParticleSystem = () => (
    <div className="animation-demo particles-demo">
      <div className="demo-header">
        <h4>Particle System</h4>
        <div className="demo-controls">
          <motion.button
            className={`control-btn ${isAnimating ? 'active' : ''}`}
            onClick={() => setIsAnimating(!isAnimating)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAnimating ? '⏸️ Pause' : '▶️ Play'}
          </motion.button>
          <button className="control-btn" onClick={() => setParticles([])}>
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="particles-container">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: animationSettings.easing
            }}
          />
        ))}
      </div>

      <div className="animation-settings">
        <div className="setting-group">
          <label>Speed: {animationSettings.speed}x</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSettings.speed}
            onChange={(e) => setAnimationSettings(prev => ({
              ...prev,
              speed: parseFloat(e.target.value)
            }))}
          />
        </div>
        <div className="setting-group">
          <label>Intensity: {Math.round(animationSettings.intensity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={animationSettings.intensity}
            onChange={(e) => setAnimationSettings(prev => ({
              ...prev,
              intensity: parseFloat(e.target.value)
            }))}
          />
        </div>
        <div className="setting-group">
          <label>Easing:</label>
          <select
            value={animationSettings.easing}
            onChange={(e) => setAnimationSettings(prev => ({
              ...prev,
              easing: e.target.value
            }))}
          >
            {easingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderShapeMorphing = () => (
    <div className="animation-demo morphing-demo">
      <div className="demo-header">
        <h4>Shape Morphing</h4>
        <p>Watch shapes transform smoothly between different forms</p>
      </div>

      <div className="morphing-container">
        <motion.div
          className="morphing-shape"
          animate={{
            borderRadius: ['0%', '50%', '0%', '25%'],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: animationSettings.easing
          }}
        />
      </div>

      <div className="morphing-controls">
        <motion.button
          className="morph-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            // Trigger custom morphing animation
          }}
        >
          🎭 Morph
        </motion.button>
      </div>
    </div>
  );

  const renderPhysicsSimulation = () => (
    <div className="animation-demo physics-demo">
      <div className="demo-header">
        <h4>Physics Simulation</h4>
        <p>Realistic physics with gravity, collision, and momentum</p>
      </div>

      <div className="physics-container">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="physics-ball"
            style={{
              backgroundColor: `hsl(${i * 72}, 70%, 60%)`
            }}
            animate={{
              y: [0, 200, 0],
              x: [0, Math.random() * 100, 0]
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2
            }}
            whileHover={{
              scale: 1.2,
              transition: { duration: 0.2 }
            }}
          />
        ))}
      </div>

      <div className="physics-controls">
        <motion.button
          className="physics-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Trigger physics reset
          }}
        >
          🔄 Reset Physics
        </motion.button>
      </div>
    </div>
  );

  const renderScrollAnimations = () => (
    <div className="animation-demo scroll-demo">
      <div className="demo-header">
        <h4>Scroll Animations</h4>
        <p>Elements animate as they come into view</p>
      </div>

      <div className="scroll-container">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="scroll-item"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: animationSettings.easing
            }}
            viewport={{ once: false, margin: '-100px' }}
          >
            <div className="scroll-content">
              <h5>Scroll Item {i + 1}</h5>
              <p>This element animates when it comes into view</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGestureControls = () => (
    <div className="animation-demo gestures-demo">
      <div className="demo-header">
        <h4>Gesture Controls</h4>
        <p>Interactive gestures for touch and mouse</p>
      </div>

      <div className="gestures-container">
        <motion.div
          className="gesture-box"
          drag
          dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
          whileDrag={{ scale: 1.1, rotate: 5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Drag me around!</span>
        </motion.div>

        <motion.div
          className="gesture-box"
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <span>Hover & Tap me!</span>
        </motion.div>

        <motion.div
          className="gesture-box"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <span>Auto Rotate</span>
        </motion.div>
      </div>

      <div className="gestures-info">
        <p>Try dragging the first box, hovering over the second, and tapping any of them!</p>
      </div>
    </div>
  );

  const renderPageTransitions = () => (
    <div className="animation-demo transitions-demo">
      <div className="demo-header">
        <h4>Page Transitions</h4>
        <p>Smooth transitions between different states</p>
      </div>

      <div className="transitions-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDemo}
            className="transition-content"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: animationSettings.easing }}
          >
            <h5>Transition Demo</h5>
            <p>This content transitions smoothly when you change demos</p>
            <div className="transition-shape"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="transition-controls">
        <motion.button
          className="transition-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Trigger transition
          }}
        >
          🌊 Trigger Transition
        </motion.button>
      </div>
    </div>
  );

  const renderDemoContent = () => {
    switch (activeDemo) {
      case 'particles':
        return renderParticleSystem();
      case 'morphing':
        return renderShapeMorphing();
      case 'physics':
        return renderPhysicsSimulation();
      case 'scroll':
        return renderScrollAnimations();
      case 'gestures':
        return renderGestureControls();
      case 'transitions':
        return renderPageTransitions();
      default:
        return renderParticleSystem();
    }
  };

  return (
    <motion.div
      className="advanced-animations"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="aa-header">
        <div className="aa-title">
          <h2>✨ Advanced Animations</h2>
          <p>Cutting-edge animation effects and interactions</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="aa-content">
        <div className="aa-sidebar">
          <h4>Animation Demos</h4>
          <div className="demos-list">
            {demos.map((demo) => (
              <motion.button
                key={demo.id}
                className={`demo-btn ${activeDemo === demo.id ? 'active' : ''}`}
                onClick={() => setActiveDemo(demo.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="demo-icon">{demo.icon}</span>
                <div className="demo-info">
                  <span className="demo-name">{demo.name}</span>
                  <span className="demo-description">{demo.description}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="aa-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderDemoContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedAnimations;
