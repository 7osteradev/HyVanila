# Linux Installation Guide

HyPrism on Linux requires WebKitGTK 4.0 to run. We provide AppImage and tar.gz packages for easy installation.

## Recommended: AppImage

AppImage is a portable format that works on most Linux distributions.

### Prerequisites

Install WebKitGTK 4.0:

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.0-37

# Fedora
sudo dnf install webkit2gtk4.0

# Arch Linux
sudo pacman -S webkit2gtk-4.1
```

### Install & Run

1. Download `HyPrism-x86_64.AppImage` from [releases](https://github.com/yyyumeniku/HyPrism/releases/latest)
2. Make it executable: `chmod +x HyPrism-x86_64.AppImage`
3. Run: `./HyPrism-x86_64.AppImage`

## Alternative: Binary (tar.gz)

If AppImage doesn't work, use the standalone binary:

1. Download `HyPrism-linux-x86_64.tar.gz` from [releases](https://github.com/yyyumeniku/HyPrism/releases/latest)
2. Extract: `tar -xzf HyPrism-linux-x86_64.tar.gz`
3. Run: `./HyPrism`

## Troubleshooting

### "libwebkit2gtk-4.0.so.37: cannot open shared object file"

Your system is missing WebKitGTK. Install it using the commands above for your distribution.

### AppImage won't launch

Try extracting and running directly:
```bash
./HyPrism-x86_64.AppImage --appimage-extract
./squashfs-root/AppRun
```

Or use the tar.gz binary instead.

### Game launches but crashes

1. Update to the latest HyPrism release
2. Ensure you have the latest graphics drivers
3. Check if WebKitGTK version is 2.40 or newer

## SteamOS / Steam Deck

For Steam Deck, use Desktop Mode and run the AppImage:

```bash
chmod +x HyPrism-x86_64.AppImage
./HyPrism-x86_64.AppImage
```

If AppImage fails, use the tar.gz binary.

## Building from Source

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions.

## Support

Report issues at [GitHub Issues](https://github.com/yyyumeniku/HyPrism/issues)
