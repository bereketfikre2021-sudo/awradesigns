import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIColorGenerator = ({ showModal }) => {
  const [palettes, setPalettes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('modern');

  const styles = [
    { name: 'Modern', keywords: ['minimalist', 'clean', 'contemporary'] },
    { name: 'Vintage', keywords: ['retro', 'classic', 'timeless'] },
    { name: 'Bohemian', keywords: ['eclectic', 'artistic', 'free-spirited'] },
    { name: 'Industrial', keywords: ['raw', 'urban', 'edgy'] },
    { name: 'Scandinavian', keywords: ['light', 'natural', 'cozy'] },
    { name: 'Luxury', keywords: ['elegant', 'sophisticated', 'premium'] }
  ];

  const generateColorPalette = async (style) => {
    setIsGenerating(true);
    
    // Simulate AI color generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baseColors = {
      modern: ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12', '#27AE60'],
      vintage: ['#8B4513', '#D2691E', '#CD853F', '#F4A460', '#DEB887'],
      bohemian: ['#8E44AD', '#E91E63', '#FF9800', '#4CAF50', '#2196F3'],
      industrial: ['#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1'],
      scandinavian: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#ADB5BD', '#6C757D'],
      luxury: ['#1A1A1A', '#FFD700', '#C0C0C0', '#800080', '#FF6B6B']
    };

    const newPalette = {
      id: Date.now(),
      name: `${style} Palette`,
      colors: baseColors[style.toLowerCase()] || baseColors.modern,
      style: style,
      createdAt: new Date(),
      likes: Math.floor(Math.random() * 100),
      uses: Math.floor(Math.random() * 50)
    };

    setPalettes(prev => [newPalette, ...prev]);
    setIsGenerating(false);
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    // Show toast notification
    showModal('Color Copied!', `Color ${color} copied to clipboard!`, 'success');
  };

  const savePalette = (palette) => {
    // Save to localStorage
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
    savedPalettes.push(palette);
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    showModal('Palette Saved!', 'Palette saved to your collection!', 'success');
  };

  return (
    <motion.div
      className="ai-color-generator"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="generator-header">
        <h3>🎨 AI Color Palette Generator</h3>
        <p>Generate perfect color combinations using advanced AI algorithms</p>
      </div>

      <div className="style-selector">
        <h4>Choose Your Style:</h4>
        <div className="style-buttons">
          {styles.map((style) => (
            <motion.button
              key={style.name}
              className={`style-btn ${selectedStyle === style.name ? 'active' : ''}`}
              onClick={() => setSelectedStyle(style.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {style.name}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        className="generate-btn"
        onClick={() => generateColorPalette(selectedStyle)}
        disabled={isGenerating}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isGenerating ? (
          <>
            <div className="spinner"></div>
            Generating AI Palette...
          </>
        ) : (
          <>
            🤖 Generate AI Palette
          </>
        )}
      </motion.button>

      <div className="palettes-grid">
        <AnimatePresence>
          {palettes.map((palette) => (
            <motion.div
              key={palette.id}
              className="palette-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <div className="palette-header">
                <h4>{palette.name}</h4>
                <div className="palette-stats">
                  <span>❤️ {palette.likes}</span>
                  <span>👁️ {palette.uses}</span>
                </div>
              </div>
              
              <div className="color-swatches">
                {palette.colors.map((color, index) => (
                  <motion.div
                    key={index}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    title={`Click to copy ${color}`}
                  >
                    <span className="color-code">{color}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="palette-actions">
                <motion.button
                  className="action-btn"
                  onClick={() => copyColor(palette.colors.join(', '))}
                  whileHover={{ scale: 1.05 }}
                >
                  📋 Copy All
                </motion.button>
                <motion.button
                  className="action-btn"
                  onClick={() => savePalette(palette)}
                  whileHover={{ scale: 1.05 }}
                >
                  💾 Save
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {palettes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h4>No palettes generated yet</h4>
          <p>Click "Generate AI Palette" to create your first color combination!</p>
        </div>
      )}
    </motion.div>
  );
};

export default AIColorGenerator;
