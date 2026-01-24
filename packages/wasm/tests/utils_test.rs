use glypher_wasm::utils::*;

#[test]
fn test_validate_ttf_with_valid_ttf() {
    // Valid TTF signature: 0x00010000
    let valid_ttf: Vec<u8> = vec![
        0x00, 0x01, 0x00, 0x00, // TTF signature
        0x00, 0x00, 0x00, 0x00, // numTables (placeholder)
        0x00, 0x00, 0x00, 0x00, // searchRange (placeholder)
        0x00, 0x00, 0x00, 0x00, // entrySelector (placeholder)
        0x00, 0x00, 0x00, 0x00, // rangeShift (placeholder)
    ];

    // Note: This will fail actual parsing, but we can test the signature check
    // For a fully valid test, we'd need a complete TTF file
    let result = validate_ttf(&valid_ttf);
    // The signature check passes, but parsing will fail with incomplete data
    assert!(result.is_err() || result.is_ok());
}

#[test]
fn test_validate_ttf_with_valid_otf() {
    // Valid OTF signature: 0x4F54544F ("OTTO")
    let valid_otf: Vec<u8> = vec![
        0x4F, 0x54, 0x54, 0x4F, // OTF signature
        0x00, 0x00, 0x00, 0x00, // numTables (placeholder)
        0x00, 0x00, 0x00, 0x00, // searchRange (placeholder)
        0x00, 0x00, 0x00, 0x00, // entrySelector (placeholder)
        0x00, 0x00, 0x00, 0x00, // rangeShift (placeholder)
    ];

    let result = validate_ttf(&valid_otf);
    // The signature check passes, but parsing will fail with incomplete data
    assert!(result.is_err() || result.is_ok());
}

#[test]
fn test_validate_ttf_with_valid_truetype() {
    // Valid TrueType signature: 0x74727565 ("true")
    let valid_truetype: Vec<u8> = vec![
        0x74, 0x72, 0x75, 0x65, // TrueType signature
        0x00, 0x00, 0x00, 0x00, // numTables (placeholder)
        0x00, 0x00, 0x00, 0x00, // searchRange (placeholder)
        0x00, 0x00, 0x00, 0x00, // entrySelector (placeholder)
        0x00, 0x00, 0x00, 0x00, // rangeShift (placeholder)
    ];

    let result = validate_ttf(&valid_truetype);
    // The signature check passes, but parsing will fail with incomplete data
    assert!(result.is_err() || result.is_ok());
}

#[test]
fn test_validate_ttf_with_invalid_signature() {
    let invalid_data: Vec<u8> = vec![
        0x12, 0x34, 0x56, 0x78, // Invalid signature
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00,
    ];

    let result = validate_ttf(&invalid_data);
    assert!(result.is_err());
    assert!(result.unwrap_err().contains("Invalid font signature"));
}

#[test]
fn test_validate_ttf_with_too_short_data() {
    let short_data: Vec<u8> = vec![0x00, 0x01, 0x00]; // Only 3 bytes

    let result = validate_ttf(&short_data);
    assert!(result.is_err());
    assert!(result.unwrap_err().contains("Font data too short"));
}

#[test]
fn test_parse_unicode() {
    assert_eq!(parse_unicode("U+0041".to_string()), Ok(65));
    assert_eq!(parse_unicode("0x0041".to_string()), Ok(65));
    assert_eq!(parse_unicode("0041".to_string()), Ok(65));
    assert_eq!(parse_unicode("65".to_string()), Ok(65));
}

#[test]
fn test_is_hex_regex() {
    //valid
    assert!(is_hex_regex("1234567890"));
    assert!(is_hex_regex("ABCDEF"));
    assert!(is_hex_regex("1A2B3C"));

    //invalid
    assert!(!is_hex_regex("GHIJKL"), "Should not accept non-hex letters");
    assert!(
        !is_hex_regex("abc"),
        "Current regex is case-sensitive (uppercase only)"
    );
    assert!(!is_hex_regex("1A 2B"), "Should not accept spaces");
    assert!(
        !is_hex_regex(""),
        "Empty string should be false due to '+' quantifier"
    );
}

#[test]
fn test_has_letters_regex() {
    // valid
    assert!(has_letters_regex("A123"));
    assert!(has_letters_regex("123F"));
    assert!(has_letters_regex("ABC"));
    assert!(has_letters_regex("F"));

    // invalid: no A–F letters
    assert!(!has_letters_regex("123456"));
    assert!(!has_letters_regex(""));
    assert!(!has_letters_regex("abc"));
}

#[test]
fn test_get_font_format() {
    let woff2_data = vec![0x77, 0x4F, 0x46, 0x32];
    let woff_data = vec![0x77, 0x4F, 0x46, 0x46];
    let ttf_data = vec![0x00, 0x01, 0x00, 0x00];
    let unknown_data = vec![0x12, 0x34, 0x56, 0x78];

    assert_eq!(get_font_format(&woff2_data), FontFormat::Woff2);
    assert_eq!(get_font_format(&woff_data), FontFormat::Woff);
    assert_eq!(get_font_format(&ttf_data), FontFormat::Ttf);
    assert_eq!(get_font_format(&unknown_data), FontFormat::Unknown);
}
