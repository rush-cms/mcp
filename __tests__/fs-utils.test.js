import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  ensureDirectoryExists,
  readJsonFile,
  writeJsonFile,
  writeFile,
  readFile,
  fileExists,
} from '../bin/utils/fs-utils.js';
import fs from 'fs';
import path from 'path';

describe('File System Utils', () => {
  const testDir = path.join(process.cwd(), '__test_fs_utils__');

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

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', () => {
      const dir = path.join(testDir, 'new-dir');
      expect(fs.existsSync(dir)).toBe(false);

      ensureDirectoryExists(dir);

      expect(fs.existsSync(dir)).toBe(true);
    });

    it('should create nested directories', () => {
      const dir = path.join(testDir, 'level1', 'level2', 'level3');

      ensureDirectoryExists(dir);

      expect(fs.existsSync(dir)).toBe(true);
    });

    it('should not throw if directory already exists', () => {
      const dir = path.join(testDir, 'existing-dir');
      fs.mkdirSync(dir);

      expect(() => ensureDirectoryExists(dir)).not.toThrow();
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', () => {
      const file = path.join(testDir, 'test.txt');
      fs.writeFileSync(file, 'content');

      expect(fileExists(file)).toBe(true);
    });

    it('should return false for non-existing file', () => {
      const file = path.join(testDir, 'nonexistent.txt');

      expect(fileExists(file)).toBe(false);
    });
  });

  describe('readFile', () => {
    it('should read file content', () => {
      const file = path.join(testDir, 'test.txt');
      const content = 'Hello World';
      fs.writeFileSync(file, content);

      expect(readFile(file)).toBe(content);
    });

    it('should throw error for non-existing file', () => {
      const file = path.join(testDir, 'nonexistent.txt');

      expect(() => readFile(file)).toThrow('File not found');
    });
  });

  describe('writeFile', () => {
    it('should write file content', () => {
      const file = path.join(testDir, 'test.txt');
      const content = 'Hello World';

      const result = writeFile(file, content);

      expect(result).toBe(true);
      expect(fs.readFileSync(file, 'utf8')).toBe(content);
    });

    it('should create parent directory if needed', () => {
      const file = path.join(testDir, 'nested', 'dir', 'test.txt');
      const content = 'Hello';

      writeFile(file, content);

      expect(fs.existsSync(file)).toBe(true);
      expect(fs.readFileSync(file, 'utf8')).toBe(content);
    });

    it('should not overwrite existing file by default', () => {
      const file = path.join(testDir, 'test.txt');
      fs.writeFileSync(file, 'Original');

      const result = writeFile(file, 'New Content');

      expect(result).toBe(false);
      expect(fs.readFileSync(file, 'utf8')).toBe('Original');
    });

    it('should overwrite when overwrite option is true', () => {
      const file = path.join(testDir, 'test.txt');
      fs.writeFileSync(file, 'Original');

      const result = writeFile(file, 'New Content', { overwrite: true });

      expect(result).toBe(true);
      expect(fs.readFileSync(file, 'utf8')).toBe('New Content');
    });
  });

  describe('readJsonFile', () => {
    it('should read and parse JSON file', () => {
      const file = path.join(testDir, 'test.json');
      const data = { name: 'Test', value: 123 };
      fs.writeFileSync(file, JSON.stringify(data));

      expect(readJsonFile(file)).toEqual(data);
    });

    it('should return default value for non-existing file', () => {
      const file = path.join(testDir, 'nonexistent.json');
      const defaultValue = { default: true };

      expect(readJsonFile(file, defaultValue)).toEqual(defaultValue);
    });

    it('should throw error for invalid JSON', () => {
      const file = path.join(testDir, 'invalid.json');
      fs.writeFileSync(file, 'not valid json');

      expect(() => readJsonFile(file)).toThrow('Failed to parse JSON');
    });
  });

  describe('writeJsonFile', () => {
    it('should write formatted JSON to file', () => {
      const file = path.join(testDir, 'test.json');
      const data = { name: 'Test', value: 123 };

      writeJsonFile(file, data);

      const content = fs.readFileSync(file, 'utf8');
      expect(JSON.parse(content)).toEqual(data);
      expect(content).toContain('\n'); // Should be formatted
    });

    it('should respect custom indentation', () => {
      const file = path.join(testDir, 'test.json');
      const data = { name: 'Test' };

      writeJsonFile(file, data, 4);

      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('    '); // 4 spaces
    });
  });
});
