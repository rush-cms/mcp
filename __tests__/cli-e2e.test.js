import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('CLI E2E Tests', () => {
  const testDir = path.join(process.cwd(), '__test_cli_e2e__');
  const cliPath = path.join(process.cwd(), 'bin', 'install-frontend-guidelines.js');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Help flag', () => {
    it('should display help with --help flag', () => {
      const output = execSync(`node "${cliPath}" --help`, { encoding: 'utf8' });

      expect(output).toContain('Usage:');
      expect(output).toContain('install-frontend-guidelines');
      expect(output).toContain('Available templates:');
      expect(output).toContain('nextjs');
      expect(output).toContain('inertia');
      expect(output).toContain('Available AI clients:');
      expect(output).toContain('claude');
      expect(output).toContain('cursor');
      expect(output).toContain('--update');
    });

    it('should display help with -h flag', () => {
      const output = execSync(`node "${cliPath}" -h`, { encoding: 'utf8' });

      expect(output).toContain('Usage:');
      expect(output).toContain('Available templates:');
    });
  });

  describe('Invalid template handling', () => {
    it('should show error for invalid template', () => {
      try {
        execSync(`node "${cliPath}" invalid-template claude 2>&1`, {
          encoding: 'utf8',
          cwd: testDir,
          shell: '/bin/bash',
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        const output = error.stdout?.toString() || error.message || '';
        expect(output).toContain('Template "invalid-template" not recognized');
        expect(error.status).toBe(1);
      }
    });
  });

  describe('Successful installations', () => {
    it('should install claude context file successfully', () => {
      const output = execSync(`node "${cliPath}" nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('✅');
      expect(output).toContain('.CLAUDE.md');
      expect(fs.existsSync(path.join(testDir, '.CLAUDE.md'))).toBe(true);

      const content = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');
      expect(content).toContain('Next.js');
    });

    it('should install cursor context file and MCP config', () => {
      const output = execSync(`node "${cliPath}" nextjs cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('✅');
      expect(output).toContain('.cursor/rules/nextjs.mdc');
      expect(fs.existsSync(path.join(testDir, '.cursor', 'rules', 'nextjs.mdc'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.cursor', 'mcp.json'))).toBe(true);

      const mcpConfig = JSON.parse(
        fs.readFileSync(path.join(testDir, '.cursor', 'mcp.json'), 'utf8')
      );
      expect(mcpConfig.mcpServers['rush-cms']).toBeDefined();
    });

    it('should install for multiple clients at once', () => {
      const output = execSync(`node "${cliPath}" inertia claude,cursor,copilot`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('✅');
      expect(fs.existsSync(path.join(testDir, '.CLAUDE.md'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.cursor', 'rules', 'inertia.mdc'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.github', 'copilot-instructions.md'))).toBe(true);
    });
  });

  describe('Update mode', () => {
    it('should not overwrite files without --update flag', () => {
      // First installation
      execSync(`node "${cliPath}" nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const originalContent = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');

      // Try to install again
      const output = execSync(`node "${cliPath}" inertia claude 2>&1`, {
        encoding: 'utf8',
        cwd: testDir,
        shell: '/bin/bash',
      });

      expect(output).toContain('already exists');

      const currentContent = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');
      expect(currentContent).toBe(originalContent);
    });

    it('should overwrite files with --update flag', () => {
      // First installation
      execSync(`node "${cliPath}" nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // Update with different template
      const output = execSync(`node "${cliPath}" --update inertia claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('ℹ️');
      expect(output).toContain('Update mode enabled');
      expect(output).toContain('updated');

      const content = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');
      expect(content).toContain('Inertia');
      expect(content).not.toContain('Next.js');
    });

    it('should support --update flag at different positions', () => {
      execSync(`node "${cliPath}" nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // --update at the end
      const output1 = execSync(`node "${cliPath}" inertia claude --update`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output1).toContain('updated');

      // Reinstall first template
      execSync(`node "${cliPath}" --update nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // --update at the beginning
      const output2 = execSync(`node "${cliPath}" --update inertia claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output2).toContain('updated');
    });
  });

  describe('Output formatting and colors', () => {
    it('should show success messages with checkmarks', () => {
      const output = execSync(`node "${cliPath}" nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toMatch(/✅/);
    });

    it('should show warning messages for existing files', () => {
      execSync(`node "${cliPath}" nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const output = execSync(`node "${cliPath}" nextjs claude 2>&1`, {
        encoding: 'utf8',
        cwd: testDir,
        shell: '/bin/bash',
      });

      expect(output).toContain('already exists');
    });
  });

  describe('Template variations', () => {
    it('should install inertia template correctly', () => {
      const output = execSync(`node "${cliPath}" inertia claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('✅');

      const content = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');
      expect(content).toContain('Inertia');
      expect(content).toContain('Laravel');
    });

    it('should install nextjs template correctly', () => {
      const output = execSync(`node "${cliPath}" nextjs claude`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('✅');

      const content = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');
      expect(content).toContain('Next.js');
    });
  });

  describe('All AI clients', () => {
    it('should install for codex client', () => {
      execSync(`node "${cliPath}" nextjs codex`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(fs.existsSync(path.join(testDir, '.codex', 'AGENTS.md'))).toBe(true);
    });

    it('should install for junie client', () => {
      execSync(`node "${cliPath}" nextjs junie`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(fs.existsSync(path.join(testDir, '.junie', 'guidelines', 'nextjs.md'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.junie', 'mcp', 'mcp.json'))).toBe(true);
    });

    it('should install for copilot client', () => {
      execSync(`node "${cliPath}" nextjs copilot`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(fs.existsSync(path.join(testDir, '.github', 'copilot-instructions.md'))).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid clients gracefully', () => {
      // Pass only invalid clients
      const output = execSync(`node "${cliPath}" nextjs invalid-client 2>&1`, {
        encoding: 'utf8',
        cwd: testDir,
        shell: '/bin/bash',
      });

      expect(output).toContain('not found');
      expect(output).toContain('No files were created');
    });

    it('should skip invalid clients but process valid ones', () => {
      const output = execSync(`node "${cliPath}" nextjs invalid-client,claude`, {
        encoding: 'utf8',
        cwd: testDir,
        stdio: 'pipe',
      });

      // Should still create the valid client file
      expect(output).toContain('✅');
      expect(fs.existsSync(path.join(testDir, '.CLAUDE.md'))).toBe(true);
    });
  });

  describe('MCP configuration', () => {
    it('should create valid MCP config for cursor', () => {
      execSync(`node "${cliPath}" nextjs cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const mcpConfig = JSON.parse(
        fs.readFileSync(path.join(testDir, '.cursor', 'mcp.json'), 'utf8')
      );

      expect(mcpConfig.mcpServers).toBeDefined();
      expect(mcpConfig.mcpServers['rush-cms']).toBeDefined();
      expect(mcpConfig.mcpServers['rush-cms'].command).toBe('node');
      expect(Array.isArray(mcpConfig.mcpServers['rush-cms'].args)).toBe(true);
      expect(mcpConfig.mcpServers['rush-cms'].args[0]).toContain('mcp-server.js');
      expect(mcpConfig.mcpServers['rush-cms'].args[1]).toBe('cursor');
      expect(mcpConfig.mcpServers['rush-cms'].args[2]).toBe('nextjs');
    });

    it('should create valid MCP config for junie', () => {
      execSync(`node "${cliPath}" inertia junie`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const mcpConfig = JSON.parse(
        fs.readFileSync(path.join(testDir, '.junie', 'mcp', 'mcp.json'), 'utf8')
      );

      expect(mcpConfig.mcpServers['rush-cms']).toBeDefined();
      expect(mcpConfig.mcpServers['rush-cms'].args[1]).toBe('junie');
      expect(mcpConfig.mcpServers['rush-cms'].args[2]).toBe('inertia');
    });
  });
});
