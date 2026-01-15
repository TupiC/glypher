use ttf2woff2::{BrotliQuality, encode};

/// Convert TTF/OTF font data to WOFF2 format
pub fn ttf_to_woff2(data: &[u8]) -> Result<Vec<u8>, String> {
    let woff2 = encode(data, BrotliQuality::from(11));
    Ok(woff2.unwrap().to_vec())
}
