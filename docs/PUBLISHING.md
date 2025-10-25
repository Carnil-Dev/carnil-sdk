# Publishing Guide

This guide explains how to publish packages from the Carnil monorepo to npm using automated GitHub Actions workflows.

## Overview

The Carnil SDK uses **Changesets** for version management and automated publishing. This ensures:

- Consistent versioning across all packages
- Automated changelog generation
- Safe publishing with proper dependency management
- npm provenance for security

## Setup Requirements

### 1. npm Automation Token

1. Go to [npmjs.com](https://npmjs.com) → Profile → **Access Tokens**
2. Click **Generate New Token** → **Automation**
3. Copy the token (starts with `npm_`)

### 2. GitHub Repository Secrets

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name**: `NPM_TOKEN`
   - **Value**: _(paste your npm automation token)_

## How It Works

### Automated Workflow

The publishing workflow (`.github/workflows/publish.yml`) runs on:

- **Push to `main` branch**: Creates version PRs when changesets are available
- **Manual trigger**: Can be run from GitHub Actions tab

### Publishing Process

1. **Add Changes**: Use `pnpm changeset` to document changes
2. **Commit & Push**: Push changes to `main` branch
3. **Version PR**: GitHub Actions creates a PR with version bumps
4. **Merge PR**: Merging the PR triggers automatic publishing to npm

## Making Changes

### 1. Add a Changeset

When you make changes that should be published:

```bash
pnpm changeset
```

This will:

- Show you which packages have changed
- Ask you to select which packages to include
- Ask for the type of change (major/minor/patch)
- Ask for a description of the changes
- Create a markdown file in `.changeset/`

### 2. Commit and Push

```bash
git add .
git commit -m "feat: add new payment method support"
git push origin main
```

### 3. Review and Merge Version PR

- GitHub Actions will create a PR titled "Version Packages"
- Review the changes and version bumps
- Merge the PR to trigger publishing

## Manual Publishing

### Using Changesets (Recommended)

```bash
# Add changes
pnpm changeset

# Version packages (updates package.json versions)
pnpm run version-packages

# Publish to npm
pnpm run release
```

### Individual Package Publishing

You can also publish individual packages:

```bash
# Publish all packages
pnpm run publish:all

# Publish specific packages
pnpm run publish:core
pnpm run publish:stripe
pnpm run publish:react
# ... etc
```

## Package Configuration

All packages in the monorepo are configured with:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

This ensures packages are published as public on npm.

## Workflow Details

### GitHub Actions Workflow

The workflow (`.github/workflows/publish.yml`) includes:

1. **Checkout**: Gets the latest code
2. **Setup Node.js**: Uses Node.js 20 with npm registry
3. **Install pnpm**: Uses pnpm for package management
4. **Install Dependencies**: `pnpm install --frozen-lockfile`
5. **Build**: `pnpm run build`
6. **Test**: `pnpm run test`
7. **Changesets Action**: Handles versioning and publishing

### Security Features

- **npm Provenance**: All packages include provenance information
- **Automation Token**: Uses npm automation token (bypasses 2FA)
- **Proper Permissions**: Limited GitHub token permissions

## Troubleshooting

### Common Issues

1. **Version Already Exists**: If a version already exists on npm, the workflow will skip publishing
2. **Build Failures**: Check that all packages build successfully before pushing
3. **Test Failures**: Ensure all tests pass before publishing

### Debugging

- Check GitHub Actions logs for detailed error messages
- Verify `NPM_TOKEN` secret is correctly set
- Ensure all packages have proper `publishConfig`

## Best Practices

1. **Always use changesets** for version management
2. **Test locally** before pushing changes
3. **Review version PRs** carefully before merging
4. **Keep changesets descriptive** for better changelogs
5. **Don't manually edit** package.json versions

## Package Structure

The monorepo includes these packages:

- `@carnil/core` - Core SDK functionality
- `@carnil/stripe` - Stripe provider
- `@carnil/razorpay` - Razorpay provider
- `@carnil/react` - React hooks and components
- `@carnil/next` - Next.js integration
- `@carnil/adapters` - Framework adapters
- `@carnil/analytics` - Analytics and metrics
- `@carnil/compliance` - Compliance and audit tools
- `@carnil/globalization` - Internationalization
- `@carnil/pricing-editor` - Pricing management
- `@carnil/webhooks` - Webhook handling

All packages are published independently and can be installed separately.
