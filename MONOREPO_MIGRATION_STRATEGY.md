# Carnil SDK Monorepo Migration Strategy

## Overview

This document outlines the strategy for breaking the Carnil SDK monorepo into 6 independent GitHub repositories while preserving git history and maintaining coordinated releases.

## Target Repository Structure

### 1. **carnil-config** (New Shared Config Package)
- **Package**: `@carnil/config`
- **Purpose**: Shared tooling configurations
- **Contents**:
  - ESLint configuration
  - TypeScript configuration
  - Prettier configuration
  - tsup configuration presets
  - Vitest configuration
- **Published to**: NPM (public)

### 2. **carnil-core** (Single Package Repository)
- **Package**: `@carnil/core` (v0.2.0)
- **Dependencies**: `zod@^3.22.4`
- **Description**: Foundation SDK for unified payments platform
- **Structure**: Standard single-package repo

### 3. **carnil-providers** (Multi-Package Monorepo)
- **Workspace Type**: pnpm workspace
- **Packages**:
  - `@carnil/stripe` (v0.2.0) - depends on `@carnil/core`, `stripe@^14.0.0`
  - `@carnil/razorpay` (v0.2.0) - depends on `@carnil/core`, `razorpay@^2.9.2`
- **Description**: Payment provider integrations
- **Orchestration**: Turbo for builds

### 4. **carnil-frameworks** (Multi-Package Monorepo)
- **Workspace Type**: pnpm workspace
- **Packages**:
  - `@carnil/react` (v0.2.0) - React components
  - `@carnil/next` (v0.2.0) - Next.js integration
  - `@carnil/adapters` (v0.2.0) - Server framework adapters
- **Description**: Framework integrations for Carnil SDK
- **Orchestration**: Turbo for builds

### 5. **carnil-features** (Multi-Package Monorepo)
- **Workspace Type**: pnpm workspace
- **Packages**:
  - `@carnil/webhooks` (v0.2.0)
  - `@carnil/analytics` (v0.2.0)
  - `@carnil/pricing-editor` (v0.2.0)
  - `@carnil/compliance` (v0.2.0)
  - `@carnil/globalization` (v0.2.0)
- **Description**: Feature modules and UI components
- **Orchestration**: Turbo for builds

### 6. **carnil-examples**
- **Type**: Example applications repository (not published)
- **Contents**:
  - `basic-usage/`
  - `nextjs-app/`
  - `react-example/`
  - `saas-dashboard/`
- **Description**: Reference implementations and usage examples

---

## Migration Phases

### Phase 1: Preparation (Setup)

#### 1.1 Create Shared Config Package Structure
```bash
# Will be created in a new repository
mkdir -p carnil-config/src
mkdir -p carnil-config/configs
```

**Files to include**:
- `package.json` - Define `@carnil/config` package
- `configs/eslint.js` - Exported ESLint config
- `configs/tsconfig.base.json` - Base TypeScript config
- `configs/prettier.json` - Prettier config
- `configs/tsup.config.ts` - tsup presets
- `configs/vitest.config.ts` - Vitest configuration
- `README.md` - Documentation for usage

#### 1.2 Prepare Git Filter Commands
Create scripts to extract history for each package group using `git filter-repo` (recommended over filter-branch).

**Install git-filter-repo**:
```bash
brew install git-filter-repo  # macOS
# or
pip install git-filter-repo
```

### Phase 2: Repository Creation and History Extraction

#### 2.1 Create GitHub Repositories
Create the following repositories on GitHub:
1. `carnil-config`
2. `carnil-core`
3. `carnil-providers`
4. `carnil-frameworks`
5. `carnil-features`
6. `carnil-examples`

#### 2.2 Extract Package Histories

For each repository, clone the original monorepo and filter the history:

**Example for carnil-core**:
```bash
# Clone fresh copy of monorepo
git clone https://github.com/YOUR_ORG/carnil.git carnil-core
cd carnil-core

# Extract only the core package history
git filter-repo --path packages/core/ --path-rename packages/core/:

# Add new remote and push
git remote add origin https://github.com/YOUR_ORG/carnil-core.git
git push -u origin main
```

**Example for carnil-providers** (multi-package):
```bash
git clone https://github.com/YOUR_ORG/carnil.git carnil-providers
cd carnil-providers

# Extract both provider packages
git filter-repo \
  --path packages/stripe/ \
  --path packages/razorpay/ \
  --path-rename packages/:packages/

git remote add origin https://github.com/YOUR_ORG/carnil-providers.git
git push -u origin main
```

Repeat similar process for:
- **carnil-frameworks**: Extract `packages/react/`, `packages/next/`, `packages/adapters/`
- **carnil-features**: Extract all 5 feature module packages
- **carnil-examples**: Extract `examples/` directory

### Phase 3: Repository Structure Setup

#### 3.1 carnil-config Repository Structure
```
carnil-config/
├── package.json
├── README.md
├── configs/
│   ├── eslint.js
│   ├── tsconfig.base.json
│   ├── prettier.json
│   └── vitest.config.ts
├── tsconfig.json
└── .github/
    └── workflows/
        └── publish.yml
```

