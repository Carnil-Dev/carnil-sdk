#!/bin/bash

# Carnil SDK Repository Structure Setup Script
# This script applies template configurations to extracted repositories

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORK_DIR="${WORK_DIR:-./migration-workspace}"
TEMPLATE_DIR="${TEMPLATE_DIR:-./migration-templates}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Carnil SDK Repository Setup Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if work directory exists
if [ ! -d "$WORK_DIR" ]; then
    echo -e "${RED}Error: Work directory not found: $WORK_DIR${NC}"
    echo -e "${YELLOW}Run migrate-repos.sh first to extract repositories${NC}"
    exit 1
fi

# Check if template directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
    echo -e "${RED}Error: Template directory not found: $TEMPLATE_DIR${NC}"
    exit 1
fi

cd "$WORK_DIR"

# Function to setup single-package repository (carnil-core)
setup_core_repo() {
    local REPO_NAME="carnil-core"

    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Setting up: ${REPO_NAME}${NC}"
    echo -e "${BLUE}========================================${NC}"

    if [ ! -d "$REPO_NAME" ]; then
        echo -e "${RED}Error: Repository not found: $REPO_NAME${NC}"
        return 1
    fi

    cd "$REPO_NAME"

    echo -e "${YELLOW}Copying template files...${NC}"

    # Copy root configuration files
    cp "../../${TEMPLATE_DIR}/carnil-core/package.json" ./
    cp "../../${TEMPLATE_DIR}/carnil-core/tsconfig.json" ./
    cp "../../${TEMPLATE_DIR}/carnil-core/.eslintrc.js" ./
    cp "../../${TEMPLATE_DIR}/carnil-core/.prettierrc.json" ./
    cp "../../${TEMPLATE_DIR}/carnil-core/tsup.config.ts" ./
    cp "../../${TEMPLATE_DIR}/carnil-core/vitest.config.ts" ./
    cp "../../${TEMPLATE_DIR}/carnil-core/.gitignore" ./

    # Copy GitHub workflows
    mkdir -p .github/workflows
    cp "../../${TEMPLATE_DIR}/carnil-core/.github/workflows/ci.yml" .github/workflows/
    cp "../../${TEMPLATE_DIR}/carnil-core/.github/workflows/publish.yml" .github/workflows/

    # Copy Changesets config
    mkdir -p .changeset
    cp "../../${TEMPLATE_DIR}/carnil-core/.changeset/config.json" .changeset/

    echo -e "${GREEN}✓ Template files copied for ${REPO_NAME}${NC}"
    echo -e "${YELLOW}Installing dependencies...${NC}"

    pnpm install || echo -e "${RED}Failed to install dependencies${NC}"

    echo -e "${GREEN}✓ ${REPO_NAME} setup complete${NC}"
    echo ""

    cd ..
}

