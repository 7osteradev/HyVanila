package app

import "HyPrism/internal/config"

// SetNick sets the player nickname
func (a *App) SetNick(nick string) error {
	a.cfg.Nick = nick
	return config.Save(a.cfg)
}

// GetNick returns the player nickname
func (a *App) GetNick() string {
	return a.cfg.Nick
}

// GetConfig returns the full config
func (a *App) GetConfig() *config.Config {
	return a.cfg
}

// SaveConfig saves the configuration
func (a *App) SaveConfig() error {
	return config.Save(a.cfg)
}

// SetMusicEnabled sets music enabled state and saves it
func (a *App) SetMusicEnabled(enabled bool) error {
	a.cfg.MusicEnabled = enabled
	return config.Save(a.cfg)
}

// GetMusicEnabled returns the music enabled state
func (a *App) GetMusicEnabled() bool {
	return a.cfg.MusicEnabled
}
