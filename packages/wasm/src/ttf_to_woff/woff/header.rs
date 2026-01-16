use super::consts::*;
use super::super::bytebuf::ByteBuffer;

pub struct WoffHeader {
    num_tables: u16,
    woff_size: usize,
    sfnt_size: usize,
    ver_maj: u16,
    ver_min: u16,
    flavor: u32,
}

impl WoffHeader {
    pub fn new(num_tables: u16) -> WoffHeader {
        return WoffHeader {
            num_tables,
            woff_size: 0,
            sfnt_size: 0,
            ver_maj: 0,
            ver_min: 1,
            flavor: 0x10000,
        };
    }

    pub fn get_woff_size(&self) -> usize {
        return self.woff_size;
    }

    pub fn set_woff_size(&mut self, woff_size: usize) {
        self.woff_size = woff_size;
    }

    pub fn set_sfnt_size(&mut self, sfnt_size: usize) {
        self.sfnt_size = sfnt_size;
    }

    pub fn set_head(&mut self, ver_maj: u16, ver_min: u16, flavor: u32) {
        self.ver_maj = ver_maj;
        self.ver_min = ver_min;
        self.flavor = flavor;
    }

    pub fn to_buffer(&self) -> ByteBuffer {
        let mut woff_header = ByteBuffer::with_len(SIZEOF_WOFF_HEADER);

        woff_header.set_u32(WOFF_OFFSET_MAGIC, MAGIC_WOFF);
        woff_header.set_u32(WOFF_OFFSET_FLAVOR, self.flavor);
        woff_header.set_u32(WOFF_OFFSET_SIZE, self.woff_size as u32);
        woff_header.set_u16(WOFF_OFFSET_NUM_TABLES, self.num_tables);
        woff_header.set_u16(WOFF_OFFSET_RESERVED, 0);
        woff_header.set_u32(WOFF_OFFSET_SFNT_SIZE, self.sfnt_size as u32);
        woff_header.set_u16(WOFF_OFFSET_VERSION_MAJ, self.ver_maj);
        woff_header.set_u16(WOFF_OFFSET_VERSION_MIN, self.ver_min);
        woff_header.set_u32(WOFF_OFFSET_META_OFFSET, 0);
        woff_header.set_u32(WOFF_OFFSET_META_LENGTH, 0);
        woff_header.set_u32(WOFF_OFFSET_META_ORIG_LENGTH, 0);
        woff_header.set_u32(WOFF_OFFSET_PRIV_OFFSET, 0);
        woff_header.set_u32(WOFF_OFFSET_PRIV_LENGTH, 0);
    
        return woff_header;
    }
}
