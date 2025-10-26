# Carnil SDK Monorepo Migration Guide

Complete guide and tooling for migrating the Carnil SDK from a monorepo to individual GitHub repositories.

## Overview

This migration breaks the Carnil SDK monorepo into **6 separate GitHub repositories** while preserving git history and maintaining coordinated releases.

### Target Structure

| Repository | Type | Packages | Description |
|------------|------|----------|-------------|
| **carnil-config** | Single | `@carnil/config` | Shared tooling configuration |
| **carnil-core** | Single | `@carnil/core` | Foundation SDK |
| **carnil-providers** | Multi | `@carnil/stripe`, `@carnil/razorpay` | Payment integrations |
| **carnil-frameworks** | Multi | `@carnil/react`, `@carnil/next`, `@carnil/adapters` | Framework integrations |
| **carnil-features** | Multi | `@carnil/webhooks`, `@carnil/analytics`, `@carnil/pricing-editor`, `@carnil/compliance`, `@carnil/globalization` | Feature modules |
| **carnil-examples** | Multi | - | Example applications |

---

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- git-filter-repo (for history extraction)

Install git-filter-repo:
```bash
# macOS
brew install git-filter-repo

# or via pip
pip install git-filter-repo
```

### Step 1: Review the Migration Strategy

Read the comprehensive strategy document:
```bash
cat MONOREPO_MIGRATION_STRATEGY.md
```

### Step 2: Create GitHub Repositories

Create these 6 repositories on GitHub:
1. `carnil-config`
2. `carnil-core`
3. `carnil-providers`
4. `carnil-frameworks`
5. `carnil-features`
6. `carnil-examples`

### Step 3: Configure the Scripts

Update the environment variables in the scripts:

```bash
# Edit scripts/migrate-repos.sh
export ORIGINAL_REPO_URL="https://github.com/YOUR_ORG/carnil.git"
export ORG_NAME="YOUR_ORG"
```

### Step 4: Extract Repository Histories

Run the migration script to extract package histories:

```bash
./scripts/migrate-repos.sh
```

This will create a `migration-workspace/` directory with 6 extracted repositories, each containing only the history relevant to that repository.

### Step 5: Apply Repository Templates

Apply the template configurations to each extracted repository:

```bash
./scripts/setup-repo-structure.sh
```

This will:
- Copy configuration files from templates
- Set up GitHub Actions workflows
- Configure Changesets for versioning
- Update dependencies to use NPM versions
- Install dependencies

### Step 6: Test Locally

Test each repository before pushing:

```bash
cd migration-workspace/carnil-core
pnpm run build
pnpm run test
pnpm run lint
```

Repeat for all repositories.

### Step 7: Push to GitHub

Push each repository to its new remote:

```bash
cd migration-workspace/carnil-core
git remote add origin https://github.com/YOUR_ORG/carnil-core.git
git push -u origin main
```

Repeat for all repositories.

### Step 8: Set Up NPM Tokens

In each GitHub repository, add the `NPM_TOKEN` secret:

1. Go to repository Settings → Secrets and variables → Actions
2. Add a new secret named `NPM_TOKEN`
3. Use your NPM automation token as the value

### Step 9: Publish Packages

Publish in this order:

1. **@carnil/config** (first):
   ```bash
   cd migration-workspace/carnil-config
   npm publish --access public
   ```

2. **@carnil/core** (second):
   ```bash
   cd migration-workspace/carnil-core
   pnpm changeset
   # Create a changeset
   git add .
   git commit -m "chore: initial release"
   git push
   # GitHub Actions will publish
   ```

3. **Dependent packages** (third):
   Repeat for `carnil-providers`, `carnil-frameworks`, `carnil-features`

### Step 10: Update Examples

Update the examples to use published packages:

```bash
cd migration-workspace/carnil-examples
# Dependencies already updated by setup script
pnpm install
pnpm run build:all
git add .
git commit -m "chore: use published packages"
git push
```

---

## File Structure

```
carnil/
├── MONOREPO_MIGRATION_STRATEGY.md    # Comprehensive migration strategy
├── DEPENDENCY_MANAGEMENT.md          # Inter-repo dependency management
├── MIGRATION_README.md               # This file - quick start guide
├── scripts/
│   ├── migrate-repos.sh              # Extract repository histories
│   └── setup-repo-structure.sh       # Apply templates to extracted repos
└── migration-templates/
    ├── carnil-config/                # Template for config package
    ├── carnil-core/                  # Template for core package
    ├── multi-package-template/       # Template for multi-package repos
    └── carnil-examples/              # Template for examples repo
```

---

## Migration Scripts

### migrate-repos.sh

Extracts package histories using git-filter-repo.

**Usage**:
```bash
./scripts/migrate-repos.sh
```

**What it does**:
- Clones the original monorepo 6 times
- Extracts relevant package history for each repo
- Preserves full commit history
- Outputs to `migration-workspace/`

### setup-repo-structure.sh

Applies template configurations to extracted repositories.

**Usage**:
```bash
./scripts/setup-repo-structure.sh
```

**What it does**:
- Copies configuration files from templates
- Sets up GitHub Actions workflows
- Configures Changesets
- Updates package dependencies
- Installs dependencies
- Prepares repos for publishing

---

## Templates

### carnil-config

Single-package repository with shared configurations:
- ESLint config
- TypeScript config
- Prettier config
- Vitest config
- tsup config

### carnil-core

Single-package repository structure:
- Standard package.json
- GitHub Actions CI/CD
- Changesets configuration
- Testing setup

