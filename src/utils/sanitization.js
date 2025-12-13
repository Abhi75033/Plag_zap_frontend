/**
 * Input Sanitization Utilities
 * Prevents XSS and validates user inputs
 */

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (input) => {
    if (!input) return '';

    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

// Validate and sanitize meeting title
export const sanitizeMeetingTitle = (title) => {
    if (!title || typeof title !== 'string') return '';

    // Remove any HTML tags
    const sanitized = sanitizeHTML(title);

    // Trim and limit length
    return sanitized.trim().slice(0, 100);
};

// Validate and sanitize chat message
export const sanitizeChatMessage = (message) => {
    if (!message || typeof message !== 'string') return '';

    // Remove any HTML tags
    const sanitized = sanitizeHTML(message);

    // Trim and limit length
    const trimmed = sanitized.trim().slice(0, 500);

    // Check if empty after sanitization
    if (trimmed.length === 0) return '';

    return trimmed;
};

// Validate meeting code format (e.g., "ABC-DEF-GHI")
export const validateMeetingCode = (code) => {
    if (!code || typeof code !== 'string') return false;

    // Should match pattern: XXX-XXXX-XXX (alphanumeric with hyphens)
    const codeRegex = /^[A-Z0-9]{3}-[A-Z0-9]{4}-[A-Z0-9]{3}$/;
    return codeRegex.test(code);
};

// Validate email format
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Sanitize URL to prevent javascript: and data: URIs
export const sanitizeURL = (url) => {
    if (!url || typeof url !== 'string') return '';

    const trimmed = url.trim();

    // Block dangerous protocols
    if (trimmed.match(/^(javascript|data|vbscript):/i)) {
        return '';
    }

    return trimmed;
};

// Rate limiting helper (client-side debouncing)
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for limiting frequent calls
export const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Validate username
export const sanitizeUsername = (username) => {
    if (!username || typeof username !== 'string') return '';

    // Remove any HTML
    const sanitized = sanitizeHTML(username);

    // Trim, limit length, and remove special characters except spaces and hyphens
    return sanitized
        .trim()
        .slice(0, 50)
        .replace(/[^a-zA-Z0-9\s-]/g, '');
};

// Check for potential SQL injection patterns (additional safety)
export const hasSQLInjection = (input) => {
    if (!input || typeof input !== 'string') return false;

    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
        /(--|;|\/\*|\*\/|xp_)/i,
        /(\bOR\b.*=.*)/i,
        /(\bAND\b.*=.*)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
};
