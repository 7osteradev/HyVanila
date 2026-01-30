#!/bin/bash
# Build script for HyVanila

set -e

VERSION="${1:-dev}"
PLATFORMS=("windows/amd64" "darwin/arm64" "darwin/amd64" "linux/amd64")

echo "Building HyVanila v${VERSION}..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Build for each platform
for platform in "${PLATFORMS[@]}"; do
    echo "Building for ${platform}..."
    wails build -platform "${platform}" -ldflags "-X 'HyVanila/app.AppVersion=${VERSION}'" -o "HyVanila-${platform//\//-}"
done

echo "Build complete!"
