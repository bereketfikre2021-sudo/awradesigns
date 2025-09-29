import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const RealTimeCollaboration = ({ onClose }) => {
  const { t } = useLanguage();
  const [activeRoom, setActiveRoom] = useState('design-room');
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: Date.now(),
    name: 'You',
    avatar: '👤',
    color: '#FFD700'
  });
  const [newMessage, setNewMessage] = useState('');
  const [sharedCanvas, setSharedCanvas] = useState([]);
  const [cursorPositions, setCursorPositions] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);

  const rooms = [
    { id: 'design-room', name: 'Design Room', icon: '🎨', users: 3 },
    { id: 'project-room', name: 'Project Room', icon: '🏗️', users: 5 },
    { id: 'client-room', name: 'Client Room', icon: '👥', users: 2 },
    { id: 'team-room', name: 'Team Room', icon: '👨‍💼', users: 8 }
  ];

  const tools = [
    { id: 'pen', name: 'Pen', icon: '✏️', color: '#000000' },
    { id: 'highlighter', name: 'Highlighter', icon: '🖍️', color: '#FFFF00' },
    { id: 'eraser', name: 'Eraser', icon: '🧽', color: '#FFFFFF' },
    { id: 'text', name: 'Text', icon: '📝', color: '#000000' },
    { id: 'shape', name: 'Shape', icon: '⬜', color: '#FF0000' }
  ];

  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    // Simulate connection to collaboration server
    const timer = setTimeout(() => {
      setIsConnected(true);
      // Mock users joining
      setUsers([
        { id: 1, name: 'Sarah M.', avatar: '👩', color: '#FF6B6B', isOnline: true },
        { id: 2, name: 'Ahmed K.', avatar: '👨', color: '#4ECDC4', isOnline: true },
        { id: 3, name: 'Maria L.', avatar: '👩‍💼', color: '#45B7D1', isOnline: false },
        { id: 4, name: 'John D.', avatar: '👨‍🔧', color: '#96CEB4', isOnline: true }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: currentUser,
        text: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const stroke = {
      id: Date.now(),
      tool: selectedTool,
      color: selectedColor,
      size: brushSize,
      points: [{ x, y }],
      user: currentUser
    };
    
    setSharedCanvas(prev => [...prev, stroke]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSharedCanvas(prev => {
      const newCanvas = [...prev];
      const lastStroke = newCanvas[newCanvas.length - 1];
      if (lastStroke) {
        lastStroke.points.push({ x, y });
      }
      return newCanvas;
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setSharedCanvas([]);
  };

  const shareScreen = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
          // Handle screen sharing
          console.log('Screen sharing started');
        })
        .catch(error => {
          console.error('Screen sharing failed:', error);
        });
    }
  };

  const renderChat = () => (
    <div className="collaboration-chat">
      <div className="chat-header">
        <h4>Live Chat</h4>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.user.id === currentUser.id ? 'own' : 'other'}`}>
            <div className="message-avatar" style={{ backgroundColor: message.user.color }}>
              {message.user.avatar}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-user">{message.user.name}</span>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="2"
          />
          <motion.button
            className="send-btn"
            onClick={handleSendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📤
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderWhiteboard = () => (
    <div className="collaboration-whiteboard">
      <div className="whiteboard-header">
        <h4>Shared Whiteboard</h4>
        <div className="whiteboard-controls">
          <button className="clear-btn" onClick={clearCanvas}>
            🗑️ Clear
          </button>
          <button className="share-btn" onClick={shareScreen}>
            📺 Share Screen
          </button>
        </div>
      </div>

      <div className="whiteboard-tools">
        <div className="tool-group">
          <label>Tools:</label>
          <div className="tools-list">
            {tools.map(tool => (
              <motion.button
                key={tool.id}
                className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                onClick={() => setSelectedTool(tool.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={tool.name}
              >
                {tool.icon}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="tool-group">
          <label>Color:</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="color-picker"
          />
        </div>

        <div className="tool-group">
          <label>Size:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="brush-size"
          />
          <span>{brushSize}px</span>
        </div>
      </div>

      <div className="whiteboard-canvas-container">
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Render shared strokes */}
        <svg className="canvas-overlay">
          {sharedCanvas.map((stroke) => (
            <g key={stroke.id}>
              {stroke.points.map((point, index) => {
                if (index === 0) return null;
                const prevPoint = stroke.points[index - 1];
                return (
                  <line
                    key={`${stroke.id}-${index}`}
                    x1={prevPoint.x}
                    y1={prevPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke={stroke.color}
                    strokeWidth={stroke.size}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="collaboration-users">
      <h4>Active Users ({users.filter(u => u.isOnline).length})</h4>
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className={`user-item ${user.isOnline ? 'online' : 'offline'}`}>
            <div className="user-avatar" style={{ backgroundColor: user.color }}>
              {user.avatar}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-status">
                {user.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            {user.isOnline && (
              <div className="user-indicator">
                <span className="indicator-dot"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="collaboration-rooms">
      <h4>Collaboration Rooms</h4>
      <div className="rooms-list">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            className={`room-item ${activeRoom === room.id ? 'active' : ''}`}
            onClick={() => setActiveRoom(room.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="room-icon">{room.icon}</div>
            <div className="room-info">
              <span className="room-name">{room.name}</span>
              <span className="room-users">{room.users} users</span>
            </div>
            <div className="room-status">
              {activeRoom === room.id ? '●' : '○'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      className="real-time-collaboration"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="rtc-header">
        <div className="rtc-title">
          <h2>🤝 Real-Time Collaboration</h2>
          <p>Work together in real-time with your team and clients</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="rtc-content">
        <div className="rtc-sidebar">
          {renderRooms()}
          {renderUsers()}
        </div>

        <div className="rtc-main">
          <div className="rtc-tabs">
            <motion.button
              className={`rtc-tab ${activeRoom === 'design-room' ? 'active' : ''}`}
              onClick={() => setActiveRoom('design-room')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              💬 Chat
            </motion.button>
            <motion.button
              className={`rtc-tab ${activeRoom === 'project-room' ? 'active' : ''}`}
              onClick={() => setActiveRoom('project-room')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎨 Whiteboard
            </motion.button>
          </div>

          <div className="rtc-tab-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoom}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeRoom === 'design-room' ? renderChat() : renderWhiteboard()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RealTimeCollaboration;