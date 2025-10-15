const path = require('path');
const { writeFile, readFile, ensureDirectoryExists } = require('../utils/fs-utils');
const { logger } = require('../utils/logger');
const { TEMPLATES, AI_CLIENTS, getMcpClientConfig, MCP_CLIENTS } = require('../config/constants');
const { updateMcpConfig } = require('./mcp-config');

/**
 * Reads template content from templates directory
 * @param {string} templateKey - Template identifier
 * @returns {string} Template content
 * @throws {Error} If template not found or cannot be read
 */
const readTemplateContent = (templateKey) => {
  const template = TEMPLATES[templateKey];
  if (!template) {
    throw new Error(`Template "${templateKey}" not found`);
  }

  const sourcePath = path.join(__dirname, '..', '..', 'templates', template.fileName);
  return readFile(sourcePath);
};

/**
 * Installs context file for an MCP client (Cursor or Junie)
 * @param {string} clientKey - MCP client key
 * @param {string} templateKey - Template key
 * @param {string} templateContent - Template content to write
 * @param {boolean} forceUpdate - Whether to overwrite existing files
 * @returns {boolean} True if installation succeeded
 */
const installMcpClient = (clientKey, templateKey, templateContent, forceUpdate = false) => {
  const config = getMcpClientConfig(clientKey);
  if (!config) {
    logger.warning(`⚠️ Unknown MCP client: ${clientKey}`);
    return false;
  }

  ensureDirectoryExists(config.rulesDir);

  const fileName = `${templateKey}${config.fileExtension}`;
  const destPath = path.join(config.rulesDir, fileName);

  const written = writeFile(destPath, templateContent, { overwrite: forceUpdate });

  if (!written) {
    logger.warning(`⚠️ File ${destPath} already exists. No action taken.`);
    return false;
  }

  const action = forceUpdate ? 'updated' : 'created';
  logger.success(`✅ AI context file "${destPath}" ${action} successfully!`);

  try {
    updateMcpConfig(config.mcpConfigPath, clientKey, templateKey);
    const clientName = AI_CLIENTS[clientKey]?.name || clientKey;
    logger.success(`✅ ${clientName} MCP config updated successfully!`);
    return true;
  } catch (error) {
    logger.error(`❌ Failed to update MCP config: ${error.message}`);
    return false;
  }
};

/**
 * Installs context file for a standard AI client (non-MCP)
 * @param {string} clientKey - Client key
 * @param {string} templateContent - Template content to write
 * @param {boolean} forceUpdate - Whether to overwrite existing files
 * @returns {boolean} True if installation succeeded
 */
const installStandardClient = (clientKey, templateContent, forceUpdate = false) => {
  const client = AI_CLIENTS[clientKey];
  if (!client?.fileName) {
    logger.warning(`⚠️ Client "${clientKey}" has no file configuration. Skipping.`);
    return false;
  }

  const destPath = path.join(process.cwd(), client.fileName);
  const written = writeFile(destPath, templateContent, { overwrite: forceUpdate });

  if (!written) {
    logger.warning(`⚠️ File ${client.fileName} already exists. No action taken.`);
    return false;
  }

  const action = forceUpdate ? 'updated' : 'created';
  logger.success(`✅ AI context file "${client.fileName}" ${action} successfully!`);
  return true;
};

/**
 * Installs template for selected AI clients
 * @param {string} templateKey - Template identifier
 * @param {string[]} selectedClients - Array of client keys to install for
 * @param {boolean} forceUpdate - Whether to overwrite existing files
 * @throws {Error} If template not found
 */
const installTemplate = (templateKey, selectedClients, forceUpdate = false) => {
  const templateContent = readTemplateContent(templateKey);

  const results = selectedClients.map((clientKey) => {
    const client = AI_CLIENTS[clientKey];
    if (!client) {
      logger.warning(`⚠️ AI client "${clientKey}" not found. Skipping.`);
      return false;
    }

    const isMcpClient = clientKey === MCP_CLIENTS.CURSOR || clientKey === MCP_CLIENTS.JUNIE;

    return isMcpClient
      ? installMcpClient(clientKey, templateKey, templateContent, forceUpdate)
      : installStandardClient(clientKey, templateContent, forceUpdate);
  });

  const successCount = results.filter(Boolean).length;
  if (successCount === 0) {
    logger.warning('⚠️ No files were created.');
  }
};

module.exports = {
  installTemplate,
  readTemplateContent,
  installMcpClient,
  installStandardClient,
};
