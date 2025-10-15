#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
}

const templates = {
  nextjs: {
    fileName: 'context-nextjs.md',
    name: 'Next.js (TypeScript)',
  },
  inertia: {
    fileName: 'context-inertia.md',
    name: 'Inertia.js + React',
  },
}

function logError(message) {
  console.error(`${colors.red}${message}${colors.reset}`)
}

function logWarning(message) {
  console.warn(`${colors.yellow}${message}${colors.reset}`)
}

function logSuccess(message) {
  console.log(`${colors.green}${message}${colors.reset}`)
}

function logInfo(message) {
  console.log(`${colors.cyan}${message}${colors.reset}`)
}

function showHelp() {
  console.log('Usage: node install-frontend-guidelines.js [template]')
  console.log('\nInstalls a context file for a specific frontend framework to guide AI assistance.')
  console.log('\nIf no template is provided, it will launch an interactive prompt.')
  console.log('\nOptions:')
  console.log('  [template]    The name of the template to install.')
  console.log('  -h, --help    Show this help message.')
  console.log('\nAvailable templates:')
  Object.keys(templates).forEach(key => {
    console.log(`  - ${key}: ${colors.dim}${templates[key].name}${colors.reset}`)
  })
}

function installTemplate(templateKey) {
  const template = templates[templateKey]
  if (!template) {
    logError(`❌ Template "${templateKey}" not found.`)

    process.exit(1)
  }

  const destFileName = `API_CONTEXT_${templateKey.toUpperCase()}.md`
  const sourcePath = path.join(__dirname, '..', 'templates', template.fileName)
  const destPath = path.join(process.cwd(), destFileName)

  if (fs.existsSync(destPath)) {
    logWarning(`⚠️  File ${destFileName} already exists in this directory. No action taken.`)

    return
  }

  try {
    fs.copyFileSync(sourcePath, destPath)
    logSuccess(`✅ AI context file "${destFileName}" created successfully!`)
    logInfo('   Copy the content of this file at the beginning of your conversation with an AI agent.')
  } catch (error) {
    logError(`❌ Error creating context file: ${error.message}`)

    process.exit(1)
  }
}

async function startInteractiveMode() {
  try {
    const { default: inquirer } = await import('inquirer')

    const { chosenTemplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chosenTemplate',
        message: 'Which frontend framework will you be using?',
        choices: Object.keys(templates).map(key => ({
          name: templates[key].name,
          value: key,
        })),
      },
    ])

    installTemplate(chosenTemplate)
  } catch (error) {
    logError('❌ Failed to start interactive mode. Is the \'inquirer\' package installed?')
    logError(error.message)

    process.exit(1)
  }
}

function main() {
  const templateArg = process.argv[2]

  if (!templateArg) {
    startInteractiveMode()

    return
  }

  if (templateArg === '--help' || templateArg === '-h') {
    showHelp()

    return
  }

  if (!templates[templateArg]) {
    logError(`❌ Template "${templateArg}" not recognized.`)
    console.log(`\nRun with --help to see the list of available templates.`)

    process.exit(1)
  }

  installTemplate(templateArg)
}

main()
