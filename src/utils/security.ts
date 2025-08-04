// Security utilities for input validation and sanitization
import { VALIDATION_PATTERNS } from '../config/constants.js';

export class SecurityValidator {
  
  /**
   * Sanitize and validate URLs to prevent malicious injections
   */
  static validateUrl(url: string): { isValid: boolean; sanitizedUrl?: string; error?: string } {
    try {
      // Basic validation
      if (!url || typeof url !== 'string') {
        return { isValid: false, error: 'URL must be a non-empty string' };
      }

      // Remove potential whitespace and control characters
      const trimmedUrl = url.trim().replace(/[\x00-\x1F\x7F]/g, '');
      
      // Check for basic URL format
      if (!VALIDATION_PATTERNS.validUrl.test(trimmedUrl)) {
        return { isValid: false, error: 'Invalid URL format' };
      }

      // Parse URL to validate components
      const urlObj = new URL(trimmedUrl);
      
      // Security checks
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
      }

      // Check for potential malicious patterns
      const maliciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /ftp:/i,
        /<script/i,
        /onload=/i,
        /onerror=/i
      ];

      for (const pattern of maliciousPatterns) {
        if (pattern.test(trimmedUrl)) {
          return { isValid: false, error: 'URL contains potentially malicious content' };
        }
      }

      // Validate hostname (no localhost in production-like contexts)
      const suspiciousHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
      if (process.env.NODE_ENV === 'production' && suspiciousHosts.includes(urlObj.hostname)) {
        return { isValid: false, error: 'Localhost URLs not allowed in production' };
      }