### multi-package-template

Template for multi-package monorepos (providers, frameworks, features):
- pnpm workspace configuration
- Turbo for build orchestration
- Changesets for coordinated releases
- GitHub Actions for CI/CD
- Shared dev dependencies

### carnil-examples

Examples repository structure:
- pnpm workspace for examples
- Updated dependencies to use published packages
- Development scripts

---

## Key Documents

### 1. MONOREPO_MIGRATION_STRATEGY.md

**Comprehensive migration strategy** covering:
- Target repository structure
- Phase-by-phase migration plan
- Repository structure details
- CI/CD workflows
- Version coordination
- Step-by-step execution
- Rollback strategy
- Timeline estimates

**Read this first** for complete understanding.

### 2. DEPENDENCY_MANAGEMENT.md

**Inter-repository dependency management** covering:
- Versioning strategy
- Dependency declaration
- Release process
- Handling cross-repo changes
- Breaking changes protocol
- Version compatibility matrix
- Testing strategies
- Best practices

**Essential for post-migration maintenance**.

### 3. MIGRATION_README.md (This File)

**Quick start guide** for executing the migration.

---

## Testing the Migration

### Pre-Migration Checklist

- [ ] Backup the original repository
- [ ] Review migration strategy
- [ ] Create all 6 GitHub repositories
- [ ] Set up NPM account and tokens
- [ ] Install required tools (git-filter-repo)
- [ ] Update script configuration

### Post-Migration Checklist

- [ ] All repositories pushed to GitHub
- [ ] GitHub Actions workflows running successfully
- [ ] NPM tokens configured in GitHub secrets
- [ ] @carnil/config published to NPM
- [ ] @carnil/core published to NPM
- [ ] All other packages published to NPM
- [ ] Examples updated and working
- [ ] Documentation updated
- [ ] Version compatibility matrix created
- [ ] Team notified and trained

### Testing Each Repository

For each repository:

```bash
cd migration-workspace/[repo-name]

# Install dependencies
pnpm install

# Run linting
pnpm run lint

# Run type checking
pnpm run type-check

# Run tests
pnpm run test

# Run build
pnpm run build

# Verify build output
ls -la dist/
```

---

## Rollback Plan

If issues arise:

1. **Keep Original Repo**: Don't delete the monorepo until migration is verified
2. **Test Thoroughly**: Verify all packages work before deprecating monorepo
3. **Gradual Transition**: Can maintain both monorepo and individual repos temporarily
4. **Document Issues**: Track any problems in a migration issues document

---

## Common Issues and Solutions

### Issue: git-filter-repo Not Found

**Solution**:
```bash
# Install via Homebrew (macOS)
brew install git-filter-repo

# Or via pip
pip install git-filter-repo
```

### Issue: Permission Denied on Scripts

**Solution**:
```bash
chmod +x scripts/migrate-repos.sh
chmod +x scripts/setup-repo-structure.sh
```

### Issue: NPM Publish Fails

**Solution**:
- Verify NPM token is valid
- Check package.json has `"publishConfig": { "access": "public" }`
- Ensure package name is available on NPM
- Verify you're logged in: `npm whoami`

### Issue: Build Fails After Migration

**Solution**:
```bash
# Clear caches
rm -rf node_modules
pnpm store prune

# Reinstall
pnpm install

# Rebuild
pnpm run build
```

### Issue: Workspace Dependencies Not Resolved

**Solution**:
- Verify pnpm-workspace.yaml is present
- Check package.json dependencies use `^0.2.0` not `workspace:*`
- Run `pnpm install` at repo root

---

## Timeline

Expected timeline for complete migration:

| Phase | Tasks | Duration |
|-------|-------|----------|
| Preparation | Review docs, create repos, install tools | 1-2 days |
| Extraction | Run migration scripts, extract histories | 1 day |
| Configuration | Apply templates, test locally | 2-3 days |
| Publishing | Publish packages in order | 1 day |
| Verification | Test all packages, update examples | 2-3 days |
| Documentation | Update docs, create guides | 1 day |
| **Total** | | **8-12 days** |

---

## Support

For issues or questions:

1. Review the detailed strategy: `MONOREPO_MIGRATION_STRATEGY.md`
2. Check dependency management guide: `DEPENDENCY_MANAGEMENT.md`
3. Open an issue in the appropriate repository
4. Contact the team

---

## Success Criteria

Migration is successful when:

- ✅ All 6 repositories created with proper history
- ✅ All packages published to NPM successfully
- ✅ CI/CD workflows running on all repos
- ✅ Examples working with published packages
- ✅ Documentation updated in all repos
- ✅ Original monorepo archived/deprecated
- ✅ Team trained on new workflow
- ✅ Version compatibility matrix maintained

---

## Next Steps After Migration

1. **Set Up Automated Updates**:
   - Configure Renovate or Dependabot
   - Automate dependency updates

2. **Create Integration Tests**:
   - Cross-repository integration testing
   - Automated compatibility checks

3. **Establish Release Process**:
   - Document release procedures
   - Set up release schedule
   - Create release checklist

4. **Monitor and Maintain**:
   - Regular dependency audits
   - Security updates
   - Performance monitoring

5. **Team Training**:
   - Onboard team to new structure
   - Document workflows
   - Create contribution guides

---

## References

- [Semantic Versioning](https://semver.org/)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo/docs)
- [git-filter-repo](https://github.com/newren/git-filter-repo)

---

## License

MIT - Same as original Carnil SDK
