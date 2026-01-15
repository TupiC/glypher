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
