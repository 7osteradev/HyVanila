package game

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"

	"HyVanila/internal/auth"
	"HyVanila/internal/env"
	"HyVanila/internal/patcher"
)

// LaunchOptions contains options for launching the game
type LaunchOptions struct {
	PlayerName string
	Branch     string
	Version    int
	OnlineMode bool   // If true, use online auth mode with patched binaries
	AuthDomain string // Custom auth domain (empty for default)
	JavaPath   string // Custom Java path
	MaxMemory  int    // Max memory in MB
	MinMemory  int    // Min memory in MB
	FullScreen bool   // Full screen mode
	// Callbacks
	OnExit func() // Called when the game process exits
}

// Legacy Launch() removed - use LaunchInstance() instead

// LaunchInstance launches a specific branch/version instance (offline mode)
func LaunchInstance(playerName string, branch string, version int) error {
	return LaunchInstanceWithOptions(LaunchOptions{
		PlayerName: playerName,
		Branch:     branch,
		Version:    version,
		OnlineMode: false,
		AuthDomain: "",
	})
}

// LaunchInstanceOnline launches a specific branch/version instance with online mode
func LaunchInstanceOnline(playerName string, branch string, version int, authDomain string) error {
	return LaunchInstanceWithOptions(LaunchOptions{
		PlayerName: playerName,
		Branch:     branch,
		Version:    version,
		OnlineMode: true,
		AuthDomain: authDomain,
	})
}

// signMacOSBinaries signs Java runtime and other binaries on macOS to avoid Gatekeeper issues
func signMacOSBinaries(jreDir, jrePath string) {
	fmt.Println("Signing macOS binaries...")
	
	// Remove quarantine attributes
	xattrCmd := exec.Command("xattr", "-cr", jreDir)
	xattrCmd.Run()
	
	// Sign the Java binary
	codesignCmd := exec.Command("codesign", "--force", "--deep", "--sign", "-", jreDir)
	if output, err := codesignCmd.CombinedOutput(); err != nil {
		fmt.Printf("Warning: Failed to sign JRE: %s\n", string(output))
	} else {
		fmt.Println("JRE signed successfully")
	}
}