      return { isValid: true, sanitizedUrl: urlObj.toString() };
      
    } catch (error) {
      return { isValid: false, error: `Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  /**
   * Sanitize contract code to prevent code injection
   */
  static sanitizeContractCode(code: string): { sanitizedCode: string; warnings: string[] } {
    if (!code || typeof code !== 'string') {
      return { sanitizedCode: '', warnings: ['Empty or invalid code provided'] };
    }

    const warnings: string[] = [];
    let sanitizedCode = code;

    // Remove potentially dangerous imports/statements
    const dangerousPatterns = [
      { pattern: /import\s+os/gi, warning: 'Removed OS import (potentially dangerous)' },
      { pattern: /import\s+subprocess/gi, warning: 'Removed subprocess import (potentially dangerous)' },
      { pattern: /import\s+sys/gi, warning: 'Removed sys import (potentially dangerous)' },
      { pattern: /exec\s*\(/gi, warning: 'Removed exec() call (potentially dangerous)' },
      { pattern: /eval\s*\(/gi, warning: 'Removed eval() call (potentially dangerous)' },
      { pattern: /__import__\s*\(/gi, warning: 'Removed __import__() call (potentially dangerous)' },
      { pattern: /open\s*\(/gi, warning: 'Removed file open() call (potentially dangerous)' },
      { pattern: /file\s*\(/gi, warning: 'Removed file() call (potentially dangerous)' }
    ];

    for (const { pattern, warning } of dangerousPatterns) {
      if (pattern.test(sanitizedCode)) {
        sanitizedCode = sanitizedCode.replace(pattern, '# REMOVED FOR SECURITY');
        warnings.push(warning);
      }
    }

    // Check for potential shell injection attempts
    const shellPatterns = [';', '|', '&', '$', '`', '$('];
    for (const pattern of shellPatterns) {
      if (sanitizedCode.includes(pattern)) {
        warnings.push(`Potential shell metacharacter detected: ${pattern}`);
      }
    }

    return { sanitizedCode, warnings };
  }

  /**
   * Validate contract names and identifiers
   */
  static validateIdentifier(identifier: string, type: 'contract' | 'method' | 'variable'): { isValid: boolean; error?: string } {
    if (!identifier || typeof identifier !== 'string') {
      return { isValid: false, error: `${type} name must be a non-empty string` };
    }

    // Remove potential whitespace
    const trimmed = identifier.trim();
    
    if (trimmed.length === 0) {
      return { isValid: false, error: `${type} name cannot be empty` };
    }

    // Check length limits
    if (trimmed.length > 100) {
      return { isValid: false, error: `${type} name too long (max 100 characters)` };
    }

    // Check for appropriate pattern based on type
    let pattern: RegExp;
    switch (type) {
      case 'contract':
        pattern = VALIDATION_PATTERNS.pascalCase;
        break;
      case 'method':
        pattern = VALIDATION_PATTERNS.methodName;
        break;
      case 'variable':
        pattern = VALIDATION_PATTERNS.camelCase;
        break;
      default:
        return { isValid: false, error: 'Unknown identifier type' };
    }

    if (!pattern.test(trimmed)) {
      return { isValid: false, error: `${type} name must follow proper naming convention` };
    }

    // Check for reserved words and dangerous names
    const reservedWords = [
      'eval', 'exec', 'import', 'open', 'file', 'input', 'raw_input',
      'compile', '__import__', 'globals', 'locals', 'vars', 'dir',
      'hasattr', 'getattr', 'setattr', 'delattr', 'callable'
    ];

    if (reservedWords.includes(trimmed.toLowerCase())) {
      return { isValid: false, error: `${type} name cannot be a reserved or dangerous word` };
    }

    return { isValid: true };
  }

  /**
   * Sanitize text input to prevent XSS and injection
   */
  static sanitizeTextInput(input: string, maxLength: number = 10000): { sanitizedText: string; warnings: string[] } {
    if (!input || typeof input !== 'string') {
      return { sanitizedText: '', warnings: ['Empty or invalid input provided'] };
    }

    const warnings: string[] = [];
    let sanitizedText = input;

    // Check length
    if (sanitizedText.length > maxLength) {
      sanitizedText = sanitizedText.substring(0, maxLength);
      warnings.push(`Input truncated to ${maxLength} characters`);
    }

    // Remove control characters except newlines and tabs
    sanitizedText = sanitizedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Check for potential script injection
    const scriptPatterns = [
      /<script/gi,
      /javascript:/gi,
      /onload=/gi, 
      /onerror=/gi,
      /onclick=/gi,
      /onmouseover=/gi
    ];

    for (const pattern of scriptPatterns) {
      if (pattern.test(sanitizedText)) {
        warnings.push('Potential script injection detected in input');
        break;
      }
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
      /('|(\\'))+.*(--|\#)/gi,
      /(('|(\\'))+.*(\-\-|\#))/gi,
      /\w*\s*((\=)|(\:))\s*('|(\\'))+((\s*((\-\-)|(\#)))|(('|(\\'))+))/gi
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(sanitizedText)) {
        warnings.push('Potential SQL injection pattern detected in input');
        break;
      }
    }

    return { sanitizedText, warnings };
  }

  /**
   * Validate file paths to prevent directory traversal
   */
  static validateFilePath(filePath: string): { isValid: boolean; sanitizedPath?: string; error?: string } {
    if (!filePath || typeof filePath !== 'string') {
      return { isValid: false, error: 'File path must be a non-empty string' };
    }

    const trimmedPath = filePath.trim();

    // Check for directory traversal attempts
    const dangerousPatterns = [
      '../',
      '..\\',
      '/etc/',
      '/var/',
      '/tmp/',
      '/usr/',
      '/bin/',
      '/sbin/',
      'C:\\',
      'D:\\',
      '\\\\'
    ];

    for (const pattern of dangerousPatterns) {
      if (trimmedPath.includes(pattern)) {
        return { isValid: false, error: 'File path contains dangerous directory traversal patterns' };
      }
    }

    // Only allow relative paths in contracts/ directory
    if (!trimmedPath.startsWith('contracts/') && !trimmedPath.match(/^[a-zA-Z0-9_\-\/\.]+$/)) {
      return { isValid: false, error: 'File path must be in contracts/ directory with valid characters only' };
    }

    // Check for valid file extension
    const allowedExtensions = ['.py', '.gl', '.genlayer'];
    const hasValidExtension = allowedExtensions.some(ext => trimmedPath.endsWith(ext));
    
    if (!hasValidExtension) {
      return { isValid: false, error: 'File must have a valid extension (.py, .gl, .genlayer)' };
    }

    return { isValid: true, sanitizedPath: trimmedPath };
  }

  /**
   * Comprehensive input validation for tool parameters
   */
  static validateToolInput(toolName: string, params: any): { isValid: boolean; sanitizedParams?: any; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitizedParams: any = {};

    if (!params || typeof params !== 'object') {
      return { isValid: false, errors: ['Parameters must be a valid object'], warnings: [] };
    }

    // Validate URLs in parameters
    for (const [key, value] of Object.entries(params)) {
      if (key.includes('url') && typeof value === 'string') {
        const urlValidation = this.validateUrl(value);
        if (!urlValidation.isValid) {
          errors.push(`Invalid URL in ${key}: ${urlValidation.error}`);
        } else {
          sanitizedParams[key] = urlValidation.sanitizedUrl;
        }
      } else if (key.includes('code') && typeof value === 'string') {
        const codeValidation = this.sanitizeContractCode(value);
        sanitizedParams[key] = codeValidation.sanitizedCode;
        warnings.push(...codeValidation.warnings);
      } else if (key.includes('name') && typeof value === 'string') {
        const nameType = key.includes('contract') ? 'contract' : 
                         key.includes('method') ? 'method' : 'variable';
        const nameValidation = this.validateIdentifier(value, nameType);
        if (!nameValidation.isValid) {
          errors.push(`Invalid ${nameType} name in ${key}: ${nameValidation.error}`);
        } else {
          sanitizedParams[key] = value.trim();
        }
      } else if (typeof value === 'string') {
        const textValidation = this.sanitizeTextInput(value);
        sanitizedParams[key] = textValidation.sanitizedText;
        warnings.push(...textValidation.warnings);
      } else {
        sanitizedParams[key] = value;
      }
    }

    return {
      isValid: errors.length === 0,
      sanitizedParams: errors.length === 0 ? sanitizedParams : undefined,
      errors,
      warnings
    };
  }
}