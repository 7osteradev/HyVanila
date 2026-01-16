package news

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"
)

type NewsItem struct {
	Title       string `json:"title"`
	Excerpt     string `json:"excerpt"`
	URL         string `json:"url"`
	Date        string `json:"date"`
	Author      string `json:"author"`
	ImageURL    string `json:"imageUrl"`
}

// FetchNews fetches news from hytale.com/news
func FetchNews(limit int) ([]NewsItem, error) {
	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	req, err := http.NewRequest("GET", "https://hytale.com/news", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("User-Agent", "HyPrism/1.0")
	req.Header.Set("Accept", "text/html")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch news: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	items, err := parseNewsHTML(string(body), limit)
	if err != nil {
		return nil, err
	}

	// Fetch images for each news item concurrently
	var wg sync.WaitGroup
	for i := range items {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			if imgURL := fetchNewsImage(items[idx].URL); imgURL != "" {
				items[idx].ImageURL = imgURL
			}
		}(i)
	}
	wg.Wait()

	return items, nil
}

// fetchNewsImage fetches the featured image from a news article page
func fetchNewsImage(url string) string {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return ""
	}

	req.Header.Set("User-Agent", "HyPrism/1.0")
	req.Header.Set("Accept", "text/html")

	resp, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ""
	}

	html := string(body)

	// Look for og:image meta tag (most reliable)
	ogImagePattern := regexp.MustCompile(`<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']`)
	if match := ogImagePattern.FindStringSubmatch(html); len(match) > 1 {
		return match[1]
	}

	// Alternative: content first then property
	ogImagePattern2 := regexp.MustCompile(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']`)
	if match := ogImagePattern2.FindStringSubmatch(html); len(match) > 1 {
		return match[1]
	}

	// Look for twitter:image
	twitterImagePattern := regexp.MustCompile(`<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']`)
	if match := twitterImagePattern.FindStringSubmatch(html); len(match) > 1 {
		return match[1]
	}

	// Look for first large image in article
	imgPattern := regexp.MustCompile(`<img[^>]+src=["']([^"']+(?:jpg|jpeg|png|webp)[^"']*)["']`)
	if match := imgPattern.FindStringSubmatch(html); len(match) > 1 {
		imgURL := match[1]
		if !strings.HasPrefix(imgURL, "http") {
			imgURL = "https://hytale.com" + imgURL
		}
		return imgURL
	}

	return ""
}

func parseNewsHTML(html string, limit int) ([]NewsItem, error) {
	var items []NewsItem

	// Pattern to match news article links with their content
	// Looking for patterns like: [TITLE excerpt... Date Posted by Author](URL)
	linkPattern := regexp.MustCompile(`<a[^>]+href="(/news/\d+/\d+/[^"]+)"[^>]*>([\s\S]*?)</a>`)
	matches := linkPattern.FindAllStringSubmatch(html, -1)

	for _, match := range matches {
		if len(matches) >= limit && len(items) >= limit {
			break
		}

		if len(match) < 3 {
			continue
		}

		url := "https://hytale.com" + match[1]
		content := match[2]

		// Skip if content is too short (likely navigation links)
		if len(content) < 50 {
			continue
		}

		// Extract title (usually in heading or at the start)
		titlePattern := regexp.MustCompile(`(?i)<h[1-6][^>]*>([^<]+)</h[1-6]>|<strong>([^<]+)</strong>`)
		titleMatch := titlePattern.FindStringSubmatch(content)
		title := ""
		if len(titleMatch) > 1 {
			title = titleMatch[1]
			if title == "" && len(titleMatch) > 2 {
				title = titleMatch[2]
			}
		}

		// If no title found, try to extract first line
		if title == "" {
			lines := strings.Split(strings.TrimSpace(stripHTML(content)), "\n")
			if len(lines) > 0 {
				title = strings.TrimSpace(lines[0])
				if len(title) > 100 {
					title = title[:100] + "..."
				}
			}
		}

		// Extract date pattern (Month Day, Year or Month YYYY)
		datePattern := regexp.MustCompile(`(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?\s+\d{4}`)
		dateMatch := datePattern.FindString(content)

		// Extract author
		authorPattern := regexp.MustCompile(`Posted by ([^<\n]+)`)
		authorMatch := authorPattern.FindStringSubmatch(content)
		author := ""
		if len(authorMatch) > 1 {
			author = strings.TrimSpace(authorMatch[1])
		}

		// Extract excerpt (text content without HTML)
		excerpt := stripHTML(content)
		excerpt = strings.TrimSpace(excerpt)
		// Remove title and metadata from excerpt
		if title != "" {
			excerpt = strings.TrimPrefix(excerpt, title)
		}
		excerpt = strings.TrimSpace(excerpt)
		if len(excerpt) > 200 {
			excerpt = excerpt[:200] + "..."
		}

		if title != "" {
			items = append(items, NewsItem{
				Title:   title,
				Excerpt: excerpt,
				URL:     url,
				Date:    dateMatch,
				Author:  author,
			})
		}
	}

	if len(items) > limit {
		items = items[:limit]
	}

	return items, nil
}

func stripHTML(s string) string {
	// Remove HTML tags
	re := regexp.MustCompile(`<[^>]*>`)
	s = re.ReplaceAllString(s, " ")
	// Remove extra whitespace
	s = regexp.MustCompile(`\s+`).ReplaceAllString(s, " ")
	return strings.TrimSpace(s)
}

// NewsService provides news fetching capabilities
type NewsService struct {
	cache     []NewsItem
	cacheTime time.Time
	cacheTTL  time.Duration
}

// NewNewsService creates a new news service
func NewNewsService() *NewsService {
	return &NewsService{
		cacheTTL: 5 * time.Minute,
	}
}

// GetNews returns cached news or fetches new news if cache is expired
func (s *NewsService) GetNews(limit int) ([]NewsItem, error) {
	// Check cache
	if time.Since(s.cacheTime) < s.cacheTTL && len(s.cache) > 0 {
		if len(s.cache) > limit {
			return s.cache[:limit], nil
		}
		return s.cache, nil
	}

	// Fetch fresh news
	items, err := FetchNews(limit)
	if err != nil {
		// Return cached data if available
		if len(s.cache) > 0 {
			return s.cache, nil
		}
		return nil, err
	}

	// Update cache
	s.cache = items
	s.cacheTime = time.Now()

	return items, nil
}

// ToJSON converts news items to JSON string
func (s *NewsService) ToJSON(items []NewsItem) (string, error) {
	data, err := json.Marshal(items)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
