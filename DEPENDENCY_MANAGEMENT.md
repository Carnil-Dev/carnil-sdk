# Carnil SDK Dependency Management Strategy

## Overview

After breaking the Carnil SDK monorepo into separate repositories, managing dependencies between packages becomes crucial. This document outlines the strategy for managing inter-repository dependencies, versioning, and coordinated releases.

## Repository Structure

### 6 Separate Repositories

1. **carnil-config** - `@carnil/config` (Shared configuration)
2. **carnil-core** - `@carnil/core` (Foundation SDK)
3. **carnil-providers** - `@carnil/stripe`, `@carnil/razorpay` (Multi-package)
4. **carnil-frameworks** - `@carnil/react`, `@carnil/next`, `@carnil/adapters` (Multi-package)
5. **carnil-features** - `@carnil/webhooks`, `@carnil/analytics`, `@carnil/pricing-editor`, `@carnil/compliance`, `@carnil/globalization` (Multi-package)
6. **carnil-examples** - Example applications (Not published)

## Dependency Graph

```
@carnil/config (devDependency for all)
    ↓
@carnil/core (foundation)
    ↓
    ├─→ @carnil/stripe
    ├─→ @carnil/razorpay
    ├─→ @carnil/react
    ├─→ @carnil/next
    ├─→ @carnil/adapters
    ├─→ @carnil/webhooks
    ├─→ @carnil/analytics
    ├─→ @carnil/pricing-editor
    ├─→ @carnil/compliance
    └─→ @carnil/globalization
```

All packages depend on `@carnil/core`, which is the foundation. No circular dependencies exist.

---

## Versioning Strategy

### Independent Versioning with Semantic Versioning

Each repository maintains independent versions following [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward-compatible)
- **PATCH**: Bug fixes (backward-compatible)

### Version Coordination

#### Scenario 1: Breaking Change in @carnil/core

When `@carnil/core` has a breaking change:

1. **Update @carnil/core**:
   ```bash
   cd carnil-core
   pnpm changeset
   # Select "major" version bump
   # Commit and merge
   # New version: 1.0.0
   ```

2. **Update Dependent Packages**:
   For each dependent repository (providers, frameworks, features):

   ```bash
   cd carnil-providers
   # Update package.json in each package
   pnpm add @carnil/core@^1.0.0 --filter @carnil/stripe
   pnpm add @carnil/core@^1.0.0 --filter @carnil/razorpay

   # Test changes
   pnpm run build
   pnpm run test

   # Create changeset
   pnpm changeset
   # Select appropriate version bump based on impact
   ```

3. **Communication**:
   - Create GitHub issue in each dependent repo
   - Document migration guide for breaking changes
   - Update CHANGELOG

#### Scenario 2: New Feature in @carnil/core

When `@carnil/core` adds a non-breaking feature:

1. **Update @carnil/core**:
   ```bash
   cd carnil-core
   pnpm changeset
   # Select "minor" version bump
   # New version: 0.3.0
   ```

2. **Dependent Packages**:
   - No immediate action required
   - Can update to use new features when needed
   - Use caret range (^) allows automatic minor updates

#### Scenario 3: Bug Fix in Any Package

1. **Fix the Bug**:
   ```bash
   cd carnil-[repo]
   # Make the fix
   pnpm run test
   pnpm changeset
   # Select "patch" version bump
   ```

2. **Publish**:
   - Merge to main
   - Automated publish via GitHub Actions

---

## Dependency Declaration

### Using Version Ranges

#### Recommended: Caret Range (^)

```json
{
  "dependencies": {
    "@carnil/core": "^0.2.0"
  }
}
```

- **Allows**: 0.2.0, 0.2.1, 0.2.2, 0.3.0, etc.
- **Blocks**: 1.0.0 (major version)
- **Best for**: Most packages, allows automatic minor/patch updates

#### Alternative: Tilde Range (~)

```json
{
  "dependencies": {
    "@carnil/core": "~0.2.0"
  }
}
```

- **Allows**: 0.2.0, 0.2.1, 0.2.2
- **Blocks**: 0.3.0
- **Best for**: Stricter control, only patch updates

#### Not Recommended: Exact Version

```json
{
  "dependencies": {
    "@carnil/core": "0.2.0"
  }
}
```

- **Allows**: Only 0.2.0
- **Use only**: For critical stability (rare cases)

