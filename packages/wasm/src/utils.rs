use serde_json::json;
use ttf_parser::Face;
use wasm_bindgen::prelude::*;
use wuff::{decompress_woff1, decompress_woff2};

/// Validate that the input data is a valid TTF/OTF font
pub fn validate_ttf(data: &[u8]) -> Result<(), String> {
    if data.len() < 12 {
        return Err("Font data too short".to_string());
    }

    let signature = u32::from_be_bytes([data[0], data[1], data[2], data[3]]);
    if signature != 0x00010000 && signature != 0x4F54544F && signature != 0x74727565 {
        return Err("Invalid font signature".to_string());
    }

    Face::parse(data, 0).map_err(|_| "Failed to parse font".to_string())?;

    Ok(())
}

/// Parse a Unicode string in various formats:
/// - U+0041
/// - 0x0041
/// - 0041
/// - 65 (decimal)
#[wasm_bindgen]
pub fn parse_unicode(mut str: String) -> Result<u32, String> {
    str = str.trim().to_uppercase();

    //U+0041 format
    if str.starts_with("U+") || str.starts_with("0X") {
        return u32::from_str_radix(&str.split_at(2).1, 16)
            .map_err(|e| format!("Invalid Unicode code point: {}", e));
    }

    //hex format
    if is_hex_regex(&str) {
        //has letters or is 4+ digits), try hex first
        if has_letters_regex(&str) || str.len() >= 4 {
            return u32::from_str_radix(&str, 16)
                .map_err(|e| format!("Invalid Unicode code point: {}", e));
        }
        //try decimal
        return str
            .parse::<u32>()
            .map_err(|e| format!("Invalid Unicode code point: {}", e));
    }

    //decimal format
    return str
        .parse::<u32>()
        .map_err(|e| format!("Invalid Unicode code point: {}", e));
}

pub fn is_hex_regex(s: &str) -> bool {
    !s.is_empty()
        && s.as_bytes()
            .iter()
            .all(|&b| b.is_ascii_digit() || (b'A'..=b'F').contains(&b))
}

pub fn has_letters_regex(s: &str) -> bool {
    !s.is_empty() && s.as_bytes().iter().any(|&b| (b'A'..=b'F').contains(&b))
}

#[derive(Debug, PartialEq)]
pub enum FontFormat {
    Woff2,
    Woff,
    Ttf,
    Unknown,
}

pub fn get_font_format(data: &[u8]) -> FontFormat {
    if is_woff2(data) {
        FontFormat::Woff2
    } else if is_woff(data) {
        FontFormat::Woff
    } else if is_ttf(data) {
        FontFormat::Ttf
    } else {
        FontFormat::Unknown
    }
}

pub fn decompress_font(data: &[u8]) -> Vec<u8> {
    let font_format = get_font_format(data);
    match font_format {
        FontFormat::Woff2 => decompress_woff2(data).unwrap().to_vec(),
        FontFormat::Woff => decompress_woff1(data).unwrap().to_vec(),
        _ => data.to_vec(),
    }
}

fn is_woff2(data: &[u8]) -> bool {
    data.starts_with(&[0x77, 0x4F, 0x46, 0x32])
}

fn is_woff(data: &[u8]) -> bool {
    data.starts_with(&[0x77, 0x4F, 0x46, 0x46])
}

fn is_ttf(data: &[u8]) -> bool {
    data.starts_with(&[0x00, 0x01, 0x00, 0x00])
}

/// Get variable font axis tags. Returns JSON array of axis names (e.g. ["wdth","wght"]).
/// Returns empty array for non-variable fonts.
#[wasm_bindgen]
pub fn get_variable_font_axes(data: &[u8]) -> String {
    let data = decompress_font(data);
    let face = match Face::parse(&data, 0) {
        Ok(f) => f,
        Err(_) => return json!([]).to_string(),
    };
    if !face.is_variable() {
        return json!([]).to_string();
    }
    let axes: Vec<String> = face
        .variation_axes()
        .into_iter()
        .map(|axis| axis.tag.to_string())
        .collect();
    json!(axes).to_string()
}
