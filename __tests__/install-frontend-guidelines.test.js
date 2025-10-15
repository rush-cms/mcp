import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { installTemplate } from '../bin/install-frontend-guidelines.js';
import fs from 'fs';
import path from 'path';

describe('installTemplate - Integration Tests', () => {
  const testDir = path.join(process.cwd(), '__test_output__');

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

  it('should create a .CLAUDE.md file for the claude client', () => {
    // When
    installTemplate('nextjs', ['claude']);

    // Then
    const expectedPath = path.join(testDir, '.CLAUDE.md');
    expect(fs.existsSync(expectedPath)).toBe(true);
    const content = fs.readFileSync(expectedPath, 'utf8');
    expect(content).toContain('Next.js');
  });

  it('should create a .cursor/rules/nextjs.mdc file and a mcp.json file for the cursor client', () => {
    // When
    installTemplate('nextjs', ['cursor']);

    // Then
    const expectedMdcPath = path.join(testDir, '.cursor', 'rules', 'nextjs.mdc');
    expect(fs.existsSync(expectedMdcPath)).toBe(true);

    const expectedMcpPath = path.join(testDir, '.cursor', 'mcp.json');
    expect(fs.existsSync(expectedMcpPath)).toBe(true);

    const mcpConfig = JSON.parse(fs.readFileSync(expectedMcpPath, 'utf8'));
    expect(mcpConfig.mcpServers).toBeDefined();
    expect(mcpConfig.mcpServers['rush-cms']).toBeDefined();
  });

  it('should create files for multiple clients', () => {
    // When
    installTemplate('inertia', ['claude', 'cursor']);

    // Then
    const expectedClaudePath = path.join(testDir, '.CLAUDE.md');
    expect(fs.existsSync(expectedClaudePath)).toBe(true);

    const expectedMdcPath = path.join(testDir, '.cursor', 'rules', 'inertia.mdc');
    expect(fs.existsSync(expectedMdcPath)).toBe(true);
  });

  it('should not overwrite existing files', () => {
    // Given
    const expectedPath = path.join(testDir, '.CLAUDE.md');
    const originalContent = 'Original content that should not be overwritten';
    fs.writeFileSync(expectedPath, originalContent);

    // When
    installTemplate('nextjs', ['claude']);

    // Then
    const content = fs.readFileSync(expectedPath, 'utf8');
    expect(content).toBe(originalContent);
  });
});
