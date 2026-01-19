use serde::{Deserialize, Serialize};
use std::collections::BTreeSet;
use wasm_bindgen::prelude::*;

/// A Unicode range defined as (start, end) inclusive
pub type UnicodeRange = (u32, u32);

/// A predefined character range with its metadata
pub struct CharacterRange {
    pub name: &'static str,
    pub description: &'static str,
    pub ranges: &'static [UnicodeRange],
}

/// Result of matching glyphs against a character range
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RangeMatch {
    pub name: String,
    /// Percentage of the range that the glyphs cover (glyphs_in_range / total_range_size)
    pub range_coverage_percent: f64,
    /// Number of glyphs that fall within this range
    pub glyphs_in_range: usize,
    /// Total number of code points in this range
    pub total_range_size: usize,
    /// Number of glyphs that don't fit in this range
    pub glyphs_outside_range: usize,
}

/// Predefined character ranges based on Unicode blocks
/// Reference: https://en.wikipedia.org/wiki/List_of_Unicode_characters
pub const CHARACTER_RANGES: &[CharacterRange] = &[
    // ==================== ASCII & Basic Latin ====================
    CharacterRange {
        name: "US_ASCII",
        description: "Printable US-ASCII characters (U+0020-U+007E)",
        ranges: &[(0x0020, 0x007E)],
    },
    CharacterRange {
        name: "LATIN_BASIC",
        description: "Basic Latin and Latin-1 Supplement",
        ranges: &[
            (0x0020, 0x007E), // Basic Latin (printable)
            (0x00A0, 0x00FF), // Latin-1 Supplement
        ],
    },
    // ==================== Latin Scripts ====================
    CharacterRange {
        name: "LATIN",
        description: "Latin characters including Basic Latin, Latin-1 Supplement, and Latin Extended A/B",
        ranges: &[
            (0x0020, 0x007E), // Basic Latin (printable)
            (0x00A0, 0x00FF), // Latin-1 Supplement
            (0x0100, 0x017F), // Latin Extended-A
            (0x0180, 0x024F), // Latin Extended-B
        ],
    },
    CharacterRange {
        name: "LATIN_EXTENDED",
        description: "All Latin script blocks including extended ranges",
        ranges: &[
            (0x0020, 0x007E), // Basic Latin (printable)
            (0x00A0, 0x00FF), // Latin-1 Supplement
            (0x0100, 0x017F), // Latin Extended-A
            (0x0180, 0x024F), // Latin Extended-B
            (0x0250, 0x02AF), // IPA Extensions
            (0x1E00, 0x1EFF), // Latin Extended Additional
            (0x2C60, 0x2C7F), // Latin Extended-C
            (0xA720, 0xA7FF), // Latin Extended-D
            (0xAB30, 0xAB6F), // Latin Extended-E
        ],
    },
    // ==================== European Scripts ====================
    CharacterRange {
        name: "GREEK",
        description: "Greek and Coptic characters",
        ranges: &[
            (0x0370, 0x03FF), // Greek and Coptic
            (0x1F00, 0x1FFF), // Greek Extended
        ],
    },
    CharacterRange {
        name: "CYRILLIC",
        description: "Cyrillic characters",
        ranges: &[
            (0x0400, 0x04FF), // Cyrillic
            (0x0500, 0x052F), // Cyrillic Supplement
            (0x2DE0, 0x2DFF), // Cyrillic Extended-A
            (0xA640, 0xA69F), // Cyrillic Extended-B
        ],
    },
    // ==================== Middle Eastern Scripts ====================
    CharacterRange {
        name: "ARABIC",
        description: "Arabic characters",
        ranges: &[
            (0x0600, 0x06FF), // Arabic
            (0x0750, 0x077F), // Arabic Supplement
            (0x08A0, 0x08FF), // Arabic Extended-A
            (0xFB50, 0xFDFF), // Arabic Presentation Forms-A
            (0xFE70, 0xFEFF), // Arabic Presentation Forms-B
        ],
    },
    // ==================== South Asian Scripts ====================
    CharacterRange {
        name: "DEVANAGARI",
        description: "Devanagari characters (Hindi, Sanskrit, etc.)",
        ranges: &[
            (0x0900, 0x097F), // Devanagari
            (0xA8E0, 0xA8FF), // Devanagari Extended
        ],
    },
    CharacterRange {
        name: "BENGALI",
        description: "Bengali and Assamese characters",
        ranges: &[(0x0980, 0x09FF)],
    },
    CharacterRange {
        name: "GUJARATI",
        description: "Gujarati characters",
        ranges: &[(0x0A80, 0x0AFF)],
    },
    CharacterRange {
        name: "TAMIL",
        description: "Tamil characters",
        ranges: &[(0x0B80, 0x0BFF)],
    },
    CharacterRange {
        name: "TELUGU",
        description: "Telugu characters",
        ranges: &[(0x0C00, 0x0C7F)],
    },
    // ==================== East Asian Scripts ====================
    CharacterRange {
        name: "HANGUL",
        description: "Korean Hangul syllables",
        ranges: &[
            (0xAC00, 0xD7AF), // Hangul Syllables
            (0x1100, 0x11FF), // Hangul Jamo
            (0x3130, 0x318F), // Hangul Compatibility Jamo
        ],
    },
    CharacterRange {
        name: "CJK_UNIFIED",
        description: "CJK Unified Ideographs",
        ranges: &[
            (0x4E00, 0x9FFF),   // CJK Unified Ideographs
            (0x3400, 0x4DBF),   // CJK Unified Ideographs Extension A
            (0x20000, 0x2A6DF), // CJK Unified Ideographs Extension B
        ],
    },
];

