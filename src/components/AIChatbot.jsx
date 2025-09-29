import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks';

const AIChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI design assistant. I can help you with interior design ideas, color schemes, furniture recommendations, space planning, and even provide instant quotes for your projects. What would you like to explore today?',
      timestamp: new Date(),
      suggestions: [
        'Get a design quote',
        'Color scheme ideas',
        'Furniture recommendations',
        'Space planning help',
        'Budget planning'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    roomType: '',
    budget: '',
    style: '',
    size: ''
  });
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse.content || aiResponse,
        suggestions: aiResponse.suggestions || [],
        action: aiResponse.action || 'general',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('quote') || input.includes('estimate') || input.includes('price') || input.includes('cost')) {
      return {
        content: "I'd be happy to help you get a quote! Based on your needs, here are our service packages:\n\n• **Basic Finishing**: 50,000 ETB - Perfect for small projects\n• **Standard Interior**: 120,000 ETB - Most popular choice\n• **Premium Design**: 250,000 ETB - Full luxury experience\n\nWould you like me to create a personalized quote based on your specific requirements?",
        suggestions: ['Get instant quote', 'Book consultation', 'View pricing details'],
        action: 'quote'
      };
    }
    
    if (input.includes('color') || input.includes('paint') || input.includes('palette')) {
      return {
        content: "Great question about colors! Here are some trending color schemes for 2024:\n\n🎨 **Warm Neutrals**: Beige, cream, soft yellows - perfect for living spaces\n🌊 **Cool Blues**: Navy, teal, sage green - ideal for bedrooms\n🔥 **Accent Colors**: Gold (#ffd700), deep red, forest green\n\nFor Ethiopian homes, I recommend colors that complement our natural light and cultural elements. Would you like specific color combinations for your room?",
        suggestions: ['Warm color palette', 'Cool color palette', 'Accent color ideas', 'Color consultation'],
        action: 'colors'
      };
    }
    
    if (input.includes('furniture') || input.includes('sofa') || input.includes('table') || input.includes('chair')) {
      return {
        content: "Furniture selection is crucial for both function and style! Here are my recommendations:\n\n🪑 **For Small Spaces**: Multi-functional pieces, wall-mounted storage\n🏠 **For Living Rooms**: Sectional sofas, coffee tables with storage\n🍽️ **For Dining**: Extendable tables, comfortable chairs\n📚 **For Storage**: Built-in shelving, modular systems\n\nWhat type of furniture are you looking for? I can provide specific recommendations based on your space and budget.",
        suggestions: ['Living room furniture', 'Dining room setup', 'Storage solutions', 'Budget-friendly options'],
        action: 'furniture'
      };
    }
    
    if (input.includes('small') || input.includes('space') || input.includes('room') || input.includes('compact')) {
      return {
        content: "Small space design is one of our specialties! Here are proven strategies:\n\n✨ **Maximize Light**: Use mirrors, light colors, sheer curtains\n📦 **Smart Storage**: Vertical storage, hidden compartments, multi-use furniture\n🎨 **Visual Tricks**: Striped patterns, strategic lighting, open shelving\n🪑 **Furniture Choices**: Foldable, stackable, and convertible pieces\n\nWhat type of room are you working with? I can provide specific space-saving solutions.",
        suggestions: ['Living room ideas', 'Bedroom solutions', 'Kitchen organization', 'Home office setup'],
        action: 'small-space'
      };
    }
    
    if (input.includes('budget') || input.includes('cost') || input.includes('price') || input.includes('affordable')) {
      return {
        content: "Smart budget planning is key to successful design! Here are cost-effective strategies:\n\n💰 **Budget Breakdown**: 60% furniture, 20% lighting, 15% accessories, 5% paint\n🛍️ **Smart Shopping**: Mix high-end and budget pieces, shop sales, consider second-hand\n🎨 **DIY Options**: Paint projects, simple upholstery, decorative accents\n📅 **Phased Approach**: Start with essentials, add pieces over time\n\nWhat's your budget range? I can create a detailed spending plan.",
        suggestions: ['Budget breakdown', 'Affordable furniture', 'DIY projects', 'Phased approach'],
        action: 'budget'
      };
    }
    
    if (input.includes('3d') || input.includes('visualization') || input.includes('preview') || input.includes('ar')) {
      return {
        content: "Our 3D visualization technology is cutting-edge! Here's what you can do:\n\n🏠 **Virtual Walkthrough**: Experience your space before construction\n🪑 **Furniture Placement**: Try different layouts in real-time\n🎨 **Color Testing**: See how colors look in different lighting\n📱 **AR Integration**: Place virtual furniture in your actual space\n\nWould you like to schedule a 3D design session or try our AR furniture placement?",
        suggestions: ['3D walkthrough', 'AR furniture placement', 'Virtual consultation', 'Design preview'],
        action: '3d'
      };
    }
    
    if (input.includes('consultation') || input.includes('meeting') || input.includes('visit')) {
      return {
        content: "I'd love to help you book a consultation! Here's what we offer:\n\n📅 **Free Initial Consultation**: 30-minute discussion of your needs\n🏠 **In-Home Visit**: Detailed space assessment and measurements\n💻 **Virtual Consultation**: Online meeting with design recommendations\n📋 **Detailed Proposal**: Comprehensive plan with timeline and budget\n\nOur consultations are completely free with no obligation. Would you like to schedule one?",
        suggestions: ['Book consultation', 'In-home visit', 'Virtual meeting', 'Get proposal'],
        action: 'consultation'
      };
    }
    
    // Default enhanced response
    return {
      content: "That's a great question! I'm here to help with all aspects of interior design and architecture. I can assist with:\n\n🎨 Color schemes and palettes\n🪑 Furniture selection and placement\n📐 Space planning and layout\n💰 Budget planning and cost estimates\n💡 Lighting design and ambiance\n🏠 Style recommendations (modern, traditional, fusion)\n\nWhat specific aspect would you like to explore? I can provide detailed recommendations and even help you get a quote!",
      suggestions: ['Get design quote', 'Color ideas', 'Furniture help', 'Space planning', 'Budget advice'],
      action: 'general'
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowQuickActions(false);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'quote':
        setInputValue('I need a quote for my project');
        break;
      case 'consultation':
        setInputValue('I want to book a consultation');
        break;
      case '3d':
        setInputValue('I want to see 3D visualization');
        break;
      default:
        setInputValue('Help me with design ideas');
    }
    setShowQuickActions(false);
  };

  return (
    <motion.div
      className="ai-chatbot"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="ai-avatar">🤖</div>
          <div>
            <h3>AI Design Assistant</h3>
            <p>Powered by advanced AI technology</p>
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

      <div className="chatbot-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="suggestions">
                    {message.suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            className="message assistant typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about interior design, colors, furniture, or anything else..."
            rows={1}
            className="message-input"
          />
          <div className="input-actions">
            {isSupported && (
              <motion.button
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                🎤
              </motion.button>
            )}
            <motion.button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ➤
            </motion.button>
          </div>
        </div>
        
        <div className="quick-actions">
          <motion.button
            className="quick-btn"
            onClick={() => setInputValue('What color scheme would work best for a modern living room?')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Color Ideas
          </motion.button>
          <motion.button
            className="quick-btn"
            onClick={() => setInputValue('Help me choose furniture for a small bedroom')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Furniture
          </motion.button>
          <motion.button
            className="quick-btn"
            onClick={() => setInputValue('How can I make my space look bigger?')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Space Tips
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatbot;
