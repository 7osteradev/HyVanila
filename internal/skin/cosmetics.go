package skin

import "fmt"

// CosmeticItem represents a cosmetic item
type CosmeticItem struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Category    string   `json:"category"`
	HasVariant  bool     `json:"hasVariant"`
	Variants    []string `json:"variants,omitempty"`
	HasColor    bool     `json:"hasColor"`
	Colors      []string `json:"colors,omitempty"`
	Description string   `json:"description,omitempty"`
}

// GetAllCosmetics returns all available cosmetic items organized by category
func GetAllCosmetics() map[string][]CosmeticItem {
	return map[string][]CosmeticItem{
		"bodyCharacteristic": getBodyCharacteristics(),
		"face":               getFaces(),
		"eyes":               getEyes(),
		"haircut":            getHaircuts(),
		"facialHair":         getFacialHair(),
		"eyebrows":           getEyebrows(),
		"undertop":           getUndertops(),
		"overtop":            getOvertops(),
		"pants":              getPants(),
		"shoes":              getShoes(),
		"headAccessory":      getHeadAccessories(),
		"faceAccessory":      getFaceAccessories(),
		"gloves":             getGloves(),
		"cape":               getCapes(),
	}
}

// GetAvailableColors returns all available colors
func GetAvailableColors() []string {
	return []string{
		// Basic Colors
		"Black", "White", "Grey", "Brown", "Red", "Blue", "Green", "Yellow", "Purple", "Pink",
		"Orange", "Cyan", "Magenta", "Navy", "Teal", "Olive", "Maroon", "Coral", "Salmon",
		// Hair Colors
		"Blond", "BlondPlatinum", "Ginger", "GreyAsh", "Auburn", "Brunette", "Chestnut",
		// Metal Colors (for accessories)
		"Gold_Red", "Silver_Blue", "Iron_Black", "Bronze", "Copper",
		// Skin Tones
		"Pale", "Fair", "Medium", "Tan", "Dark", "Deep",
	}
}

func getBodyCharacteristics() []CosmeticItem {
	return []CosmeticItem{
		{ID: "Muscular", Name: "Muscular", Category: "bodyCharacteristic", HasVariant: true, Variants: generateNumberVariants(1, 10), Description: "Muscular body type with intensity levels 1-10"},
		{ID: "Slim", Name: "Slim", Category: "bodyCharacteristic", HasVariant: true, Variants: generateNumberVariants(1, 10), Description: "Slim body type with intensity levels 1-10"},
		{ID: "Average", Name: "Average", Category: "bodyCharacteristic", HasVariant: true, Variants: generateNumberVariants(1, 10), Description: "Average body type with intensity levels 1-10"},
		{ID: "Heavy", Name: "Heavy", Category: "bodyCharacteristic", HasVariant: true, Variants: generateNumberVariants(1, 10), Description: "Heavy body type with intensity levels 1-10"},
	}
}

func getFaces() []CosmeticItem {
	return []CosmeticItem{
		{ID: "Face_Neutral", Name: "Neutral Face", Category: "face", Description: "Default neutral expression"},
		{ID: "Face_Happy", Name: "Happy Face", Category: "face", Description: "Happy expression"},
		{ID: "Face_Serious", Name: "Serious Face", Category: "face", Description: "Serious expression"},
		{ID: "Face_Determined", Name: "Determined Face", Category: "face", Description: "Determined expression"},
		{ID: "Face_Smirk", Name: "Smirk Face", Category: "face", Description: "Smirking expression"},
	}
}

func getEyes() []CosmeticItem {
	colors := []string{"Blue", "Green", "Brown", "Hazel", "Grey", "Amber", "Black"}
	return []CosmeticItem{
		{ID: "Almond_Eyes", Name: "Almond Eyes", Category: "eyes", HasColor: true, Colors: colors},
		{ID: "Round_Eyes", Name: "Round Eyes", Category: "eyes", HasColor: true, Colors: colors},
		{ID: "Deep_Eyes", Name: "Deep Eyes", Category: "eyes", HasColor: true, Colors: colors},
		{ID: "Narrow_Eyes", Name: "Narrow Eyes", Category: "eyes", HasColor: true, Colors: colors},
		{ID: "Wide_Eyes", Name: "Wide Eyes", Category: "eyes", HasColor: true, Colors: colors},
	}
}

