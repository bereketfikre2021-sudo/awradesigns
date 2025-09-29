import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../hooks';

const ClientPortal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useLocalStorage('clientProjects', []);
  const [notifications, setNotifications] = useLocalStorage('clientNotifications', []);
  const [showNewProject, setShowNewProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample data for demonstration
  useEffect(() => {
    if (projects.length === 0) {
      const sampleProjects = [
        {
          id: 1,
          name: 'Modern Living Room Design',
          status: 'in-progress',
          progress: 75,
          startDate: '2024-01-15',
          endDate: '2024-03-15',
          budget: '150,000 ETB',
          description: 'Complete living room renovation with modern furniture and lighting',
          team: ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez'],
          files: [
            { name: 'Initial Design Concept.pdf', type: 'pdf', size: '2.3 MB', date: '2024-01-20' },
            { name: '3D Visualization.obj', type: '3d', size: '15.7 MB', date: '2024-01-25' },
            { name: 'Material Samples.jpg', type: 'image', size: '4.1 MB', date: '2024-02-01' }
          ],
          milestones: [
            { name: 'Initial Consultation', completed: true, date: '2024-01-15' },
            { name: 'Design Concept Approval', completed: true, date: '2024-01-25' },
            { name: 'Material Selection', completed: true, date: '2024-02-05' },
            { name: '3D Visualization', completed: false, date: '2024-02-15' },
            { name: 'Final Approval', completed: false, date: '2024-02-25' }
          ],
          messages: [
            { id: 1, sender: 'Sarah Johnson', message: 'The initial design concept is ready for your review.', timestamp: '2024-01-20T10:30:00Z', type: 'message' },
            { id: 2, sender: 'System', message: 'New file uploaded: Material Samples.jpg', timestamp: '2024-02-01T14:15:00Z', type: 'file' },
            { id: 3, sender: 'Mike Chen', message: 'We need your approval on the color scheme before proceeding.', timestamp: '2024-02-10T09:45:00Z', type: 'approval' }
          ]
        },
        {
          id: 2,
          name: 'Kitchen Renovation',
          status: 'completed',
          progress: 100,
          startDate: '2023-11-01',
          endDate: '2023-12-15',
          budget: '200,000 ETB',
          description: 'Complete kitchen renovation with custom cabinets and modern appliances',
          team: ['Sarah Johnson', 'David Kim'],
          files: [
            { name: 'Final Design.pdf', type: 'pdf', size: '3.2 MB', date: '2023-11-20' },
            { name: 'Before Photos.jpg', type: 'image', size: '8.5 MB', date: '2023-11-01' },
            { name: 'After Photos.jpg', type: 'image', size: '9.2 MB', date: '2023-12-15' }
          ],
          milestones: [
            { name: 'Initial Consultation', completed: true, date: '2023-11-01' },
            { name: 'Design Concept Approval', completed: true, date: '2023-11-10' },
            { name: 'Material Selection', completed: true, date: '2023-11-15' },
            { name: 'Construction', completed: true, date: '2023-12-01' },
            { name: 'Final Inspection', completed: true, date: '2023-12-15' }
          ],
          messages: [
            { id: 1, sender: 'Sarah Johnson', message: 'Kitchen renovation completed successfully!', timestamp: '2023-12-15T16:00:00Z', type: 'completion' }
          ]
        }
      ];
      setProjects(sampleProjects);
    }
  }, [projects.length, setProjects]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'on-hold': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      case 'on-hold': return '⏸️';
      default: return '📋';
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'projects', name: 'Projects', icon: '🏠' },
    { id: 'files', name: 'Files', icon: '📁' },
    { id: 'messages', name: 'Messages', icon: '💬' },
    { id: 'invoices', name: 'Invoices', icon: '💰' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const Dashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back! 👋</h2>
        <p>Here's an overview of your projects and recent activity.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>{projects.length}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{projects.filter(p => p.status === 'in-progress').length}</h3>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{projects.filter(p => p.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{projects.reduce((sum, p) => sum + parseInt(p.budget.replace(/[^\d]/g, '')), 0).toLocaleString()} ETB</h3>
            <p>Total Investment</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {projects.slice(0, 3).map(project => (
            <div key={project.id} className="activity-item">
              <div className="activity-icon">{getStatusIcon(project.status)}</div>
              <div className="activity-content">
                <h4>{project.name}</h4>
                <p>Status: {project.status.replace('-', ' ')} • Progress: {project.progress}%</p>
              </div>
              <div className="activity-date">
                {new Date(project.startDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Projects = () => (
    <div className="projects">
      <div className="projects-header">
        <h2>Your Projects</h2>
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowNewProject(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Project
        </motion.button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <motion.div
            key={project.id}
            className="project-card"
            onClick={() => setSelectedProject(project)}
            whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="project-header">
              <h3>{project.name}</h3>
              <span 
                className="project-status"
                style={{ backgroundColor: getStatusColor(project.status) }}
              >
                {getStatusIcon(project.status)} {project.status.replace('-', ' ')}
              </span>
            </div>
            
            <div className="project-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{project.progress}% Complete</span>
            </div>

            <div className="project-details">
              <div className="detail-item">
                <span className="detail-label">Budget:</span>
                <span className="detail-value">{project.budget}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Timeline:</span>
                <span className="detail-value">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Team:</span>
                <span className="detail-value">{project.team.length} members</span>
              </div>
            </div>

            <div className="project-description">
              <p>{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ProjectDetail = ({ project }) => (
    <div className="project-detail">
      <div className="project-detail-header">
        <button 
          className="back-btn"
          onClick={() => setSelectedProject(null)}
        >
          ← Back to Projects
        </button>
        <h2>{project.name}</h2>
      </div>

      <div className="project-detail-content">
        <div className="project-overview">
          <div className="overview-card">
            <h3>Project Overview</h3>
            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-label">Status</span>
                <span 
                  className="overview-value status"
                  style={{ color: getStatusColor(project.status) }}
                >
                  {getStatusIcon(project.status)} {project.status.replace('-', ' ')}
                </span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Progress</span>
                <span className="overview-value">{project.progress}%</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Budget</span>
                <span className="overview-value">{project.budget}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Timeline</span>
                <span className="overview-value">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="milestones-card">
            <h3>Project Milestones</h3>
            <div className="milestones-list">
              {project.milestones.map((milestone, index) => (
                <div key={index} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                  <div className="milestone-icon">
                    {milestone.completed ? '✅' : '⏳'}
                  </div>
                  <div className="milestone-content">
                    <h4>{milestone.name}</h4>
                    <p>{new Date(milestone.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="project-files">
          <h3>Project Files</h3>
          <div className="files-list">
            {project.files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-icon">
                  {file.type === 'pdf' ? '📄' : file.type === 'image' ? '🖼️' : '📁'}
                </div>
                <div className="file-content">
                  <h4>{file.name}</h4>
                  <p>{file.size} • {new Date(file.date).toLocaleDateString()}</p>
                </div>
                <button className="download-btn">⬇️</button>
              </div>
            ))}
          </div>
        </div>

        <div className="project-messages">
          <h3>Project Messages</h3>
          <div className="messages-list">
            {project.messages.map(message => (
              <div key={message.id} className={`message-item ${message.type}`}>
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="message-content">
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="client-portal"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="portal-header">
        <div className="portal-title">
          <h1>Client Portal</h1>
          <p>Manage your projects and communicate with our team</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="portal-content">
        <div className="portal-sidebar">
          <nav className="portal-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-name">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="portal-main">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key="project-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectDetail project={selectedProject} />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'projects' && <Projects />}
                {activeTab === 'files' && <div>Files Tab</div>}
                {activeTab === 'messages' && <div>Messages Tab</div>}
                {activeTab === 'invoices' && <div>Invoices Tab</div>}
                {activeTab === 'settings' && <div>Settings Tab</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientPortal;
