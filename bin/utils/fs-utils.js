const fs = require('fs');
const path = require('path');

/**
 * Ensures a directory exists, creating it recursively if needed
 * @param {string} dirPath - Directory path to ensure exists
 * @throws {Error} If directory creation fails
 */
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Safely reads a JSON file
 * @param {string} filePath - Path to JSON file
 * @param {Object} defaultValue - Default value if file doesn't exist
 * @returns {Object} Parsed JSON content or default value
 * @throws {Error} If file exists but cannot be parsed
 */
const readJsonFile = (filePath, defaultValue = {}) => {
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${filePath}: ${error.message}`);
  }
};

/**
 * Safely writes JSON to a file
 * @param {string} filePath - Path to write JSON file
 * @param {Object} data - Data to write as JSON
 * @param {number} indentation - JSON indentation spaces (default: 2)
 * @throws {Error} If write operation fails
 */
const writeJsonFile = (filePath, data, indentation = 2) => {
  const content = JSON.stringify(data, null, indentation);
  fs.writeFileSync(filePath, content, 'utf8');
};

/**
 * Safely writes text content to a file
 * @param {string} filePath - Path to write file
 * @param {string} content - Content to write
 * @param {Object} options - Write options
 * @param {boolean} options.overwrite - Whether to overwrite existing files (default: false)
 * @returns {boolean} True if file was written, false if skipped
 * @throws {Error} If write operation fails
 */
const writeFile = (filePath, content, options = {}) => {
  const { overwrite = false } = options;

  if (!overwrite && fs.existsSync(filePath)) {
    return false;
  }

  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
};

/**
 * Reads a text file
 * @param {string} filePath - Path to read
 * @returns {string} File content
 * @throws {Error} If file doesn't exist or cannot be read
 */
const readFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
};

/**
 * Checks if a file exists
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file exists
 */
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

module.exports = {
  ensureDirectoryExists,
  readJsonFile,
  writeJsonFile,
  writeFile,
  readFile,
  fileExists,
};
