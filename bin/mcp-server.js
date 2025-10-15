#!/usr/bin/env node

const { validateNodeVersion } = require('./utils/version-check');
const { readFile } = require('./utils/fs-utils');
const { getContextFilePath } = require('./config/constants');

// Check Node.js version before proceeding
validateNodeVersion('18.0.0');

/**
 * Retrieves MCP context content for a given AI client and framework
 * @param {string} aiClient - The AI client identifier (e.g., 'cursor', 'junie')
 * @param {string} framework - The framework identifier (e.g., 'nextjs', 'inertia')
 * @returns {string} The content of the context file
 * @throws {Error} If parameters are missing or file not found
 */
const getMcpContext = (aiClient, framework) => {
  if (!aiClient || !framework) {
    throw new Error('AI client or framework name not provided.');
  }

  const filePath = getContextFilePath(aiClient, framework);

  if (!filePath) {
    throw new Error(`Context file not found for ${aiClient}`);
  }

  try {
    return readFile(filePath);
  } catch (error) {
    throw new Error(`Context file not found for ${aiClient} at ${filePath}`);
  }
};

/**
 * Main entry point for MCP server CLI
 */
const main = () => {
  const [, , aiClient, framework] = process.argv;

  try {
    const content = getMcpContext(aiClient, framework);
    console.log(content);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run main if executed directly
if (require.main === module) {
  main();
}

module.exports = { getMcpContext };
