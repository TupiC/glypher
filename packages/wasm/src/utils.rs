use ttf_parser::Face;
use wasm_bindgen::prelude::*;

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
