package env

import (
	"os"
	"path/filepath"
	"runtime"
)

// GetDefaultAppDir returns the default application directory
func GetDefaultAppDir() string {
	var baseDir string

	switch runtime.GOOS {
	case "windows":
		baseDir = os.Getenv("LOCALAPPDATA")
		if baseDir == "" {
			baseDir = os.Getenv("APPDATA")
		}
	case "darwin":
		home, _ := os.UserHomeDir()
		baseDir = filepath.Join(home, "Library", "Application Support")
	default: // Linux and others
		home, _ := os.UserHomeDir()
		baseDir = filepath.Join(home, ".local", "share")
	}

	return filepath.Join(baseDir, "HyPrism")
}

// CreateFolders creates the required folder structure
func CreateFolders() error {
	appDir := GetDefaultAppDir()

	folders := []string{
		appDir,
		filepath.Join(appDir, "release"),
		filepath.Join(appDir, "release", "package"),
		filepath.Join(appDir, "release", "package", "game"),
		filepath.Join(appDir, "release", "package", "game", "latest"),
		filepath.Join(appDir, "jre"),
		filepath.Join(appDir, "butler"),
		filepath.Join(appDir, "cache"),
		filepath.Join(appDir, "logs"),
		filepath.Join(appDir, "crashes"),
		filepath.Join(appDir, "UserData"),
	}

	for _, folder := range folders {
		if err := os.MkdirAll(folder, 0755); err != nil {
			return err
		}
	}

	return nil
}

// GetCacheDir returns the cache directory
func GetCacheDir() string {
	return filepath.Join(GetDefaultAppDir(), "cache")
}

// GetLogsDir returns the logs directory
func GetLogsDir() string {
	return filepath.Join(GetDefaultAppDir(), "logs")
}

// GetJREDir returns the JRE directory
func GetJREDir() string {
	return filepath.Join(GetDefaultAppDir(), "jre")
}

// GetButlerDir returns the Butler directory
func GetButlerDir() string {
	return filepath.Join(GetDefaultAppDir(), "butler")
}

// GetUserDataDir returns the user data directory
func GetUserDataDir() string {
	return filepath.Join(GetDefaultAppDir(), "UserData")
}

// GetGameDir returns the game directory
func GetGameDir(version string) string {
	return filepath.Join(GetDefaultAppDir(), "release", "package", "game", version)
}
