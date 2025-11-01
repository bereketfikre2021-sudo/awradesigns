/**
 * Accessibility Testing Utilities
 * Comprehensive accessibility validation and testing tools
 */

/**
 * Accessibility Test Runner
 */
class AccessibilityTester {
  constructor() {
    this.results = [];
    this.listeners = [];
  }

  /**
   * Run all accessibility tests
   */
  async runAllTests() {
    this.results = [];
    
    const tests = [
      this.testARIA(),
      this.testKeyboardNavigation(),
      this.testColorContrast(),
      this.testImageAlt(),
      this.testFormLabels(),
      this.testHeadings(),
      this.testLinks(),
      this.testButtons(),
      this.testFocusIndicators(),
      this.testLandmarks(),
      this.testLiveRegions(),
    ];

    const results = await Promise.all(tests);
    this.results = results.flat();
    
    this.notifyListeners();
    return this.results;
  }

  /**
   * Test ARIA attributes
   */
  async testARIA() {
    const issues = [];
    const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');

    elements.forEach((element, index) => {
      const role = element.getAttribute('role');
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledby = element.getAttribute('aria-labelledby');
      
      // Check if interactive elements have labels
      if (['button', 'link', 'checkbox', 'radio', 'textbox', 'combobox'].includes(role)) {
        if (!ariaLabel && !ariaLabelledby && !this.hasTextContent(element)) {
          issues.push({
            type: 'error',
            category: 'aria',
            element: this.getElementInfo(element),
            message: `Interactive element with role "${role}" missing aria-label or aria-labelledby`,
            severity: 'high',
            fix: `Add aria-label="${this.generateLabel(element)}" to the element`,
          });
        }
      }

      // Check for invalid ARIA values
      const ariaInvalid = element.getAttribute('aria-invalid');
      if (ariaInvalid && !['true', 'false', 'grammar', 'spelling'].includes(ariaInvalid)) {
        issues.push({
          type: 'error',
          category: 'aria',
          element: this.getElementInfo(element),
          message: `Invalid aria-invalid value: "${ariaInvalid}"`,
          severity: 'medium',
        });
      }

      // Check for aria-hidden conflicts
      const ariaHidden = element.getAttribute('aria-hidden');
      if (ariaHidden === 'true' && element.getAttribute('aria-label')) {
        issues.push({
          type: 'warning',
          category: 'aria',
          element: this.getElementInfo(element),
          message: 'Element has aria-hidden="true" but also has aria-label',
          severity: 'medium',
        });
      }
    });

    return issues;
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation() {
    const issues = [];
    const interactiveElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex], [role="button"], [role="link"]'
    );

    // Check tab order
    const tabbableElements = Array.from(interactiveElements).filter(el => {
      const tabIndex = parseInt(el.getAttribute('tabindex') || '0', 10);
      const style = window.getComputedStyle(el);
      return tabIndex >= 0 && style.display !== 'none' && style.visibility !== 'hidden';
    });

