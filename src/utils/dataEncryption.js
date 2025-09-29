// Data Encryption Utility for Client-Side Security
class DataEncryption {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12;
  }

  // Generate a random encryption key
  async generateKey() {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  // Derive key from password using PBKDF2
  async deriveKeyFromPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Generate random salt
  generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  // Generate random IV
  generateIV() {
    return crypto.getRandomValues(new Uint8Array(this.ivLength));
  }

  // Encrypt data
  async encrypt(data, key) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const iv = this.generateIV();

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  }

  // Decrypt data
  async decrypt(encryptedData, key) {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, this.ivLength);
      const encrypted = combined.slice(this.ivLength);

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv,
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedData));
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Hash data using SHA-256
  async hash(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Secure random string generation
  generateSecureRandom(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Encrypt sensitive form data
  async encryptFormData(formData, password) {
    const salt = this.generateSalt();
    const key = await this.deriveKeyFromPassword(password, salt);
    const encryptedData = await this.encrypt(formData, key);
    
    return {
      encryptedData,
      salt: btoa(String.fromCharCode(...salt))
    };
  }

  // Decrypt sensitive form data
  async decryptFormData(encryptedFormData, password) {
    const salt = new Uint8Array(
      atob(encryptedFormData.salt).split('').map(char => char.charCodeAt(0))
    );
    const key = await this.deriveKeyFromPassword(password, salt);
    return await this.decrypt(encryptedFormData.encryptedData, key);
  }

  // Secure local storage with encryption
  async setSecureItem(key, data, password) {
    try {
      const encrypted = await this.encryptFormData(data, password);
      localStorage.setItem(key, JSON.stringify(encrypted));
      return true;
    } catch (error) {
      console.error('Failed to encrypt and store data:', error);
      return false;
    }
  }

  // Retrieve and decrypt from local storage
  async getSecureItem(key, password) {
    try {
      const encryptedData = localStorage.getItem(key);
      if (!encryptedData) return null;
      
      const parsed = JSON.parse(encryptedData);
      return await this.decryptFormData(parsed, password);
    } catch (error) {
      console.error('Failed to decrypt and retrieve data:', error);
      return null;
    }
  }

  // Remove secure item
  removeSecureItem(key) {
    localStorage.removeItem(key);
  }

  // Validate data integrity
  async validateIntegrity(data, expectedHash) {
    const actualHash = await this.hash(JSON.stringify(data));
    return actualHash === expectedHash;
  }

  // Sanitize user input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number format
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // Generate secure token for forms
  generateCSRFToken() {
    return this.generateSecureRandom(32);
  }

  // Validate CSRF token
  validateCSRFToken(token, expectedToken) {
    return token === expectedToken;
  }

  // Secure data transmission preparation
  async prepareSecureData(data, password) {
    const sanitizedData = {};
    
    // Sanitize all string inputs
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitizedData[key] = this.sanitizeInput(value);
      } else {
        sanitizedData[key] = value;
      }
    }

    // Validate required fields
    if (sanitizedData.email && !this.validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format');
    }

    if (sanitizedData.phone && !this.validatePhone(sanitizedData.phone)) {
      throw new Error('Invalid phone format');
    }

    // Encrypt the data
    const encrypted = await this.encryptFormData(sanitizedData, password);
    
    // Generate integrity hash
    const hash = await this.hash(JSON.stringify(sanitizedData));
    
    return {
      encryptedData: encrypted.encryptedData,
      salt: encrypted.salt,
      hash: hash,
      timestamp: Date.now()
    };
  }
}

// Create singleton instance
const dataEncryption = new DataEncryption();

export default dataEncryption;
