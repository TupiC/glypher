use std::fmt::{Display,Formatter,Result};
use std::str::from_utf8_unchecked;

pub struct ByteBuffer {
    bytes: Vec<u8>,
    start: usize,
    len: usize,
    offset: usize
}

impl ByteBuffer {
    pub fn from_bytes(bytes: &[u8]) -> ByteBuffer {
        return ByteBuffer {
            bytes: Vec::from(bytes),
            start: 0,
            len: bytes.len(),
            offset: 0,
        };
    }

    pub fn from_buffer_start(buf: &ByteBuffer, start: usize) -> ByteBuffer {
        return ByteBuffer {
            bytes: buf.bytes.to_vec(),
            start: start,
            len: buf.bytes.len() - start,
            offset: 0
        };
    }

    pub fn from_buffer_slice(buf: &ByteBuffer, start: usize, len: usize) -> ByteBuffer {
        return ByteBuffer {
            bytes: buf.bytes.to_vec(),
            start: start + buf.start,
            len: len,
            offset: 0
        };
    }
    
    pub fn with_len(len: usize) -> ByteBuffer {
        let mut vec: Vec<u8> = Vec::with_capacity(len);
        vec.resize(len, 0);

        return ByteBuffer {
            bytes: vec,
            start: 0,
            len: len,
            offset: 0,
        };
    }

    pub fn len(&self) -> usize {
        return self.len;
    }

    // pub fn offset(&self) -> usize {
    //     return self.offset;
    // }

    // pub fn seek(&mut self, offset: usize) {
    //     self.offset = offset;
    // }

    // pub fn get_u8(&self, pos: usize) -> u8 {
    //     return self.bytes[pos + self.start];
    // }
    
    pub fn get_u16(&self, pos: usize) -> u16 {
        return u16::from_be_bytes([
            self.bytes[pos + self.start],
            self.bytes[pos + self.start + 1]
        ]);
    }

    pub fn get_u32(&self, pos: usize) -> u32 {
        return u32::from_be_bytes([
            self.bytes[pos + self.start],
            self.bytes[pos + self.start + 1],
            self.bytes[pos + self.start + 2],
            self.bytes[pos + self.start + 3],
        ]);
    }

    // pub fn set_u8(&mut self, pos: usize, val: u8) {
    //     self.bytes[pos + self.start] = val;
    // }

    pub fn set_u16(&mut self, pos: usize, val: u16) {
        let split = val.to_be_bytes();
        self.bytes[pos + self.start] = split[0];
        self.bytes[pos + self.start + 1] = split[1];
    }

    pub fn set_u32(&mut self, pos: usize, val: u32) {
        let split = val.to_be_bytes();
        self.bytes[pos + self.start] = split[0];
        self.bytes[pos + self.start + 1] = split[1];
        self.bytes[pos + self.start + 2] = split[2];
        self.bytes[pos + self.start + 3] = split[3];
    }

    // pub fn write_u8(&mut self, pos: usize, val: u8) {
    //     self.set_u8(pos, val);
    //     self.offset += 1;
    // }

    // pub fn write_i8(&mut self, pos: usize, val: i8) {
    //     let sureVal = if val < 0 { 0xFF + val + 1 } else { val };
    //     let uval: u8 = sureVal.try_into().expect("ByteStream: u8 to i8 convert fails");

    //     self.write_u8(pos, uval);
    // }

    // pub fn write_u16(&mut self, pos: usize, val: u16) {
    //     self.set_u16(pos, val);
    //     self.offset += 2;
    // }

    // pub fn write_i16(&mut self, pos: usize, val: i16) {
    //     let sureVal = if val < 0 { 0xFFFF + val + 1 } else { val };
    //     let uval: u16 = sureVal.try_into().expect("ByteStream: u16 to i16 convert fails");
        
    //     self.write_u16(pos, uval);
    // }

    // pub fn write_u32(&mut self, pos: usize, val: u32) {
    //     self.set_u32(pos, val);
    //     self.offset += 4;
    // }
    
    // pub fn write_i32(&mut self, pos: usize, val: i32) {
    //     let sureVal = if val < 0 { 0xFFFFFFFF + val + 1 } else { val };
    //     let uval: u32 = sureVal.try_into().expect("ByteStream: u32 to i32 convert fails");

    //     self.write_u32(pos, uval);
    // }

    pub fn write_bytes(&mut self, bytes: &[u8]) {
        let offset = self.offset + self.start;
        let chunk_len = bytes.len();

        for i in 0..chunk_len {
            self.bytes[i + offset] = bytes[i];
        }

        self.offset += chunk_len;
    }

    pub fn to_string(&self) -> String {
        return unsafe { String::from_utf8_unchecked(self.to_bytes().to_vec()) };
    }

    pub fn to_str(&self) -> &str {
        return unsafe { from_utf8_unchecked(self.to_bytes()) };
    }

    pub fn to_bytes(&self) -> &[u8] {
        let end = self.start + self.len;
        return &self.bytes[self.start..end];
    }
    
    // pub fn to_bytes_slice(&self, start: usize, end: usize) -> &[u8] {
    //     return &self.bytes[start..end];
    // }
}

impl Display for ByteBuffer {
    fn fmt(&self, f: &mut Formatter) -> Result {
        return write!(f, "{}", self.to_str());
    }
}
