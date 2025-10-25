# Publishing Guide

This guide explains how to publish the Carnil SDK packages to npm.

## Prerequisites

1. **npm Account**: You need an npm account with access to the `@carnil` organization
2. **Authentication**: Login to npm using `npm login`
3. **Organization Access**: Ensure you have publish access to the `@carnil` organization

## Publishing Process

### 1. Build All Packages

```bash
# Build all packages
pnpm build

# Or use the build script
node scripts/build-and-publish.js build
```

### 2. Publish Individual Packages

```bash
# Publish core package first (required by others)
npm run publish:core

# Publish provider packages
npm run publish:stripe
npm run publish:razorpay

# Publish framework integrations
npm run publish:react
npm run publish:next
npm run publish:adapters

# Publish advanced features
npm run publish:analytics
npm run publish:pricing-editor
npm run publish:webhooks
npm run publish:compliance
npm run publish:globalization
```

### 3. Publish All Packages at Once

```bash
# Publish all packages in the correct order
npm run publish:all
```

## Publishing Order

Packages must be published in the following order due to dependencies:

1. `@carnil/core` (no dependencies on other @carnil packages)
2. All other packages (depend on @carnil/core)

## Version Management

### Using Changesets (Recommended)

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version-packages

# Publish packages
pnpm release
```

### Manual Versioning

```bash
# Update version in package.json files
# Then publish
npm run publish:all
```

## Verification

After publishing, verify packages are available:

```bash
# Check if packages exist
npm view @carnil/core
npm view @carnil/stripe
npm view @carnil/react

# Test installation
npm install @carnil/core @carnil/stripe @carnil/react
```

## Troubleshooting

### Package Already Exists

If you get "Package already exists" error:

1. Check if the package is already published: `npm view @carnil/package-name`
2. If it exists, either:
   - Update the version number
   - Use `npm unpublish` to remove the existing package (if it's recent)

### Authentication Issues

```bash
# Login to npm
npm login

# Check authentication
npm whoami

# Set organization access
npm access grant @carnil:readwrite @your-username
```

### Build Issues

```bash
# Clean and rebuild
pnpm clean
pnpm build

# Check for TypeScript errors
pnpm type-check

# Run tests
pnpm test
```

## CI/CD Integration

For automated publishing, you can use GitHub Actions:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm run publish:all
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Package Information

| Package | Description | Dependencies |
|---------|-------------|--------------|
| `@carnil/core` | Core SDK | None |
| `@carnil/stripe` | Stripe provider | `@carnil/core`, `stripe` |
| `@carnil/razorpay` | Razorpay provider | `@carnil/core`, `razorpay` |
| `@carnil/react` | React integration | `@carnil/core`, `react` |
| `@carnil/next` | Next.js integration | `@carnil/core`, `next` |
| `@carnil/adapters` | Framework adapters | `@carnil/core` |
| `@carnil/analytics` | Analytics dashboard | `@carnil/core`, `react` |
| `@carnil/pricing-editor` | Pricing editor | `@carnil/core`, `react` |
| `@carnil/webhooks` | Webhook management | `@carnil/core`, `react` |
| `@carnil/compliance` | Compliance tools | `@carnil/core`, `react` |
| `@carnil/globalization` | Globalization | `@carnil/core`, `react` |

## Support

If you encounter issues with publishing:

1. Check the [npm documentation](https://docs.npmjs.com/)
2. Verify your npm authentication
3. Ensure you have the correct permissions for the `@carnil` organization
4. Check the package.json files for correct configuration