impl CharacterRange {
    /// Get all code points in this range as a set
    pub fn code_points(&self) -> BTreeSet<u32> {
        let mut points = BTreeSet::new();
        for &(start, end) in self.ranges {
            for cp in start..=end {
                points.insert(cp);
            }
        }
        points
    }

    /// Get the total size of this range
    pub fn size(&self) -> usize {
        self.ranges
            .iter()
            .map(|&(start, end)| (end - start + 1) as usize)
            .sum()
    }

    /// Check if a character is in this range
    pub fn contains(&self, c: char) -> bool {
        let cp = c as u32;
        self.ranges
            .iter()
            .any(|&(start, end)| cp >= start && cp <= end)
    }
}

/// Calculate how well the given glyphs match each predefined range
/// Returns matches sorted by range coverage percentage (highest first)
///
/// Range coverage = glyphs_in_range / total_range_size
/// This shows what percentage of a range the website actually uses,
/// helping find the most appropriately-sized range.
pub fn find_best_matching_ranges(glyphs: &BTreeSet<char>) -> Vec<RangeMatch> {
    let mut matches: Vec<RangeMatch> = CHARACTER_RANGES
        .iter()
        .filter_map(|range| {
            let glyphs_in_range = glyphs.iter().filter(|&&c| range.contains(c)).count();
            let glyphs_outside_range = glyphs.len() - glyphs_in_range;
            let total_range_size = range.size();

            if glyphs_in_range == 0 {
                return None;
            }

            let range_coverage_percent = (glyphs_in_range as f64 / total_range_size as f64) * 100.0;

            Some(RangeMatch {
                name: range.name.to_string(),
                range_coverage_percent,
                glyphs_in_range,
                total_range_size,
                glyphs_outside_range,
            })
        })
        .collect();

    matches.sort_by(|a, b| {
        b.range_coverage_percent
            .partial_cmp(&a.range_coverage_percent)
            .unwrap()
    });

    matches
}

/// Get the best matching range for the given glyphs
pub fn get_best_match(glyphs: &BTreeSet<char>) -> Option<RangeMatch> {
    find_best_matching_ranges(glyphs).into_iter().next()
}

/// Format the range match results for display
pub fn format_range_matches(matches: &[RangeMatch]) -> String {
    let mut output = String::new();
    for m in matches {
        let fit_info = if m.glyphs_outside_range > 0 {
            format!(", {} glyphs outside range", m.glyphs_outside_range)
        } else {
            String::new()
        };
        output.push_str(&format!(
            "  {}: {:.1}% ({}/{} chars used{})\n",
            m.name, m.range_coverage_percent, m.glyphs_in_range, m.total_range_size, fit_info
        ));
    }
    output
}

// ==================== WASM Exports ====================

/// Get all available range names for CLI choices
/// Returns a JSON array of range names
#[wasm_bindgen]
pub fn get_available_range_names() -> String {
    let names: Vec<&str> = CHARACTER_RANGES.iter().map(|r| r.name).collect();
    serde_json::to_string(&names).unwrap_or_else(|_| "[]".to_string())
}

/// Expand a single character range definition into an array of Unicode code points
fn expand_range_internal(range_name: &str) -> Result<Vec<u32>, String> {
    let range = CHARACTER_RANGES
        .iter()
        .find(|r| r.name == range_name)
        .ok_or_else(|| format!("Unknown character range: {}", range_name))?;

    let mut code_points: Vec<u32> = Vec::new();
    for &(start, end) in range.ranges {
        for cp in start..=end {
            code_points.push(cp);
        }
    }
    Ok(code_points)
}

/// Expand multiple range names into a deduplicated array of Unicode code points
/// Takes a JSON array of range names, returns a Uint32Array of code points
#[wasm_bindgen]
pub fn expand_ranges(range_names_json: &str) -> Result<Vec<u32>, String> {
    let range_names: Vec<String> = serde_json::from_str(range_names_json)
        .map_err(|e| format!("Failed to parse range names: {}", e))?;

    let mut code_point_set = BTreeSet::new();
    for name in range_names {
        for cp in expand_range_internal(&name)? {
            code_point_set.insert(cp);
        }
    }

    Ok(code_point_set.into_iter().collect())
}
