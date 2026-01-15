use crate::utils::{
    compress_font_data, read_u16_be, read_u32_be, validate_ttf, write_u16_be, write_u32_be,
};

/// Convert TTF/OTF font data to WOFF1 format
pub fn ttf_to_woff(data: &[u8]) -> Result<Vec<u8>, String> {
    validate_ttf(data)?;

    if data.len() < 12 {
        return Err("Font data too short".to_string());
    }

    // Parse font header
    let num_tables = read_u16_be(data, 4) as usize;
    let header_size = 12;
    let table_dir_size = num_tables * 16;

    if data.len() < header_size + table_dir_size {
        return Err("Invalid font structure".to_string());
    }

    #[derive(Clone)]
    struct TableInfo {
        tag: u32,
        checksum: u32,
        orig_length: u32,
        compressed_data: Vec<u8>,
    }

    let mut tables = Vec::new();
    let mut total_orig_size = header_size + table_dir_size;

    // Parse and compress each table individually
    for i in 0..num_tables {
        let offset = header_size + i * 16;
        let tag = read_u32_be(data, offset);
        let checksum = read_u32_be(data, offset + 4);
        let table_offset = read_u32_be(data, offset + 8);
        let length = read_u32_be(data, offset + 12);

        let start = table_offset as usize;
        let end = start + length as usize;

        if end > data.len() {
            return Err("Table extends beyond font data".to_string());
        }

        let table_data = &data[start..end];

        // Pad table data to 4-byte boundary if needed (for checksum calculation)
        let mut padded_data = table_data.to_vec();
        while padded_data.len() % 4 != 0 {
            padded_data.push(0);
        }

        // Compress each table separately
        let compressed = compress_font_data(table_data)?;

        total_orig_size += length as usize;

        tables.push(TableInfo {
            tag,
            checksum,
            orig_length: length,
            compressed_data: compressed,
        });
    }

    // Build WOFF1 header
    let mut woff = Vec::new();

    // WOFF signature: "wOFF"
    woff.extend_from_slice(b"wOFF");

    // Flavor (TTF = 0x00010000, CFF = 0x4F54544F, TrueType = 0x74727565)
    let flavor = read_u32_be(data, 0);
    write_u32_be(&mut woff, flavor);

    // Calculate total file size
    let header_size = 44;
    let dir_size = num_tables * 20;
    let mut total_compressed_size = 0u32;
    for table in &tables {
        total_compressed_size += table.compressed_data.len() as u32;
        // Align to 4-byte boundary
        total_compressed_size = (total_compressed_size + 3) & !3;
    }
    let total_length = header_size as u32 + dir_size as u32 + total_compressed_size;
    write_u32_be(&mut woff, total_length);

    // Number of tables
    write_u16_be(&mut woff, num_tables as u16);
    write_u16_be(&mut woff, 0); // reserved

    // Total size of uncompressed font data (header + directory + all tables)
    write_u32_be(&mut woff, total_orig_size as u32);

    // Major and minor version of the original font
    // Extract from sfntVersion: 0x00010000 = 1.0, etc.
    let sfnt_version = read_u32_be(data, 0);
    let (major, minor) = if sfnt_version == 0x00010000 {
        (1u16, 0u16)
    } else if sfnt_version == 0x4F54544F || sfnt_version == 0x74727565 {
        // For OTF or TrueType, default to 1.0
        (1u16, 0u16)
    } else {
        // Extract from version if it's a valid version number
        ((sfnt_version >> 16) as u16, (sfnt_version & 0xFFFF) as u16)
    };
    write_u16_be(&mut woff, major);
    write_u16_be(&mut woff, minor);

    // Offset to metadata block (not used)
    write_u32_be(&mut woff, 0);
    // Length of compressed metadata block (not used)
    write_u32_be(&mut woff, 0);

    // Offset to private data block (not used)
    write_u32_be(&mut woff, 0);
    // Length of private data block (not used)
    write_u32_be(&mut woff, 0);

    // Table directory entries
    let mut data_offset = header_size as u32 + dir_size as u32;
    for table in &tables {
        // Tag (4 bytes)
        write_u32_be(&mut woff, table.tag);

        // Offset to the table data (in WOFF file)
        write_u32_be(&mut woff, data_offset);

        // Compressed length
        write_u32_be(&mut woff, table.compressed_data.len() as u32);

        // Original length
        write_u32_be(&mut woff, table.orig_length);

        // Original checksum
        write_u32_be(&mut woff, table.checksum);

        let compressed_len = table.compressed_data.len() as u32;
        // Align to 4-byte boundary
        data_offset += (compressed_len + 3) & !3;
    }

    // Append compressed table data (each table separately)
    for table in &tables {
        woff.extend_from_slice(&table.compressed_data);
        // Pad to 4-byte boundary
        while woff.len() % 4 != 0 {
            woff.push(0);
        }
    }

    Ok(woff)
}
