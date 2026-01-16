package skin

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// AvatarPreset represents a Hytale avatar preset
type AvatarPreset struct {
	BodyCharacteristic string  `json:"bodyCharacteristic,omitempty"`
	Face               string  `json:"face,omitempty"`
	Eyes               string  `json:"eyes,omitempty"`
	Haircut            string  `json:"haircut,omitempty"`
	FacialHair         *string `json:"facialHair"`
	Eyebrows           string  `json:"eyebrows,omitempty"`
	Undertop           string  `json:"undertop,omitempty"`
	Overtop            string  `json:"overtop,omitempty"`
	Pants              string  `json:"pants,omitempty"`
	Shoes              string  `json:"shoes,omitempty"`
	HeadAccessory      *string `json:"headAccessory"`
	FaceAccessory      *string `json:"faceAccessory"`
	Gloves             *string `json:"gloves"`
	Cape               string  `json:"cape,omitempty"`
}

// GetAvatarPresetsPath returns the path to the AvatarPresets.json file
func GetAvatarPresetsPath(gameDir string) string {
	return filepath.Join(gameDir, "Client", "Data", "Game", "AvatarPresets.json")
}

// LoadPreset loads the current avatar preset
func LoadPreset(gameDir string) (*AvatarPreset, error) {
	presetsPath := GetAvatarPresetsPath(gameDir)

	data, err := os.ReadFile(presetsPath)
	if err != nil {
		if os.IsNotExist(err) {
			// Return default preset
			return DefaultPreset(), nil
		}
		return nil, fmt.Errorf("failed to read presets file: %w", err)
	}

	var presets []AvatarPreset
	if err := json.Unmarshal(data, &presets); err != nil {
		return nil, fmt.Errorf("failed to parse presets: %w", err)
	}

	if len(presets) == 0 {
		return DefaultPreset(), nil
	}

	return &presets[0], nil
}

// SavePreset saves an avatar preset
func SavePreset(gameDir string, preset *AvatarPreset) error {
	presetsPath := GetAvatarPresetsPath(gameDir)

	// Create directory if it doesn't exist
	if err := os.MkdirAll(filepath.Dir(presetsPath), 0755); err != nil {
		return fmt.Errorf("failed to create presets directory: %w", err)
	}

	// Wrap preset in array as required by the game
	presets := []AvatarPreset{*preset}

	data, err := json.MarshalIndent(presets, "", "    ")
	if err != nil {
		return fmt.Errorf("failed to serialize preset: %w", err)
	}

	if err := os.WriteFile(presetsPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write presets file: %w", err)
	}

	return nil
}

// DefaultPreset returns a default avatar preset
func DefaultPreset() *AvatarPreset {
	return &AvatarPreset{
		BodyCharacteristic: "Muscular.10",
		Face:               "Face_Neutral",
		Eyes:               "Almond_Eyes.Blue",
		Haircut:            "Slickback.Black.SlickbackClean",
		FacialHair:         nil,
		Eyebrows:           "Thick.Black",
		Undertop:           "VikingShirt.Black",
		Overtop:            "PuffyJacket.Red",
		Pants:              "Jeans.Blue",
		Shoes:              "BasicBoots.Black",
		HeadAccessory:      nil,
		FaceAccessory:      nil,
		Gloves:             nil,
		Cape:               "Cape_Royal_Emissary.Black.Neck_Piece",
	}
}

// BackupPresets creates a backup of the current presets file
func BackupPresets(gameDir string) error {
	presetsPath := GetAvatarPresetsPath(gameDir)
	backupPath := presetsPath + ".backup"

	data, err := os.ReadFile(presetsPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil // Nothing to backup
		}
		return err
	}

	return os.WriteFile(backupPath, data, 0644)
}

// RestorePresets restores presets from backup
func RestorePresets(gameDir string) error {
	presetsPath := GetAvatarPresetsPath(gameDir)
	backupPath := presetsPath + ".backup"

	data, err := os.ReadFile(backupPath)
	if err != nil {
		return fmt.Errorf("no backup found: %w", err)
	}

	return os.WriteFile(presetsPath, data, 0644)
}
