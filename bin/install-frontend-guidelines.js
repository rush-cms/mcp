#!/usr/bin/env node

const { validateNodeVersion } = require('./utils/version-check');
const { logger } = require('./utils/logger');
const { TEMPLATES, AI_CLIENTS } = require('./config/constants');
const { installTemplate } = require('./lib/template-installer');
const {
  showHelp,
  isValidTemplate,
  parseClientsList,
  createChoices,
} = require('./lib/cli-helpers');

// Check Node.js version before proceeding
validateNodeVersion('18.0.0');

/**
 * Starts interactive mode using inquirer
 * @param {boolean} forceUpdate - Whether to force update existing files
 * @returns {Promise<void>}
 */
const startInteractiveMode = async (forceUpdate = false) => {
  try {
    const { default: inquirer } = await import('inquirer');

    const { chosenTemplate, chosenClients } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chosenTemplate',
        message: 'Which frontend framework will you be using?',
        choices: createChoices(TEMPLATES),
      },
      {
        type: 'checkbox',
        name: 'chosenClients',
        message: 'Which AI clients do you want to install context files for?',
        choices: createChoices(AI_CLIENTS),
      },
    ]);

    if (chosenClients.length === 0) {
      logger.warning('⚠️ No AI clients selected. No files were created.');
      return;
    }

    installTemplate(chosenTemplate, chosenClients, forceUpdate);
  } catch (error) {
    logger.error('❌ Failed to start interactive mode.');
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Parses command line arguments and executes appropriate action
 */
const main = async () => {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.some((arg) => arg === '--help' || arg === '-h')) {
    showHelp();
    return;
  }

  // Check for update flag
  const forceUpdate = args.some((arg) => arg === '--update');
  const filteredArgs = args.filter((arg) => arg !== '--update');

  const [templateArg, clientsArg] = filteredArgs;

  // No arguments - start interactive mode
  if (!templateArg) {
    await startInteractiveMode(forceUpdate);
    return;
  }

  // Validate template
  if (!isValidTemplate(templateArg)) {
    logger.error(`❌ Template "${templateArg}" not recognized.`);
    logger.log('\nRun with --help to see the list of available templates.');
    process.exit(1);
  }

  // No clients specified - start interactive mode
  if (!clientsArg) {
    await startInteractiveMode(forceUpdate);
    return;
  }

  // Parse and install for specified clients
  const clients = parseClientsList(clientsArg);

  if (clients.length === 0) {
    logger.warning('⚠️ No valid clients specified.');
    await startInteractiveMode(forceUpdate);
    return;
  }

  try {
    if (forceUpdate) {
      logger.info('ℹ️ Update mode enabled - existing files will be overwritten.');
    }
    installTemplate(templateArg, clients, forceUpdate);
  } catch (error) {
    logger.error(`❌ Installation failed: ${error.message}`);
    process.exit(1);
  }
};

// Run main if executed directly
if (require.main === module) {
  main().catch((error) => {
    logger.error(`❌ Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

// Export for testing
module.exports = {
  installTemplate,
  aiClients: AI_CLIENTS,
  templates: TEMPLATES,
};
