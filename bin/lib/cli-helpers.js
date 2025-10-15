const { logger, colorize, COLORS } = require('../utils/logger');
const { TEMPLATES, AI_CLIENTS } = require('../config/constants');

/**
 * Displays help information for the CLI
 */
const showHelp = () => {
  logger.log('Usage: install-frontend-guidelines [template] [clients] [options]');
  logger.log('\nInstalls context files for a specific frontend framework and AI clients.');
  logger.log('\nIf no template or clients are provided, it will launch an interactive prompt.');
  logger.log('\nOptions:');
  logger.log('  [template]    The name of the template to install.');
  logger.log('  [clients]     A comma-separated list of AI clients to install context files for.');
  logger.log('  --update      Force update existing files (overwrites existing context files).');
  logger.log('  -h, --help    Show this help message.');

  logger.log('\nAvailable templates:');
  Object.entries(TEMPLATES).forEach(([key, { name }]) => {
    logger.log(`  - ${key}: ${colorize(name, COLORS.DIM)}`);
  });

  logger.log('\nAvailable AI clients:');
  Object.entries(AI_CLIENTS).forEach(([key, { name }]) => {
    logger.log(`  - ${key}: ${colorize(name, COLORS.DIM)}`);
  });
};

/**
 * Validates if a template key exists
 * @param {string} templateKey - Template key to validate
 * @returns {boolean} True if valid
 */
const isValidTemplate = (templateKey) => {
  return templateKey in TEMPLATES;
};

/**
 * Validates if a client key exists
 * @param {string} clientKey - Client key to validate
 * @returns {boolean} True if valid
 */
const isValidClient = (clientKey) => {
  return clientKey in AI_CLIENTS;
};

/**
 * Parses comma-separated client list
 * @param {string} clientsArg - Comma-separated client keys
 * @returns {string[]} Array of trimmed client keys
 */
const parseClientsList = (clientsArg) => {
  return clientsArg.split(',').map((c) => c.trim()).filter(Boolean);
};

/**
 * Creates choices array for inquirer prompts
 * @param {Object.<string, {name: string}>} options - Options object
 * @returns {Array.<{name: string, value: string}>} Choices array
 */
const createChoices = (options) => {
  return Object.entries(options).map(([key, { name }]) => ({
    name,
    value: key,
  }));
};

module.exports = {
  showHelp,
  isValidTemplate,
  isValidClient,
  parseClientsList,
  createChoices,
};
