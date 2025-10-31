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

// Set base URL CSS variables for GitHub Pages compatibility
if (typeof document !== 'undefined') {
  let baseUrl = import.meta.env.BASE_URL || '/';
  
  // Normalize baseUrl - ensure it doesn't end with / (we'll add it when needed)
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Ensure baseUrl starts with /
  if (baseUrl === '' || !baseUrl.startsWith('/')) {
    baseUrl = '/' + baseUrl;
  }
  
  // Clean up any double slashes
  const cleanBaseUrl = baseUrl.replace(/\/+/g, '/');
  
  document.documentElement.style.setProperty('--base-url', cleanBaseUrl);
  // Set full image paths as CSS variables for background images
  // Note: images/ already has the leading slash in the path, so we combine cleanly
  document.documentElement.style.setProperty('--hero-bg-image', `url(${cleanBaseUrl}/images/Hero BG.webp)`);
}

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
