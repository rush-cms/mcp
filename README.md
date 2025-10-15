# Frontend AI Guidelines for Rush CMS

[![Tests](https://github.com/rush-cms/mcp/actions/workflows/test.yml/badge.svg)](https://github.com/rush-cms/mcp/actions/workflows/test.yml)
[![Security Audit](https://github.com/rush-cms/mcp/actions/workflows/security-audit.yml/badge.svg)](https://github.com/rush-cms/mcp/actions/workflows/security-audit.yml)
[![npm version](https://img.shields.io/npm/v/@rush-cms/mcp.svg)](https://www.npmjs.com/package/@rush-cms/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This CLI tool installs a Markdown context file tailored for a specific frontend framework. The goal is to provide a standardized prompt for another AI assistant to help with development.

## Usage

There are two ways to use this tool:

### 1. Interactive Mode (Recommended)

Run the following command to launch an interactive prompt:

```bash
npx @rush-cms/mcp@latest
```

You'll be asked to:
1. Choose your frontend framework (Next.js or Inertia.js)
2. Select which AI clients to install for (Claude, Cursor, VS Code, etc.)

### 2. Direct Mode

Specify the framework and AI clients directly:

```bash
# Install for specific clients
npx @rush-cms/mcp@latest nextjs claude,cursor

# Install for multiple clients
npx @rush-cms/mcp@latest inertia claude,copilot,cursor
```

**Available clients**: `claude`, `copilot`, `cursor`, `junie`, `codex`

### 3. Update Existing Files

To update/overwrite existing context files:

```bash
npx @rush-cms/mcp@latest --update nextjs claude,cursor
```

### 4. Get Help

```bash
npx @rush-cms/mcp@latest --help
```

## What it Does

This tool installs AI context files for various development environments, supporting both standard AI clients and MCP (Model Context Protocol) servers.

### For Standard AI Clients

Creates context files in your project directory:

- **Claude**: `.CLAUDE.md` - Context file for Claude Code/Desktop
- **VS Code Copilot**: `.github/copilot-instructions.md` - Instructions for GitHub Copilot
- **Codex**: `.codex/AGENTS.md` - Context for Codex AI

### For MCP-Compatible Clients

Creates context files **and** configures MCP servers:

- **Cursor**:
  - Creates `.cursor/rules/[framework].mdc`
  - Updates `.cursor/mcp.json` with server configuration

- **Junie**:
  - Creates `.junie/guidelines/[framework].md`
  - Updates `.junie/mcp/mcp.json` with server configuration

### Available Frameworks

- `nextjs` - Next.js (TypeScript) with headless API integration
- `inertia` - Laravel + Inertia.js + React

Each context file contains detailed guidelines, API documentation, and best practices tailored for the specific framework and your headless CMS API.

## Examples

### Example 1: Setup for Claude + Cursor

```bash
npx @rush-cms/mcp@latest nextjs claude,cursor
```

This will create:
- `.CLAUDE.md` - For use with Claude Desktop/Code
- `.cursor/rules/nextjs.mdc` - Cursor context rules
- `.cursor/mcp.json` - MCP server configuration

### Example 2: Setup for Multiple Environments

```bash
npx @rush-cms/mcp@latest inertia claude,copilot,cursor,codex
```

This will create context files for all specified AI clients in a single command.

### Example 3: Interactive Setup

```bash
npx @rush-cms/mcp@latest
```

Launches an interactive prompt where you can:
- Select your framework from a list
- Choose multiple AI clients with checkboxes
- Preview what will be installed

## Features

- **Multi-client support** - Install for multiple AI assistants at once
- **MCP integration** - Automatic server configuration for compatible clients
- **Framework-specific** - Tailored guidelines for Next.js and Inertia.js
- **Safe installation** - Never overwrites existing files by default
- **Update mode** - Use `--update` flag to refresh existing files
- **Interactive mode** - User-friendly CLI prompts
- **Zero config** - Works out of the box with sensible defaults
- **Version check** - Validates Node.js version compatibility (>=18.0.0)

## Security

This project uses automated security measures:

- **Dependabot**: Automatically checks for dependency updates and security vulnerabilities
- **Security Audit**: Weekly automated audits via GitHub Actions
- **npm audit**: Run `npm audit` locally to check for vulnerabilities

To check security issues locally:

```bash
npm audit              # Check for vulnerabilities
npm audit fix          # Auto-fix vulnerabilities
npm outdated           # Check for outdated dependencies
```

## Contributing

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation about the codebase structure and how to contribute.

## License

MIT