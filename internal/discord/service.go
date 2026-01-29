package discord

import (
	"fmt"
	"time"

	"github.com/hugolgst/rich-go/client"
)

// AppID is the Discord Application ID for HyVanila
// TODO: Replace with a real registered application ID if needed
const AppID = "1464599540148600978"

// Service handles Discord Rich Presence
type Service struct {
	initialized bool
}

// NewService creates a new Discord service
func NewService() *Service {
	return &Service{}
}

// Initialize connects to Discord IPC
func (s *Service) Initialize() error {
	if s.initialized {
		return nil
	}

	// Try to login, but don't fail hard if Discord isn't running
	err := client.Login(AppID)
	if err != nil {
		return fmt.Errorf("failed to login to discord: %w", err)
	}

	s.initialized = true

	now := time.Now()
	// Set initial status
	err = client.SetActivity(client.Activity{
		Details:    "In Launcher",
		State:      "Browsing HyVanila",
		LargeImage: "logo", // Requires uploading assets to Discord Developer Portal
		LargeText:  "HyVanila",
		Timestamps: &client.Timestamps{
			Start: &now,
		},
	})

	return err
}

// SetPlaying sets activity to "Playing Hytale"
func (s *Service) SetPlaying(version string) error {
	if !s.initialized {
		return nil
	}

	now := time.Now()
	return client.SetActivity(client.Activity{
		Details:    "Playing Hytale",
		State:      fmt.Sprintf("Version %s", version),
		LargeImage: "logo",
		LargeText:  "HyVanila",
		Buttons: []*client.Button{
			{
				Label: "Website",
				Url:   "https://github.com/7osteradev/HyVanila",
			},
		},
		Timestamps: &client.Timestamps{
			Start: &now,
		},
	})
}

// SetIdle sets activity back to launcher idle state
func (s *Service) SetIdle() error {
	if !s.initialized {
		return nil
	}

	now := time.Now()
	return client.SetActivity(client.Activity{
		Details:    "In Launcher",
		State:      "Idle",
		LargeImage: "logo",
		LargeText:  "HyVanila",
		Buttons: []*client.Button{
			{
				Label: "Website",
				Url:   "https://github.com/7osteradev/HyVanila",
			},
		},
		Timestamps: &client.Timestamps{
			Start: &now,
		},
	})
}

// Close disconnects from Discord
func (s *Service) Close() {
	if s.initialized {
		client.Logout()
		s.initialized = false
	}
}
