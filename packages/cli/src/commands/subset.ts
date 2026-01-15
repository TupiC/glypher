import { subset_font } from "../wasm/glypher_wasm";
import fs from "fs";

export function subset(inputPath: string, outputPath: string, glyphs?: string) {
    const data = fs.readFileSync(inputPath);
    const glyphsArray = glyphs?.split(",").map(Number) || [];
    const subsetData = subset_font(data, new Uint32Array(glyphsArray));
    fs.writeFileSync(outputPath, subsetData);
    return subsetData;
}