**package.json**:
```json
{
  "name": "@carnil/config",
  "version": "1.0.0",
  "description": "Shared configuration for Carnil SDK packages",
  "main": "configs/index.js",
  "files": ["configs"],
  "exports": {
    "./eslint": "./configs/eslint.js",
    "./typescript": "./configs/tsconfig.base.json",
    "./prettier": "./configs/prettier.json",
    "./vitest": "./configs/vitest.config.ts"
  },
  "keywords": ["carnil", "config"],
  "license": "MIT",
  "peerDependencies": {
    "eslint": "^8.54.0",
    "typescript": "^5.3.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.0"
  }
}
```

#### 3.2 carnil-core Repository Structure (Single Package)
```
carnil-core/
├── src/
│   └── index.ts
├── tests/
├── package.json
├── tsconfig.json (extends @carnil/config/typescript)
├── tsup.config.ts
├── vitest.config.ts (extends @carnil/config/vitest)
├── .eslintrc.js (extends @carnil/config/eslint)
├── .prettierrc.json (extends @carnil/config/prettier)
├── README.md
├── LICENSE
├── .changeset/
│   └── config.json
└── .github/
    └── workflows/
        ├── ci.yml (test + build on PRs)
        └── publish.yml (publish to npm)
```

**Root package.json dependencies**:
```json
{
  "name": "@carnil/core",
  "version": "0.2.0",
  "devDependencies": {
    "@carnil/config": "^1.0.0",
    "@changesets/cli": "^2.27.1",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  },
  "dependencies": {
    "zod": "^3.22.4"
  }
}
```

#### 3.3 Multi-Package Repositories (carnil-providers, carnil-frameworks, carnil-features)

**Common Structure**:
```
carnil-{NAME}/
├── packages/
│   ├── {package-1}/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   └── {package-2}/
│       └── ... (same structure)
├── pnpm-workspace.yaml
├── turbo.json
├── package.json (root with shared devDependencies)
├── tsconfig.json (extends @carnil/config/typescript)
├── .eslintrc.js (extends @carnil/config/eslint)
├── .prettierrc.json
├── .changeset/
│   └── config.json
└── .github/
    └── workflows/
        ├── ci.yml
        └── publish.yml
```

**Root package.json for multi-package repos**:
```json
{
  "name": "carnil-providers",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm run build && changeset publish"
  },
  "devDependencies": {
    "@carnil/config": "^1.0.0",
    "@changesets/cli": "^2.27.1",
    "@types/node": "^20.10.0",
    "tsup": "^8.0.0",
    "turbo": "^2.5.8",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  },
  "packageManager": "pnpm@8.12.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

**pnpm-workspace.yaml**:
```yaml
packages:
  - 'packages/*'
