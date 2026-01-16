use crate::ttf_to_woff::woff::ttf_to_woff;
use crate::ttf_to_woff2::ttf_to_woff2;
use crate::utils::validate_ttf;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn convert_font(data: &[u8], format: &str) -> Vec<u8> {
    if validate_ttf(data).is_err() {
        return data.to_vec();
    }

    match format {
        "woff2" => match ttf_to_woff2(data) {
            Ok(woff2_data) => woff2_data,
            Err(_) => data.to_vec(),
        },
        "woff" => match ttf_to_woff(data) {
            Ok(woff_data) => woff_data,
            Err(_) => data.to_vec(),
        },
        _ => data.to_vec(),
    }
}
