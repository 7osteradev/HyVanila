package config

// Config represents the launcher configuration
type Config struct {
	Version           string `toml:"version" json:"version"`
	Nick              string `toml:"nick" json:"nick"`
	MusicEnabled      bool   `toml:"music_enabled" json:"musicEnabled"`
	VersionType       string `toml:"version_type" json:"versionType"`
	SelectedVersion   int    `toml:"selected_version" json:"selectedVersion"`
	CustomInstanceDir string `toml:"custom_instance_dir" json:"customInstanceDir"` // Custom path for instances
	AutoUpdateLatest  bool   `toml:"auto_update_latest" json:"autoUpdateLatest"`   // Auto-update latest instance
	OnlineMode        bool   `toml:"online_mode" json:"onlineMode"`                // Enable online multiplayer
	AuthDomain        string `toml:"auth_domain" json:"authDomain"`                // Custom auth server domain
	JavaPath          string `toml:"java_path" json:"javaPath"`                    // Custom path to Java executable
	DiscordRPCEnabled bool   `toml:"discord_rpc_enabled" json:"discordRPCEnabled"` // Enable Discord Rich Presence
	MaxMemory         int    `toml:"max_memory" json:"maxMemory"`                  // Maximum memory in MB
	MinMemory         int    `toml:"min_memory" json:"minMemory"`                  // Minimum memory in MB
	FullScreen        bool   `toml:"full_screen" json:"fullScreen"`                // Launch in full screen
}

// Default returns the default configuration
func Default() *Config {
	return &Config{
		Version:           "1.0.0",
		Nick:              "Steven",
		MusicEnabled:      true,
		VersionType:       "release",
		SelectedVersion:   0,  // 0 means use latest
		CustomInstanceDir: "", // Empty means use default
		AutoUpdateLatest:  true,
		OnlineMode:        true, // Online mode enabled by default
		AuthDomain:        "",   // Empty uses default auth domain
		JavaPath:          "",   // Empty means use bundled JRE
		DiscordRPCEnabled: true,
		MaxMemory:         2560,
		MinMemory:         512,
		FullScreen:        false,
	}
}
