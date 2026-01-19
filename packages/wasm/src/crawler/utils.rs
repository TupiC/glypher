use scraper::{Html, Selector};
use std::collections::BTreeSet;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

/// Log a message to the JavaScript console
pub fn console_log(msg: &str) {
    log(msg);
}

/// Extract all text content from HTML and return unique glyphs (characters)
pub fn extract_glyphs_from_html(html: &str) -> BTreeSet<char> {
    let document = Html::parse_document(html);
    let mut glyphs = BTreeSet::new();

    let body_selector = Selector::parse("body").unwrap();

    if let Some(body) = document.select(&body_selector).next() {
        extract_text_recursive(&body, &mut glyphs);
    }

    glyphs
}

/// Recursively extract text from an element, skipping script and style tags
fn extract_text_recursive(element: &scraper::ElementRef, glyphs: &mut BTreeSet<char>) {
    for child in element.children() {
        match child.value() {
            scraper::node::Node::Text(text) => {
                for c in text.chars() {
                    // skip whitespace & protected whitespace
                    if !c.is_whitespace() || c == '\u{00A0}' {
                        glyphs.insert(c);
                    }
                }
            }
            scraper::node::Node::Element(el) => {
                let tag_name = el.name();
                if !matches!(tag_name, "script" | "style" | "noscript" | "svg" | "path") {
                    if let Some(child_ref) = scraper::ElementRef::wrap(child) {
                        extract_text_recursive(&child_ref, glyphs);
                    }
                }
            }
            _ => {}
        }
    }
}

/// Extract glyphs from alt attributes of images
pub fn extract_glyphs_from_attributes(html: &str) -> BTreeSet<char> {
    let document = Html::parse_document(html);
    let mut glyphs = BTreeSet::new();

    let img_selector = Selector::parse("img[alt]").unwrap();
    for element in document.select(&img_selector) {
        if let Some(alt) = element.value().attr("alt") {
            for c in alt.chars() {
                if !c.is_whitespace() || c == '\u{00A0}' {
                    glyphs.insert(c);
                }
            }
        }
    }

    let title_selector = Selector::parse("[title]").unwrap();
    for element in document.select(&title_selector) {
        if let Some(title) = element.value().attr("title") {
            for c in title.chars() {
                if !c.is_whitespace() || c == '\u{00A0}' {
                    glyphs.insert(c);
                }
            }
        }
    }

    let placeholder_selector = Selector::parse("[placeholder]").unwrap();
    for element in document.select(&placeholder_selector) {
        if let Some(placeholder) = element.value().attr("placeholder") {
            for c in placeholder.chars() {
                if !c.is_whitespace() || c == '\u{00A0}' {
                    glyphs.insert(c);
                }
            }
        }
    }

    let aria_selector = Selector::parse("[aria-label]").unwrap();
    for element in document.select(&aria_selector) {
        if let Some(aria_label) = element.value().attr("aria-label") {
            for c in aria_label.chars() {
                if !c.is_whitespace() || c == '\u{00A0}' {
                    glyphs.insert(c);
                }
            }
        }
    }

    glyphs
}

/// Format glyphs for display - shows character and its Unicode code point
pub fn format_glyphs(glyphs: &BTreeSet<char>) -> String {
    glyphs
        .iter()
        .map(|c| format!("'{}' (U+{:04X})", c, *c as u32))
        .collect::<Vec<_>>()
        .join(", ")
}

/// Convert glyphs to a sorted string
pub fn glyphs_to_string(glyphs: &BTreeSet<char>) -> String {
    glyphs.iter().collect()
}
