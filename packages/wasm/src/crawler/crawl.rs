use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use std::collections::{BTreeSet, HashSet, VecDeque};
use wasm_bindgen::prelude::*;

use super::utils::{extract_glyphs_from_attributes, extract_glyphs_from_html};

/// Result of crawling a website for glyphs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrawlResult {
    /// All unique glyphs found across all crawled pages
    pub glyphs: BTreeSet<char>,
    /// URLs that were successfully crawled
    pub crawled_urls: HashSet<String>,
    /// Number of pages crawled
    pub pages_crawled: usize,
}

impl CrawlResult {
    pub fn new() -> Self {
        Self {
            glyphs: BTreeSet::new(),
            crawled_urls: HashSet::new(),
            pages_crawled: 0,
        }
    }
}

impl Default for CrawlResult {
    fn default() -> Self {
        Self::new()
    }
}

/// Crawl a website and extract all unique glyphs from text content
pub async fn crawl_and_extract_glyphs(url: &str, depth: u8) -> Result<CrawlResult, String> {
    println!("Starting glyph extraction crawl: {:?}", url);

    let mut result = CrawlResult::new();
    let mut visited = HashSet::new();
    let mut queue = VecDeque::new();

    queue.push_back((url.to_string(), 0));
    visited.insert(url.to_string());
    let base_url = extract_base_url(url);

    while let Some((current_url, current_depth)) = queue.pop_front() {
        if current_depth > depth {
            continue;
        }

        println!("Crawling [depth {}]: {}", current_depth, current_url);

        let response = match reqwest::get(&current_url).await {
            Ok(resp) => resp,
            Err(e) => {
                eprintln!("Failed to fetch {}: {}", current_url, e);
                continue;
            }
        };

        let content_type = response
            .headers()
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");

        if !content_type.contains("text/html") {
            println!("Skipping non-HTML content: {}", current_url);
            continue;
        }

        let body = match response.text().await {
            Ok(text) => text,
            Err(e) => {
                eprintln!("Failed to read body from {}: {}", current_url, e);
                continue;
            }
        };

        let page_glyphs = extract_glyphs_from_html(&body);
        let attr_glyphs = extract_glyphs_from_attributes(&body);

        let page_glyph_count = page_glyphs.len();
        let attr_glyph_count = attr_glyphs.len();

        result.glyphs.extend(page_glyphs);
        result.glyphs.extend(attr_glyphs);
        result.crawled_urls.insert(current_url.clone());
        result.pages_crawled += 1;

        println!(
            "  Found {} unique glyphs on this page (total: {})",
            page_glyph_count + attr_glyph_count,
            result.glyphs.len()
        );

        if current_depth < depth {
            let document = Html::parse_document(&body);
            let selector = Selector::parse("a[href]").unwrap();

            for element in document.select(&selector) {
                if let Some(href) = element.value().attr("href") {
                    let full_url = resolve_url(&base_url, &current_url, href);

                    if let Some(ref resolved) = full_url {
                        if resolved.starts_with(&base_url) && visited.insert(resolved.clone()) {
                            queue.push_back((resolved.clone(), current_depth + 1));
                        }
                    }
                }
            }
        }
    }

    println!(
        "\nCrawl complete! Visited {} pages, found {} unique glyphs",
        result.pages_crawled,
        result.glyphs.len()
    );

    Ok(result)
}

/// Extract the base URL (protocol + domain) from a URL
fn extract_base_url(url: &str) -> String {
    url.split('/').take(3).collect::<Vec<&str>>().join("/")
}

/// Resolve a potentially relative URL to an absolute URL
fn resolve_url(base_url: &str, current_url: &str, href: &str) -> Option<String> {
    if href.starts_with("mailto:")
        || href.starts_with("tel:")
        || href.starts_with("javascript:")
        || href.starts_with("#")
        || href.starts_with("data:")
    {
        return None;
    }

    if href.starts_with("http://") || href.starts_with("https://") {
        return Some(href.to_string());
    }

    if href.starts_with("//") {
        let protocol = if base_url.starts_with("https://") {
            "https:"
        } else {
            "http:"
        };
        return Some(format!("{}{}", protocol, href));
    }

    if href.starts_with('/') {
        return Some(format!("{}{}", base_url, href));
    }

    let current_dir = current_url
        .rfind('/')
        .map(|i| &current_url[..i])
        .unwrap_or(base_url);

    Some(format!("{}/{}", current_dir, href))
}

/// WASM-compatible version that returns glyphs as a JSON string
#[wasm_bindgen]
pub async fn crawl(url: &str, depth: u8) -> Result<String, String> {
    let result = crawl_and_extract_glyphs(url, depth).await?;

    let glyphs_string: String = result.glyphs.iter().collect();
    Ok(glyphs_string)
}