---

## Release Process

### 1. Publishing @carnil/config (First)

Since all repos depend on it as devDependency:

```bash
cd carnil-config
pnpm install
pnpm build  # If applicable
npm publish --access public
```

### 2. Publishing @carnil/core (Second)

Foundation for all other packages:

```bash
cd carnil-core
pnpm changeset add
# Describe changes
pnpm changeset version
# Updates version and CHANGELOG
git add .
git commit -m "chore: version package"
git push

# Merge PR or push to main
# GitHub Actions will automatically publish
```

### 3. Publishing Dependent Packages (Third)

For multi-package repos (providers, frameworks, features):

```bash
cd carnil-providers

# Update @carnil/core version if needed
pnpm update @carnil/core@latest --recursive

# Create changeset for each changed package
pnpm changeset add

# Version packages
pnpm changeset version

git add .
git commit -m "chore: version packages"
git push

# Merge PR
# GitHub Actions will publish
```

---

## Automated Workflows

### CI/CD Pipeline

Each repository has two workflows:

#### 1. CI Workflow (Pull Requests)

```yaml
# .github/workflows/ci.yml
on: pull_request

jobs:
  test:
    - Install dependencies
    - Run lint
    - Run type-check
    - Run tests
    - Run build
```

#### 2. Publish Workflow (Main Branch)

```yaml
# .github/workflows/publish.yml
on:
  push:
    branches: [main]

jobs:
  release:
    - Install dependencies
    - Build packages
    - Run Changesets
    - Publish to NPM
```

### Changesets Automation

Changesets handles:
- Version bumping based on changeset files
- CHANGELOG generation
- Git tagging
- NPM publishing
- Release PR creation

---

## Handling Cross-Repository Changes

### Scenario: Feature Spanning Multiple Repos

Example: Adding a new payment method requires changes to `core`, `providers`, and `examples`.

#### Step 1: Plan the Change

1. Create issues in each affected repo
2. Link issues together
3. Document the API contract

#### Step 2: Implement in Order

1. **@carnil/core**: Add new types/interfaces
   ```bash
   cd carnil-core
   # Implement changes
   pnpm changeset add  # minor bump
   ```

2. **@carnil/providers**: Add provider integration
   ```bash
   cd carnil-providers
   # Wait for @carnil/core to publish
   pnpm update @carnil/core@latest
   # Implement changes
   pnpm changeset add  # minor bump
   ```

3. **@carnil/examples**: Add example usage
   ```bash
   cd carnil-examples
   pnpm update @carnil/core@latest @carnil/stripe@latest
   # Update examples
   ```

#### Step 3: Coordinate Releases

1. Publish in dependency order: core → providers → examples
2. Create release notes documenting the feature across repos
3. Update documentation

---

## Dependency Update Strategies

### 1. Manual Updates (Recommended Initially)

```bash
# Update specific package
pnpm update @carnil/core@latest

# Update all @carnil packages
pnpm update "@carnil/*@latest"

# Update and verify
pnpm run build
pnpm run test
```

### 2. Automated Updates (Future)

Use Renovate or Dependabot:

```json
// renovate.json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackagePatterns": ["^@carnil/"],
      "groupName": "carnil packages",
      "automerge": true,
      "automergeType": "branch",
      "major": {
        "automerge": false
      }
    }
  ]
}
```

---

## Testing Inter-Package Changes

### Local Development with NPM Link

When developing across multiple repos:

```bash
# In @carnil/core
cd carnil-core
pnpm link --global

# In @carnil/stripe
cd carnil-providers
pnpm link --global @carnil/core

# Make changes in core
cd carnil-core
pnpm run build

# Test in stripe
cd carnil-providers
pnpm run build
pnpm run test
```

### Local Development with pnpm link (Better)

```bash
# In @carnil/core
cd carnil-core
pnpm link --global

# In @carnil/providers
cd carnil-providers
pnpm link --global @carnil/core

# Changes in core automatically reflected
```

### Integration Testing

Create integration test suite in examples:

```bash
cd carnil-examples
# Update to latest versions
pnpm update "@carnil/*@latest"

# Run full integration tests
pnpm run test:integration
```

---

## Breaking Changes Protocol

### Communication

When introducing breaking changes:

