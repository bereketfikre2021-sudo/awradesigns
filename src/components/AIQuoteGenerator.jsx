import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const AIQuoteGenerator = ({ onClose }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    spaceSize: '',
    roomCount: '',
    budget: '',
    timeline: '',
    style: '',
    materials: [],
    specialRequirements: '',
    location: '',
    existingFurniture: false
  });
  
  const [quote, setQuote] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const projectTypes = [
    { value: 'residential', label: 'Residential', icon: '🏠', basePrice: 50000 },
    { value: 'commercial', label: 'Commercial', icon: '🏢', basePrice: 100000 },
    { value: 'office', label: 'Office', icon: '💼', basePrice: 75000 },
    { value: 'retail', label: 'Retail', icon: '🛍️', basePrice: 80000 },
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️', basePrice: 120000 },
    { value: 'hotel', label: 'Hotel', icon: '🏨', basePrice: 200000 }
  ];

  const designStyles = [
    { value: 'modern', label: 'Modern', description: 'Clean lines, minimal design' },
    { value: 'traditional', label: 'Traditional', description: 'Classic, timeless elegance' },
    { value: 'contemporary', label: 'Contemporary', description: 'Current trends and styles' },
    { value: 'industrial', label: 'Industrial', description: 'Raw materials, exposed elements' },
    { value: 'scandinavian', label: 'Scandinavian', description: 'Light, natural, functional' },
    { value: 'mediterranean', label: 'Mediterranean', description: 'Warm, earthy tones' }
  ];

  const materialOptions = [
    { value: 'premium', label: 'Premium Materials', multiplier: 1.5 },
    { value: 'standard', label: 'Standard Materials', multiplier: 1.0 },
    { value: 'budget', label: 'Budget Materials', multiplier: 0.7 },
    { value: 'eco-friendly', label: 'Eco-Friendly', multiplier: 1.2 },
    { value: 'luxury', label: 'Luxury Materials', multiplier: 2.0 }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaterialToggle = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const generateQuote = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI-powered quote calculation
    const baseProject = projectTypes.find(p => p.value === formData.projectType);
    let totalCost = baseProject ? baseProject.basePrice : 50000;
    
    // Size multiplier
    const sizeMultiplier = Math.max(0.5, Math.min(2.0, parseInt(formData.spaceSize) / 100));
    totalCost *= sizeMultiplier;
    
    // Room count adjustment
    const roomMultiplier = 1 + (parseInt(formData.roomCount) - 1) * 0.3;
    totalCost *= roomMultiplier;
    
    // Material multipliers
    const materialMultiplier = formData.materials.reduce((acc, material) => {
      const mat = materialOptions.find(m => m.value === material);
      return acc * (mat ? mat.multiplier : 1);
    }, 1);
    totalCost *= materialMultiplier;
    
    // Timeline urgency
    const timelineMultiplier = formData.timeline === 'asap' ? 1.3 : 
                              formData.timeline === '1-3months' ? 1.1 : 1.0;
    totalCost *= timelineMultiplier;
    
    // Location adjustment (Ethiopia pricing)
    totalCost *= 0.3; // Adjusted for local market
    
    const generatedQuote = {
      totalCost: Math.round(totalCost),
      breakdown: {
        design: Math.round(totalCost * 0.15),
        materials: Math.round(totalCost * 0.45),
        labor: Math.round(totalCost * 0.30),
        permits: Math.round(totalCost * 0.05),
        contingency: Math.round(totalCost * 0.05)
      },
      timeline: calculateTimeline(),
      recommendations: generateRecommendations()
    };
    
    setQuote(generatedQuote);
    setIsGenerating(false);
    setCurrentStep(4);
  };

  const calculateTimeline = () => {
    const baseWeeks = parseInt(formData.roomCount) * 2;
    const sizeWeeks = Math.ceil(parseInt(formData.spaceSize) / 200);
    const materialWeeks = formData.materials.includes('luxury') ? 2 : 0;
    
    return Math.max(4, baseWeeks + sizeWeeks + materialWeeks);
  };

  const generateRecommendations = () => {
    const recs = [];
    
    if (formData.budget === 'under-50k') {
      recs.push({
        type: 'cost-saving',
        title: 'Cost Optimization',
        description: 'Consider phased implementation to spread costs over time',
        impact: 'Save 20-30% on initial investment'
      });
    }
    
    if (formData.style === 'modern') {
      recs.push({
        type: 'design',
        title: 'Modern Design Package',
        description: 'Smart home integration and energy-efficient solutions',
        impact: 'Increase property value by 15-20%'
      });
    }
    
    if (formData.materials.includes('eco-friendly')) {
      recs.push({
        type: 'sustainability',
        title: 'Green Building Certification',
        description: 'LEED certification available for eco-friendly projects',
        impact: 'Tax incentives and premium resale value'
      });
    }
    
    if (formData.timeline === 'asap') {
      recs.push({
        type: 'timeline',
        title: 'Expedited Delivery',
        description: 'Premium materials and additional crew for faster completion',
        impact: 'Complete 2-3 weeks earlier'
      });
    }
    
    return recs;
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      generateQuote();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      projectType: '',
      spaceSize: '',
      roomCount: '',
      budget: '',
      timeline: '',
      style: '',
      materials: [],
      specialRequirements: '',
      location: '',
      existingFurniture: false
    });
    setCurrentStep(1);
    setQuote(null);
  };

  return (
    <motion.div
      className="ai-quote-generator"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="quote-header">
        <h2>🤖 AI Quote Generator</h2>
        <p>Get an intelligent estimate for your project in minutes</p>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="quote-content">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Project Type'}
                {step === 2 && 'Details'}
                {step === 3 && 'Preferences'}
                {step === 4 && 'Quote'}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Project Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              className="quote-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3>What type of project are you planning?</h3>
              <div className="project-types">
                {projectTypes.map((type) => (
                  <motion.div
                    key={type.value}
                    className={`project-type ${formData.projectType === type.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('projectType', type.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="type-icon">{type.icon}</div>
                    <div className="type-info">
                      <h4>{type.label}</h4>
                      <p>Starting from ${type.basePrice.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              className="quote-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3>Tell us about your space</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Space Size (sq ft)</label>
                  <input
                    type="number"
                    value={formData.spaceSize}
                    onChange={(e) => handleInputChange('spaceSize', e.target.value)}
                    placeholder="e.g., 1500"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Rooms</label>
                  <select
                    value={formData.roomCount}
                    onChange={(e) => handleInputChange('roomCount', e.target.value)}
                  >
                    <option value="">Select rooms</option>
                    <option value="1">1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>
                    <option value="4">4 Rooms</option>
                    <option value="5">5+ Rooms</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  >
                    <option value="">Select budget</option>
                    <option value="under-50k">Under $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="250k-500k">$250,000 - $500,000</option>
                    <option value="over-500k">Over $500,000</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-3months">1-3 months</option>
                    <option value="3-6months">3-6 months</option>
                    <option value="6-12months">6-12 months</option>
                    <option value="over-12months">Over 12 months</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              className="quote-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3>Design preferences and materials</h3>
              
              <div className="form-group">
                <label>Design Style</label>
                <div className="style-options">
                  {designStyles.map((style) => (
                    <motion.div
                      key={style.value}
                      className={`style-option ${formData.style === style.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('style', style.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h4>{style.label}</h4>
                      <p>{style.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Material Preferences</label>
                <div className="material-options">
                  {materialOptions.map((material) => (
                    <motion.div
                      key={material.value}
                      className={`material-option ${formData.materials.includes(material.value) ? 'selected' : ''}`}
                      onClick={() => handleMaterialToggle(material.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h4>{material.label}</h4>
                      <span className="multiplier">
                        {material.multiplier > 1 ? '+' : ''}{Math.round((material.multiplier - 1) * 100)}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Special Requirements</label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Any specific requirements or features..."
                  rows="3"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Quote Results */}
          {currentStep === 4 && quote && (
            <motion.div
              key="step4"
              className="quote-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="quote-results">
                <div className="quote-summary">
                  <h3>🎯 Your AI-Generated Quote</h3>
                  <div className="total-cost">
                    <span className="currency">ETB</span>
                    <span className="amount">{quote.totalCost.toLocaleString()}</span>
                  </div>
                  <p className="timeline">Estimated completion: {quote.timeline} weeks</p>
                </div>

                <div className="cost-breakdown">
                  <h4>Cost Breakdown</h4>
                  <div className="breakdown-items">
                    {Object.entries(quote.breakdown).map(([key, value]) => (
                      <div key={key} className="breakdown-item">
                        <span className="item-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className="item-value">ETB {value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ai-recommendations">
                  <h4>🤖 AI Recommendations</h4>
                  <div className="recommendations-list">
                    {quote.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        className={`recommendation ${rec.type}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="rec-header">
                          <h5>{rec.title}</h5>
                          <span className="rec-type">{rec.type}</span>
                        </div>
                        <p>{rec.description}</p>
                        <div className="rec-impact">{rec.impact}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="quote-actions">
                  <motion.button
                    className="btn btn-secondary"
                    onClick={resetForm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate New Quote
                  </motion.button>
                  <motion.button
                    className="btn btn-primary"
                    onClick={() => {
                      // Handle quote acceptance
                      console.log('Quote accepted:', quote);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Accept Quote & Contact Us
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isGenerating && (
          <motion.div
            className="generating-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="ai-thinking">
              <div className="thinking-animation">
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
              </div>
              <h3>🤖 AI is analyzing your project...</h3>
              <p>Calculating costs, timeline, and generating recommendations</p>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        {!isGenerating && currentStep < 4 && (
          <div className="quote-navigation">
            {currentStep > 1 && (
              <motion.button
                className="btn btn-secondary"
                onClick={prevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Previous
              </motion.button>
            )}
            <motion.button
              className="btn btn-primary"
              onClick={nextStep}
              disabled={!canProceed()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === 3 ? 'Generate Quote' : 'Next →'}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );

  function canProceed() {
    switch (currentStep) {
      case 1:
        return formData.projectType;
      case 2:
        return formData.spaceSize && formData.roomCount && formData.budget && formData.timeline;
      case 3:
        return formData.style;
      default:
        return true;
    }
  }
};

export default AIQuoteGenerator;