// LaunchInstanceWithOptions launches a specific branch/version instance with given options
func LaunchInstanceWithOptions(opts LaunchOptions) error {
	baseDir := env.GetDefaultAppDir()
	
	// Get instance-specific game directory
	gameDir := env.GetInstanceGameDir(opts.Branch, opts.Version)
	
	// Verify client exists
	var clientPath string
	switch runtime.GOOS {
	case "darwin":
		clientPath = filepath.Join(gameDir, "Client", "Hytale.app", "Contents", "MacOS", "HytaleClient")
	case "windows":
		clientPath = filepath.Join(gameDir, "Client", "HytaleClient.exe")
	default:
		clientPath = filepath.Join(gameDir, "Client", "HytaleClient")
	}

	if _, err := os.Stat(clientPath); err != nil {
		return fmt.Errorf("game client not found at %s (instance %s v%d not installed): %w", clientPath, opts.Branch, opts.Version, err)
	}

	// Use instance-specific UserData
	userDataDir := env.GetInstanceUserDataDir(opts.Branch, opts.Version)
	_ = os.MkdirAll(userDataDir, 0755)

	// Set up Java path
	var jrePath string
	jreDir := filepath.Join(baseDir, "jre")
	if opts.JavaPath != "" {
		jrePath = opts.JavaPath
	} else {
		switch runtime.GOOS {
		case "darwin":
			javaDir := filepath.Join(baseDir, "java")
			javaHomeBin := filepath.Join(javaDir, "Contents", "Home", "bin")
			
			if _, err := os.Stat(javaHomeBin); err != nil {
				os.RemoveAll(javaDir)
				os.MkdirAll(filepath.Join(javaDir, "Contents", "Home"), 0755)
				os.Symlink(filepath.Join(jreDir, "bin"), filepath.Join(javaDir, "Contents", "Home", "bin"))
				os.Symlink(filepath.Join(jreDir, "lib"), filepath.Join(javaDir, "Contents", "Home", "lib"))
			}
			jrePath = filepath.Join(baseDir, "java", "Contents", "Home", "bin", "java")
		case "windows":
			jrePath = filepath.Join(jreDir, "bin", "java.exe")
		default:
			jrePath = filepath.Join(jreDir, "bin", "java")
		}
	}

	if _, err := os.Stat(jrePath); err != nil {
		return fmt.Errorf("Java not found at %s: %w", jrePath, err)
	}

	// On macOS, sign Java runtime to avoid Gatekeeper issues
	if runtime.GOOS == "darwin" && opts.JavaPath == "" {
		signMacOSBinaries(jreDir, jrePath)
	}

	// Generate UUID from player name
	uuid := OfflineUUID(opts.PlayerName)
	uuidStr := uuid.String()

	// Determine auth mode and tokens
	authMode := "offline"
	var tokens *auth.AuthTokens

	if opts.OnlineMode {
		// Online mode: patch binaries and authenticate with server
		authDomain := opts.AuthDomain
		if authDomain == "" {
			authDomain = patcher.DefaultAuthDomain
		}

		fmt.Printf("Online mode enabled (domain: %s)\n", authDomain)
		
		// Create patcher and patch game binaries
		clientPatcher := patcher.NewClientPatcher(authDomain)
		fmt.Println("Patching game binaries for online mode...")
		
		patchResult := clientPatcher.EnsurePatched(gameDir, func(msg string, percent int) {
			fmt.Printf("  [%d%%] %s\n", percent, msg)
		})
		
		if !patchResult.Success {
			return fmt.Errorf("failed to patch game for online mode: %s", patchResult.Error)
		}
		
		if patchResult.AlreadyPatched {
			fmt.Println("Game already patched for online mode")
		} else {
			fmt.Printf("Successfully patched game (%d occurrences)\n", patchResult.PatchCount)
		}
		
		// Note: Signing happens right before launch, not here
		// This is because macOS needs fresh signature every time
		
		// Try to fetch auth tokens from server
		fmt.Println("Fetching auth tokens...")
		var err error
		tokens, err = auth.FetchAuthTokens(uuidStr, opts.PlayerName, authDomain)
		if err != nil {
			fmt.Printf("Warning: Failed to fetch auth tokens: %v\n", err)
			fmt.Println("Falling back to offline mode for this session...")
			tokens = auth.GenerateLocalTokens(uuidStr, opts.PlayerName)
			authMode = "offline"
		} else {
			fmt.Println("Auth tokens received successfully")
			authMode = "authenticated"
		}
	} else {
		fmt.Println("Offline mode enabled")
		tokens = auth.GenerateLocalTokens(uuidStr, opts.PlayerName)
		authMode = "offline"
	}

	fmt.Printf("=== LAUNCH INSTANCE ===\n")
	fmt.Printf("Branch: %s, Version: %d\n", opts.Branch, opts.Version)
	fmt.Printf("Game dir: %s\n", gameDir)
	fmt.Printf("UserData: %s\n", userDataDir)
	fmt.Printf("Auth mode: %s\n", authMode)
	fmt.Printf("Online mode: %v\n", opts.OnlineMode)
	fmt.Printf("========================\n")

	// Build common arguments
	commonArgs := []string{
		"--app-dir", gameDir,
		"--user-dir", userDataDir,
		"--java-exec", jrePath,
		"--auth-mode", authMode,
		"--uuid", uuidStr,
		"--name", opts.PlayerName,
	}

	if opts.MaxMemory > 0 {
		commonArgs = append(commonArgs, "--max-memory", strconv.Itoa(opts.MaxMemory))
	}

	if opts.MinMemory > 0 {
		commonArgs = append(commonArgs, "--min-memory", strconv.Itoa(opts.MinMemory))
	}

	if opts.FullScreen {
		commonArgs = append(commonArgs, "--fullscreen")
	}

	// Add auth tokens if available and in authenticated mode
	if authMode == "authenticated" && tokens != nil {
		// When using identity token, also pass username for profile
		if tokens.IdentityToken != "" {
			commonArgs = append(commonArgs, "--identity-token", tokens.IdentityToken)
			commonArgs = append(commonArgs, "--username", opts.PlayerName)
		}
		if tokens.SessionToken != "" {
			commonArgs = append(commonArgs, "--session-token", tokens.SessionToken)
		}
	}

	var cmd *exec.Cmd
	if runtime.GOOS == "darwin" {
		appBundlePath := filepath.Join(gameDir, "Client", "Hytale.app")
		
		// CRITICAL macOS fix: Sign app right before launch every time
		// This is needed because patching invalidates the signature
		fmt.Println("Signing Hytale.app for macOS launch...")
		
		// Remove all quarantine attributes recursively
		xattrCmd := exec.Command("xattr", "-cr", appBundlePath)
		xattrCmd.Run() // Ignore errors
		
		// CRITICAL: Remove .original backup files from app bundle before signing
		// The patcher creates these and they break codesign --deep
		macOSDir := filepath.Join(appBundlePath, "Contents", "MacOS")
		if entries, err := os.ReadDir(macOSDir); err == nil {
			for _, entry := range entries {
				if strings.HasSuffix(entry.Name(), ".original") {
					backupPath := filepath.Join(macOSDir, entry.Name())
					fmt.Printf("Removing backup file before signing: %s\n", entry.Name())
					os.Remove(backupPath)
				}
			}
		}
		
		// Sign with codesign - use ad-hoc signature
		// Must use --force to overwrite existing signature after patching
		codesignCmd := exec.Command("codesign", 
			"--force",
			"--deep", 
			"--sign", "-",
			"--preserve-metadata=entitlements",
			appBundlePath)
		
		if output, err := codesignCmd.CombinedOutput(); err != nil {
			fmt.Printf("Signing failed: %s\n", string(output))
			// Try again without preserve-metadata
			simpleSign := exec.Command("codesign", "--force", "--deep", "--sign", "-", appBundlePath)
			if out2, err2 := simpleSign.CombinedOutput(); err2 != nil {
				fmt.Printf("Warning: Could not sign app: %v\nOutput: %s\n", err2, string(out2))
			}
		} else {
			fmt.Println("App signed successfully")
		}
		
		args := append([]string{appBundlePath, "--args"}, commonArgs...)
		cmd = exec.Command("open", args...)
	} else if runtime.GOOS == "windows" {
		// Windows - launch directly without special working directory
		cmd = exec.Command(clientPath, commonArgs...)
		cmd.SysProcAttr = getWindowsSysProcAttr()
	} else {
		// Linux - must set LD_LIBRARY_PATH to find SDL3_image and other native libraries
		clientDir := filepath.Join(gameDir, "Client")
		cmd = exec.Command(clientPath, commonArgs...)
		// Preserve LD_LIBRARY_PATH with Client directory first
		existingLdPath := os.Getenv("LD_LIBRARY_PATH")
		newLdPath := clientDir
		if existingLdPath != "" {
			newLdPath = fmt.Sprintf("%s:%s", clientDir, existingLdPath)
		}
		cmd.Env = append(os.Environ(), fmt.Sprintf("LD_LIBRARY_PATH=%s", newLdPath))
	}
	
	cmd.Dir = baseDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start game: %w", err)
	}

	gameProcess = cmd.Process
	gameRunning = true
	
	go func() {
		cmd.Wait()
		gameProcess = nil
		gameRunning = false
		if opts.OnExit != nil {
			opts.OnExit()
		}
	}()

	return nil
}

