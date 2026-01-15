import path from "path";
import type { ConvertFormat } from "../types/convert.types";

/**
 * Generates an output path based on the input path and desired format.
 * Replaces the file extension with the specified format extension.
 *
 * @param inputPath - The path to the input file
 * @param format - The desired output format (woff2 or woff)
 * @returns The generated output path with the new extension
 */
export function generateOutputPath(
    inputPath: string,
    format: ConvertFormat
): string {
    const ext = path.extname(inputPath);
    const base = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);
    return path.join(dir, `${base}.${format}`);
}

/**
 * Parse a Unicode string in various formats:
 * - U+0041
 * - 0x0041
 * - 0041
 * - 65 (decimal)
 */
export function parseUnicode(str: string): number | null {
    //TODO move this to the wasm side
    str = str.trim().toUpperCase();

    // Handle U+0041 format
    if (str.startsWith("U+")) {
        return parseInt(str.slice(2), 16);
    }

    // Handle 0x0041 format
    if (str.startsWith("0X")) {
        return parseInt(str.slice(2), 16);
    }

    // Try hex format (0041)
    if (/^[0-9A-F]+$/.test(str)) {
        // If it looks like hex (has letters or is 4+ digits), try hex first
        if (/[A-F]/.test(str) || str.length >= 4) {
            const hex = parseInt(str, 16);
            // If it's a reasonable Unicode value, return it
            if (hex <= 0x10ffff) {
                return hex;
            }
        }
        // Otherwise try decimal
        return parseInt(str, 10);
    }

    // Try decimal
    const decimal = parseInt(str, 10);
    if (!isNaN(decimal)) {
        return decimal;
    }

    return null;
}
