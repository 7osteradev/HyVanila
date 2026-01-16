package app

import (
	"HyPrism/internal/env"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

// OpenFolder opens the game folder in the system file explorer
func (a *App) OpenFolder() error {
	path := env.GetDefaultAppDir()

	// Verify folder exists
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := os.MkdirAll(path, 0755); err != nil {
			return FileSystemError("creating game folder", err)
		}
	}

	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("explorer", path)
	case "darwin":
		cmd = exec.Command("open", path)
	default: // Linux
		cmd = exec.Command("xdg-open", path)
	}

	if err := cmd.Start(); err != nil {
		return FileSystemError("opening folder", err)
	}

	return nil
}

// DeleteGame deletes the game installation
func (a *App) DeleteGame() error {
	homeDir := env.GetDefaultAppDir()

	entries, err := os.ReadDir(homeDir)
	if err != nil {
		return FileSystemError("reading game directory", err)
	}

	// Track deletion errors
	var deleteErrors []string

	for _, entry := range entries {
		if entry.IsDir() {
			dirPath := filepath.Join(homeDir, entry.Name())
			if err := os.RemoveAll(dirPath); err != nil {
				deleteErrors = append(deleteErrors, entry.Name())
			}
		}
	}

	if len(deleteErrors) > 0 {
		return GameError(
			fmt.Sprintf("Failed to delete some folders: %v", deleteErrors),
			nil,
		)
	}

	// Recreate folder structure
	if err := env.CreateFolders(); err != nil {
		return FileSystemError("recreating folder structure", err)
	}

	return nil
}

// GetPlatformInfo returns information about the current platform
func (a *App) GetPlatformInfo() map[string]string {
	return map[string]string{
		"os":   runtime.GOOS,
		"arch": runtime.GOARCH,
	}
}
