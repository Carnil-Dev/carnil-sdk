# 🚀 Carnil SDK Monorepo Migration

**Complete toolkit for migrating the Carnil SDK from a monorepo to 6 individual GitHub repositories.**

---

## 📚 Documentation

Start here based on what you need:

### 🎯 **Quick Start** → [`MIGRATION_README.md`](MIGRATION_README.md)
Step-by-step guide to execute the migration in ~10 days.
- Prerequisites and setup
- Script usage
- Testing procedures
- Publishing process

### 📊 **Visual Overview** → [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md)
Before/after comparison and key changes.
- Repository structure comparison
- Dependency flow diagram
- Benefits and challenges
- Quick reference commands

### 📖 **Detailed Strategy** → [`MONOREPO_MIGRATION_STRATEGY.md`](MONOREPO_MIGRATION_STRATEGY.md)
Comprehensive 8,000+ word migration strategy.
- Complete phase-by-phase plan
- Repository structures
- CI/CD setup
- Rollback strategy
- Timeline estimates

### 🔗 **Dependency Management** → [`DEPENDENCY_MANAGEMENT.md`](DEPENDENCY_MANAGEMENT.md)
Inter-repository dependency guide (6,000+ words).
- Versioning strategy
- Release coordination
- Breaking changes protocol
- Testing strategies
- Best practices

---

## 🎯 Migration at a Glance

### Current State: 1 Monorepo
```
carnil/
├── 11 packages in /packages
├── 4 examples in /examples
├── 1 GitHub Actions workflow
└── Coordinated releases (all v0.2.0)
```

### Target State: 6 Repositories
```
1. carnil-config     → @carnil/config (NEW)
2. carnil-core       → @carnil/core (1 package)
3. carnil-providers  → stripe, razorpay (2 packages)
4. carnil-frameworks → react, next, adapters (3 packages)
5. carnil-features   → 5 feature packages
6. carnil-examples   → 4 example apps
```

**Benefits**: Independent releases, faster CI/CD, clearer ownership, better permissions

---

## ⚡ Quick Start (5 Minutes)

### 1. Install Prerequisites
```bash
# Install git-filter-repo
brew install git-filter-repo  # macOS
# or
pip install git-filter-repo

# Verify installation
git-filter-repo --version
```

### 2. Configure Scripts
```bash
# Edit scripts/migrate-repos.sh
export ORIGINAL_REPO_URL="https://github.com/YOUR_ORG/carnil.git"
export ORG_NAME="YOUR_ORG"
```

### 3. Create GitHub Repositories
Create 6 empty repositories on GitHub:
- `carnil-config`
- `carnil-core`
- `carnil-providers`
- `carnil-frameworks`
- `carnil-features`
- `carnil-examples`

### 4. Run Migration
```bash
# Extract repository histories (~10 minutes)
./scripts/migrate-repos.sh

# Apply templates and setup (~5 minutes)
./scripts/setup-repo-structure.sh
```

### 5. Test and Publish
```bash
# Test each repository
cd migration-workspace/carnil-core
pnpm install && pnpm run build && pnpm run test

# Push to GitHub
git remote add origin https://github.com/YOUR_ORG/carnil-core.git
git push -u origin main

# Repeat for all 6 repositories
```

**Full guide**: See [`MIGRATION_README.md`](MIGRATION_README.md)

---

## 📦 What's Included

### 🛠️ Automated Scripts

#### [`scripts/migrate-repos.sh`](scripts/migrate-repos.sh)
Extracts package histories while preserving git history.
- Uses git-filter-repo for clean extraction
- Creates 6 separate repositories in `migration-workspace/`
- Preserves full commit history for each package

#### [`scripts/setup-repo-structure.sh`](scripts/setup-repo-structure.sh)
Applies templates and configurations to extracted repositories.
- Copies configuration files
- Sets up GitHub Actions workflows
- Configures Changesets for versioning
- Updates dependencies to NPM versions
- Installs dependencies

### 📁 Repository Templates

#### [`migration-templates/carnil-config/`](migration-templates/carnil-config/)
Template for the shared configuration package.
- ESLint, TypeScript, Prettier, Vitest, tsup configs
- Published as `@carnil/config@1.0.0`
- Used by all other repositories

#### [`migration-templates/carnil-core/`](migration-templates/carnil-core/)
Template for single-package repository structure.
- Standard package.json
- GitHub Actions CI/CD
- Changesets configuration

