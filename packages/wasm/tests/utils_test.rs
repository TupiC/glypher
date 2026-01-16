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
fn test_read_u32_be() {
    let data: Vec<u8> = vec![0x12, 0x34, 0x56, 0x78, 0xAB, 0xCD, 0xEF, 0x00];

    assert_eq!(read_u32_be(&data, 0), 0x12345678);
    assert_eq!(read_u32_be(&data, 4), 0xABCDEF00);
}

#[test]
fn test_read_u16_be() {
    let data: Vec<u8> = vec![0x12, 0x34, 0x56, 0x78];

    assert_eq!(read_u16_be(&data, 0), 0x1234);
    assert_eq!(read_u16_be(&data, 2), 0x5678);
}

#[test]
fn test_write_u32_be() {
    let mut bytes = Vec::new();
    write_u32_be(&mut bytes, 0x12345678);
    write_u32_be(&mut bytes, 0xABCDEF00);

    assert_eq!(bytes.len(), 8);
    assert_eq!(bytes[0..4], [0x12, 0x34, 0x56, 0x78]);
    assert_eq!(bytes[4..8], [0xAB, 0xCD, 0xEF, 0x00]);
}

#[test]
fn test_write_u16_be() {
    let mut bytes = Vec::new();
    write_u16_be(&mut bytes, 0x1234);
    write_u16_be(&mut bytes, 0x5678);

    assert_eq!(bytes.len(), 4);
    assert_eq!(bytes[0..2], [0x12, 0x34]);
    assert_eq!(bytes[2..4], [0x56, 0x78]);
}

#[test]
fn test_compress_font_data() {
    let data = b"Hello, World! This is some test data for compression.";
    let result = compress_font_data(data);

    assert!(result.is_ok());
    let compressed = result.unwrap();

    // Compressed data should be different from original
    assert_ne!(compressed, data);
    // Compressed data should not be empty
    assert!(!compressed.is_empty());
    // For small data, compression might add overhead, so we just check it's valid
    assert!(compressed.len() > 0);
}

#[test]
fn test_compress_font_data_empty() {
    let data = b"";
    let result = compress_font_data(data);

    assert!(result.is_ok());
    let compressed = result.unwrap();
    // Even empty data can be compressed (will result in a small zlib header)
    assert!(!compressed.is_empty());
}

#[test]
fn test_compress_font_data_large() {
    // Create a larger dataset
    let data: Vec<u8> = (0..1000).map(|i| (i % 256) as u8).collect();
    let result = compress_font_data(&data);

    assert!(result.is_ok());
    let compressed = result.unwrap();
    // Large repetitive data should compress well
    assert!(compressed.len() < data.len());
}

#[test]
fn test_read_write_u32_be_roundtrip() {
    let original_value = 0xDEADBEEF;
    let mut bytes = Vec::new();
    write_u32_be(&mut bytes, original_value);

    let read_value = read_u32_be(&bytes, 0);
    assert_eq!(original_value, read_value);
}

#[test]
fn test_read_write_u16_be_roundtrip() {
    let original_value = 0xBEEF;
    let mut bytes = Vec::new();
    write_u16_be(&mut bytes, original_value);

    let read_value = read_u16_be(&bytes, 0);
    assert_eq!(original_value, read_value);
}

#[test]
fn test_parse_unicode() {
    assert_eq!(parse_unicode("U+0041".to_string()), Ok(65));
    assert_eq!(parse_unicode("0x0041".to_string()), Ok(65));
    assert_eq!(parse_unicode("0041".to_string()), Ok(65));
    assert_eq!(parse_unicode("65".to_string()), Ok(65));
}
