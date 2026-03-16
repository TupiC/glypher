import { describe, it, expect } from "vitest";
import path from "path";
import {
    getSlicedOutputPath,
    getAxisSliceFinalPath,
    shouldUnlinkIntermediate,
} from "../../src/commands/axis-slice";

describe("getSlicedOutputPath", () => {
    it("returns outputPath for single combination (no intermediate)", () => {
        const outputPath = "/out/font.woff2";
        expect(
            getSlicedOutputPath(outputPath, 0, 1)
        ).toBe(outputPath);
    });

    it("returns -N.ttf paths for multiple combinations", () => {
        const outputPath = "/out/font.woff2";
        expect(
            getSlicedOutputPath(outputPath, 0, 2)
        ).toBe(path.join("/out", "font-0.ttf"));
        expect(
            getSlicedOutputPath(outputPath, 1, 2)
        ).toBe(path.join("/out", "font-1.ttf"));
    });

    it("handles multiple combo indices", () => {
        const outputPath = "/fonts/NotoSans.woff2";
        expect(
            getSlicedOutputPath(outputPath, 0, 3)
        ).toBe(path.join("/fonts", "NotoSans-0.ttf"));
        expect(
            getSlicedOutputPath(outputPath, 2, 3)
        ).toBe(path.join("/fonts", "NotoSans-2.ttf"));
    });

    it("preserves directory structure", () => {
        const outputPath = "/deep/nested/dir/out.ttf";
        expect(
            getSlicedOutputPath(outputPath, 0, 2)
        ).toBe(path.join("/deep/nested/dir", "out-0.ttf"));
    });
});

describe("getAxisSliceFinalPath", () => {
    it("returns slicedPath when no format specified", () => {
        const slicedPath = "/out/font.ttf";
        expect(getAxisSliceFinalPath(slicedPath)).toBe(slicedPath);
        expect(getAxisSliceFinalPath(slicedPath, undefined)).toBe(slicedPath);
    });

    it("replaces extension with format when converting", () => {
        const slicedPath = "/out/font-0.ttf";
        expect(getAxisSliceFinalPath(slicedPath, "woff2")).toBe(
            path.join("/out", "font-0.woff2")
        );
    });

    it("single combo: outputPath equals finalPath (same file, no unlink)", () => {
        // When single combo, axisSlice writes to outputPath directly (e.g. out.woff2)
        const slicedPath = "/out/font.woff2";
        const finalPath = getAxisSliceFinalPath(slicedPath, "woff2");
        expect(finalPath).toBe(slicedPath);
    });

    it("multi combo: intermediate .ttf differs from final .woff2 (unlink)", () => {
        const slicedPath = "/out/font-0.ttf";
        const finalPath = getAxisSliceFinalPath(slicedPath, "woff2");
        expect(finalPath).toBe(path.join("/out", "font-0.woff2"));
        expect(finalPath).not.toBe(slicedPath);
    });
});

describe("shouldUnlinkIntermediate", () => {
    it("returns false when paths are the same (single combo - preserve output)", () => {
        const p = "/out/font.woff2";
        expect(shouldUnlinkIntermediate(p, p)).toBe(false);
    });

    it("returns true when paths differ (multi combo - remove intermediate)", () => {
        const slicedPath = "/out/font-0.ttf";
        const finalPath = "/out/font-0.woff2";
        expect(shouldUnlinkIntermediate(slicedPath, finalPath)).toBe(true);
    });

    it("returns false for same path with different string representation", () => {
        // Path normalization - same logical path
        expect(
            shouldUnlinkIntermediate("/out/font.woff2", "/out/font.woff2")
        ).toBe(false);
    });
});

describe("axis slice single vs multi combo path behavior", () => {
    it("single combination: slicedPath equals finalPath, so should NOT unlink", () => {
        const outputPath = "/out/NotoSans-Regular-Normal.woff2";
        const slicedPath = getSlicedOutputPath(outputPath, 0, 1);
        const finalPath = getAxisSliceFinalPath(slicedPath, "woff2");

        expect(slicedPath).toBe(outputPath);
        expect(finalPath).toBe(slicedPath);
        expect(shouldUnlinkIntermediate(slicedPath, finalPath)).toBe(false);
    });

    it("multiple combinations: slicedPath differs from finalPath, so SHOULD unlink", () => {
        const outputPath = "/out/NotoSans.woff2";
        const slicedPath = getSlicedOutputPath(outputPath, 0, 2);
        const finalPath = getAxisSliceFinalPath(slicedPath, "woff2");

        expect(slicedPath).toBe(path.join("/out", "NotoSans-0.ttf"));
        expect(finalPath).toBe(path.join("/out", "NotoSans-0.woff2"));
        expect(slicedPath).not.toBe(finalPath);
        expect(shouldUnlinkIntermediate(slicedPath, finalPath)).toBe(true);
    });
});
