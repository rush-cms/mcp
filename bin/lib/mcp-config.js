const path = require('path');
const { readJsonFile, writeJsonFile, ensureDirectoryExists } = require('../utils/fs-utils');
const { MCP_SERVER_NAME } = require('../config/constants');
const { logger } = require('../utils/logger');

/**
 * Updates MCP configuration file for a client
 * @param {string} mcpConfigPath - Path to MCP config file
 * @param {string} clientKey - Client identifier
 * @param {string} templateKey - Template identifier
 * @throws {Error} If config cannot be read or written
 */
const updateMcpConfig = (mcpConfigPath, clientKey, templateKey) => {
  ensureDirectoryExists(path.dirname(mcpConfigPath));

  let mcpConfig;
  try {
    mcpConfig = readJsonFile(mcpConfigPath, {});
  } catch (error) {
    logger.error(`❌ Error reading ${mcpConfigPath}: ${error.message}`);
    throw error;
  }

  if (!mcpConfig.mcpServers) {
    mcpConfig.mcpServers = {};
  }

  const serverPath = path.join(__dirname, '..', 'mcp-server.js');
  mcpConfig.mcpServers[MCP_SERVER_NAME] = {
    command: 'node',
    args: [serverPath, clientKey, templateKey],
  };

  try {
    writeJsonFile(mcpConfigPath, mcpConfig);
  } catch (error) {
    logger.error(`❌ Error writing to ${mcpConfigPath}: ${error.message}`);
    throw error;
  }
};

module.exports = { updateMcpConfig };