func getHaircuts() []CosmeticItem {
	hairColors := []string{"Black", "Brown", "Blond", "BlondPlatinum", "Ginger", "GreyAsh", "White", "Red", "Auburn"}
	return []CosmeticItem{
		{ID: "Slickback", Name: "Slickback", Category: "haircut", HasColor: true, Colors: hairColors, HasVariant: true, Variants: []string{"SlickbackClean", "SlickbackMessy"}},
		{ID: "Ponytail", Name: "Ponytail", Category: "haircut", HasColor: true, Colors: hairColors, HasVariant: true, Variants: []string{"PonytailHigh", "PonytailLow"}},
		{ID: "Mohawk", Name: "Mohawk", Category: "haircut", HasColor: true, Colors: hairColors},
		{ID: "Buzz", Name: "Buzz Cut", Category: "haircut", HasColor: true, Colors: hairColors},
		{ID: "Long", Name: "Long Hair", Category: "haircut", HasColor: true, Colors: hairColors, HasVariant: true, Variants: []string{"LongStraight", "LongWavy", "LongCurly"}},
		{ID: "Short", Name: "Short Hair", Category: "haircut", HasColor: true, Colors: hairColors, HasVariant: true, Variants: []string{"ShortNeat", "ShortMessy"}},
		{ID: "Braid", Name: "Braid", Category: "haircut", HasColor: true, Colors: hairColors, HasVariant: true, Variants: []string{"BraidSingle", "BraidDouble"}},
		{ID: "Afro", Name: "Afro", Category: "haircut", HasColor: true, Colors: hairColors},
		{ID: "Curly", Name: "Curly", Category: "haircut", HasColor: true, Colors: hairColors, HasVariant: true, Variants: []string{"CurlyShort", "CurlyMedium"}},
		{ID: "Bald", Name: "Bald", Category: "haircut", Description: "No hair"},
	}
}

func getFacialHair() []CosmeticItem {
	hairColors := []string{"Black", "Brown", "Blond", "Ginger", "Grey", "White"}
	return []CosmeticItem{
		{ID: "Beard_Full", Name: "Full Beard", Category: "facialHair", HasColor: true, Colors: hairColors},
		{ID: "Beard_Short", Name: "Short Beard", Category: "facialHair", HasColor: true, Colors: hairColors},
		{ID: "Goatee", Name: "Goatee", Category: "facialHair", HasColor: true, Colors: hairColors},
		{ID: "Mustache", Name: "Mustache", Category: "facialHair", HasColor: true, Colors: hairColors},
		{ID: "Stubble", Name: "Stubble", Category: "facialHair", HasColor: true, Colors: hairColors},
		{ID: "Sideburns", Name: "Sideburns", Category: "facialHair", HasColor: true, Colors: hairColors},
	}
}

func getEyebrows() []CosmeticItem {
	hairColors := []string{"Black", "Brown", "Blond", "Ginger", "Grey"}
	return []CosmeticItem{
		{ID: "Thick", Name: "Thick Eyebrows", Category: "eyebrows", HasColor: true, Colors: hairColors},
		{ID: "Thin", Name: "Thin Eyebrows", Category: "eyebrows", HasColor: true, Colors: hairColors},
		{ID: "Arched", Name: "Arched Eyebrows", Category: "eyebrows", HasColor: true, Colors: hairColors},
		{ID: "Straight", Name: "Straight Eyebrows", Category: "eyebrows", HasColor: true, Colors: hairColors},
		{ID: "Bushy", Name: "Bushy Eyebrows", Category: "eyebrows", HasColor: true, Colors: hairColors},
	}
}

func getUndertops() []CosmeticItem {
	colors := []string{"Black", "White", "Grey", "Brown", "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Orange"}
	return []CosmeticItem{
		{ID: "VikingShirt", Name: "Viking Shirt", Category: "undertop", HasColor: true, Colors: colors},
		{ID: "TShirt", Name: "T-Shirt", Category: "undertop", HasColor: true, Colors: colors},
		{ID: "LongSleeve", Name: "Long Sleeve", Category: "undertop", HasColor: true, Colors: colors},
		{ID: "TankTop", Name: "Tank Top", Category: "undertop", HasColor: true, Colors: colors},
		{ID: "Tunic", Name: "Tunic", Category: "undertop", HasColor: true, Colors: colors},
		{ID: "Vest", Name: "Vest", Category: "undertop", HasColor: true, Colors: colors},
		{ID: "Sweater", Name: "Sweater", Category: "undertop", HasColor: true, Colors: colors},
	}
}

