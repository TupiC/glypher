use crate::utils::validate_ttf;
use ttf_parser::Face;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn subset_font(data: &[u8], glyphs: Vec<u32>) -> Vec<u8> {
    if validate_ttf(data).is_err() {
        return data.to_vec();
    }

    let face = match Face::parse(data, 0) {
        Ok(face) => face,
        Err(_) => {
            return data.to_vec();
        }
    };

    if glyphs.is_empty() {
        return data.to_vec();
    }

    let num_glyphs = face.number_of_glyphs() as u32;
    let mut valid_glyphs = Vec::new();
    for glyph_id in &glyphs {
        if *glyph_id < num_glyphs {
            valid_glyphs.push(*glyph_id);
        }
    }

    // TODO: Implement proper font subsetting
    data.to_vec()
}
