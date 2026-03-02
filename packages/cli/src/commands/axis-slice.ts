import fs from "fs";
import path from "path";
import { get_variable_font_axes } from "../wasm/glypher_wasm";
import type { AxisLimits } from "../axis/parse";

/**
 * Slice variable font axes using fonttools. Uses @web-alchemy/fonttools
 * (Pyodide-based fonttools) for variable font instancing.
 * Returns paths to the sliced font file(s).
 */
export async function axisSlice(
    inputPath: string,
    combinations: AxisLimits[],
    outputPath: string
): Promise<string[]> {
    const { instantiateVariableFont } = await import("@web-alchemy/fonttools");
    const data = fs.readFileSync(inputPath);

    // Get font's actual axes - only pass limits for axes that exist
    const fontAxes: string[] = JSON.parse(
        get_variable_font_axes(new Uint8Array(data))
    );
    const fontAxisSet = new Set(fontAxes.map((a) => a.toLowerCase()));

    const outputPaths: string[] = [];
    // Sliced output is TTF from fonttools; use .ttf for intermediate
    const outExt = "ttf";
    const outDir = path.dirname(outputPath);
    const outBase = path.basename(outputPath, path.extname(outputPath));

    for (let i = 0; i < combinations.length; i++) {
        const limits = combinations[i];

        // Convert to fonttools format, filtering to only axes present in the font
        const axisLimits: Record<string, number | [number, number] | null> = {};
        for (const [tag, value] of Object.entries(limits)) {
            if (!fontAxisSet.has(tag.toLowerCase())) continue;
            if (value === null) {
                axisLimits[tag] = null;
            } else if (typeof value === "number") {
                axisLimits[tag] = value;
            } else {
                axisLimits[tag] = value;
            }
        }

        let slicedBuffer: Buffer;
        try {
            slicedBuffer = Buffer.from(
                await instantiateVariableFont(
                    new Uint8Array(data) as unknown as ArrayBuffer,
                    axisLimits
                )
            );
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new Error(
                `Axis slicing failed (not a variable font?): ${msg}`
            );
        }

        const outPath =
            combinations.length > 1
                ? path.join(outDir, `${outBase}-${i}.${outExt}`)
                : outputPath;

        fs.writeFileSync(outPath, slicedBuffer);
        outputPaths.push(outPath);
    }

    return outputPaths;
}
