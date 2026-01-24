use crate::utils::decompress_font;
use fontcull_klippa::{Plan, SubsetFlags, subset_font as klippa_subset};
use fontcull_write_fonts::{
    read::{FontRef, collections::int_set::IntSet},
    types::GlyphId,
};
use std::collections::HashSet;
use ttf_parser::Face;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn subset_font(data: &[u8], glyphs: Vec<u16>) -> Vec<u8> {
    let data = decompress_font(data);

    let font_ref = match FontRef::new(&data) {
        Ok(font) => font,
        Err(_) => return data.to_vec(),
    };

    let face = match Face::parse(&data, 0) {
        Ok(face) => face,
        Err(_) => return data.to_vec(),
    };

    let mut unicodes_set = HashSet::new();
    let glyph_set: HashSet<u16> = glyphs.iter().cloned().collect();

    if let Some(cmap) = face.tables().cmap {
        for subtable in cmap.subtables {
            for codepoint in 0x0000..=0xFFFF {
                if let Some(gid) = subtable.glyph_index(codepoint) {
                    if glyph_set.contains(&gid.0) {
                        unicodes_set.insert(codepoint);
                    }
                }
            }
        }
    }

    let mut input_unicodes = IntSet::empty();
    for &unicode in &unicodes_set {
        input_unicodes.insert(unicode);
    }

    let mut input_gids = IntSet::empty();
    for &gid in &glyphs {
        input_gids.insert(GlyphId::new(gid as u32));
    }

    let flags = SubsetFlags::default();
    let drop_tables = IntSet::empty();
    let layout_scripts = IntSet::empty();
    let layout_features = IntSet::empty();
    let name_ids = IntSet::empty();
    let name_languages = IntSet::empty();

    let plan = Plan::new(
        &input_gids,
        &input_unicodes,
        &font_ref,
        flags,
        &drop_tables,
        &layout_scripts,
        &layout_features,
        &name_ids,
        &name_languages,
    );

    match klippa_subset(&font_ref, &plan) {
        Ok(subset_data) => subset_data,
        Err(_) => data.to_vec(),
    }
}

#[wasm_bindgen]
pub fn subset_font_by_unicodes(data: &[u8], unicodes: Vec<u32>) -> Vec<u8> {
    let data = decompress_font(data);

    let font_ref = match FontRef::new(&data) {
        Ok(font) => font,
        Err(_) => return data.to_vec(),
    };

    let face = match Face::parse(&data, 0) {
        Ok(face) => face,
        Err(_) => return data.to_vec(),
    };

    let mut unicodes_set = HashSet::new();
    let mut glyph_set = HashSet::new();

    if let Some(cmap) = face.tables().cmap {
        for &unicode in &unicodes {
            unicodes_set.insert(unicode);

            for subtable in cmap.subtables {
                if let Some(gid) = subtable.glyph_index(unicode) {
                    glyph_set.insert(gid.0);
                    break;
                }
            }
        }
    } else {
        for &unicode in &unicodes {
            unicodes_set.insert(unicode);
        }
    }

    let mut input_unicodes = IntSet::empty();
    for &unicode in &unicodes_set {
        input_unicodes.insert(unicode);
    }

    let mut input_gids = IntSet::empty();
    for &gid in &glyph_set {
        input_gids.insert(GlyphId::new(gid as u32));
    }

    let flags = SubsetFlags::default();
    let drop_tables = IntSet::empty();
    let layout_scripts = IntSet::empty();
    let layout_features = IntSet::empty();
    let name_ids = IntSet::empty();
    let name_languages = IntSet::empty();

    let plan = Plan::new(
        &input_gids,
        &input_unicodes,
        &font_ref,
        flags,
        &drop_tables,
        &layout_scripts,
        &layout_features,
        &name_ids,
        &name_languages,
    );

    match klippa_subset(&font_ref, &plan) {
        Ok(subset_data) => subset_data,
        Err(_) => data.to_vec(),
    }
}