# Function to setup multi-package repository
setup_multi_package_repo() {
    local REPO_NAME=$1
    local DESCRIPTION=$2

    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Setting up: ${REPO_NAME}${NC}"
    echo -e "${BLUE}========================================${NC}"

    if [ ! -d "$REPO_NAME" ]; then
        echo -e "${RED}Error: Repository not found: $REPO_NAME${NC}"
        return 1
    fi

    cd "$REPO_NAME"

    echo -e "${YELLOW}Copying template files...${NC}"

    # Copy and customize root package.json
    cp "../../${TEMPLATE_DIR}/multi-package-template/package.json" ./

    # Update package.json with correct repo name and description
    if command -v sed &> /dev/null; then
        sed -i.bak "s/{REPO_NAME}/${REPO_NAME}/g" package.json
        sed -i.bak "s/{DESCRIPTION}/${DESCRIPTION}/g" package.json
        rm package.json.bak
    else
        echo -e "${YELLOW}Warning: sed not found. Update package.json manually.${NC}"
    fi

    # Copy other configuration files
    cp "../../${TEMPLATE_DIR}/multi-package-template/pnpm-workspace.yaml" ./
    cp "../../${TEMPLATE_DIR}/multi-package-template/turbo.json" ./
    cp "../../${TEMPLATE_DIR}/multi-package-template/tsconfig.json" ./
    cp "../../${TEMPLATE_DIR}/multi-package-template/.eslintrc.js" ./
    cp "../../${TEMPLATE_DIR}/multi-package-template/.prettierrc.json" ./
    cp "../../${TEMPLATE_DIR}/multi-package-template/.gitignore" ./

    # Copy GitHub workflows
    mkdir -p .github/workflows
    cp "../../${TEMPLATE_DIR}/multi-package-template/.github/workflows/ci.yml" .github/workflows/
    cp "../../${TEMPLATE_DIR}/multi-package-template/.github/workflows/publish.yml" .github/workflows/

    # Copy Changesets config
    mkdir -p .changeset
    cp "../../${TEMPLATE_DIR}/multi-package-template/.changeset/config.json" .changeset/

    # Update each package's dependencies to use NPM versions instead of workspace
    echo -e "${YELLOW}Updating package dependencies...${NC}"

    for pkg in packages/*; do
        if [ -f "$pkg/package.json" ]; then
            echo -e "${YELLOW}  Updating $pkg/package.json...${NC}"

            # Update workspace:* to version numbers
            if command -v node &> /dev/null; then
                node -e "
                const fs = require('fs');
                const path = '$pkg/package.json';
                const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));

                // Update dependencies
                if (pkg.dependencies) {
                    Object.keys(pkg.dependencies).forEach(dep => {
                        if (pkg.dependencies[dep] === 'workspace:*') {
                            pkg.dependencies[dep] = '^0.2.0';
                        }
                    });
                }

                fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
                "
            fi
        fi
    done

    echo -e "${GREEN}✓ Template files copied for ${REPO_NAME}${NC}"
    echo -e "${YELLOW}Installing dependencies...${NC}"

    pnpm install || echo -e "${RED}Failed to install dependencies${NC}"

    echo -e "${GREEN}✓ ${REPO_NAME} setup complete${NC}"
    echo ""

    cd ..
}

# Function to setup examples repository
setup_examples_repo() {
    local REPO_NAME="carnil-examples"

    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Setting up: ${REPO_NAME}${NC}"
    echo -e "${BLUE}========================================${NC}"

    if [ ! -d "$REPO_NAME" ]; then
        echo -e "${RED}Error: Repository not found: $REPO_NAME${NC}"
        return 1
    fi

    cd "$REPO_NAME"

    echo -e "${YELLOW}Copying template files...${NC}"

    # Copy root configuration files
    cp "../../${TEMPLATE_DIR}/carnil-examples/package.json" ./
    cp "../../${TEMPLATE_DIR}/carnil-examples/pnpm-workspace.yaml" ./
    cp "../../${TEMPLATE_DIR}/carnil-examples/.gitignore" ./
    cp "../../${TEMPLATE_DIR}/carnil-examples/README.md" ./

    echo -e "${YELLOW}Updating example dependencies...${NC}"

    # Update all example package.json files to use published NPM versions
    for example in basic-usage nextjs-app react-example saas-dashboard; do
        if [ -f "$example/package.json" ]; then
            echo -e "${YELLOW}  Updating $example/package.json...${NC}"

            if command -v node &> /dev/null; then
                node -e "
                const fs = require('fs');
                const path = '$example/package.json';
                if (!fs.existsSync(path)) process.exit(0);

                const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));

                // Update all @carnil/* dependencies from workspace:* to version
                ['dependencies', 'devDependencies'].forEach(depType => {
                    if (pkg[depType]) {
                        Object.keys(pkg[depType]).forEach(dep => {
                            if (dep.startsWith('@carnil/') && pkg[depType][dep] === 'workspace:*') {
                                pkg[depType][dep] = '^0.2.0';
                            }
                        });
                    }
                });

                fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
                "
            fi
        fi
    done

    echo -e "${GREEN}✓ Template files copied for ${REPO_NAME}${NC}"
    echo -e "${YELLOW}Installing dependencies...${NC}"

    pnpm install || echo -e "${RED}Failed to install dependencies${NC}"

    echo -e "${GREEN}✓ ${REPO_NAME} setup complete${NC}"
    echo ""

    cd ..
}

# ========================================
# Execute Setup
# ========================================

echo -e "${GREEN}Setting up all repositories...${NC}"
echo ""

# 1. Setup carnil-core
setup_core_repo

# 2. Setup carnil-providers
setup_multi_package_repo "carnil-providers" "Payment provider integrations for Carnil SDK"

# 3. Setup carnil-frameworks
setup_multi_package_repo "carnil-frameworks" "Framework integrations for Carnil SDK"

# 4. Setup carnil-features
setup_multi_package_repo "carnil-features" "Feature modules and UI components for Carnil SDK"

# 5. Setup carnil-examples
setup_examples_repo

# ========================================
# Summary
# ========================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}All repositories have been configured with:${NC}"
echo -e "  ✓ Shared configuration (@carnil/config)"
echo -e "  ✓ GitHub Actions workflows (CI/CD)"
echo -e "  ✓ Changesets for versioning"
echo -e "  ✓ Turbo for build orchestration (multi-package repos)"
echo -e "  ✓ Updated dependencies"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Review the configuration files in each repository"
echo -e "2. Make any necessary adjustments"
echo -e "3. Test build and test commands locally:"
echo -e "   cd ${WORK_DIR}/carnil-core && pnpm run build && pnpm run test"
echo -e "4. Commit changes and push to GitHub:"
echo -e "   cd ${WORK_DIR}/carnil-core"
echo -e "   git add ."
echo -e "   git commit -m \"chore: add repository configuration\""
echo -e "   git push -u origin main"
echo -e "5. Repeat for all repositories"
echo -e "6. Publish @carnil/config first, then other packages"
echo ""
echo -e "${GREEN}Done!${NC}"
