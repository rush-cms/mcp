# Frontend AI Guidelines for Rush CMS

This CLI tool installs a Markdown context file tailored for a specific frontend framework. The goal is to provide a standardized prompt for another AI assistant to help with development.

## Usage

There are two ways to use this tool:

### 1. Interactive Mode

Run the following command to launch an interactive prompt that asks you to choose between the available frameworks:

```bash
npx install-frontend-guidelines
```

### 2. Direct Mode

You can also specify the framework directly as an argument:

```bash
# For Next.js
npx install-frontend-guidelines nextjs

# For Laravel with Inertia.js + React
npx install-frontend-guidelines inertia
```

## What it Does

This command will create a new Markdown file in your current directory named `API_CONTEXT_[FRAMEWORK].md`.

For example, if you choose `nextjs`, it will create a file named `API_CONTEXT_NEXTJS.md`.

This file contains a detailed prompt that you can copy and paste at the beginning of your conversation with an AI programming assistant to set the context for your frontend development questions.