var gameProcess *os.Process
var gameRunning bool

// KillGame terminates the running game process
func KillGame() error {
	if !gameRunning {
		return fmt.Errorf("no game process running")
	}
	
	// Try to kill by process reference first
	if gameProcess != nil {
		err := gameProcess.Kill()
		if err == nil {
			gameProcess = nil
			gameRunning = false
			fmt.Println("Game process terminated")
			return nil
		}
	}
	
	// If that fails, try to find and kill by name
	if runtime.GOOS == "darwin" {
		exec.Command("pkill", "-f", "Hytale").Run()
	} else if runtime.GOOS == "windows" {
		cmd := exec.Command("taskkill", "/F", "/IM", "HytaleClient.exe")
		cmd.SysProcAttr = getWindowsSysProcAttr()
		cmd.Run()
	} else {
		exec.Command("pkill", "-f", "HytaleClient").Run()
	}
	
	gameProcess = nil
	gameRunning = false
	fmt.Println("Game process terminated")
	return nil
}

// IsGameRunning checks if the game process is still running
func IsGameRunning() bool {
	// Active check for the game process by name
	var isRunning bool
	
	if runtime.GOOS == "darwin" {
		// Check for Hytale process on macOS
		out, err := exec.Command("pgrep", "-f", "Hytale").Output()
		isRunning = err == nil && len(out) > 0
	} else if runtime.GOOS == "windows" {
		// Check for HytaleClient.exe on Windows using WMI (no window flash)
		isRunning = isWindowsProcessRunning("HytaleClient.exe")
	} else {
		// Linux
		out, err := exec.Command("pgrep", "-f", "HytaleClient").Output()
		isRunning = err == nil && len(out) > 0
	}
	
	// Update global state
	gameRunning = isRunning
	if !isRunning {
		gameProcess = nil
	}
	
	return isRunning
}

