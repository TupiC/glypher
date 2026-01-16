mod consts;
mod header;

use deflate::deflate_bytes_zlib;
use std::cmp::min;

use super::bytebuf::ByteBuffer;
use consts::*;
use header::WoffHeader;

pub fn ttf_to_woff(bytes: &[u8]) -> Result<Vec<u8>, String> {
    let ttf_buf = ByteBuffer::from_bytes(bytes);

    let num_tables = ttf_buf.get_u16(TTF_OFFSET_NUM_TABLES);
    let sfnt_table_directory = parse_sfnt_table_directory(&ttf_buf, num_tables);

    let checksum_adjusted = get_checksum_adjustment(&ttf_buf, &sfnt_table_directory);

    let mut woff_header = WoffHeader::new(num_tables);

    let (woff_table_directory_buf, woff_table_data) = build_woff_table_directory_and_data(
        &ttf_buf,
        &sfnt_table_directory,
        &mut woff_header,
        checksum_adjusted,
    )?;

    let woff_buf = build_woff(&woff_header, &woff_table_directory_buf, &woff_table_data);

    return Ok(woff_buf.to_bytes().to_vec());
}

fn parse_sfnt_table_directory(ttf_buf: &ByteBuffer, num_tables: u16) -> Vec<TableEntry> {
    let mut entries: Vec<TableEntry> = Vec::new();

    for i in 0..num_tables {
        let data = ByteBuffer::from_buffer_start(
            ttf_buf,
            SIZEOF_SFNT_HEADER + (i as usize) * SIZEOF_SFNT_TABLE_ENTRY,
        );

        let sfnt_tag = ByteBuffer::from_buffer_slice(&data, SFNT_OFFSET_TAG, 4);

        let sfnt_entry = TableEntry {
            tag_str: sfnt_tag.to_string(),
            tag: sfnt_tag,
            checksum: data.get_u32(SFNT_OFFSET_CHECKSUM),
            offset: data.get_u32(SFNT_OFFSET_OFFSET),
            len: data.get_u32(SFNT_OFFSET_LENGTH),
        };

        entries.push(sfnt_entry);
    }

    entries.sort_by(|a, b| a.tag_str.cmp(&b.tag_str));

    return entries;
}

fn get_checksum_adjustment(ttf_buf: &ByteBuffer, sfnt_table_directory: &Vec<TableEntry>) -> u32 {
    let num_tables = sfnt_table_directory.len();
    let mut sfnt_offset = SIZEOF_SFNT_HEADER + num_tables * SIZEOF_SFNT_TABLE_ENTRY;
    let mut csum = calc_checksum(&ByteBuffer::from_buffer_slice(
        ttf_buf,
        0,
        SIZEOF_SFNT_HEADER,
    )) as usize;

    for i in 0..num_tables {
        let sfnt_table_directory_entry = &sfnt_table_directory[i];

        let mut check_buf = ByteBuffer::with_len(SIZEOF_SFNT_TABLE_ENTRY);

        check_buf.set_u32(SFNT_OFFSET_TAG, sfnt_table_directory_entry.tag.get_u32(0));
        check_buf.set_u32(SFNT_OFFSET_CHECKSUM, sfnt_table_directory_entry.checksum);
        check_buf.set_u32(SFNT_OFFSET_OFFSET, sfnt_offset as u32);
        check_buf.set_u32(SFNT_OFFSET_LENGTH, sfnt_table_directory_entry.len);

        sfnt_offset += four_byte_align(sfnt_table_directory_entry.len as usize);

        csum += calc_checksum(&check_buf) as usize;
        csum += sfnt_table_directory_entry.checksum as usize;
    }

    return u32_limit(MAGIC_CHECKSUM_ADJUSTMENT - csum) as u32;
}

