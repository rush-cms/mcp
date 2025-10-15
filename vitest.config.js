import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    mockReset: true,
    environment: 'node',
    unstubEnvs: true,
    unstubGlobals: true,
  },
});