func getOvertops() []CosmeticItem {
	colors := []string{"Black", "White", "Grey", "Brown", "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Orange", "Navy"}
	return []CosmeticItem{
		{ID: "PuffyJacket", Name: "Puffy Jacket", Category: "overtop", HasColor: true, Colors: colors},
		{ID: "LeatherJacket", Name: "Leather Jacket", Category: "overtop", HasColor: true, Colors: colors},
		{ID: "Hoodie", Name: "Hoodie", Category: "overtop", HasColor: true, Colors: colors},
		{ID: "Coat", Name: "Coat", Category: "overtop", HasColor: true, Colors: colors},
		{ID: "Cloak", Name: "Cloak", Category: "overtop", HasColor: true, Colors: colors},
		{ID: "Scavenger_Poncho", Name: "Scavenger Poncho", Category: "overtop", HasColor: true, Colors: colors},
		{ID: "Armor_Light", Name: "Light Armor", Category: "overtop", HasColor: true, Colors: []string{"Iron_Black", "Silver_Blue", "Gold_Red", "Bronze"}},
		{ID: "Armor_Heavy", Name: "Heavy Armor", Category: "overtop", HasColor: true, Colors: []string{"Iron_Black", "Silver_Blue", "Gold_Red", "Bronze"}},
		{ID: "Robe", Name: "Robe", Category: "overtop", HasColor: true, Colors: colors},
	}
}

func getPants() []CosmeticItem {
	colors := []string{"Black", "White", "Grey", "Brown", "Blue", "Green", "Khaki", "Navy", "Olive"}
	return []CosmeticItem{
		{ID: "Jeans", Name: "Jeans", Category: "pants", HasColor: true, Colors: colors},
		{ID: "Shorts", Name: "Shorts", Category: "pants", HasColor: true, Colors: colors},
		{ID: "Cargo", Name: "Cargo Pants", Category: "pants", HasColor: true, Colors: colors},
		{ID: "Leggings", Name: "Leggings", Category: "pants", HasColor: true, Colors: colors},
		{ID: "Skirt", Name: "Skirt", Category: "pants", HasColor: true, Colors: colors},
		{ID: "ShortDungareesRegular", Name: "Short Dungarees", Category: "pants", HasColor: true, Colors: colors},
		{ID: "ArmorLegs", Name: "Armor Legs", Category: "pants", HasColor: true, Colors: []string{"Iron_Black", "Silver_Blue", "Gold_Red"}},
	}
}

func getShoes() []CosmeticItem {
	colors := []string{"Black", "White", "Grey", "Brown", "Red", "Blue"}
	return []CosmeticItem{
		{ID: "BasicBoots", Name: "Basic Boots", Category: "shoes", HasColor: true, Colors: colors},
		{ID: "Sneakers", Name: "Sneakers", Category: "shoes", HasColor: true, Colors: colors},
		{ID: "Sandals", Name: "Sandals", Category: "shoes", HasColor: true, Colors: colors},
		{ID: "HighBoots", Name: "High Boots", Category: "shoes", HasColor: true, Colors: colors},
		{ID: "ArmorBoots", Name: "Armor Boots", Category: "shoes", HasColor: true, Colors: []string{"Iron_Black", "Silver_Blue", "Gold_Red"}},
		{ID: "Barefoot", Name: "Barefoot", Category: "shoes", Description: "No shoes"},
	}
}

func getHeadAccessories() []CosmeticItem {
	colors := []string{"Black", "White", "Grey", "Brown", "Red", "Blue", "Green", "Purple", "Gold_Red", "Silver_Blue"}
	return []CosmeticItem{
		{ID: "Crown", Name: "Crown", Category: "headAccessory", HasColor: true, Colors: []string{"Gold_Red", "Silver_Blue", "Bronze"}},
		{ID: "Hat_Top", Name: "Top Hat", Category: "headAccessory", HasColor: true, Colors: colors},
		{ID: "Bandana", Name: "Bandana", Category: "headAccessory", HasColor: true, Colors: colors},
		{ID: "Headband", Name: "Headband", Category: "headAccessory", HasColor: true, Colors: colors},
		{ID: "Helmet", Name: "Helmet", Category: "headAccessory", HasColor: true, Colors: []string{"Iron_Black", "Silver_Blue", "Gold_Red"}},
		{ID: "Hood", Name: "Hood", Category: "headAccessory", HasColor: true, Colors: colors},
		{ID: "Circlet", Name: "Circlet", Category: "headAccessory", HasColor: true, Colors: []string{"Gold_Red", "Silver_Blue"}},
		{ID: "Flower", Name: "Flower", Category: "headAccessory", HasColor: true, Colors: []string{"Red", "Blue", "Yellow", "Pink", "White"}},
	}
}