fn build_woff_table_directory_and_data(
    ttf_buf: &ByteBuffer,
    sfnt_table_directory: &Vec<TableEntry>,
    woff_header: &mut WoffHeader,
    checksum_adjustment: u32,
) -> Result<(ByteBuffer, Vec<ByteBuffer>), String> {
    let num_tables = sfnt_table_directory.len();

    let mut woff_table_directory_buf =
        ByteBuffer::with_len((num_tables as usize) * SIZEOF_WOFF_ENTRY);
    let mut woff_table_data: Vec<ByteBuffer> = Vec::new();

    let mut sfnt_size = SIZEOF_SFNT_HEADER + num_tables * SIZEOF_SFNT_TABLE_ENTRY;
    let mut woff_offset = SIZEOF_WOFF_HEADER + num_tables * SIZEOF_WOFF_ENTRY;

    for i in 0..num_tables {
        let sfnt_table_directory_entry = &sfnt_table_directory[i];

        let mut sfnt_data_buf = ByteBuffer::from_buffer_slice(
            ttf_buf,
            sfnt_table_directory_entry.offset as usize,
            sfnt_table_directory_entry.len as usize,
        );

        if sfnt_table_directory_entry.tag_str == "head" {
            woff_header.set_head(
                sfnt_data_buf.get_u16(SFNT_ENTRY_OFFSET_VERSION_MAJ),
                sfnt_data_buf.get_u16(SFNT_ENTRY_OFFSET_VERSION_MIN),
                sfnt_data_buf.get_u32(SFNT_ENTRY_OFFSET_FLAVOR),
            );

            sfnt_data_buf.set_u32(SFNT_ENTRY_OFFSET_CHECKSUM_ADJUSTMENT, checksum_adjustment);
        } else {
            let aligned_table = ByteBuffer::from_buffer_slice(
                ttf_buf,
                sfnt_table_directory_entry.offset as usize,
                four_byte_align(sfnt_table_directory_entry.len as usize),
            );

            if calc_checksum(&aligned_table) != sfnt_table_directory_entry.checksum {
                return Err(format!(
                    "checksum error in {}",
                    sfnt_table_directory_entry.tag
                ));
            }
        }

        let compressed = deflate_bytes_zlib(sfnt_data_buf.to_bytes());

        // we should use compression only if it really save space (standard requirement).
        let compressed_len = min(compressed.len(), sfnt_data_buf.len());
        // also, data should be aligned to long (with zeros?).
        let woff_len = four_byte_align(compressed_len);
        let mut woff_data_buf = ByteBuffer::with_len(woff_len);

        if compressed.len() >= sfnt_data_buf.len() {
            woff_data_buf.write_bytes(sfnt_data_buf.to_bytes());
        } else {
            woff_data_buf.write_bytes(&compressed[..]);
        }

        woff_table_directory_buf.set_u32(
            i * SIZEOF_WOFF_ENTRY + WOFF_ENTRY_OFFSET_TAG,
            sfnt_table_directory_entry.tag.get_u32(0),
        );
        woff_table_directory_buf.set_u32(
            i * SIZEOF_WOFF_ENTRY + WOFF_ENTRY_OFFSET_OFFSET,
            woff_offset as u32,
        );
        woff_table_directory_buf.set_u32(
            i * SIZEOF_WOFF_ENTRY + WOFF_ENTRY_OFFSET_COMPR_LENGTH,
            compressed_len as u32,
        );
        woff_table_directory_buf.set_u32(
            i * SIZEOF_WOFF_ENTRY + WOFF_ENTRY_OFFSET_LENGTH,
            sfnt_table_directory_entry.len,
        );
        woff_table_directory_buf.set_u32(
            i * SIZEOF_WOFF_ENTRY + WOFF_ENTRY_OFFSET_CHECKSUM,
            sfnt_table_directory_entry.checksum,
        );

        sfnt_size += four_byte_align(sfnt_table_directory_entry.len as usize);
        woff_offset += woff_len;

        woff_table_data.push(woff_data_buf);
    }

    woff_header.set_sfnt_size(sfnt_size);
    woff_header.set_woff_size(woff_offset);

    return Ok((woff_table_directory_buf, woff_table_data));
}

fn build_woff(
    woff_header: &WoffHeader,
    woff_table_directory_buf: &ByteBuffer,
    woff_table_data: &Vec<ByteBuffer>,
) -> ByteBuffer {
    let mut woff_buf = ByteBuffer::with_len(woff_header.get_woff_size());

    woff_buf.write_bytes(woff_header.to_buffer().to_bytes());
    woff_buf.write_bytes(woff_table_directory_buf.to_bytes());

    for chain in woff_table_data {
        woff_buf.write_bytes(chain.to_bytes());
    }

    return woff_buf;
}

fn calc_checksum(buf: &ByteBuffer) -> u32 {
    let nlongs = buf.len() / 4;
    let mut sum: usize = 0;
    for i in 0..nlongs {
        let t = buf.get_u32(i * 4);

        sum = u32_limit(sum + t as usize);
    }

    return sum as u32;
}

fn u32_limit(t: usize) -> usize {
    let mut res = (t as i64) & 0xffffffff;

    if res < 0 {
        res += 0x100000000;
    }

    return res as usize;
}

fn four_byte_align(n: usize) -> usize {
    return (((n as i64) + 3) & -4) as usize;
}

struct TableEntry {
    tag: ByteBuffer,
    tag_str: String,
    checksum: u32,
    offset: u32,
    len: u32,
}
