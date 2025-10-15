import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkNodeVersion } from '../bin/utils/version-check.js';

describe('checkNodeVersion', () => {
  let originalVersion;

  beforeEach(() => {
    originalVersion = process.version;
  });

  afterEach(() => {
    // Restore original version
    Object.defineProperty(process, 'version', {
      value: originalVersion,
      writable: true,
    });
  });

  it('should return true when current version is higher than minimum', () => {
    Object.defineProperty(process, 'version', {
      value: 'v20.0.0',
      writable: true,
    });

    expect(checkNodeVersion('18.0.0')).toBe(true);
  });

  it('should return true when current version equals minimum', () => {
    Object.defineProperty(process, 'version', {
      value: 'v18.0.0',
      writable: true,
    });

    expect(checkNodeVersion('18.0.0')).toBe(true);
  });

  it('should return false when current version is lower than minimum', () => {
    Object.defineProperty(process, 'version', {
      value: 'v16.0.0',
      writable: true,
    });

    expect(checkNodeVersion('18.0.0')).toBe(false);
  });

  it('should handle patch version differences correctly', () => {
    Object.defineProperty(process, 'version', {
      value: 'v18.0.5',
      writable: true,
    });

    expect(checkNodeVersion('18.0.0')).toBe(true);
    expect(checkNodeVersion('18.0.10')).toBe(false);
  });

  it('should handle minor version differences correctly', () => {
    Object.defineProperty(process, 'version', {
      value: 'v18.5.0',
      writable: true,
    });

    expect(checkNodeVersion('18.0.0')).toBe(true);
    expect(checkNodeVersion('18.10.0')).toBe(false);
  });
});
