package pwr

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"time"

	"HyPrism/internal/env"
	"HyPrism/internal/pwr/butler"
)

// ApplyPWR applies a PWR patch file using Butler (itch.io patching tool)
// PWR files are NOT regular zip files - they require Butler to extract
func ApplyPWR(ctx context.Context, pwrFile string, progressCallback func(stage string, progress float64, message string, currentFile string, speed string, downloaded, total int64)) error {
	gameDir := filepath.Join(env.GetDefaultAppDir(), "release", "package", "game", "latest")
	stagingDir := filepath.Join(gameDir, "staging-temp")
	
	// Check if game is already installed
	// Determine client path based on OS (matching TEMPLATE.sh structure)
	var clientPath string
	switch runtime.GOOS {
	case "darwin":
		clientPath = filepath.Join(gameDir, "Client", "Hytale.app", "Contents", "MacOS", "HytaleClient")
	case "windows":
		clientPath = filepath.Join(gameDir, "Client", "HytaleClient.exe")
	default:
		clientPath = filepath.Join(gameDir, "Client", "HytaleClient")
	}
	
	if _, err := os.Stat(clientPath); err == nil {
		fmt.Println("Game files detected, skipping patch installation")
		if progressCallback != nil {
			progressCallback("install", 100, "Game already installed", "", "", 0, 0)
		}
		// Clean up patch file
		go func() {
			time.Sleep(1 * time.Second)
			os.Remove(pwrFile)
		}()
		return nil
	}
	
	// Get Butler path
	butlerPath, err := butler.GetButlerPath()
	if err != nil {
		return fmt.Errorf("butler not found: %w", err)
	}
	
	// Create directories
	if err := os.MkdirAll(gameDir, 0755); err != nil {
		return fmt.Errorf("failed to create game directory: %w", err)
	}
	if err := os.MkdirAll(stagingDir, 0755); err != nil {
		return fmt.Errorf("failed to create staging directory: %w", err)
	}

	if progressCallback != nil {
		progressCallback("install", 0, "Installing Hytale...", "", "", 0, 0)
	}

	fmt.Printf("Applying PWR patch with Butler: %s\n", pwrFile)
	fmt.Printf("Butler path: %s\n", butlerPath)
	fmt.Printf("Game directory: %s\n", gameDir)
	
	// Run butler apply with staging directory (like Hytale-F2P does)
	cmd := exec.CommandContext(ctx, butlerPath, "apply", "--staging-dir", stagingDir, pwrFile, gameDir)
	
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Butler error output: %s\n", string(output))
		return fmt.Errorf("butler apply failed: %w\nOutput: %s", err, string(output))
	}

	fmt.Printf("Butler output: %s\n", string(output))

	// Clean up staging directory
	if err := os.RemoveAll(stagingDir); err != nil {
		fmt.Printf("Warning: failed to clean staging dir: %v\n", err)
	}

	// Clean up patch file
	go func() {
		time.Sleep(2 * time.Second)
		os.Remove(pwrFile)
	}()

	if progressCallback != nil {
		progressCallback("install", 100, "Hytale installed successfully", "", "", 0, 0)
	}

	// Set executable permissions on Unix
	if runtime.GOOS != "windows" {
		os.Chmod(clientPath, 0755)
	}

	fmt.Println("Installation complete")
	return nil
}
