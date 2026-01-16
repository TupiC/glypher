/**
 * Predefined Unicode character ranges for font subsetting.
 * Each range is defined as an array of [start, end] tuples (inclusive).
 * Add new ranges here to extend the available options.
 */

export type UnicodeRange = [number, number];

export interface CharacterRange {
    name: string;
    description: string;
    ranges: UnicodeRange[];
}

/**
 * Predefined character ranges.
 * To add a new range:
 * 1. Add a new key to this object
 * 2. Define the ranges as [start, end] tuples (inclusive)
 * 3. The CLI will automatically pick up the new range
 */
export const CHARACTER_RANGES: Record<string, CharacterRange> = {
    US_ASCII: {
        name: "US_ASCII",
        description: "Printable US-ASCII characters (0x20-0x7E)",
        ranges: [[0x0020, 0x007e]],
    },
    LATIN: {
        name: "LATIN",
        description:
            "Latin characters including Basic Latin, Latin-1 Supplement, and Latin Extended A/B",
        ranges: [
            [0x0020, 0x007f], // Basic Latin (printable + DEL)
            [0x0080, 0x00ff], // Latin-1 Supplement
            [0x0100, 0x017f], // Latin Extended-A
            [0x0180, 0x024f], // Latin Extended-B
        ],
    },
    LATIN_BASIC: {
        name: "LATIN_BASIC",
        description: "Basic Latin and Latin-1 Supplement (0x20-0xFF)",
        ranges: [
            [0x0020, 0x007f], // Basic Latin
            [0x0080, 0x00ff], // Latin-1 Supplement
        ],
    },
    CYRILLIC: {
        name: "CYRILLIC",
        description: "Cyrillic characters",
        ranges: [
            [0x0400, 0x04ff], // Cyrillic
            [0x0500, 0x052f], // Cyrillic Supplement
        ],
    },
    GREEK: {
        name: "GREEK",
        description: "Greek and Coptic characters",
        ranges: [
            [0x0370, 0x03ff], // Greek and Coptic
            [0x1f00, 0x1fff], // Greek Extended
        ],
    },
};

/**
 * Get all available range names for CLI choices
 */
export function getAvailableRangeNames(): string[] {
    return Object.keys(CHARACTER_RANGES);
}

/**
 * Expand a character range definition into an array of Unicode code points
 */
export function expandRange(rangeName: string): number[] {
    const range = CHARACTER_RANGES[rangeName];
    if (!range) {
        throw new Error(`Unknown character range: ${rangeName}`);
    }

    const codePoints: number[] = [];
    for (const [start, end] of range.ranges) {
        for (let i = start; i <= end; i++) {
            codePoints.push(i);
        }
    }
    return codePoints;
}

/**
 * Expand multiple range names into a deduplicated array of Unicode code points
 */
export function expandRanges(rangeNames: string[]): number[] {
    const codePointSet = new Set<number>();
    for (const name of rangeNames) {
        for (const cp of expandRange(name)) {
            codePointSet.add(cp);
        }
    }
    return Array.from(codePointSet).sort((a, b) => a - b);
}
