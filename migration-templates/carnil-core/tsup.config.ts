import { defineConfig } from 'tsup';
import baseConfig from '@carnil/config/tsup';

export default defineConfig({
  ...baseConfig,
  external: ['zod'],
});
