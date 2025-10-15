import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getMcpContext } from '../bin/mcp-server.js';
import fs from 'fs';
import path from 'path';

describe('getMcpContext - Integration Tests', () => {
  const testDir = path.join(process.cwd(), '__test_mcp_output__');

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

  it('should return the content of the context file for a valid client and framework', () => {
    // Given
    const aiClient = 'cursor';
    const framework = 'nextjs';
    const templateContent = 'This is a test template for cursor';

    const cursorDir = path.join(testDir, '.cursor', 'rules');
    fs.mkdirSync(cursorDir, { recursive: true });
    fs.writeFileSync(path.join(cursorDir, `${framework}.mdc`), templateContent);

    // When
    const result = getMcpContext(aiClient, framework);

    // Then
    expect(result).toBe(templateContent);
  });

  it('should throw an error for an invalid client', () => {
    // Given
    const aiClient = 'invalid';
    const framework = 'nextjs';

    // When / Then
    expect(() => getMcpContext(aiClient, framework)).toThrow('Context file not found for invalid');
  });

  it('should throw an error when the framework is missing', () => {
    // Given
    const aiClient = 'cursor';

    // When / Then
    expect(() => getMcpContext(aiClient, undefined)).toThrow('AI client or framework name not provided.');
  });

  it('should throw an error when the context file does not exist', () => {
    // Given
    const aiClient = 'cursor';
    const framework = 'nonexistent';

    // When / Then
    expect(() => getMcpContext(aiClient, framework)).toThrow('Context file not found for cursor');
  });

  it('should return the content of the context file for junie client', () => {
    // Given
    const aiClient = 'junie';
    const framework = 'nextjs';
    const templateContent = 'This is a test template for junie';

    const junieDir = path.join(testDir, '.junie', 'guidelines');
    fs.mkdirSync(junieDir, { recursive: true });
    fs.writeFileSync(path.join(junieDir, `${framework}.md`), templateContent);

    // When
    const result = getMcpContext(aiClient, framework);

    // Then
    expect(result).toBe(templateContent);
  });
});