func getFaceAccessories() []CosmeticItem {
	return []CosmeticItem{
		{ID: "Glasses_Round", Name: "Round Glasses", Category: "faceAccessory", HasColor: true, Colors: []string{"Black", "Gold_Red", "Silver_Blue", "Brown"}},
		{ID: "Glasses_Square", Name: "Square Glasses", Category: "faceAccessory", HasColor: true, Colors: []string{"Black", "Gold_Red", "Silver_Blue", "Brown"}},
		{ID: "Sunglasses", Name: "Sunglasses", Category: "faceAccessory", HasColor: true, Colors: []string{"Black", "Brown", "Blue"}},
		{ID: "Eyepatch", Name: "Eyepatch", Category: "faceAccessory", HasColor: true, Colors: []string{"Black", "Brown", "Red"}},
		{ID: "Mask", Name: "Mask", Category: "faceAccessory", HasColor: true, Colors: []string{"Black", "White", "Red", "Blue"}},
		{ID: "Earrings", Name: "Earrings", Category: "faceAccessory", HasColor: true, Colors: []string{"Gold_Red", "Silver_Blue", "Iron_Black"}},
		{ID: "NoseRing", Name: "Nose Ring", Category: "faceAccessory", HasColor: true, Colors: []string{"Gold_Red", "Silver_Blue"}},
		{ID: "Monocle", Name: "Monocle", Category: "faceAccessory", HasColor: true, Colors: []string{"Gold_Red", "Silver_Blue", "Black"}},
	}
}

func getGloves() []CosmeticItem {
	colors := []string{"Black", "White", "Brown", "Grey", "Red"}
	return []CosmeticItem{
		{ID: "Gloves_Leather", Name: "Leather Gloves", Category: "gloves", HasColor: true, Colors: colors},
		{ID: "Gloves_Fingerless", Name: "Fingerless Gloves", Category: "gloves", HasColor: true, Colors: colors},
		{ID: "Gloves_Armor", Name: "Armor Gloves", Category: "gloves", HasColor: true, Colors: []string{"Iron_Black", "Silver_Blue", "Gold_Red"}},
		{ID: "Gloves_Cloth", Name: "Cloth Gloves", Category: "gloves", HasColor: true, Colors: colors},
		{ID: "Bracers", Name: "Bracers", Category: "gloves", HasColor: true, Colors: []string{"Brown", "Black", "Iron_Black", "Gold_Red"}},
	}
}

func getCapes() []CosmeticItem {
	colors := []string{"Black", "White", "Red", "Blue", "Green", "Purple", "Gold_Red", "Silver_Blue"}
	return []CosmeticItem{
		{ID: "Cape_Royal_Emissary", Name: "Royal Emissary Cape", Category: "cape", HasColor: true, Colors: colors, HasVariant: true, Variants: []string{"Neck_Piece", "Full"}},
		{ID: "Cape_Simple", Name: "Simple Cape", Category: "cape", HasColor: true, Colors: colors},
		{ID: "Cape_Torn", Name: "Torn Cape", Category: "cape", HasColor: true, Colors: colors},
		{ID: "Cape_Hooded", Name: "Hooded Cape", Category: "cape", HasColor: true, Colors: colors},
		{ID: "Cape_Short", Name: "Short Cape", Category: "cape", HasColor: true, Colors: colors},
		{ID: "Scarf", Name: "Scarf", Category: "cape", HasColor: true, Colors: colors},
	}
}

func generateNumberVariants(start, end int) []string {
	var variants []string
	for i := start; i <= end; i++ {
		variants = append(variants, fmt.Sprintf("%d", i))
	}
	return variants
}

// FormatCosmeticValue formats a cosmetic value with the correct syntax
// Simple items: "ID.Color"
// Complex items: "ID.Color.Variant"
func FormatCosmeticValue(id, color, variant string) string {
	if variant != "" {
		return fmt.Sprintf("%s.%s.%s", id, color, variant)
	}
	if color != "" {
		return fmt.Sprintf("%s.%s", id, color)
	}
	return id
}

// ParseCosmeticValue parses a cosmetic value string
func ParseCosmeticValue(value string) (id, color, variant string) {
	if value == "" {
		return
	}

	parts := splitCosmeticValue(value)
	switch len(parts) {
	case 1:
		id = parts[0]
	case 2:
		id = parts[0]
		color = parts[1]
	case 3:
		id = parts[0]
		color = parts[1]
		variant = parts[2]
	}
	return
}

func splitCosmeticValue(value string) []string {
	var parts []string
	current := ""
	for _, ch := range value {
		if ch == '.' {
			if current != "" {
				parts = append(parts, current)
				current = ""
			}
		} else {
			current += string(ch)
		}
	}
	if current != "" {
		parts = append(parts, current)
	}
	return parts
}
