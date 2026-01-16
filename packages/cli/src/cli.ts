#! /usr/bin/env node

import { Command, Option } from "commander";
import { subset } from "./commands/subset";
import { convert } from "./commands/convert";
import type { ConvertFormat } from "./types/convert.types";
import { generateOutputPath } from "./commands/utils";
import fs from "fs";
import path from "path";
import os from "os";

const program = new Command();

program
    .name("glypher")
    .description("A font manipulation CLI tool")
    .version("1.0.0")
    .requiredOption("-i, --input <path>", "Input font file")
    .option("-o, --output <path>", "Output font file")
    .addOption(
        new Option(
            "-f, --format <format>",
            "Convert to format (woff2 or woff)"
        ).choices(["woff2", "woff"])
    )
    .option(
        "-g, --glyphs <glyphs>",
        "Glyphs to subset (Unicode code points or glyph IDs)"
    )
    .action(
        (opts: {
            input: string;
            output?: string;
            format?: ConvertFormat;
            glyphs?: string;
        }) => {
            const { input, output, format, glyphs } = opts;

            // Validate that at least one operation is specified
            if (!format && !glyphs) {
                console.error(
                    "Error: At least one of --format or --glyphs must be specified"
                );
                process.exit(1);
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
            if (glyphs && format) {
                // Both subset and convert: subset to temp file, then convert
                const tempPath = path.join(
                    os.tmpdir(),
                    `glypher-temp-${Date.now()}${path.extname(input)}`
                );
                try {
                    subset(input, tempPath, glyphs);
                    convert(tempPath, format, outputPath);
                } finally {
                    // Clean up temp file
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                    }
                }
            } else if (glyphs) {
                // Only subset
                subset(input, outputPath, glyphs);
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
