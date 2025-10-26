# @carnil/config

Shared tooling configuration for all Carnil SDK packages.

## Installation

```bash
npm install --save-dev @carnil/config
# or
pnpm add -D @carnil/config
# or
yarn add -D @carnil/config
```

## Usage

### ESLint

Create `.eslintrc.js` in your project root:

```javascript
module.exports = {
  extends: [require.resolve('@carnil/config/eslint')],
  // Add project-specific overrides here
};
```

### TypeScript

Create `tsconfig.json` in your project root:

```json
{
  "extends": "@carnil/config/typescript",
  "compilerOptions": {
    // Project-specific overrides
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Prettier

Create `.prettierrc.json` in your project root:

```json
"@carnil/config/prettier"
```

Or extend it in your `.prettierrc.js`:

```javascript
module.exports = {
  ...require('@carnil/config/prettier'),
  // Add project-specific overrides
};
```

### Vitest

Create `vitest.config.ts` in your project root:

```typescript
import { defineConfig } from 'vitest/config';
import baseConfig from '@carnil/config/vitest';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    // Project-specific overrides
  },
});
```

### tsup

Create `tsup.config.ts` in your project root:

```typescript
import { defineConfig } from 'tsup';
import baseConfig from '@carnil/config/tsup';

export default defineConfig({
  ...baseConfig,
  // Project-specific overrides
});
```

## Peer Dependencies

This package requires the following peer dependencies:

- `eslint` ^8.54.0
- `typescript` ^5.3.0
- `prettier` ^3.1.0
- `vitest` ^1.0.0 (optional)
- `tsup` ^8.0.0 (optional)

## License

MIT