// WaitForGameExit waits for the game to exit and returns
func WaitForGameExit() {
	if !gameRunning {
		return
	}
	
	// Poll until the game is no longer running
	for IsGameRunning() {
		// Sleep briefly to avoid busy-waiting
		// The IsGameRunning function already checks the actual process
	}
	
	gameProcess = nil
	gameRunning = false
}

// GetGameLogs returns the game log file content
func GetGameLogs() (string, error) {
	baseDir := env.GetDefaultAppDir()
	
	// Try multiple log paths based on typical Hytale log locations
	paths := []string{
		// UserData logs
		filepath.Join(baseDir, "UserData", "logs", "latest.log"),
		filepath.Join(baseDir, "UserData", "logs", "game.log"),
		filepath.Join(baseDir, "UserData", "logs", "client.log"),
		// Instance logs (latest)
		filepath.Join(env.GetInstanceGameDir("release", 0), "logs", "latest.log"),
		filepath.Join(env.GetInstanceGameDir("release", 0), "logs", "game.log"),
		filepath.Join(env.GetInstanceGameDir("release", 0), "Client", "logs", "latest.log"),
		// HyVanila specific log
		filepath.Join(baseDir, "logs", "game.log"),
	}
	
	var allLogs strings.Builder
	foundAny := false
	
	for _, p := range paths {
		if data, err := os.ReadFile(p); err == nil && len(data) > 0 {
			foundAny = true
			allLogs.WriteString(fmt.Sprintf("=== %s ===\n", filepath.Base(p)))
			
			content := string(data)
			// Return last 30KB of each log
			if len(content) > 30*1024 {
				content = content[len(content)-30*1024:]
			}
			allLogs.WriteString(content)
			allLogs.WriteString("\n\n")
		}
	}
	
	if foundAny {
		return allLogs.String(), nil
	}
	
	// List what directories exist to help debug
	var debug strings.Builder
	debug.WriteString("No game logs found. Checking directories:\n\n")
	
	checkDirs := []string{
		filepath.Join(baseDir, "UserData"),
		filepath.Join(baseDir, "UserData", "logs"),
		env.GetInstanceDir("release", 0),
		filepath.Join(env.GetInstanceGameDir("release", 0), "logs"),
	}
	
	for _, dir := range checkDirs {
		if _, err := os.Stat(dir); err == nil {
			debug.WriteString(fmt.Sprintf("✓ %s exists\n", dir))
			// List files in the directory
			if entries, err := os.ReadDir(dir); err == nil {
				for _, e := range entries {
					debug.WriteString(fmt.Sprintf("   - %s\n", e.Name()))
				}
			}
		} else {
			debug.WriteString(fmt.Sprintf("✗ %s not found\n", dir))
		}
	}
	
	return debug.String(), nil
}

// UUID represents a UUID
type UUID [16]byte

// OfflineUUID generates an offline UUID from a player name
func OfflineUUID(name string) UUID {
	data := "OfflinePlayer:" + name
	hash := md5.Sum([]byte(data))
	
	// Set version to 3 (name-based)
	hash[6] = (hash[6] & 0x0f) | 0x30
	// Set variant to 1
	hash[8] = (hash[8] & 0x3f) | 0x80
	
	return UUID(hash)
}

// String returns the UUID as a string
func (u UUID) String() string {
	hex := hex.EncodeToString(u[:])
	return fmt.Sprintf("%s-%s-%s-%s-%s",
		hex[0:8], hex[8:12], hex[12:16], hex[16:20], hex[20:32])
}

// setSDLVideoDriver sets the SDL_VIDEODRIVER environment variable for Linux
func setSDLVideoDriver(cmd *exec.Cmd) {
	if runtime.GOOS != "linux" {
		return
	}

	// Check if running under Wayland
	waylandDisplay := os.Getenv("WAYLAND_DISPLAY")
	xdgSession := os.Getenv("XDG_SESSION_TYPE")

	if waylandDisplay != "" || strings.ToLower(xdgSession) == "wayland" {
		cmd.Env = append(os.Environ(), "SDL_VIDEODRIVER=wayland,x11")
	}
}
