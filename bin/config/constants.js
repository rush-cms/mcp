const path = require('path');

/**
 * MCP client types
 * @readonly
 * @enum {string}
 */
const MCP_CLIENTS = Object.freeze({
  CURSOR: 'cursor',
  JUNIE: 'junie',
});

/**
 * Available framework templates
 * @typedef {Object} Template
 * @property {string} fileName - Template file name
 * @property {string} name - Display name
 */

/**
 * @type {Object.<string, Template>}
 */
const TEMPLATES = Object.freeze({
  nextjs: {
    fileName: 'context-nextjs.md',
    name: 'Next.js (TypeScript)',
  },
  inertia: {
    fileName: 'context-inertia.md',
    name: 'Inertia.js + React',
  },
});

/**
 * AI Client configuration
 * @typedef {Object} AIClient
 * @property {string} name - Display name
 * @property {string} [fileName] - Optional file name for non-MCP clients
 */

/**
 * @type {Object.<string, AIClient>}
 */
const AI_CLIENTS = Object.freeze({
  claude: {
    fileName: '.CLAUDE.md',
    name: 'Claude',
  },
  copilot: {
    fileName: '.github/copilot-instructions.md',
    name: 'VS Code',
  },
  cursor: {
    name: 'Cursor',
  },
  junie: {
    name: 'Junie',
  },
  codex: {
    fileName: '.codex/AGENTS.md',
    name: 'Codex',
  },
});

/**
 * MCP client configuration paths
 * @typedef {Object} McpClientConfig
 * @property {string} rulesDir - Directory for rules/guidelines
 * @property {string} mcpConfigPath - Path to MCP config file
 * @property {string} fileExtension - File extension for context files
 */

/**
 * Gets MCP client configuration
 * @param {string} clientKey - Client key (cursor or junie)
 * @param {string} cwd - Current working directory
 * @returns {McpClientConfig|null} Client configuration or null if not found
 */
const getMcpClientConfig = (clientKey, cwd = process.cwd()) => {
  const configs = {
    [MCP_CLIENTS.CURSOR]: {
      rulesDir: path.join(cwd, '.cursor', 'rules'),
      mcpConfigPath: path.join(cwd, '.cursor', 'mcp.json'),
      fileExtension: '.mdc',
    },
    [MCP_CLIENTS.JUNIE]: {
      rulesDir: path.join(cwd, '.junie', 'guidelines'),
      mcpConfigPath: path.join(cwd, '.junie', 'mcp', 'mcp.json'),
      fileExtension: '.md',
    },
  };

  return configs[clientKey] || null;
};

/**
 * Gets the file path for a context file
 * @param {string} clientKey - Client key
 * @param {string} framework - Framework name
 * @param {string} cwd - Current working directory
 * @returns {string|null} File path or null if client not found
 */
const getContextFilePath = (clientKey, framework, cwd = process.cwd()) => {
  const filePaths = {
    [MCP_CLIENTS.CURSOR]: path.join(cwd, '.cursor', 'rules', `${framework}.mdc`),
    [MCP_CLIENTS.JUNIE]: path.join(cwd, '.junie', 'guidelines', `${framework}.md`),
  };

  return filePaths[clientKey] || null;
};

/**
 * MCP server configuration name
 */
const MCP_SERVER_NAME = 'rush-cms';

module.exports = {
  MCP_CLIENTS,
  TEMPLATES,
  AI_CLIENTS,
  MCP_SERVER_NAME,
  getMcpClientConfig,
  getContextFilePath,
};
