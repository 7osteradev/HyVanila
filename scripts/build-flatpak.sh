#!/bin/bash
# Build Flatpak for HyVanila
# Requires: flatpak-builder, flatpak

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Building HyVanila Flatpak..."

# Check if required tools are installed
if ! command -v flatpak-builder &> /dev/null; then
    echo "Error: flatpak-builder is not installed"
    echo "Install with: sudo apt install flatpak-builder (Debian/Ubuntu)"
    echo "           or: sudo dnf install flatpak-builder (Fedora)"
    exit 1
fi

# Ensure required Flatpak runtimes are installed
echo "Installing required Flatpak runtimes..."
flatpak install -y flathub org.gnome.Platform//46 org.gnome.Sdk//46 || true
flatpak install -y flathub org.freedesktop.Sdk.Extension.golang//23.08 || true
flatpak install -y flathub org.freedesktop.Sdk.Extension.node18//23.08 || true

# Build the Wails binary first
cd "$PROJECT_DIR"
echo "Building HyVanila binary with Wails..."
if ! command -v wails &> /dev/null; then
    echo "Error: wails is not installed"
    echo "Install with: go install github.com/wailsapp/wails/v2/cmd/wails@latest"
    exit 1
fi

wails build -clean -tags webkit2_41

# Prepare files for Flatpak
echo "Preparing Flatpak assets..."
cp build/bin/HyVanila flatpak/HyVanila
chmod +x flatpak/HyVanila

# Resize icon to 512x512 if ImageMagick is available
if command -v convert &> /dev/null; then
    convert build/appicon.png -resize 512x512 flatpak/dev.hyvanila.HyVanila.png
else
    cp build/appicon.png flatpak/dev.hyvanila.HyVanila.png
fi

# Build the Flatpak
flatpak-builder \
    --force-clean \
    --repo=flatpak-repo \
    --state-dir=.flatpak-builder \
    flatpak-build \
    flatpak/dev.hyvanila.HyVanila.json

# Create a bundle for distribution
echo "Creating Flatpak bundle..."
flatpak build-bundle flatpak-repo HyVanila.flatpak dev.hyvanila.HyVanila

# Clean up temporary files
echo "Cleaning up..."
rm -f flatpak/HyVanila flatpak/dev.hyvanila.HyVanila.png

echo ""
echo "Build complete!"
echo "Flatpak bundle: HyVanila.flatpak"
echo ""
echo "To install locally: flatpak install HyVanila.flatpak"
echo "To run: flatpak run dev.HyVanila.HyVanila"
