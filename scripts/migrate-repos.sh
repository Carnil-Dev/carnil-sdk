#!/bin/bash

# Carnil SDK Repository Migration Script
# This script extracts package history and creates separate repositories

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ORIGINAL_REPO_URL="${ORIGINAL_REPO_URL:-https://github.com/YOUR_ORG/carnil.git}"
ORG_NAME="${ORG_NAME:-YOUR_ORG}"
WORK_DIR="${WORK_DIR:-./migration-workspace}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Carnil SDK Repository Migration Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if git-filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
    echo -e "${RED}Error: git-filter-repo is not installed${NC}"
    echo -e "${YELLOW}Install it with:${NC}"
    echo -e "  macOS: brew install git-filter-repo"
    echo -e "  pip: pip install git-filter-repo"
    exit 1
fi

# Create work directory
echo -e "${GREEN}Creating migration workspace...${NC}"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Function to extract repository history
extract_repo() {
    local REPO_NAME=$1
    local NEW_REPO_URL=$2
    shift 2
    local PATHS=("$@")

    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Extracting: ${REPO_NAME}${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Clone fresh copy
    echo -e "${YELLOW}Cloning original repository...${NC}"
    if [ -d "$REPO_NAME" ]; then
        echo -e "${YELLOW}Directory exists, removing...${NC}"
        rm -rf "$REPO_NAME"
    fi
    git clone "$ORIGINAL_REPO_URL" "$REPO_NAME"
    cd "$REPO_NAME"

    # Build git-filter-repo command
    echo -e "${YELLOW}Filtering repository history...${NC}"
    local FILTER_CMD="git filter-repo --force"

    for PATH_ARG in "${PATHS[@]}"; do
        FILTER_CMD="$FILTER_CMD $PATH_ARG"
    done

    echo -e "${YELLOW}Running: $FILTER_CMD${NC}"
    eval "$FILTER_CMD"

    # Remove old remote
    git remote remove origin || true

    echo -e "${GREEN}✓ History extracted for ${REPO_NAME}${NC}"
    echo -e "${YELLOW}To push to new repository, run:${NC}"
    echo -e "  cd $WORK_DIR/$REPO_NAME"
    echo -e "  git remote add origin $NEW_REPO_URL"
    echo -e "  git push -u origin main"
    echo ""

    cd ..
}

# ========================================
# 1. Extract carnil-config
# ========================================
echo -e "${GREEN}Step 1: Extracting carnil-config${NC}"
echo -e "${YELLOW}Note: This will be a new repo with selected config files${NC}"
echo -e "${YELLOW}Manual extraction required - creating template instead${NC}"
# Config package will be created manually as it's a new structure

# ========================================
# 2. Extract carnil-core
# ========================================
echo -e "${GREEN}Step 2: Extracting carnil-core${NC}"
extract_repo "carnil-core" \
    "https://github.com/${ORG_NAME}/carnil-core.git" \
    "--path packages/core/" \
    "--path-rename packages/core/:"

# ========================================
# 3. Extract carnil-providers
# ========================================
echo -e "${GREEN}Step 3: Extracting carnil-providers${NC}"
extract_repo "carnil-providers" \
    "https://github.com/${ORG_NAME}/carnil-providers.git" \
    "--path packages/stripe/" \
    "--path packages/razorpay/" \
    "--path-rename packages/:packages/"

# ========================================
# 4. Extract carnil-frameworks
# ========================================
echo -e "${GREEN}Step 4: Extracting carnil-frameworks${NC}"
extract_repo "carnil-frameworks" \
    "https://github.com/${ORG_NAME}/carnil-frameworks.git" \
    "--path packages/react/" \
    "--path packages/next/" \
    "--path packages/adapters/" \
    "--path-rename packages/:packages/"

# ========================================
# 5. Extract carnil-features
# ========================================
echo -e "${GREEN}Step 5: Extracting carnil-features${NC}"
extract_repo "carnil-features" \
    "https://github.com/${ORG_NAME}/carnil-features.git" \
    "--path packages/webhooks/" \
    "--path packages/analytics/" \
    "--path packages/pricing-editor/" \
    "--path packages/compliance/" \
    "--path packages/globalization/" \
    "--path-rename packages/:packages/"

# ========================================
# 6. Extract carnil-examples
# ========================================
echo -e "${GREEN}Step 6: Extracting carnil-examples${NC}"
extract_repo "carnil-examples" \
    "https://github.com/${ORG_NAME}/carnil-examples.git" \
    "--path examples/" \
    "--path-rename examples/:"

# ========================================
# Summary
# ========================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Migration Extraction Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Repositories extracted to: ${WORK_DIR}${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Create GitHub repositories:"
echo -e "   - carnil-config"
echo -e "   - carnil-core"
echo -e "   - carnil-providers"
echo -e "   - carnil-frameworks"
echo -e "   - carnil-features"
echo -e "   - carnil-examples"
echo ""
echo -e "2. For each extracted repo, add remote and push:"
echo -e "   cd ${WORK_DIR}/[repo-name]"
echo -e "   git remote add origin https://github.com/${ORG_NAME}/[repo-name].git"
echo -e "   git push -u origin main"
echo ""
echo -e "3. Run setup scripts to add configurations:"
echo -e "   ./scripts/setup-repo-structure.sh"
echo ""
echo -e "${GREEN}Done!${NC}"
