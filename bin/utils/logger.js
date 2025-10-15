/**
 * ANSI color codes for terminal output
 */
const COLORS = Object.freeze({
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  DIM: '\x1b[2m',
});

/**
 * Wraps text with ANSI color codes
 * @param {string} text - Text to colorize
 * @param {string} colorCode - ANSI color code
 * @returns {string} Colorized text
 */
const colorize = (text, colorCode) => `${colorCode}${text}${COLORS.RESET}`;

/**
 * Logger utility for consistent console output
 */
const logger = {
  /**
   * Logs an error message in red
   * @param {string} message - Error message
   */
  error: (message) => {
    console.error(colorize(message, COLORS.RED));
  },

  /**
   * Logs a warning message in yellow
   * @param {string} message - Warning message
   */
  warning: (message) => {
    console.warn(colorize(message, COLORS.YELLOW));
  },

  /**
   * Logs a success message in green
   * @param {string} message - Success message
   */
  success: (message) => {
    console.log(colorize(message, COLORS.GREEN));
  },

  /**
   * Logs an info message in cyan
   * @param {string} message - Info message
   */
  info: (message) => {
    console.log(colorize(message, COLORS.CYAN));
  },

  /**
   * Logs a dimmed message
   * @param {string} message - Message to dim
   */
  dim: (message) => {
    console.log(colorize(message, COLORS.DIM));
  },

  /**
   * Logs a plain message
   * @param {string} message - Message
   */
  log: (message) => {
    console.log(message);
  },
};

module.exports = { logger, COLORS, colorize };
