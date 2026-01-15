import { subset_font, subset_font_by_unicodes } from "../wasm/glypher_wasm";
import fs from "fs";
import { parseUnicode } from "./utils";

export function subset(inputPath: string, outputPath: string, glyphs?: string) {
    const data = fs.readFileSync(inputPath);

    if (!glyphs) {
        fs.writeFileSync(outputPath, data);
        return data;
    }

    const unicodeValues: number[] = [];
    const glyphValues: number[] = [];
    let isUnicode = false;

    for (const item of glyphs.split(",")) {
        const unicode = parseUnicode(item);
        if (unicode !== null) {
            if (unicode <= 0x10ffff) {
                unicodeValues.push(unicode);
                isUnicode = true;
            } else {
                glyphValues.push(unicode);
            }
        } else {
            const num = parseInt(item.trim(), 10);
            if (!isNaN(num)) {
                glyphValues.push(num);
            }
        }
    }

    let subsetData: Uint8Array;

    if (isUnicode && unicodeValues.length > 0) {
        subsetData = subset_font_by_unicodes(
            data,
            new Uint32Array(unicodeValues)
        );
    } else if (glyphValues.length > 0) {
        subsetData = subset_font(data, new Uint16Array(glyphValues));
    } else {
        fs.writeFileSync(outputPath, data);
        return data;
    }

    fs.writeFileSync(outputPath, subsetData);
    return subsetData;
}
