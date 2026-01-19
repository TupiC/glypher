#! /usr/bin/env node

import { Command, Option } from "commander";
import { subset } from "./commands/subset";
import { convert } from "./commands/convert";
import type { ConvertFormat } from "./types/convert.types";
import { generateOutputPath } from "./commands/utils";
import { get_available_range_names, expand_ranges } from "./wasm/glypher_wasm";
import fs from "fs";
import path from "path";
import os from "os";
import packageJson from "../package.json";

// Helper functions to wrap WASM exports
function getAvailableRangeNames(): string[] {
    return JSON.parse(get_available_range_names());
}

function expandRanges(rangeNames: string[]): number[] {
    return Array.from(expand_ranges(JSON.stringify(rangeNames)));
}

const program = new Command();

program
    .name("glypher")
    .description("A font manipulation CLI tool")
    .version(packageJson.version)
    .requiredOption("-i, --input <path>", "Input font file")
    .option("-o, --output <path>", "Output font file")
    .addOption(
        new Option("-f, --format <format>", "Convert to format").choices([
            "woff2",
            "woff",
        ])
    )
    .option(
        "-g, --glyphs <glyphs>",
        "Glyphs to subset (Unicode code points or glyph IDs)"
    )
    .addOption(
        new Option(
            "-r, --range <ranges...>",
            "Predefined character range(s) for subsetting"
        ).choices(getAvailableRangeNames())
    )
    .action(
        (opts: {
            input: string;
            output?: string;
            format?: ConvertFormat;
            glyphs?: string;
            range?: string[];
        }) => {
            const { input, output, format, glyphs, range } = opts;

            // Validate that at least one operation is specified
            if (!format && !glyphs && !range) {
                console.error(
                    "Error: At least one of --format, --glyphs, or --range must be specified"
                );
                process.exit(1);
            }

            // Expand ranges to Unicode code points if specified
            let effectiveGlyphs = glyphs;
            if (range && range.length > 0) {
                const rangeCodePoints = expandRanges(range);
                const rangeStr = rangeCodePoints
                    .map(
                        (cp) =>
                            `U+${cp
                                .toString(16)
                                .toUpperCase()
                                .padStart(4, "0")}`
                    )
                    .join(",");
                // Combine with existing glyphs if any
                effectiveGlyphs = glyphs ? `${glyphs},${rangeStr}` : rangeStr;
            }

            // Determine output path
            let outputPath = output;
            if (!outputPath) {
                if (format) {
                    outputPath = generateOutputPath(input, format);
                } else {
                    console.error(
                        "Error: --output is required when only subsetting"
                    );
                    process.exit(1);
                }
            }

            // Handle the different operation combinations
            if (effectiveGlyphs && format) {
                // Both subset and convert: subset to temp file, then convert
                const tempPath = path.join(
                    os.tmpdir(),
                    `glypher-temp-${Date.now()}${path.extname(input)}`
                );
                try {
                    subset(input, tempPath, effectiveGlyphs);
                    convert(tempPath, format, outputPath);
                } finally {
                    // Clean up temp file
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                    }
                }
            } else if (effectiveGlyphs) {
                // Only subset
                subset(input, outputPath, effectiveGlyphs);
            } else if (format) {
                // Only convert
                convert(input, format, outputPath);
            }

            console.log(`Output written to: ${outputPath}`);
        }
    );

if (!process.argv.slice(2).length) {
    program.help();
}

program.parse(process.argv);

export default program;
