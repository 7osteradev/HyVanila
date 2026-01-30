# Security Policy

## Reporting a Vulnerability

We take the security of HyVanila seriously. If you believe you have found a security vulnerability, please report it to us by opening a private security advisory on GitHub or by contacting the maintainers directly.

Please do **not** report security vulnerabilities via public GitHub issues.

## Why Antivirus Scanners May Flag HyVanila

HyVanila is a Hytale launcher that performs several actions that can sometimes trigger "false positive" alerts in antivirus software, especially because our binaries are often unsigned (as we are an open-source community project).

### 1. Automatic Updates
The launcher checks for updates to itself and the game. It downloads executables and replaces the old ones. Scanners often flag programs that "download and execute" other programs.

### 2. Game Injection/Patching
To enable features like modding or performance fixes, the launcher may need to modify game files or inject code into the game process. This behavior is common in game launchers but is also used by malware, leading to flags.

### 3. Unsigned Binaries
Code signing certificates for Windows and macOS are expensive. As an open-source project, we often distribute unsigned binaries. Operating systems and antivirus tools are inherently suspicious of unsigned software.

## What HyVanila Actually Does

*   **Network Access**: Connects to GitHub for updates and Hytale servers for game news/data.
*   **File System**: Creates a `.hyvanila` folder in your user directory to store game instances, logs, and configurations.
*   **Registry/Settings**: On Windows, it may touch specific registry keys needed for game environment setup (like Java paths).
*   **No Data Collection**: HyVanila does not collect personal data, passwords, or telemetry without your knowledge.

## How to Stay Safe

1.  **Always download from official sources**: Only download HyVanila from our [official GitHub releases](https://github.com/7osteradev/HyVanila/releases).
2.  **Verify the Source**: Since the project is open source, you can always review the code yourself or build it from source if you have the Go and Node.js tools installed.
3.  **Check Hashes**: We provide SHA-256 checksums for our releases. You can verify that the file you downloaded matches the one we built.

## Supported Versions

Only the latest version of HyVanila is supported with security updates. Please ensure you are always running the latest version.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |
