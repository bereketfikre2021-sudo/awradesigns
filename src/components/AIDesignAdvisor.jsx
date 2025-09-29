import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const AIDesignAdvisor = ({ onClose }) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    lifestyle: '',
    colorPreferences: [],
    lighting: '',
    spaceUsage: '',
    budget: '',
    timeline: '',
    family: '',
    pets: false,
    workFromHome: false,
    entertaining: false
  });
  
  const [recommendations, setRecommendations] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const questions = [
    {
      id: 'lifestyle',
      question: "How would you describe your lifestyle?",
      type: 'single',
      options: [
        { value: 'minimalist', label: 'Minimalist', description: 'Clean, simple, uncluttered spaces' },
        { value: 'busy-professional', label: 'Busy Professional', description: 'Efficient, low-maintenance design' },
        { value: 'family-oriented', label: 'Family-Oriented', description: 'Durable, kid-friendly, functional' },
        { value: 'creative', label: 'Creative', description: 'Inspiring, unique, artistic spaces' },
        { value: 'luxury', label: 'Luxury', description: 'High-end, sophisticated, premium' }
      ]
    },
    {
      id: 'colorPreferences',
      question: "What colors appeal to you? (Select all that apply)",
      type: 'multiple',
      options: [
        { value: 'neutral', label: 'Neutrals', color: '#F5F5F5', description: 'Beiges, grays, whites' },
        { value: 'warm', label: 'Warm Tones', color: '#FF6B6B', description: 'Reds, oranges, yellows' },
        { value: 'cool', label: 'Cool Tones', color: '#4ECDC4', description: 'Blues, greens, purples' },
        { value: 'earth', label: 'Earth Tones', color: '#8B4513', description: 'Browns, tans, natural colors' },
        { value: 'bold', label: 'Bold Colors', color: '#FF1493', description: 'Bright, vibrant, statement colors' }
      ]
    },
    {
      id: 'lighting',
      question: "What type of lighting do you prefer?",
      type: 'single',
      options: [
        { value: 'natural', label: 'Natural Light', description: 'Large windows, skylights, bright spaces' },
        { value: 'ambient', label: 'Ambient Lighting', description: 'Soft, warm, cozy atmosphere' },
        { value: 'task', label: 'Task Lighting', description: 'Focused, functional, work-oriented' },
        { value: 'dramatic', label: 'Dramatic Lighting', description: 'Statement fixtures, mood lighting' }
      ]
    },
    {
      id: 'spaceUsage',
      question: "How do you primarily use your space?",
      type: 'single',
      options: [
        { value: 'relaxation', label: 'Relaxation', description: 'Comfortable, peaceful, stress-free' },
        { value: 'entertaining', label: 'Entertaining', description: 'Open, social, welcoming' },
        { value: 'work', label: 'Work & Productivity', description: 'Organized, efficient, inspiring' },
        { value: 'creative', label: 'Creative Activities', description: 'Inspiring, flexible, artistic' }
      ]
    },
    {
      id: 'family',
      question: "Tell us about your household",
      type: 'single',
      options: [
        { value: 'single', label: 'Single', description: 'Personal space, individual preferences' },
        { value: 'couple', label: 'Couple', description: 'Shared spaces, romantic atmosphere' },
        { value: 'family', label: 'Family with Kids', description: 'Durable, safe, family-friendly' },
        { value: 'extended', label: 'Extended Family', description: 'Flexible, accommodating, multi-generational' }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setUserPreferences(prev => ({
      ...prev,
      [questionId]: prev[questionId] && Array.isArray(prev[questionId]) 
        ? prev[questionId].includes(answer)
          ? prev[questionId].filter(a => a !== answer)
          : [...prev[questionId], answer]
        : answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRecommendations();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const generateRecommendations = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const recs = {
      designStyle: determineDesignStyle(),
      colorScheme: generateColorScheme(),
      furniture: generateFurnitureRecommendations(),
      lighting: generateLightingPlan(),
      layout: generateLayoutRecommendations(),
      materials: generateMaterialSuggestions(),
      budget: generateBudgetRecommendations(),
      timeline: generateTimelineRecommendations(),
      tips: generatePersonalizedTips()
    };
    
    setRecommendations(recs);
    setIsAnalyzing(false);
  };

  const determineDesignStyle = () => {
    const { lifestyle, colorPreferences, spaceUsage } = userPreferences;
    
    if (lifestyle === 'minimalist') return 'Modern Minimalist';
    if (lifestyle === 'luxury') return 'Contemporary Luxury';
    if (lifestyle === 'family-oriented') return 'Modern Family';
    if (lifestyle === 'creative') return 'Eclectic Creative';
    if (lifestyle === 'busy-professional') return 'Contemporary Professional';
    
    return 'Modern Contemporary';
  };

  const generateColorScheme = () => {
    const { colorPreferences } = userPreferences;
    
    if (colorPreferences.includes('neutral')) {
      return {
        primary: '#F5F5F5',
        secondary: '#E0E0E0',
        accent: '#FFD700',
        name: 'Neutral Elegance'
      };
    }
    
    if (colorPreferences.includes('warm')) {
      return {
        primary: '#FF6B6B',
        secondary: '#FFE66D',
        accent: '#4ECDC4',
        name: 'Warm & Inviting'
      };
    }
    
    if (colorPreferences.includes('cool')) {
      return {
        primary: '#4ECDC4',
        secondary: '#45B7D1',
        accent: '#FFD700',
        name: 'Cool & Calming'
      };
    }
    
    return {
      primary: '#F5F5F5',
      secondary: '#E0E0E0',
      accent: '#FFD700',
      name: 'Balanced Harmony'
    };
  };

  const generateFurnitureRecommendations = () => {
    const { lifestyle, family } = userPreferences;
    
    if (lifestyle === 'minimalist') {
      return [
        { name: 'Modular Sofa', reason: 'Flexible, clean lines, space-efficient' },
        { name: 'Floating Shelves', reason: 'Minimal visual weight, functional storage' },
        { name: 'Nesting Tables', reason: 'Versatile, space-saving when not in use' }
      ];
    }
    
    if (family === 'family') {
      return [
        { name: 'Sectional Sofa', reason: 'Durable, comfortable for family gatherings' },
        { name: 'Storage Ottoman', reason: 'Dual-purpose seating and toy storage' },
        { name: 'Kid-Friendly Coffee Table', reason: 'Rounded corners, easy to clean' }
      ];
    }
    
    return [
      { name: 'Statement Sofa', reason: 'Comfortable centerpiece for your space' },
      { name: 'Accent Chairs', reason: 'Add personality and extra seating' },
      { name: 'Storage Console', reason: 'Functional and stylish storage solution' }
    ];
  };

  const generateLightingPlan = () => {
    const { lighting, spaceUsage } = userPreferences;
    
    if (lighting === 'natural') {
      return [
        { type: 'Ambient', description: 'Large windows with sheer curtains for maximum natural light' },
        { type: 'Task', description: 'Adjustable desk lamps for work areas' },
        { type: 'Accent', description: 'Subtle LED strips to highlight architectural features' }
      ];
    }
    
    if (spaceUsage === 'entertaining') {
      return [
        { type: 'Ambient', description: 'Dimmable overhead lighting for mood control' },
        { type: 'Task', description: 'Pendant lights over dining and kitchen areas' },
        { type: 'Accent', description: 'Statement chandelier as conversation piece' }
      ];
    }
    
    return [
      { type: 'Ambient', description: 'Soft, warm overhead lighting for general illumination' },
      { type: 'Task', description: 'Focused lighting for reading and work areas' },
      { type: 'Accent', description: 'Decorative lighting to create visual interest' }
    ];
  };

  const generateLayoutRecommendations = () => {
    const { spaceUsage, family } = userPreferences;
    
    if (spaceUsage === 'entertaining') {
      return [
        'Open floor plan to encourage social interaction',
        'Flexible seating arrangements for different group sizes',
        'Clear traffic flow between kitchen, dining, and living areas'
      ];
    }
    
    if (family === 'family') {
      return [
        'Dedicated play area with easy supervision',
        'Durable materials in high-traffic areas',
        'Flexible spaces that can adapt as children grow'
      ];
    }
    
    return [
      'Zoned areas for different activities',
      'Efficient use of natural light',
      'Clear pathways and unobstructed views'
    ];
  };

  const generateMaterialSuggestions = () => {
    const { lifestyle, family } = userPreferences;
    
    if (family === 'family') {
      return [
        { material: 'Performance Fabrics', reason: 'Stain-resistant, easy to clean' },
        { material: 'Hardwood Floors', reason: 'Durable, timeless, easy maintenance' },
        { material: 'Quartz Countertops', reason: 'Non-porous, scratch-resistant' }
      ];
    }
    
    if (lifestyle === 'luxury') {
      return [
        { material: 'Marble Accents', reason: 'Luxurious, sophisticated appearance' },
        { material: 'Premium Hardwoods', reason: 'Rich, warm, high-end feel' },
        { material: 'Custom Millwork', reason: 'Tailored, unique design elements' }
      ];
    }
    
    return [
      { material: 'Engineered Hardwood', reason: 'Durable, cost-effective, beautiful' },
      { material: 'Natural Stone', reason: 'Timeless, elegant, easy maintenance' },
      { material: 'Quality Upholstery', reason: 'Comfortable, long-lasting, stylish' }
    ];
  };

  const generateBudgetRecommendations = () => {
    const { lifestyle } = userPreferences;
    
    if (lifestyle === 'luxury') {
      return {
        range: '$150,000 - $300,000',
        focus: 'Premium materials and custom solutions',
        tips: ['Invest in statement pieces', 'Consider custom millwork', 'Quality over quantity']
      };
    }
    
    if (lifestyle === 'minimalist') {
      return {
        range: '$50,000 - $100,000',
        focus: 'Quality basics with strategic accents',
        tips: ['Fewer, better pieces', 'Multi-functional furniture', 'Focus on lighting and textiles']
      };
    }
    
    return {
      range: '$75,000 - $150,000',
      focus: 'Balanced approach to quality and value',
      tips: ['Mix high and low pieces', 'Invest in key areas', 'Plan for future flexibility']
    };
  };

  const generateTimelineRecommendations = () => {
    const { lifestyle, family } = userPreferences;
    
    if (family === 'family') {
      return {
        duration: '12-16 weeks',
        phases: ['Planning (2-3 weeks)', 'Demolition (1 week)', 'Construction (8-10 weeks)', 'Finishing (2-3 weeks)'],
        tips: ['Plan around school schedules', 'Consider temporary living arrangements', 'Order materials early']
      };
    }
    
    return {
      duration: '8-12 weeks',
      phases: ['Planning (1-2 weeks)', 'Construction (6-8 weeks)', 'Finishing (1-2 weeks)'],
      tips: ['Book contractors early', 'Order custom items first', 'Plan for weather delays']
    };
  };

  const generatePersonalizedTips = () => {
    const tips = [];
    
    if (userPreferences.workFromHome) {
      tips.push('Create a dedicated workspace with good lighting and minimal distractions');
    }
    
    if (userPreferences.pets) {
      tips.push('Choose pet-friendly materials and consider built-in pet areas');
    }
    
    if (userPreferences.entertaining) {
      tips.push('Design flexible seating and consider a bar or beverage station');
    }
    
    tips.push('Start with a neutral base and add color through accessories');
    tips.push('Measure twice, buy once - accurate measurements save time and money');
    tips.push('Consider the flow of natural light throughout the day');
    
    return tips;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserPreferences({
      lifestyle: '',
      colorPreferences: [],
      lighting: '',
      spaceUsage: '',
      budget: '',
      timeline: '',
      family: '',
      pets: false,
      workFromHome: false,
      entertaining: false
    });
    setRecommendations(null);
  };

  const currentQ = questions[currentQuestion];

  return (
    <motion.div
      className="ai-design-advisor"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="advisor-header">
        <h2>🎨 AI Design Advisor</h2>
        <p>Get personalized design recommendations based on your lifestyle</p>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="advisor-content">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Questions */}
          {!recommendations && !isAnalyzing && (
            <motion.div
              key={`question-${currentQuestion}`}
              className="question-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3>{currentQ.question}</h3>
              
              <div className="options-container">
                {currentQ.options.map((option) => (
                  <motion.div
                    key={option.value}
                    className={`option ${currentQ.type === 'multiple' ? 'multiple' : 'single'} ${
                      (currentQ.type === 'multiple' 
                        ? userPreferences[currentQ.id]?.includes(option.value)
                        : userPreferences[currentQ.id] === option.value) ? 'selected' : ''
                    }`}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.color && (
                      <div 
                        className="color-preview" 
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <div className="option-content">
                      <h4>{option.label}</h4>
                      <p>{option.description}</p>
                    </div>
                    {currentQ.type === 'multiple' && (
                      <div className="checkbox">
                        {userPreferences[currentQ.id]?.includes(option.value) && '✓'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <motion.div
              className="analyzing-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="ai-analyzing">
                <div className="analyzing-animation">
                  <div className="analyzing-dot"></div>
                  <div className="analyzing-dot"></div>
                  <div className="analyzing-dot"></div>
                </div>
                <h3>🎨 AI is analyzing your preferences...</h3>
                <p>Creating personalized design recommendations just for you</p>
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {recommendations && (
            <motion.div
              className="recommendations-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="recommendations-header">
                <h3>🎯 Your Personalized Design Plan</h3>
                <p>Based on your preferences and lifestyle</p>
              </div>

              <div className="recommendations-grid">
                {/* Design Style */}
                <div className="recommendation-card">
                  <h4>🎨 Recommended Style</h4>
                  <div className="style-recommendation">
                    <h5>{recommendations.designStyle}</h5>
                    <p>Perfect match for your lifestyle and preferences</p>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="recommendation-card">
                  <h4>🌈 Color Palette</h4>
                  <div className="color-scheme">
                    <div className="color-palette">
                      <div 
                        className="color-swatch primary" 
                        style={{ backgroundColor: recommendations.colorScheme.primary }}
                      />
                      <div 
                        className="color-swatch secondary" 
                        style={{ backgroundColor: recommendations.colorScheme.secondary }}
                      />
                      <div 
                        className="color-swatch accent" 
                        style={{ backgroundColor: recommendations.colorScheme.accent }}
                      />
                    </div>
                    <h5>{recommendations.colorScheme.name}</h5>
                  </div>
                </div>

                {/* Furniture */}
                <div className="recommendation-card">
                  <h4>🪑 Key Furniture Pieces</h4>
                  <div className="furniture-list">
                    {recommendations.furniture.map((item, index) => (
                      <div key={index} className="furniture-item">
                        <h5>{item.name}</h5>
                        <p>{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lighting */}
                <div className="recommendation-card">
                  <h4>💡 Lighting Plan</h4>
                  <div className="lighting-plan">
                    {recommendations.lighting.map((light, index) => (
                      <div key={index} className="lighting-item">
                        <h5>{light.type}</h5>
                        <p>{light.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layout */}
                <div className="recommendation-card">
                  <h4>📐 Layout Recommendations</h4>
                  <div className="layout-list">
                    {recommendations.layout.map((item, index) => (
                      <div key={index} className="layout-item">
                        <span className="layout-bullet">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div className="recommendation-card">
                  <h4>🏗️ Material Suggestions</h4>
                  <div className="materials-list">
                    {recommendations.materials.map((material, index) => (
                      <div key={index} className="material-item">
                        <h5>{material.material}</h5>
                        <p>{material.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="recommendation-card budget">
                  <h4>💰 Budget Guidance</h4>
                  <div className="budget-info">
                    <div className="budget-range">{recommendations.budget.range}</div>
                    <p className="budget-focus">{recommendations.budget.focus}</p>
                    <div className="budget-tips">
                      {recommendations.budget.tips.map((tip, index) => (
                        <div key={index} className="budget-tip">• {tip}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="recommendation-card timeline">
                  <h4>⏰ Project Timeline</h4>
                  <div className="timeline-info">
                    <div className="timeline-duration">{recommendations.timeline.duration}</div>
                    <div className="timeline-phases">
                      {recommendations.timeline.phases.map((phase, index) => (
                        <div key={index} className="timeline-phase">{phase}</div>
                      ))}
                    </div>
                    <div className="timeline-tips">
                      {recommendations.timeline.tips.map((tip, index) => (
                        <div key={index} className="timeline-tip">• {tip}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="recommendation-card tips">
                  <h4>💡 Personalized Tips</h4>
                  <div className="tips-list">
                    {recommendations.tips.map((tip, index) => (
                      <div key={index} className="tip-item">
                        <span className="tip-bullet">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="recommendations-actions">
                <motion.button
                  className="btn btn-secondary"
                  onClick={resetQuiz}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Take Quiz Again
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => {
                    // Handle consultation booking
                    console.log('Book consultation with recommendations:', recommendations);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Design Consultation
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!recommendations && !isAnalyzing && (
          <div className="advisor-navigation">
            {currentQuestion > 0 && (
              <motion.button
                className="btn btn-secondary"
                onClick={prevQuestion}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Previous
              </motion.button>
            )}
            <motion.button
              className="btn btn-primary"
              onClick={nextQuestion}
              disabled={!canProceed()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentQuestion === questions.length - 1 ? 'Get Recommendations' : 'Next →'}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );

  function canProceed() {
    const currentQ = questions[currentQuestion];
    const value = userPreferences[currentQ.id];
    
    if (currentQ.type === 'multiple') {
      return value && value.length > 0;
    }
    
    return value && value !== '';
  }
};

export default AIDesignAdvisor;
