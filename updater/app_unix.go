//go:build !windows

package updater

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

// Apply applies a launcher update on Unix systems
func Apply(tmp string) error {
	exe, err := os.Executable()
	if err != nil {
		return fmt.Errorf("failed to get executable path: %w", err)
	}

	helperName := "update-helper"
	helper := filepath.Join(filepath.Dir(exe), helperName)

	if _, err := os.Stat(helper); err != nil {
		return fmt.Errorf("update helper not found: %w", err)
	}

	// Make helper executable
	os.Chmod(helper, 0755)

	var cmd *exec.Cmd
	if runtime.GOOS == "darwin" {
		cmd = exec.Command(helper, exe, tmp)
	} else {
		cmd = exec.Command(helper, exe, tmp)
	}

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start update helper: %w", err)
	}

	os.Exit(0)
	return nil
}
