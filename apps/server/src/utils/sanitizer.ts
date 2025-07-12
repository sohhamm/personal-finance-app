import DOMPurify from 'isomorphic-dompurify';

export class Sanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true, // Keep text content but remove tags
    });
  }

  /**
   * Sanitize text input by removing potential XSS vectors
   */
  static sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove HTML tags and decode HTML entities
    return this.sanitizeHtml(input)
      .replace(/[<>]/g, '') // Remove any remaining angle brackets
      .trim();
  }

  /**
   * Sanitize user input for database storage
   */
  static sanitizeUserInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return this.sanitizeText(input)
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, 1000); // Limit length to prevent DoS
  }
}