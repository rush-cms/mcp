import { describe, it, expect } from 'vitest';
import {
  isValidTemplate,
  isValidClient,
  parseClientsList,
  createChoices,
} from '../bin/lib/cli-helpers.js';

describe('CLI Helpers', () => {
  describe('isValidTemplate', () => {
    it('should return true for valid template keys', () => {
      expect(isValidTemplate('nextjs')).toBe(true);
      expect(isValidTemplate('inertia')).toBe(true);
    });

    it('should return false for invalid template keys', () => {
      expect(isValidTemplate('invalid')).toBe(false);
      expect(isValidTemplate('')).toBe(false);
      expect(isValidTemplate(null)).toBe(false);
      expect(isValidTemplate(undefined)).toBe(false);
    });
  });

  describe('isValidClient', () => {
    it('should return true for valid client keys', () => {
      expect(isValidClient('claude')).toBe(true);
      expect(isValidClient('cursor')).toBe(true);
      expect(isValidClient('copilot')).toBe(true);
      expect(isValidClient('junie')).toBe(true);
      expect(isValidClient('codex')).toBe(true);
    });

    it('should return false for invalid client keys', () => {
      expect(isValidClient('invalid')).toBe(false);
      expect(isValidClient('')).toBe(false);
      expect(isValidClient(null)).toBe(false);
    });
  });

  describe('parseClientsList', () => {
    it('should parse comma-separated list correctly', () => {
      expect(parseClientsList('claude,cursor')).toEqual(['claude', 'cursor']);
      expect(parseClientsList('claude, cursor, copilot')).toEqual(['claude', 'cursor', 'copilot']);
    });

    it('should handle single client', () => {
      expect(parseClientsList('claude')).toEqual(['claude']);
    });

    it('should trim whitespace', () => {
      expect(parseClientsList(' claude , cursor ')).toEqual(['claude', 'cursor']);
    });

    it('should filter out empty strings', () => {
      expect(parseClientsList('claude,,cursor')).toEqual(['claude', 'cursor']);
      expect(parseClientsList('claude, , cursor')).toEqual(['claude', 'cursor']);
    });

    it('should handle empty input', () => {
      expect(parseClientsList('')).toEqual([]);
    });
  });

  describe('createChoices', () => {
    it('should create choices array from options object', () => {
      const options = {
        key1: { name: 'Option 1' },
        key2: { name: 'Option 2' },
      };

      const result = createChoices(options);

      expect(result).toEqual([
        { name: 'Option 1', value: 'key1' },
        { name: 'Option 2', value: 'key2' },
      ]);
    });

    it('should handle empty options', () => {
      expect(createChoices({})).toEqual([]);
    });
  });
});
