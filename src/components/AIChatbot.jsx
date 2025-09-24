import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks';

const AIChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI design assistant. I can help you with interior design ideas, color schemes, furniture recommendations, and space planning. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('color') || input.includes('paint')) {
      return 'For color schemes, I recommend considering your space\'s natural light and mood. Warm colors like gold and amber create cozy atmospheres, while cool blues and greens promote relaxation. Would you like me to suggest specific color palettes for your room type?';
    }
    
    if (input.includes('furniture') || input.includes('sofa') || input.includes('chair')) {
      return 'Furniture selection depends on your space size and style preferences. For modern spaces, I suggest clean lines and neutral colors. For traditional spaces, consider rich woods and classic silhouettes. What\'s your preferred style - modern, traditional, or eclectic?';
    }
    
    if (input.includes('small') || input.includes('space') || input.includes('room')) {
      return 'For small spaces, I recommend multi-functional furniture, light colors, and strategic lighting. Mirrors can make rooms feel larger, and vertical storage solutions maximize space. Would you like specific layout suggestions for your room dimensions?';
    }
    
    if (input.includes('budget') || input.includes('cost') || input.includes('price')) {
      return 'I can help you design within any budget! We offer three tiers: Basic (50,000 ETB), Standard (120,000 ETB), and Premium (250,000 ETB). Each includes different features from consultation to full AI-powered design. Which tier interests you most?';
    }
    
    if (input.includes('3d') || input.includes('visualization') || input.includes('preview')) {
      return 'Our 3D visualization technology lets you walk through your space before construction! You can see how furniture, colors, and lighting will look in real-time. Would you like to schedule a 3D design session?';
    }
    
    return 'That\'s a great question! I\'m here to help with all aspects of interior design. I can assist with color schemes, furniture selection, space planning, lighting design, and more. Could you tell me more about your specific project or what you\'d like to achieve?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
                <p>{message.content}</p>
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
