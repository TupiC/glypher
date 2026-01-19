import { describe, it, expect, vi } from "vitest";
import path from "path";

// Mock the WASM module before importing utils
vi.mock("../src/wasm/glypher_wasm", () => ({
    get_available_range_names: vi.fn(),
    expand_ranges: vi.fn(),
    find_best_matching_ranges_wasm: vi.fn(),
    format_range_matches_wasm: vi.fn(),
}));

// Mock the commands
vi.mock("../src/commands/subset", () => ({
    subset: vi.fn(),
}));

vi.mock("../src/commands/convert", () => ({
    convert: vi.fn(),
}));

import {
    glyphsToUnicodeFormat,
    codePointsToUnicodeFormat,
    determineOutputPath,
} from "../src/utils";

describe("glyphsToUnicodeFormat", () => {
    it("should convert a single ASCII character to Unicode format", () => {
        expect(glyphsToUnicodeFormat("A")).toBe("U+0041");
    });

    it("should convert multiple ASCII characters", () => {
        expect(glyphsToUnicodeFormat("ABC")).toBe("U+0041,U+0042,U+0043");
    });

    it("should handle lowercase letters", () => {
        expect(glyphsToUnicodeFormat("abc")).toBe("U+0061,U+0062,U+0063");
    });

    it("should handle digits", () => {
        expect(glyphsToUnicodeFormat("123")).toBe("U+0031,U+0032,U+0033");
    });

    it("should handle special characters", () => {
        expect(glyphsToUnicodeFormat("!@#")).toBe("U+0021,U+0040,U+0023");
    });

    it("should handle Unicode characters beyond ASCII", () => {
        expect(glyphsToUnicodeFormat("é")).toBe("U+00E9");
        expect(glyphsToUnicodeFormat("中")).toBe("U+4E2D");
    });

    it("should handle emoji (surrogate pairs)", () => {
        expect(glyphsToUnicodeFormat("😀")).toBe("U+1F600");
    });

    it("should handle mixed ASCII and Unicode characters", () => {
        expect(glyphsToUnicodeFormat("Aé中")).toBe("U+0041,U+00E9,U+4E2D");
    });

    it("should handle empty string", () => {
        expect(glyphsToUnicodeFormat("")).toBe("");
    });

    it("should handle space character", () => {
        expect(glyphsToUnicodeFormat(" ")).toBe("U+0020");
    });

    it("should pad code points to at least 4 digits", () => {
        // Tab character (U+0009)
        expect(glyphsToUnicodeFormat("\t")).toBe("U+0009");
    });
});

describe("codePointsToUnicodeFormat", () => {
    it("should convert a single code point to Unicode format", () => {
        expect(codePointsToUnicodeFormat([65])).toBe("U+0041");
    });

    it("should convert multiple code points", () => {
        expect(codePointsToUnicodeFormat([65, 66, 67])).toBe("U+0041,U+0042,U+0043");
    });

    it("should handle code points beyond BMP", () => {
        // Emoji grinning face
        expect(codePointsToUnicodeFormat([0x1F600])).toBe("U+1F600");
    });

    it("should handle mixed code points", () => {
        expect(codePointsToUnicodeFormat([65, 0x00E9, 0x4E2D])).toBe("U+0041,U+00E9,U+4E2D");
    });

    it("should handle empty array", () => {
        expect(codePointsToUnicodeFormat([])).toBe("");
    });

    it("should pad small code points to 4 digits", () => {
        expect(codePointsToUnicodeFormat([9])).toBe("U+0009");
        expect(codePointsToUnicodeFormat([1])).toBe("U+0001");
    });

    it("should handle code points with more than 4 hex digits", () => {
        expect(codePointsToUnicodeFormat([0x10000])).toBe("U+10000");
        expect(codePointsToUnicodeFormat([0x10FFFF])).toBe("U+10FFFF");
    });
});

describe("determineOutputPath", () => {
    it("should return output path if provided", () => {
        const result = determineOutputPath(
            "/path/to/input.ttf",
            "/path/to/output.woff2",
            undefined
        );
        expect(result).toBe("/path/to/output.woff2");
    });

    it("should return output path even when format is provided", () => {
        const result = determineOutputPath(
            "/path/to/input.ttf",
            "/path/to/output.woff2",
            "woff2"
        );
        expect(result).toBe("/path/to/output.woff2");
    });

    it("should generate output path from format when no output specified", () => {
        const result = determineOutputPath(
            "/path/to/font.ttf",
            undefined,
            "woff2"
        );
        expect(result).toBe("/path/to/font.woff2");
    });

    it("should generate output path with woff format", () => {
        const result = determineOutputPath(
            "/path/to/font.ttf",
            undefined,
            "woff"
        );
        expect(result).toBe("/path/to/font.woff");
    });

    it("should generate subset output path when no output and no format", () => {
        const result = determineOutputPath(
            "/path/to/font.ttf",
            undefined,
            undefined,
            true
        );
        expect(result).toBe(path.join("/path/to", "font-subset.ttf"));
    });

    it("should preserve file extension for subset output", () => {
        const result = determineOutputPath(
            "/path/to/font.otf",
            undefined,
            undefined,
            true
        );
        expect(result).toBe(path.join("/path/to", "font-subset.otf"));
    });

    it("should handle files with multiple dots in name for subset", () => {
        const result = determineOutputPath(
            "/path/to/font.name.ttf",
            undefined,
            undefined,
            true
        );
        expect(result).toBe(path.join("/path/to", "font.name-subset.ttf"));
    });

    it("should handle relative paths", () => {
        const result = determineOutputPath(
            "./fonts/myfont.ttf",
            undefined,
            "woff2"
        );
        expect(result).toBe(path.join(".", "fonts", "myfont.woff2"));
    });

    it("should handle files in current directory", () => {
        const result = determineOutputPath(
            "font.ttf",
            undefined,
            "woff2"
        );
        expect(result).toBe(path.join(".", "font.woff2"));
    });
});