#### [`migration-templates/multi-package-template/`](migration-templates/multi-package-template/)
Template for multi-package monorepos (providers, frameworks, features).
- pnpm workspace + Turbo
- Changesets for coordinated releases
- GitHub Actions workflows

#### [`migration-templates/carnil-examples/`](migration-templates/carnil-examples/)
Template for examples repository.
- pnpm workspace setup
- Updated dependencies

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Read [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md) for overview
- [ ] Read [`MONOREPO_MIGRATION_STRATEGY.md`](MONOREPO_MIGRATION_STRATEGY.md) for details
- [ ] Backup original repository
- [ ] Install git-filter-repo
- [ ] Create 6 GitHub repositories
- [ ] Set up NPM account and tokens
- [ ] Update script configurations

### Migration Execution
- [ ] Run `migrate-repos.sh` to extract histories
- [ ] Run `setup-repo-structure.sh` to apply templates
- [ ] Test each repository locally
- [ ] Push to GitHub
- [ ] Set up NPM_TOKEN secrets in GitHub
- [ ] Publish @carnil/config first
- [ ] Publish @carnil/core second
- [ ] Publish dependent packages (providers, frameworks, features)
- [ ] Update and test examples

### Post-Migration
- [ ] Verify all packages on NPM
- [ ] Test installation in fresh projects
- [ ] Verify CI/CD workflows
- [ ] Update documentation
- [ ] Create version compatibility matrix
- [ ] Train team on new workflow
- [ ] Archive original monorepo

---

## 🎓 Understanding the Migration

### Repository Grouping Strategy

**Why 6 repositories?**
- **carnil-config**: Shared tooling (prevents duplication)
- **carnil-core**: Foundation with no dependencies
- **carnil-providers**: Payment integrations (logically grouped)
- **carnil-frameworks**: Framework adapters (logically grouped)
- **carnil-features**: Feature modules (UI components)
- **carnil-examples**: Reference implementations (not published)

### Dependency Flow
```
@carnil/config (devDep for all)
    ↓
@carnil/core (foundation)
    ↓
    ├─→ Providers (stripe, razorpay)
    ├─→ Frameworks (react, next, adapters)
    └─→ Features (webhooks, analytics, etc.)
        ↓
    Examples
```

### Version Management
- **Independent versioning**: Each repo has its own version
- **Semantic versioning**: MAJOR.MINOR.PATCH
- **Changesets**: Automated version management
- **Coordinated releases**: Within multi-package repos

---

## 📊 Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Preparation | 1-2 days | Review docs, create repos, install tools |
| Extraction | 1 day | Run migration scripts |
| Configuration | 2-3 days | Apply templates, test locally |
| Publishing | 1 day | Publish packages in order |
| Verification | 2-3 days | Test everything, update docs |
| **Total** | **8-12 days** | |

---

## 🆘 Troubleshooting

### git-filter-repo not found
```bash
brew install git-filter-repo  # macOS
pip install git-filter-repo   # Other systems
```

### Permission denied on scripts
```bash
chmod +x scripts/migrate-repos.sh
chmod +x scripts/setup-repo-structure.sh
```

### NPM publish fails
- Verify NPM token is valid
- Check `publishConfig.access` is "public"
- Ensure package name is available

### Build fails after migration
```bash
rm -rf node_modules
pnpm store prune
pnpm install
pnpm run build
```

**More solutions**: See [`MIGRATION_README.md`](MIGRATION_README.md#common-issues-and-solutions)

---

## 🎯 Success Criteria

Migration is successful when:
- ✅ All 6 repositories created with proper history
- ✅ All 12 packages published to NPM
- ✅ CI/CD workflows running on all repos
- ✅ Examples working with published packages
- ✅ Documentation updated
- ✅ Original monorepo archived
- ✅ Team trained on new workflow

---

## 📚 Additional Resources

- [Semantic Versioning](https://semver.org/)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo/docs)
- [git-filter-repo](https://github.com/newren/git-filter-repo)

---

## 🤝 Next Steps

1. **Start with the overview**: Read [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md)
2. **Understand the strategy**: Read [`MONOREPO_MIGRATION_STRATEGY.md`](MONOREPO_MIGRATION_STRATEGY.md)
3. **Execute the migration**: Follow [`MIGRATION_README.md`](MIGRATION_README.md)
4. **Manage dependencies**: Reference [`DEPENDENCY_MANAGEMENT.md`](DEPENDENCY_MANAGEMENT.md)

---

## 📝 License

MIT - Same as original Carnil SDK

---

**Ready to migrate?** Start with [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md) for a visual overview! 🚀
