import { subset } from "./commands/subset";
import { convert } from "./commands/convert";
import type { ConvertFormat } from "./types/convert.types";
import { generateOutputPath } from "./commands/utils";
import {
    get_available_range_names,
    expand_ranges, find_best_matching_ranges_wasm,
    format_range_matches_wasm
} from "./wasm/glypher_wasm";
import fs from "fs";
import path from "path";
import os from "os";
import type { RangeMatch } from './types/range.types';

export function getAvailableRangeNames(): string[] {
    return JSON.parse(get_available_range_names());
}

export function expandRanges(rangeNames: string[]): number[] {
    return Array.from(expand_ranges(JSON.stringify(rangeNames)));
}

export function findBestMatchingRanges(glyphs: string): RangeMatch[] {
    return JSON.parse(find_best_matching_ranges_wasm(glyphs));
}

export function formatRangeMatches(matches: RangeMatch[]): string {
    return format_range_matches_wasm(JSON.stringify(matches));
}

export function glyphsToUnicodeFormat(glyphs: string): string {
    return [...glyphs]
        .map((c) => {
            const cp = c.codePointAt(0)!;
            return `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
        })
        .join(",");
}

export function codePointsToUnicodeFormat(codePoints: number[]): string {
    return codePoints
        .map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`)
        .join(",");
}

export function performSubsetAndConvert(
    input: string,
    outputPath: string,
    glyphs: string,
    format?: ConvertFormat
): void {
    if (format) {
        // Both subset and convert: subset to temp file, then convert
        const tempPath = path.join(
            os.tmpdir(),
            `glypher-temp-${Date.now()}${path.extname(input)}`
        );
        try {
            subset(input, tempPath, glyphs);
            convert(tempPath, format, outputPath);
        } finally {
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    } else {
        subset(input, outputPath, glyphs);
    }
}

export function determineOutputPath(
    input: string,
    output: string | undefined,
    format: ConvertFormat | undefined,
    requireOutput: boolean = true
): string {
    if (output) return output;
    
    if (format) {
        return generateOutputPath(input, format);
    }
    
    if (requireOutput) {
        const ext = path.extname(input);
        const base = path.basename(input, ext);
        const dir = path.dirname(input);
        return path.join(dir, `${base}-subset${ext}`);
    }
    
    console.error("Error: --output is required when only subsetting");
    process.exit(1);
}