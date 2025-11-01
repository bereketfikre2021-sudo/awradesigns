import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import SkipNavigation from './components/SkipNavigation.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { initErrorReporting } from './services/errorReporting';
import './styles/critical.css';
import './styles/theme-styles.css';
import './App.css';
import App from './App.jsx';

// Set base URL CSS variables for GitHub Pages compatibility
if (typeof document !== 'undefined') {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  document.documentElement.style.setProperty('--base-url', baseUrl);
  // Set hero background image URL with proper base path (with quotes for CSS)
  const heroBgUrl = `${normalizedBase}/images/Hero%20BG.webp`;
  document.documentElement.style.setProperty('--hero-bg-url', `url(${heroBgUrl})`);
}

// Initialize error reporting service
initErrorReporting();

// Initialize accessibility testing (available in console as window.a11yTest)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  import('./utils/accessibilityTesting').then(({ initAccessibilityTesting }) => {
    initAccessibilityTesting();
    console.log('%cAccessibility Testing', 'color: #ffd700; font-weight: bold; font-size: 14px;');
    console.log('Run accessibility tests with: window.a11yTest.run()');
    console.log('View results: window.a11yTest.results');
    console.log('View summary: window.a11yTest.summary()');
  });
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
