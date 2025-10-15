# Architecture Documentation

## Overview

This package provides CLI tools for installing AI context files and MCP (Model Context Protocol) servers for various development environments.

## Project Structure

```
bin/
├── config/
│   └── constants.js          # Application constants and configuration
├── lib/
│   ├── cli-helpers.js        # CLI utility functions
│   ├── mcp-config.js         # MCP configuration management
│   └── template-installer.js # Template installation logic
├── utils/
│   ├── fs-utils.js           # File system utilities
│   └── logger.js             # Logging utilities
├── install-frontend-guidelines.js  # Main CLI entry point
└── mcp-server.js             # MCP server entry point

templates/
├── context-nextjs.md         # Next.js template
└── context-inertia.md        # Inertia.js template

__tests__/
├── install-frontend-guidelines.test.js
└── mcp-server.test.js
```

## Architecture Principles

### 1. Separation of Concerns

Each module has a single, well-defined responsibility:

- **config/**: Application configuration and constants
- **lib/**: Core business logic
- **utils/**: Reusable utility functions
- **bin/**: CLI entry points

### 2. DRY (Don't Repeat Yourself)

- Common file operations are abstracted into `fs-utils.js`
- Logging is centralized in `logger.js`
- Configuration is centralized in `constants.js`

### 3. Error Handling

All functions properly throw and handle errors with descriptive messages:

```javascript
try {
  const content = readFile(filePath);
} catch (error) {
  throw new Error(`Failed to read ${filePath}: ${error.message}`);
}
```

### 4. Type Safety via JSDoc

All functions are documented with JSDoc annotations providing:
- Parameter types
- Return types
- Error conditions
- Usage examples

### 5. Testability

- Pure functions where possible
- Dependency injection for testing
- Integration tests for end-to-end verification

## Module Responsibilities

### constants.js

Centralizes all configuration:
- Template definitions
- AI client configurations
- MCP client mappings
- File path generation functions

### fs-utils.js

Provides safe file system operations:
- `ensureDirectoryExists()` - Creates directories recursively
- `readJsonFile()` - Safely reads and parses JSON
- `writeJsonFile()` - Writes formatted JSON
- `writeFile()` - Writes files with overwrite protection
- `readFile()` - Reads text files with error handling

### logger.js

Provides consistent, colorized console output:
- `logger.error()` - Red error messages
- `logger.warning()` - Yellow warnings
- `logger.success()` - Green success messages
- `logger.info()` - Cyan informational messages

### cli-helpers.js

CLI-specific utilities:
- `showHelp()` - Displays help text
- `isValidTemplate()` - Validates template keys
- `parseClientsList()` - Parses comma-separated lists
- `createChoices()` - Formats options for inquirer

### mcp-config.js

Manages MCP configuration files:
- `updateMcpConfig()` - Updates/creates MCP config JSON

### template-installer.js

Core installation logic:
- `readTemplateContent()` - Reads template files
- `installMcpClient()` - Installs for MCP clients (Cursor/Junie)
- `installStandardClient()` - Installs for standard clients
- `installTemplate()` - Main installation orchestrator

## Data Flow

### Installation Flow

```
CLI Input
    ↓
main() [install-frontend-guidelines.js]
    ↓
Parse Arguments / Interactive Mode
    ↓
installTemplate() [template-installer.js]
    ↓
readTemplateContent() → Read from templates/
    ↓
For each client:
    ├→ installMcpClient() [MCP clients]
    │   ├→ writeFile() [fs-utils.js]
    │   └→ updateMcpConfig() [mcp-config.js]
    │
    └→ installStandardClient() [Other clients]
        └→ writeFile() [fs-utils.js]
```

### MCP Server Flow

```
MCP Request
    ↓
main() [mcp-server.js]
    ↓
getMcpContext(client, framework)
    ↓
getContextFilePath() [constants.js]
    ↓
readFile() [fs-utils.js]
    ↓
Return content
```

## Design Patterns

### 1. Factory Pattern

`getMcpClientConfig()` and `getContextFilePath()` act as factories, creating appropriate configurations based on client type.

### 2. Strategy Pattern

Different installation strategies for MCP vs standard clients, selected at runtime.

### 3. Single Responsibility

Each function does one thing well:
- `writeFile()` only writes files
- `updateMcpConfig()` only updates configs
- `installMcpClient()` orchestrates but delegates

### 4. Dependency Injection

Functions accept dependencies as parameters rather than importing them directly, improving testability.

## Error Handling Strategy

1. **Validation at Entry Points**: Input validation happens at CLI entry
2. **Descriptive Errors**: All errors include context about what failed
3. **Graceful Degradation**: Warnings for non-critical failures
4. **No Silent Failures**: All errors are logged or thrown

## Testing Strategy

### Integration Tests

Focus on end-to-end behavior:
- Tests use real file system in isolated directories
- Cleanup after each test
- Verify actual file creation and content

### Benefits

- More reliable than mocking CommonJS modules
- Tests actual user experience
- Catches integration issues

## Future Improvements

1. **Add Unit Tests**: For individual utility functions
2. **TypeScript Migration**: Convert to TypeScript for better type safety
3. **Plugin System**: Allow custom templates and clients
4. **Configuration File**: Support `.mcprc` or similar config files
5. **Validation**: Add schema validation for MCP configs
6. **Logging Levels**: Add debug/verbose modes
7. **Async Operations**: Use async file operations for better performance

## Contributing

When adding new features:

1. Follow the module structure
2. Add JSDoc documentation
3. Include error handling
4. Write tests
5. Update this documentation
