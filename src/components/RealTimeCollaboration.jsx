import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RealTimeCollaboration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cursorPositions, setCursorPositions] = useState({});
  const [isSharing, setIsSharing] = useState(false);
  const canvasRef = useRef(null);

  // Simulate real-time collaboration
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        // Simulate new collaborators joining
        const newCollaborator = {
          id: Date.now(),
          name: `Designer ${Math.floor(Math.random() * 100)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
          status: 'active',
          cursor: {
            x: Math.random() * 800,
            y: Math.random() * 600
          }
        };
        
        setCollaborators(prev => [...prev.slice(-4), newCollaborator]);
        
        // Simulate cursor movements
        setCursorPositions(prev => ({
          ...prev,
          [newCollaborator.id]: {
            x: Math.random() * 800,
            y: Math.random() * 600,
            timestamp: Date.now()
          }
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const startCollaboration = () => {
    setIsConnected(true);
    setIsSharing(true);
    
    // Simulate connection
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: 'Collaboration session started! Share your screen to begin.',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const stopCollaboration = () => {
    setIsConnected(false);
    setIsSharing(false);
    setCollaborators([]);
    setCursorPositions({});
  };

  const sendMessage = (content) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const shareScreen = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          // Handle screen sharing
        })
        .catch(err => console.log('Screen sharing not supported:', err));
    }
  };

  return (
    <motion.div
      className="real-time-collaboration"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="collaboration-header">
        <h3>🌐 Real-Time Collaboration</h3>
        <p>Work together with your team in real-time</p>
      </div>

      <div className="collaboration-controls">
        <motion.button
          className={`collab-btn ${isConnected ? 'connected' : 'disconnected'}`}
          onClick={isConnected ? stopCollaboration : startCollaboration}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isConnected ? '🔴 Stop Collaboration' : '🟢 Start Collaboration'}
        </motion.button>

        {isConnected && (
          <motion.button
            className="collab-btn secondary"
            onClick={shareScreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📺 Share Screen
          </motion.button>
        )}
      </div>

      {isConnected && (
        <div className="collaboration-workspace">
          <div className="workspace-header">
            <div className="collaborators-list">
              <h4>Active Collaborators:</h4>
              <div className="collaborators">
                <AnimatePresence>
                  {collaborators.map((collaborator) => (
                    <motion.div
                      key={collaborator.id}
                      className="collaborator"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <img src={collaborator.avatar} alt={collaborator.name} />
                      <span>{collaborator.name}</span>
                      <div className={`status ${collaborator.status}`}></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="workspace-area" ref={canvasRef}>
            <div className="workspace-content">
              <h4>Shared Workspace</h4>
              <p>Design together in real-time</p>
              
              {/* Cursor positions */}
              {Object.entries(cursorPositions).map(([id, position]) => {
                const collaborator = collaborators.find(c => c.id.toString() === id);
                if (!collaborator) return null;
                
                return (
                  <motion.div
                    key={id}
                    className="remote-cursor"
                    style={{
                      left: position.x,
                      top: position.y
                    }}
                    animate={{
                      x: [0, 10, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="cursor-pointer"></div>
                    <span className="cursor-name">{collaborator.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="collaboration-chat">
            <div className="chat-messages">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    sendMessage(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ➤
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="collaboration-features">
          <h4>Collaboration Features:</h4>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">👥</div>
              <h5>Real-time Cursors</h5>
              <p>See where your team members are working</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h5>Live Chat</h5>
              <p>Communicate instantly with your team</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📺</div>
              <h5>Screen Sharing</h5>
              <p>Share your screen for presentations</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎨</div>
              <h5>Shared Canvas</h5>
              <p>Design together on the same workspace</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RealTimeCollaboration;
