#!/bin/bash
set -e

# macOS Build Script for HyVanila
# Usage: ./scripts/build-macos.sh [version]
# Example: ./scripts/build-macos.sh 1.0.24

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if version is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}No version specified. Using git tag or 'dev'${NC}"
    # Try to get version from git tag
    if git describe --tags --exact-match 2>/dev/null; then
        VERSION=$(git describe --tags --exact-match | sed 's/^v//')
    else
        VERSION="dev-$(git rev-parse --short HEAD)"
    fi
else
    VERSION="$1"
fi

APP_TITLE="HyVanila - Hytale Launcher"

echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       Building HyVanila for macOS (ARM64)            ║${NC}"
echo -e "${GREEN}║       Version: $VERSION${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"

# Check if wails is installed
if ! command -v wails &> /dev/null; then
    echo -e "${RED}Error: Wails CLI not found. Install it with:${NC}"
    echo "go install github.com/wailsapp/wails/v2/cmd/wails@latest"
    exit 1
fi

# Build the application
echo -e "${YELLOW}Building application...${NC}"
wails build -clean -ldflags "-X 'HyVanila/app.AppVersion=$VERSION' -X 'HyVanila/app.AppTitle=$APP_TITLE'"

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"

# Create DMG
echo -e "${YELLOW}Creating DMG installer...${NC}"

# Install create-dmg if not present
if ! command -v create-dmg &> /dev/null; then
    echo -e "${YELLOW}Installing create-dmg...${NC}"
    brew install create-dmg
fi

# Create a clean directory for DMG contents
rm -rf dmg-contents
mkdir -p dmg-contents

# Copy the app bundle
cp -r build/bin/HyVanila.app dmg-contents/

# Create the Fix-HyVanila helper script
cat > dmg-contents/Fix-HyVanila.command << 'HELPER'
#!/bin/bash
clear
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       HyVanila - Fix macOS Security Warning           ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Check common locations for HyVanila.app
APP_PATH=""
if [ -d "/Applications/HyVanila.app" ]; then
    APP_PATH="/Applications/HyVanila.app"
elif [ -d "$HOME/Applications/HyVanila.app" ]; then
    APP_PATH="$HOME/Applications/HyVanila.app"
elif [ -d "$(dirname "$0")/HyVanila.app" ]; then
    APP_PATH="$(dirname "$0")/HyVanila.app"
fi

if [ -z "$APP_PATH" ]; then
    echo "❌ HyVanila.app not found!"
    echo ""
    echo "Please drag HyVanila.app to your Applications folder first,"
    echo "then run this script again."
    echo ""
    echo "Or run manually in Terminal:"
    echo "  xattr -cr /path/to/HyVanila.app"
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

echo "Found HyVanila at: $APP_PATH"
echo ""
echo "Removing quarantine attribute..."
xattr -cr "$APP_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! HyVanila is now ready to use."
    echo ""
    echo "You can now open HyVanila from your Applications folder."
else
    echo ""
    echo "❌ Failed to remove quarantine. Try running manually:"
    echo "  sudo xattr -cr \"$APP_PATH\""
fi

echo ""
read -p "Press Enter to close..."
HELPER
chmod +x dmg-contents/Fix-HyVanila.command

# Create DMG
DMG_NAME="HyVanila-v${VERSION}-macOS-arm64.dmg"
rm -f "$DMG_NAME"

create-dmg \
  --volname "HyVanila" \
  --window-pos 200 120 \
  --window-size 700 400 \
  --icon-size 100 \
  --icon "HyVanila.app" 175 120 \
  --hide-extension "HyVanila.app" \
  --app-drop-link 525 120 \
  --icon "Fix-HyVanila.command" 350 280 \
  "$DMG_NAME" \
  "dmg-contents"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ DMG created: $DMG_NAME${NC}"
    echo -e "${GREEN}✓ Size: $(du -h "$DMG_NAME" | cut -f1)${NC}"
    
    # Move to releases directory
    mkdir -p releases
    mv "$DMG_NAME" releases/
    
    echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       Build Complete!                                ║${NC}"
    echo -e "${GREEN}║       DMG: releases/$DMG_NAME${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}Failed to create DMG${NC}"
    exit 1
fi

# Cleanup
rm -rf dmg-contents

echo -e "${YELLOW}To upload to GitHub release, run:${NC}"
echo "gh release upload v${VERSION} releases/${DMG_NAME}"
