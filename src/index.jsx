import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import SkipNavigation from './components/SkipNavigation.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './styles/critical.css';
import './styles/theme-styles.css';
import './App.css';
import App from './App.jsx';

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
