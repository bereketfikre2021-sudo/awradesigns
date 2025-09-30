// Import console filter FIRST to catch all console messages
// import './utils/consoleFilter.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import SkipNavigation from './components/SkipNavigation.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
// import { initializeConsoleOptimizations } from './utils/consoleOptimizer.js';
// import { initializeErrorHandlers } from './utils/errorHandler.js';
import './styles/critical.css';
import './styles/theme-styles.css';
import './App.css';
import App from './App.jsx';

// Initialize console optimizations and error handlers
// initializeConsoleOptimizations();
// initializeErrorHandlers();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <HelmetProvider>
          <SkipNavigation />
          <App />
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
