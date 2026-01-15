import { describe, it, expect } from "vitest";
import { generateOutputPath } from "../src/commands/utils";
import path from "path";

describe("generateOutputPath", () => {
    it("should replace .ttf extension with .woff2", () => {
        const inputPath = "/path/to/font.ttf";
        const result = generateOutputPath(inputPath, "woff2");
        expect(result).toBe("/path/to/font.woff2");
    });

    it("should replace .ttf extension with .woff", () => {
        const inputPath = "/path/to/font.ttf";
        const result = generateOutputPath(inputPath, "woff");
        expect(result).toBe("/path/to/font.woff");
    });

    it("should replace .otf extension with .woff2", () => {
        const inputPath = "/path/to/font.otf";
        const result = generateOutputPath(inputPath, "woff2");
        expect(result).toBe("/path/to/font.woff2");
    });

    it("should handle files without extension", () => {
        const inputPath = "/path/to/font";
        const result = generateOutputPath(inputPath, "woff2");
        expect(result).toBe("/path/to/font.woff2");
    });

    it("should handle files with multiple dots in name", () => {
        const inputPath = "/path/to/font.name.ttf";
        const result = generateOutputPath(inputPath, "woff2");
        expect(result).toBe("/path/to/font.name.woff2");
    });

    it("should preserve directory structure", () => {
        const inputPath = "/deep/nested/path/to/font.ttf";
        const result = generateOutputPath(inputPath, "woff2");
        expect(result).toBe("/deep/nested/path/to/font.woff2");
    });

    it("should handle relative paths", () => {
        const inputPath = "./fonts/myfont.ttf";
        const result = generateOutputPath(inputPath, "woff2");
        expect(result).toBe(path.join(".", "fonts", "myfont.woff2"));
    });

    it("should handle Windows-style paths", () => {
        const inputPath = "C:\\Users\\Fonts\\font.ttf";
        const result = generateOutputPath(inputPath, "woff2");
        // path.join normalizes paths based on the platform
        // Just verify the extension is replaced correctly
        expect(result.endsWith("font.woff2")).toBe(true);
        expect(result).not.toContain(".ttf");
    });

    it("should handle files in root directory", () => {
        const inputPath = "/font.ttf";
        const result = generateOutputPath(inputPath, "woff2");
        expect(result).toBe("/font.woff2");
    });

    it("should handle current directory", () => {
        const inputPath = "font.ttf";
        const result = generateOutputPath(inputPath, "woff");
        expect(result).toBe(path.join(".", "font.woff"));
    });
});
