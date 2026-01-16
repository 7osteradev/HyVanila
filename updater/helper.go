package updater

import (
	"HyPrism/internal/util"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

// EnsureUpdateHelper ensures the update helper is available
func EnsureUpdateHelper(ctx context.Context) (string, error) {
	exe, err := os.Executable()
	if err != nil {
		return "", fmt.Errorf("failed to get executable path: %w", err)
	}

	dir := filepath.Dir(exe)

	name := "update-helper"
	if runtime.GOOS == "windows" {
		name += ".exe"
	}

	helperPath := filepath.Join(dir, name)

	// Check if helper already exists
	if _, err := os.Stat(helperPath); err == nil {
		return helperPath, nil
	}

	fmt.Println("Update helper not found, downloading...")

	asset, err := GetHelperAsset(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to get helper asset info: %w", err)
	}

	tmp, err := DownloadUpdate(ctx, asset.URL, nil)
	if err != nil {
		return "", fmt.Errorf("failed to download helper: %w", err)
	}
	defer os.Remove(tmp)

	// Verify checksum if provided
	if asset.Sha256 != "" {
		if err := util.VerifySHA256(tmp, asset.Sha256); err != nil {
			return "", fmt.Errorf("helper checksum verification failed: %w", err)
		}
	}

	// Copy to final location
	if err := util.CopyFile(tmp, helperPath); err != nil {
		return "", fmt.Errorf("failed to copy helper: %w", err)
	}

	// Make executable on Unix
	if runtime.GOOS != "windows" {
		os.Chmod(helperPath, 0755)
	}

	return helperPath, nil
}
