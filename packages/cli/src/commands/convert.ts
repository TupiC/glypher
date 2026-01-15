import { convert_font } from "../wasm/glypher_wasm";
import fs from "fs";
import type { ConvertFormat } from "../types/convert.types";
import { generateOutputPath } from "./utils";

export function convert(
    inputPath: string,
    format: ConvertFormat,
    outputPath?: string
) {
    const data = fs.readFileSync(inputPath);
    const convertedData = convert_font(data, format);
    const finalOutputPath = outputPath || generateOutputPath(inputPath, format);

    fs.writeFileSync(finalOutputPath, convertedData);
    return convertedData;
}
