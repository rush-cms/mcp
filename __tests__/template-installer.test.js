import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  readTemplateContent,
  installTemplate,
} from '../bin/lib/template-installer.js';
import fs from 'fs';
import path from 'path';

describe('Template Installer - Edge Cases', () => {
  const testDir = path.join(process.cwd(), '__test_installer__');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(path.join(testDir, '..'));
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('readTemplateContent', () => {
    it('should throw error for non-existent template', () => {
      expect(() => readTemplateContent('nonexistent')).toThrow('Template "nonexistent" not found');
    });

    it('should read nextjs template successfully', () => {
      const content = readTemplateContent('nextjs');
      expect(content).toBeTruthy();
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    });

    it('should read inertia template successfully', () => {
      const content = readTemplateContent('inertia');
      expect(content).toBeTruthy();
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('installTemplate - Edge Cases', () => {
    it('should handle empty clients array gracefully', () => {
      expect(() => installTemplate('nextjs', [])).not.toThrow();
    });

    it('should skip invalid client keys', () => {
      installTemplate('nextjs', ['invalid-client', 'claude']);

      // Should create claude file only
      expect(fs.existsSync(path.join(testDir, '.CLAUDE.md'))).toBe(true);
    });

    it('should handle multiple installations to same client', () => {
      // First installation
      installTemplate('nextjs', ['claude']);
      const firstContent = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');

      // Second installation (should be skipped)
      installTemplate('inertia', ['claude']);
      const secondContent = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');

      // Content should not change
      expect(firstContent).toBe(secondContent);
    });

    it('should update files when forceUpdate is true', () => {
      // First installation
      installTemplate('nextjs', ['claude']);
      const nextjsContent = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');

      // Update with different template
      installTemplate('inertia', ['claude'], true);
      const inertiaContent = fs.readFileSync(path.join(testDir, '.CLAUDE.md'), 'utf8');

      // Content should be different
      expect(nextjsContent).not.toBe(inertiaContent);
      expect(inertiaContent).toContain('Inertia');
    });

    it('should create nested directories for MCP clients', () => {
      installTemplate('nextjs', ['cursor']);

      expect(fs.existsSync(path.join(testDir, '.cursor', 'rules', 'nextjs.mdc'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.cursor', 'mcp.json'))).toBe(true);
    });

    it('should create MCP config with correct structure', () => {
      installTemplate('nextjs', ['cursor']);

      const mcpConfig = JSON.parse(
        fs.readFileSync(path.join(testDir, '.cursor', 'mcp.json'), 'utf8')
      );

      expect(mcpConfig.mcpServers).toBeDefined();
      expect(mcpConfig.mcpServers['rush-cms']).toBeDefined();
      expect(mcpConfig.mcpServers['rush-cms'].command).toBe('node');
      expect(mcpConfig.mcpServers['rush-cms'].args).toBeDefined();
      expect(Array.isArray(mcpConfig.mcpServers['rush-cms'].args)).toBe(true);
    });

    it('should handle simultaneous installation for multiple clients', () => {
      installTemplate('nextjs', ['claude', 'cursor', 'copilot', 'codex']);

      expect(fs.existsSync(path.join(testDir, '.CLAUDE.md'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.cursor', 'rules', 'nextjs.mdc'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.github', 'copilot-instructions.md'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.codex', 'AGENTS.md'))).toBe(true);
    });

    it('should preserve existing MCP config when updating', () => {
      // First installation
      installTemplate('nextjs', ['cursor']);

      // Manually add custom config
      const mcpPath = path.join(testDir, '.cursor', 'mcp.json');
      const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      mcpConfig.mcpServers['custom-server'] = { command: 'custom' };
      fs.writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2));

      // Second installation with different template
      installTemplate('inertia', ['cursor'], true);

      // Custom config should still exist
      const updatedConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      expect(updatedConfig.mcpServers['custom-server']).toBeDefined();
      expect(updatedConfig.mcpServers['rush-cms']).toBeDefined();
    });
  });
});
