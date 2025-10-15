const { logger } = require('./logger');

/**
 * Checks if the current Node.js version meets the minimum requirement
 * @param {string} minVersion - Minimum required version (e.g., '18.0.0')
 * @returns {boolean} True if version is compatible
 */
const checkNodeVersion = (minVersion) => {
  const currentVersion = process.version.slice(1); // Remove 'v' prefix
  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);
  const [minMajor, minMinor, minPatch] = minVersion.split('.').map(Number);

  if (currentMajor > minMajor) return true;
  if (currentMajor < minMajor) return false;
  if (currentMinor > minMinor) return true;
  if (currentMinor < minMinor) return false;
  return currentPatch >= minPatch;
};

/**
 * Validates Node.js version and exits if incompatible
 * @param {string} minVersion - Minimum required version
 */
const validateNodeVersion = (minVersion) => {
  if (!checkNodeVersion(minVersion)) {
    logger.error(`❌ Node.js version ${minVersion} or higher is required.`);
    logger.error(`   Current version: ${process.version}`);
    logger.log('\nPlease update Node.js to continue.');
    logger.log('Download from: https://nodejs.org/');
    process.exit(1);
  }
};

module.exports = {
  checkNodeVersion,
  validateNodeVersion,
};