1. **Create Breaking Change Issue**:
   - Title: `[BREAKING] Description`
   - Label: `breaking-change`
   - List affected packages
   - Provide migration guide

2. **Update Documentation**:
   - CHANGELOG with migration steps
   - README with updated examples
   - API documentation

3. **Notify Stakeholders**:
   - GitHub discussions
   - Release notes
   - Email/Slack if applicable

### Migration Example

**@carnil/core v1.0.0 Breaking Change**:

```markdown
# Breaking Changes in @carnil/core v1.0.0

## Changed: Payment Method Interface

**Before**:
```typescript
interface PaymentMethod {
  type: string;
  details: any;
}
```

**After**:
```typescript
interface PaymentMethod {
  type: PaymentMethodType;
  details: Record<string, unknown>;
}
```

## Migration Guide

1. Update `@carnil/core` to v1.0.0
2. Replace `any` types with `Record<string, unknown>`
3. Use `PaymentMethodType` enum instead of strings

## Affected Packages

- @carnil/stripe - update to v1.0.0
- @carnil/razorpay - update to v1.0.0
- @carnil/react - update to v1.0.0
```

---

## Version Compatibility Matrix

Maintain a compatibility matrix:

| @carnil/core | @carnil/stripe | @carnil/razorpay | @carnil/react | @carnil/next |
|--------------|----------------|------------------|---------------|--------------|
| 0.2.x        | 0.2.x          | 0.2.x            | 0.2.x         | 0.2.x        |
| 1.0.x        | 1.0.x          | 1.0.x            | 1.0.x         | 1.0.x        |
| 1.1.x        | 1.0.x+         | 1.0.x+           | 1.1.x+        | 1.1.x+       |

Update this in main documentation repository.

---

## Monitoring and Maintenance

### Regular Dependency Audits

```bash
# Weekly/monthly routine
for repo in carnil-core carnil-providers carnil-frameworks carnil-features; do
  cd $repo
  pnpm audit
  pnpm outdated
  cd ..
done
```

### Deprecation Strategy

When deprecating a package or feature:

1. Add deprecation notice to README
2. Add deprecation warning in code
3. Update package.json:
   ```json
   {
     "deprecated": "This package is deprecated. Use @carnil/new-package instead."
   }
   ```
4. Maintain for 6 months with security patches only
5. Archive repository

---

## Best Practices

### DO:
✅ Use caret ranges (^) for dependencies
✅ Update dependencies regularly
✅ Test thoroughly before publishing
✅ Document breaking changes clearly
✅ Maintain CHANGELOG in each repo
✅ Use Changesets for versioning
✅ Publish in dependency order

### DON'T:
❌ Use exact versions unless absolutely necessary
❌ Make breaking changes in minor/patch versions
❌ Skip testing when updating dependencies
❌ Forget to update dependent repos after core changes
❌ Rush releases without proper testing
❌ Publish without changeset documentation

---

## Troubleshooting

### Issue: Version Mismatch

**Symptom**: Build errors, type errors after update

**Solution**:
```bash
# Clear all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Clear pnpm cache
pnpm store prune

# Reinstall
pnpm install

# Rebuild
pnpm run build
```

### Issue: Circular Dependency

**Symptom**: Install fails, dependency resolution errors

**Solution**:
- Review dependency graph
- Ensure no package depends on its dependent
- Extract shared code to @carnil/core

### Issue: Publish Fails

**Symptom**: NPM publish error, authentication failure

**Solution**:
```bash
# Verify NPM token
echo $NPM_TOKEN

# Test publish locally
npm publish --dry-run

# Check package.json publishConfig
{
  "publishConfig": {
    "access": "public"
  }
}
```

---

## Future Improvements

1. **Automated Dependency Updates**: Implement Renovate/Dependabot
2. **Integration Test Suite**: Cross-repo integration tests
3. **Release Dashboard**: Visualize versions and dependencies
4. **Automated Compatibility Checking**: CI checks for version compatibility
5. **Monorepo Tools**: Consider pnpm workspaces or Turborepo for local development

---

## Summary

- Each repository is independently versioned
- @carnil/core is the foundation - update first
- Use semantic versioning and Changesets
- Communicate breaking changes clearly
- Test thoroughly before publishing
- Maintain version compatibility matrix
- Automate where possible

For questions or issues, open a discussion in the carnil-core repository.