    // Check for missing focus indicators
    tabbableElements.forEach((element) => {
      const style = window.getComputedStyle(element, ':focus');
      const outline = style.outline || style.outlineWidth;
      const border = style.borderWidth;
      
      if (!outline && (!border || border === '0px')) {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.outline === 'none' || computedStyle.outlineWidth === '0px') {
          issues.push({
            type: 'warning',
            category: 'keyboard',
            element: this.getElementInfo(element),
            message: 'Interactive element may lack visible focus indicator',
            severity: 'medium',
            fix: 'Add CSS: :focus { outline: 2px solid var(--primary); }',
          });
        }
      }
    });

    // Check for tabindex > 0 (should be avoided)
    document.querySelectorAll('[tabindex]').forEach((element) => {
      const tabIndex = parseInt(element.getAttribute('tabindex'), 10);
      if (tabIndex > 0) {
        issues.push({
          type: 'warning',
          category: 'keyboard',
          element: this.getElementInfo(element),
          message: `tabindex="${tabIndex}" should be 0 or negative`,
          severity: 'low',
        });
      }
    });

    return issues;
  }

  /**
   * Test color contrast
   */
  async testColorContrast() {
    const issues = [];
    
    // Get all text elements
    const textElements = Array.from(document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label'))
      .filter(el => {
        const text = el.textContent?.trim();
        return text && text.length > 0 && this.isVisible(el);
      });

    textElements.forEach((element) => {
      const style = window.getComputedStyle(element);
      const bgColor = this.getBackgroundColor(element);
      const textColor = style.color;

      if (bgColor && textColor) {
        const contrast = this.calculateContrast(bgColor, textColor);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight, 10);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        
        // WCAG AA: 4.5:1 for normal text, 3:1 for large text
        const requiredContrast = isLargeText ? 3 : 4.5;
        
        if (contrast < requiredContrast) {
          issues.push({
            type: 'error',
            category: 'contrast',
            element: this.getElementInfo(element),
            message: `Color contrast ratio ${contrast.toFixed(2)}:1 is below WCAG AA standard (${requiredContrast}:1 required)`,
            severity: 'high',
            data: { contrast, requiredContrast, fontSize, fontWeight },
          });
        } else if (contrast < (requiredContrast + 1)) {
          issues.push({
            type: 'warning',
            category: 'contrast',
            element: this.getElementInfo(element),
            message: `Color contrast ratio ${contrast.toFixed(2)}:1 is close to minimum`,
            severity: 'medium',
          });
        }
      }
    });

    return issues;
  }

  /**
   * Test image alt attributes
   */
  async testImageAlt() {
    const issues = [];
    const images = document.querySelectorAll('img');

    images.forEach((img) => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      const ariaHidden = img.getAttribute('aria-hidden');

      // Decorative images should have empty alt or aria-hidden
      if (role === 'presentation' || ariaHidden === 'true') {
        if (alt && alt.length > 0) {
          issues.push({
            type: 'warning',
            category: 'images',
            element: this.getElementInfo(img),
            message: 'Decorative image should have empty alt attribute',
            severity: 'low',
          });
        }
      } else {
        // Informative images need alt text
        if (!alt && alt !== '') {
          issues.push({
            type: 'error',
            category: 'images',
            element: this.getElementInfo(img),
            message: 'Image missing alt attribute',
            severity: 'high',
            fix: 'Add alt="descriptive text" to the image',
          });
        } else if (alt === '') {
          issues.push({
            type: 'warning',
            category: 'images',
            element: this.getElementInfo(img),
            message: 'Image has empty alt - verify if it is decorative',
            severity: 'medium',
          });
        }
      }
    });

    return issues;
  }

  /**
   * Test form labels
   */
  async testFormLabels() {
    const issues = [];
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const type = input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') return;

      // Check for labels
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label && !ariaLabel && !ariaLabelledby) {
          issues.push({
            type: 'error',
            category: 'forms',
            element: this.getElementInfo(input),
            message: 'Form input missing label',
            severity: 'high',
            fix: `Add <label for="${id}">Label text</label> or aria-label`,
          });
        }
      } else if (!ariaLabel && !ariaLabelledby) {
        issues.push({
          type: 'error',
          category: 'forms',
          element: this.getElementInfo(input),
          message: 'Form input missing id and label',
          severity: 'high',
        });
      }

      // Check for required fields
      if (input.hasAttribute('required') && !input.getAttribute('aria-required')) {
        issues.push({
          type: 'warning',
          category: 'forms',
          element: this.getElementInfo(input),
          message: 'Required field missing aria-required attribute',
          severity: 'medium',
          fix: 'Add aria-required="true"',
        });
      }
    });

    return issues;
  }

  /**
   * Test heading hierarchy
   */
  async testHeadings() {
    const issues = [];
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1), 10));
    
    // Check for skipped levels
    let previousLevel = 0;
    headingLevels.forEach((level, index) => {
      if (level > previousLevel + 1) {
        issues.push({
          type: 'warning',
          category: 'headings',
          element: this.getElementInfo(headings[index]),
          message: `Heading level skipped from h${previousLevel} to h${level}`,
          severity: 'medium',
        });
      }
      previousLevel = level;
    });

    // Check for multiple h1
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count > 1) {
      issues.push({
        type: 'warning',
        category: 'headings',
        message: `Multiple h1 elements found (${h1Count}). Consider using only one h1 per page.`,
        severity: 'medium',
      });
    }

    // Check for empty headings
    headings.forEach((heading) => {
      if (!heading.textContent?.trim()) {
        issues.push({
          type: 'error',
          category: 'headings',
          element: this.getElementInfo(heading),
          message: 'Empty heading element',
          severity: 'medium',
        });
      }
    });

    return issues;
  }

  /**
   * Test links
   */
  async testLinks() {
    const issues = [];
    const links = document.querySelectorAll('a[href]');

    links.forEach((link) => {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      const href = link.getAttribute('href');
      
      // Check for accessible link text
      if (!text && !ariaLabel) {
        issues.push({
          type: 'error',
          category: 'links',
          element: this.getElementInfo(link),
          message: 'Link missing accessible text',
          severity: 'high',
        });
      }

      // Check for "click here" or similar generic text
      if (text && /^(click here|here|read more|link|more)$/i.test(text)) {
        issues.push({
          type: 'warning',
          category: 'links',
          element: this.getElementInfo(link),
          message: 'Link text is not descriptive',
          severity: 'low',
        });
      }

      // Check for empty href
      if (href === '' || href === '#') {
        issues.push({
          type: 'warning',
          category: 'links',
          element: this.getElementInfo(link),
          message: 'Link with empty or placeholder href',
          severity: 'medium',
        });
      }
    });

    return issues;
  }

  /**
   * Test buttons
   */
  async testButtons() {
    const issues = [];
    const buttons = document.querySelectorAll('button, [role="button"]');

    buttons.forEach((button) => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const ariaLabelledby = button.getAttribute('aria-labelledby');
      const type = button.getAttribute('type');

      // Check for accessible button text
      if (!text && !ariaLabel && !ariaLabelledby) {
        issues.push({
          type: 'error',
          category: 'buttons',
          element: this.getElementInfo(button),
          message: 'Button missing accessible text',
          severity: 'high',
        });
      }

      // Check for type attribute on buttons
      if (button.tagName.toLowerCase() === 'button' && !type) {
        issues.push({
          type: 'warning',
          category: 'buttons',
          element: this.getElementInfo(button),
          message: 'Button missing type attribute',
          severity: 'medium',
          fix: 'Add type="button" (or "submit"/"reset" as appropriate)',
        });
      }
    });

    return issues;
  }

  /**
   * Test focus indicators
   */
  async testFocusIndicators() {
    const issues = [];
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((element) => {
      // Check if element has focus styles
      const testStylesheet = document.createElement('style');
      testStylesheet.textContent = `
        .a11y-test-focus { outline: 2px solid red !important; }
      `;
      document.head.appendChild(testStylesheet);

      // Test focus styles
      element.classList.add('a11y-test-focus');
      const computedStyle = window.getComputedStyle(element, ':focus');
      const outline = computedStyle.outline;
      
      element.classList.remove('a11y-test-focus');
      document.head.removeChild(testStylesheet);

      if (!outline || outline === 'none' || outline === '0px') {
        // Check if element is visible
        if (this.isVisible(element)) {
          issues.push({
            type: 'warning',
            category: 'focus',
            element: this.getElementInfo(element),
            message: 'Focus indicator may not be visible',
            severity: 'medium',
          });
        }
      }
    });

    return issues;
  }

  /**
   * Test landmark regions
   */
  async testLandmarks() {
    const issues = [];
    
    // Check for main landmark
    const main = document.querySelector('main, [role="main"]');
    if (!main) {
      issues.push({
        type: 'error',
        category: 'landmarks',
        message: 'Page missing main landmark (main or [role="main"])',
        severity: 'high',
      });
    }

    // Check for navigation landmarks
    const navs = document.querySelectorAll('nav, [role="navigation"]');
    navs.forEach((nav, index) => {
      const ariaLabel = nav.getAttribute('aria-label');
      if (navs.length > 1 && !ariaLabel) {
        issues.push({
          type: 'warning',
          category: 'landmarks',
          element: this.getElementInfo(nav),
          message: 'Multiple navigation landmarks - should have aria-label',
          severity: 'medium',
        });
      }
    });

    return issues;
  }

  /**
   * Test live regions
   */
  async testLiveRegions() {
    const issues = [];
    const liveRegions = document.querySelectorAll('[aria-live]');

    liveRegions.forEach((region) => {
      const ariaLive = region.getAttribute('aria-live');
      const ariaAtomic = region.getAttribute('aria-atomic');
      
      // Check for proper live region setup
      if (!['polite', 'assertive', 'off'].includes(ariaLive)) {
        issues.push({
          type: 'error',
          category: 'live-regions',
          element: this.getElementInfo(region),
          message: `Invalid aria-live value: "${ariaLive}"`,
          severity: 'high',
        });
      }

      // assertive regions should typically be atomic
      if (ariaLive === 'assertive' && ariaAtomic !== 'true') {
        issues.push({
          type: 'warning',
          category: 'live-regions',
          element: this.getElementInfo(region),
          message: 'Assertive live region should have aria-atomic="true"',
          severity: 'low',
        });
      }
    });

    return issues;
  }

  /**
   * Helper: Get element information
   */
  getElementInfo(element) {
    if (!element) return null;

    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id || null,
      className: element.className || null,
      textContent: element.textContent?.trim().substring(0, 50) || null,
      selector: this.generateSelector(element),
    };
  }

  /**
   * Helper: Generate CSS selector
   */
  generateSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      return classes ? `.${classes}` : null;
    }
    return element.tagName.toLowerCase();
  }

  /**
   * Helper: Check if element has text content
   */
  hasTextContent(element) {
    return element.textContent?.trim().length > 0;
  }

  /**
   * Helper: Generate label suggestion
   */
  generateLabel(element) {
    const text = element.textContent?.trim();
    if (text) return text;
    
    const placeholder = element.getAttribute('placeholder');
    if (placeholder) return placeholder;
    
    return 'Descriptive label';
  }

  /**
   * Helper: Check if element is visible
   */
  isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 &&
           element.offsetHeight > 0;
  }

  /**
   * Helper: Get background color
   */
  getBackgroundColor(element) {
    let el = element;
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
      }
      el = el.parentElement;
    }
    const bodyStyle = window.getComputedStyle(document.body);
    return bodyStyle.backgroundColor || 'rgb(255, 255, 255)';
  }

  /**
   * Helper: Calculate color contrast ratio
   */
  calculateContrast(color1, color2) {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Helper: Get relative luminance
   */
  getLuminance(color) {
    const rgb = this.parseColor(color);
    if (!rgb) return 0.5; // Default fallback

    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Helper: Parse color to RGB
   */
  parseColor(color) {
    // Remove whitespace
    color = color.trim();

    // Hex color
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b];
    }

    // RGB/RGBA color
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
    }

    // Named colors (basic support)
    const namedColors = {
      black: [0, 0, 0],
      white: [255, 255, 255],
      red: [255, 0, 0],
      green: [0, 128, 0],
      blue: [0, 0, 255],
    };
    return namedColors[color.toLowerCase()] || null;
  }

  /**
   * Subscribe to test results
   */
  onResults(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notify listeners of new results
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.results));
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    const errors = this.results.filter(r => r.type === 'error').length;
    const warnings = this.results.filter(r => r.type === 'warning').length;
    const highSeverity = this.results.filter(r => r.severity === 'high').length;
    const mediumSeverity = this.results.filter(r => r.severity === 'medium').length;
    const lowSeverity = this.results.filter(r => r.severity === 'low').length;

    const categories = {};
    this.results.forEach(result => {
      categories[result.category] = (categories[result.category] || 0) + 1;
    });

    return {
      total: this.results.length,
      errors,
      warnings,
      bySeverity: { high: highSeverity, medium: mediumSeverity, low: lowSeverity },
      byCategory: categories,
      score: this.calculateScore(),
    };
  }

  /**
   * Calculate accessibility score
   */
  calculateScore() {
    if (this.results.length === 0) return 100;
    
    const errors = this.results.filter(r => r.type === 'error').length;
    const warnings = this.results.filter(r => r.type === 'warning').length;
    
    const errorPenalty = errors * 10;
    const warningPenalty = warnings * 2;
    
    return Math.max(0, 100 - errorPenalty - warningPenalty);
  }

  /**
   * Export results as JSON
   */
  exportResults() {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: this.getSummary(),
      results: this.results,
    }, null, 2);
  }

  /**
   * Export results as HTML report
   */
  exportHTMLReport() {
    const summary = this.getSummary();
    const errors = this.results.filter(r => r.type === 'error');
    const warnings = this.results.filter(r => r.type === 'warning');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Accessibility Test Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .issue { padding: 10px; margin: 10px 0; border-left: 4px solid; border-radius: 4px; }
            .error { border-color: #ef4444; background: #fee; }
            .warning { border-color: #f59e0b; background: #fffbeb; }
            .category { font-weight: bold; color: #666; }
          </style>
        </head>
        <body>
          <h1>Accessibility Test Report</h1>
          <div class="summary">
            <h2>Summary</h2>
            <p>Score: ${summary.score}/100</p>
            <p>Total Issues: ${summary.total}</p>
            <p>Errors: ${errors.length}</p>
            <p>Warnings: ${warnings.length}</p>
          </div>
          <h2>Issues</h2>
          ${[...errors, ...warnings].map(issue => `
            <div class="issue ${issue.type}">
              <div class="category">${issue.category.toUpperCase()}</div>
              <div><strong>${issue.type.toUpperCase()}:</strong> ${issue.message}</div>
              ${issue.element ? `<div>Element: ${issue.element.tagName}${issue.element.id ? `#${issue.element.id}` : ''}</div>` : ''}
              ${issue.fix ? `<div>Fix: ${issue.fix}</div>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;
  }
}

/**
 * Initialize accessibility testing
 */
export const initAccessibilityTesting = () => {
  const tester = new AccessibilityTester();

  // Expose to window for console access
  if (typeof window !== 'undefined') {
    window.a11yTest = {
      run: () => tester.runAllTests(),
      results: () => tester.results,
      summary: () => tester.getSummary(),
      exportJSON: () => tester.exportResults(),
      exportHTML: () => tester.exportHTMLReport(),
    };
  }

  return tester;
};

/**
 * Quick accessibility check
 */
export const quickA11yCheck = async () => {
  const tester = new AccessibilityTester();
  await tester.runAllTests();
  return tester.getSummary();
};

export default {
  init: initAccessibilityTesting,
  quickCheck: quickA11yCheck,
  AccessibilityTester,
};

