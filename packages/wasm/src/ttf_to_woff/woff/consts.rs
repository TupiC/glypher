pub const TTF_OFFSET_NUM_TABLES: usize = 4;

pub const WOFF_OFFSET_MAGIC: usize = 0;
pub const WOFF_OFFSET_FLAVOR: usize = 4;
pub const WOFF_OFFSET_SIZE: usize = 8;
pub const WOFF_OFFSET_NUM_TABLES: usize = 12;
pub const WOFF_OFFSET_RESERVED: usize = 14;
pub const WOFF_OFFSET_SFNT_SIZE: usize = 16;
pub const WOFF_OFFSET_VERSION_MAJ: usize = 20;
pub const WOFF_OFFSET_VERSION_MIN: usize = 22;
pub const WOFF_OFFSET_META_OFFSET: usize = 24;
pub const WOFF_OFFSET_META_LENGTH: usize = 28;
pub const WOFF_OFFSET_META_ORIG_LENGTH: usize = 32;
pub const WOFF_OFFSET_PRIV_OFFSET: usize = 36;
pub const WOFF_OFFSET_PRIV_LENGTH: usize = 40;

pub const WOFF_ENTRY_OFFSET_TAG: usize = 0;
pub const WOFF_ENTRY_OFFSET_OFFSET: usize = 4;
pub const WOFF_ENTRY_OFFSET_COMPR_LENGTH: usize = 8;
pub const WOFF_ENTRY_OFFSET_LENGTH: usize = 12;
pub const WOFF_ENTRY_OFFSET_CHECKSUM: usize = 16;

pub const SFNT_OFFSET_TAG: usize = 0;
pub const SFNT_OFFSET_CHECKSUM: usize = 4;
pub const SFNT_OFFSET_OFFSET: usize = 8;
pub const SFNT_OFFSET_LENGTH: usize = 12;

pub const SFNT_ENTRY_OFFSET_FLAVOR: usize = 0;
pub const SFNT_ENTRY_OFFSET_VERSION_MAJ: usize = 4;
pub const SFNT_ENTRY_OFFSET_VERSION_MIN: usize = 6;
pub const SFNT_ENTRY_OFFSET_CHECKSUM_ADJUSTMENT: usize = 8;
pub const MAGIC_WOFF: u32 = 0x774F4646;
pub const MAGIC_CHECKSUM_ADJUSTMENT: usize = 0xB1B0AFBA;

pub const SIZEOF_WOFF_HEADER: usize = 44;
pub const SIZEOF_WOFF_ENTRY: usize = 20;
pub const SIZEOF_SFNT_HEADER: usize = 12;
pub const SIZEOF_SFNT_TABLE_ENTRY: usize = 16;