use flate2::Compression;
use flate2::write::ZlibEncoder;
use regex::Regex;
use std::io::Write;
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

/// Read a 32-bit big-endian value from bytes
pub fn read_u32_be(data: &[u8], offset: usize) -> u32 {
    u32::from_be_bytes([
        data[offset],
        data[offset + 1],
        data[offset + 2],
        data[offset + 3],
    ])
}

/// Read a 16-bit big-endian value from bytes
pub fn read_u16_be(data: &[u8], offset: usize) -> u16 {
    u16::from_be_bytes([data[offset], data[offset + 1]])
}

/// Write a 32-bit big-endian value to bytes
pub fn write_u32_be(bytes: &mut Vec<u8>, value: u32) {
    bytes.extend_from_slice(&value.to_be_bytes());
}

/// Write a 16-bit big-endian value to bytes
pub fn write_u16_be(bytes: &mut Vec<u8>, value: u16) {
    bytes.extend_from_slice(&value.to_be_bytes());
}

/// Compress font data using zlib/deflate (required for WOFF1)
pub fn compress_font_data(data: &[u8]) -> Result<Vec<u8>, String> {
    let mut encoder = ZlibEncoder::new(Vec::new(), Compression::default());
    encoder
        .write_all(data)
        .map_err(|e| format!("Compression failed: {}", e))?;
    encoder
        .finish()
        .map_err(|e| format!("Compression finalization failed: {}", e))
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
    let hex_regex = Regex::new(r"^[0-9A-F]+$").unwrap();
    if hex_regex.is_match(&str) {
        //has letters or is 4+ digits), try hex first
        let has_letters_regex = Regex::new(r"[A-F]").unwrap();
        if has_letters_regex.is_match(&str) || str.len() >= 4 {
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