```

#### 3.4 carnil-examples Repository
```
carnil-examples/
├── basic-usage/
├── nextjs-app/
├── react-example/
├── saas-dashboard/
├── README.md
└── package.json (private, workspace root)
```

### Phase 4: Dependency Updates

#### 4.1 Update Package Dependencies

All packages that previously depended on `@carnil/*` via workspace protocol need to change to NPM versions:

**Before (workspace)**:
```json
{
  "dependencies": {
    "@carnil/core": "workspace:*"
  }
}
```

**After (npm)**:
```json
{
  "dependencies": {
    "@carnil/core": "^0.2.0"
  }
}
```

#### 4.2 Dependency Update Matrix

| Repository | External Dependencies | Carnil Dependencies |
|------------|----------------------|---------------------|
| carnil-config | None | None |
| carnil-core | `zod` | None |
| carnil-providers | `stripe`, `razorpay` | `@carnil/core@^0.2.0` |
| carnil-frameworks | Framework peer deps | `@carnil/core@^0.2.0` |
| carnil-features | UI library peer deps | `@carnil/core@^0.2.0` |
| carnil-examples | All SDK packages | Latest published versions |

### Phase 5: CI/CD Workflows

#### 5.1 Shared Workflow Template

Each repository needs two workflows:

**`.github/workflows/ci.yml`** - Run on PRs:
```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.12.0

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm run test

      - name: Run build
        run: pnpm run build

      - name: Run linting
        run: pnpm run lint

      - name: Type check
        run: pnpm run type-check
```

**`.github/workflows/publish.yml`** - Run on push to main:
```yaml
name: Publish

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.12.0

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm run release
          version: pnpm run version-packages
          commit: 'chore: version packages'
          title: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Phase 6: Version Coordination Strategy

#### 6.1 Independent Versioning with Changesets

Each repository uses Changesets for versioning:

**.changeset/config.json** (per repo):
```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

#### 6.2 Coordinated Release Process

1. **Core Changes**: Release `@carnil/core` first
2. **Dependent Packages**: Update version ranges in dependent repos
3. **Create Changesets**: In each affected repo
4. **Merge PRs**: Changesets creates version PRs
5. **Publish**: Automated via GitHub Actions

---

## Migration Execution Plan

### Step-by-Step Execution

#### Step 1: Backup and Preparation
```bash
# Create full backup of current repo
git clone --mirror https://github.com/YOUR_ORG/carnil.git carnil-backup.git

# Archive current state
tar -czf carnil-monorepo-backup-$(date +%Y%m%d).tar.gz carnil/
```

#### Step 2: Create carnil-config (First)
1. Create new GitHub repo: `carnil-config`
2. Initialize with extracted configs from monorepo
3. Publish `@carnil/config@1.0.0` to NPM
4. Verify installation works

#### Step 3: Create carnil-core (Second)
1. Create new GitHub repo: `carnil-core`
2. Clone monorepo and extract history:
   ```bash
   git clone https://github.com/YOUR_ORG/carnil.git carnil-core
   cd carnil-core
   git filter-repo --path packages/core/ --path-rename packages/core/:
   ```
3. Update structure with new configs
4. Add `@carnil/config` as devDependency
5. Set up workflows
6. Test build and publish
7. Push to new remote

#### Step 4: Create carnil-providers
1. Create new GitHub repo: `carnil-providers`
2. Clone and extract stripe + razorpay packages
3. Set up pnpm workspace structure
4. Update dependencies to use `@carnil/core` from NPM
5. Configure Turbo + Changesets
6. Set up workflows
7. Test and push

#### Step 5: Create carnil-frameworks
1. Create new GitHub repo: `carnil-frameworks`
2. Extract react, next, adapters packages
3. Set up pnpm workspace structure
4. Update dependencies
5. Configure tooling
6. Set up workflows
7. Test and push

#### Step 6: Create carnil-features
1. Create new GitHub repo: `carnil-features`
2. Extract all 5 feature packages
3. Set up pnpm workspace structure
4. Update dependencies
5. Configure tooling
6. Set up workflows
7. Test and push

#### Step 7: Create carnil-examples
1. Create new GitHub repo: `carnil-examples`
2. Extract examples directory
3. Update all imports to use published NPM packages
4. Test each example application
5. Push to new remote

#### Step 8: Verification and Cleanup
1. Verify all packages published to NPM
2. Test installation in fresh projects
3. Verify CI/CD pipelines working
4. Update documentation and README files
5. Archive or deprecate original monorepo
6. Update organization documentation

---

## Post-Migration Maintenance

### Cross-Repository Updates

When making changes that span multiple repos:

1. **Create Issues**: Open issues in all affected repos
2. **Sequential PRs**: Start with core, then dependents
3. **Version Bumps**: Use Changesets to coordinate versions
4. **Documentation**: Update README files with new repo structure

### Dependency Management

**Update script for dependent repos**:
```bash
# In carnil-providers, carnil-frameworks, or carnil-features
pnpm update @carnil/core@latest
pnpm update @carnil/config@latest
```

### Documentation Updates

Update all documentation to reference new repository structure:
- Installation instructions
- Contribution guidelines
- Architecture diagrams
- API documentation

---

## Rollback Strategy

If issues arise during migration:

1. **Keep Original Repo**: Don't delete the monorepo until migration verified
2. **Version Pins**: Pin all package versions during migration
3. **Gradual Rollout**: Can maintain both monorepo and individual repos temporarily
4. **Deprecation Tags**: Mark old monorepo as deprecated in README

---

## Expected Benefits

1. **Independent Release Cycles**: Each repo can release on its own schedule
2. **Focused CI/CD**: Faster builds and tests per repo
3. **Clearer Ownership**: Teams can own specific repos
4. **Reduced Complexity**: Smaller, more focused repositories
5. **Better Permissions**: Fine-grained access control per repo
6. **Easier Onboarding**: Contributors can focus on specific repos

## Expected Challenges

1. **Cross-Repo Changes**: Changes spanning multiple repos require coordination
2. **Version Management**: Need to manage inter-package version compatibility
3. **Duplication**: Some config duplication (mitigated by @carnil/config)
4. **Discovery**: Harder to see full codebase at once
5. **Testing**: Integration testing across repos more complex

---

## Timeline Estimate

- **Phase 1 (Preparation)**: 1-2 days
- **Phase 2 (History Extraction)**: 1 day
- **Phase 3 (Structure Setup)**: 2-3 days
- **Phase 4 (Dependencies)**: 1 day
- **Phase 5 (CI/CD)**: 1-2 days
- **Phase 6 (Testing)**: 2-3 days
- **Total**: 8-12 days

---

## Success Criteria

- [ ] All 6 repositories created with proper history
- [ ] All packages published to NPM successfully
- [ ] CI/CD workflows running on all repos
- [ ] Examples working with published packages
- [ ] Documentation updated
- [ ] Original monorepo archived/deprecated
- [ ] Team trained on new workflow

---

## Resources

- **git-filter-repo**: https://github.com/newren/git-filter-repo
- **Changesets**: https://github.com/changesets/changesets
- **pnpm workspaces**: https://pnpm.io/workspaces
- **Turborepo**: https://turbo.build/repo/docs

---

## Next Steps

1. Review and approve this migration strategy
2. Schedule migration window
3. Notify team and stakeholders
4. Begin Phase 1 preparation
5. Execute migration plan
6. Monitor and iterate

