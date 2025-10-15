import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('MCP Server E2E Tests', () => {
  const testDir = path.join(process.cwd(), '__test_mcp_server_e2e__');
  const mcpServerPath = path.join(process.cwd(), 'bin', 'mcp-server.js');
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

  describe('MCP Server - Cursor client', () => {
    beforeEach(() => {
      // Install files first
      execSync(`node "${cliPath}" nextjs cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });
    });

    it('should return context for cursor nextjs', () => {
      const output = execSync(`node "${mcpServerPath}" cursor nextjs`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toBeTruthy();
      expect(output).toContain('Next.js');
      expect(output.length).toBeGreaterThan(100);
    });

    it('should return context for cursor inertia', () => {
      // Install inertia template
      execSync(`node "${cliPath}" --update inertia cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const output = execSync(`node "${mcpServerPath}" cursor inertia`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('Inertia');
      expect(output).toContain('Laravel');
    });
  });

  describe('MCP Server - Junie client', () => {
    beforeEach(() => {
      // Install files first
      execSync(`node "${cliPath}" nextjs junie`, {
        encoding: 'utf8',
        cwd: testDir,
      });
    });

    it('should return context for junie nextjs', () => {
      const output = execSync(`node "${mcpServerPath}" junie nextjs`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toBeTruthy();
      expect(output).toContain('Next.js');
    });

    it('should return context for junie inertia', () => {
      execSync(`node "${cliPath}" --update inertia junie`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const output = execSync(`node "${mcpServerPath}" junie inertia`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      expect(output).toContain('Inertia');
    });
  });

  describe('MCP Server - Error handling', () => {
    it('should fail when file does not exist', () => {
      try {
        execSync(`node "${mcpServerPath}" cursor nextjs`, {
          encoding: 'utf8',
          cwd: testDir,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.status).toBe(1);
        expect(error.stderr).toContain('Error:');
        expect(error.stderr).toContain('Context file not found');
      }
    });

    it('should fail without required arguments', () => {
      try {
        execSync(`node "${mcpServerPath}"`, {
          encoding: 'utf8',
          cwd: testDir,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.status).toBe(1);
        expect(error.stderr).toContain('Error:');
      }
    });

    it('should fail with only one argument', () => {
      try {
        execSync(`node "${mcpServerPath}" cursor`, {
          encoding: 'utf8',
          cwd: testDir,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.status).toBe(1);
        expect(error.stderr).toContain('Error:');
      }
    });
  });

  describe('MCP Server - Content validation', () => {
    beforeEach(() => {
      execSync(`node "${cliPath}" nextjs cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });
    });

    it('should return complete markdown content', () => {
      const output = execSync(`node "${mcpServerPath}" cursor nextjs`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // Should have markdown headers
      expect(output).toMatch(/^#/m);

      // Should be substantial content
      expect(output.length).toBeGreaterThan(500);

      // Check it doesn't start with an error (content comes first)
      expect(output.trim()).not.toMatch(/^Error:/);
    });

    it('should match content from installed file', () => {
      const serverOutput = execSync(`node "${mcpServerPath}" cursor nextjs`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const fileContent = fs.readFileSync(
        path.join(testDir, '.cursor', 'rules', 'nextjs.mdc'),
        'utf8'
      );

      expect(serverOutput.trim()).toBe(fileContent.trim());
    });
  });

  describe('MCP Server - Multiple frameworks', () => {
    it('should handle both frameworks for same client', () => {
      // Install both frameworks
      execSync(`node "${cliPath}" nextjs cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });
      execSync(`node "${cliPath}" inertia cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // Get nextjs content
      const nextjsOutput = execSync(`node "${mcpServerPath}" cursor nextjs`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // Get inertia content
      const inertiaOutput = execSync(`node "${mcpServerPath}" cursor inertia`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // Should be different content
      expect(nextjsOutput).not.toBe(inertiaOutput);
      expect(nextjsOutput).toContain('Next.js');
      expect(inertiaOutput).toContain('Inertia');
    });
  });

  describe('MCP Server - File paths', () => {
    it('should read from correct cursor path', () => {
      execSync(`node "${cliPath}" nextjs cursor`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const output = execSync(`node "${mcpServerPath}" cursor nextjs`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // Verify file was read from correct location
      const expectedPath = path.join(testDir, '.cursor', 'rules', 'nextjs.mdc');
      expect(fs.existsSync(expectedPath)).toBe(true);

      const fileContent = fs.readFileSync(expectedPath, 'utf8');
      expect(output.trim()).toBe(fileContent.trim());
    });

    it('should read from correct junie path', () => {
      execSync(`node "${cliPath}" inertia junie`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      const output = execSync(`node "${mcpServerPath}" junie inertia`, {
        encoding: 'utf8',
        cwd: testDir,
      });

      // Verify file was read from correct location
      const expectedPath = path.join(testDir, '.junie', 'guidelines', 'inertia.md');
      expect(fs.existsSync(expectedPath)).toBe(true);

      const fileContent = fs.readFileSync(expectedPath, 'utf8');
      expect(output.trim()).toBe(fileContent.trim());
    });
  });
});
