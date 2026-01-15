import { convert_font } from "../wasm/glypher_wasm";
import fs from "fs";
import path from "path";
import type { ConvertFormat } from "../types/convert.types";

export function convert(
    inputPath: string,
    format: ConvertFormat,
    outputPath?: string
) {
    const data = fs.readFileSync(inputPath);
    const convertedData = convert_font(data, format);

    const finalOutputPath =
        outputPath ||
        (() => {
            const ext = path.extname(inputPath);
            const base = path.basename(inputPath, ext);
            const dir = path.dirname(inputPath);
            return path.join(dir, `${base}.${format}`);
        })();

    fs.writeFileSync(finalOutputPath, convertedData);
    return convertedData;
}
