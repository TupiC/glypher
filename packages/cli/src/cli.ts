#! /usr/bin/env node

import { Command, Option } from "commander";
import { subset } from "./commands/subset";
import { convert } from "./commands/convert";
import { axisSlice } from "./commands/axis-slice";
import { parseAxisSpec } from "./axis/parse";
import type { ConvertFormat } from "./types/convert.types";
import { crawl } from "./wasm/glypher_wasm";
import fs from "fs";
import path from "path";
import packageJson from "../package.json";
import {
    getAvailableRangeNames,
    findBestMatchingRanges,
    formatRangeMatches,
    codePointsToUnicodeFormat,
    expandRanges,
    glyphsToUnicodeFormat,
    determineOutputPath,
    performSubsetAndConvert,
} from "./utils";

const program = new Command();

//todo add silent option (no logs)
program
    .name("glypher")
    .description("A font manipulation CLI tool")
    .version(packageJson.version)
    .enablePositionalOptions()
    .option("-i, --input <path>", "Input font file")
    .option("-o, --output <path>", "Output font file")
    .addOption(
        new Option("-f, --format <format>", "Convert to format").choices([
            "woff2",
            "woff",
        ]),
    )
    .option(
        "-a, --axis <spec>",
        "Slice variable font axes (e.g. ital,wght,wdth@0,400-900,100;0,400-900,75)",
    )
    .option(
        "-g, --glyphs <glyphs>",
        "Glyphs to subset (Unicode code points or glyph IDs)",
    )
    .option(
        "-t, --text <text>",
        'Text characters to subset (e.g., -t "abc" keeps only a, b, c)',
    )
    .addOption(
        new Option(
            "-r, --range <ranges...>",
            "Predefined character range(s) for subsetting",
        ).choices(getAvailableRangeNames()),
    )
    .option("--crawl", "Crawl a website to extract glyphs for subsetting")
    .option("-u, --url <url>", "URL to crawl (requires --crawl)")
    .option("-d, --depth <depth>", "Crawl depth (0 = single page only)", "0")
    .option(
        "--use-range",
        "Use best matching range instead of exact glyphs (with --crawl)",
    )
    .action(
        async (opts: {
            input?: string;
            output?: string;
            format?: ConvertFormat;
            axis?: string;
            glyphs?: string;
            text?: string;
            range?: string[];
            crawl?: boolean;
            url?: string;
            depth?: string;
            useRange?: boolean;
        }) => {
            const {
                input,
                output,
                format,
                axis,
                glyphs,
                text,
                range,
                url,
                depth,
                useRange,
            } = opts;

            // Handle crawl mode
            if (opts.crawl) {
                if (!url) {
                    console.error(
                        "Error: --url is required when using --crawl",
                    );
                    process.exit(1);
                }

                const crawlDepth = parseInt(depth || "0", 10);
                if (isNaN(crawlDepth) || crawlDepth < 0) {
                    console.error(
                        "Error: depth must be a non-negative integer",
                    );
                    process.exit(1);
                }

                console.log(`\nCrawling ${url} with depth ${crawlDepth}...\n`);

                try {
                    const crawledGlyphs = await crawl(url, crawlDepth);

                    if (!crawledGlyphs || crawledGlyphs.length === 0) {
                        console.log("No glyphs found on the website.");
                        process.exit(0);
                    }

                    // Display found glyphs
                    console.log(
                        `\n=== Found ${crawledGlyphs.length} unique glyphs ===\n`,
                    );
                    const sampleSize = Math.min(100, crawledGlyphs.length);
                    console.log(
                        `Sample (first ${sampleSize} chars): ${crawledGlyphs.slice(0, sampleSize)}`,
                    );
                    if (crawledGlyphs.length > sampleSize) {
                        console.log(
                            `... and ${crawledGlyphs.length - sampleSize} more`,
                        );
                    }

                    // Find and display best matching ranges
                    const matches = findBestMatchingRanges(crawledGlyphs);

                    if (matches.length > 0) {
                        console.log(
                            "\n=== Best Matching Character Ranges ===\n",
                        );
                        console.log(formatRangeMatches(matches));

                        const bestMatch = matches[0];
                        console.log(
                            `\nRecommendation: Use "${bestMatch.name}" range`,
                        );
                        console.log(
                            `  - Covers ${bestMatch.range_coverage_percent.toFixed(1)}% of the range`,
                        );
                        console.log(
                            `  - ${bestMatch.glyphs_in_range}/${bestMatch.total_range_size} characters used`,
                        );
                        if (bestMatch.glyphs_outside_range > 0) {
                            console.log(
                                `  - ${bestMatch.glyphs_outside_range} glyphs fall outside this range`,
                            );
                        }
                        if (!useRange) {
                            console.log(
                                "\nTip: Use --use-range to subset using the best matching range",
                            );
                        }
                    }

                    // Process font if input is provided
                    if (input) {
                        if (!fs.existsSync(input)) {
                            console.error(
                                `\nError: Input font file not found: ${input}`,
                            );
                            process.exit(1);
                        }

                        let effectiveGlyphs: string;

                        if (useRange && matches.length > 0) {
                            const bestRange = matches[0].name;
                            console.log(
                                `\n=== Converting font using "${bestRange}" range ===\n`,
                            );
                            effectiveGlyphs = codePointsToUnicodeFormat(
                                expandRanges([bestRange]),
                            );
                        } else {
                            console.log(
                                "\n=== Converting font using exact glyphs found ===\n",
                            );
                            effectiveGlyphs =
                                glyphsToUnicodeFormat(crawledGlyphs);
                        }

                        const outputPath = determineOutputPath(
                            input,
                            output,
                            format,
                            true,
                        );
                        performSubsetAndConvert(
                            input,
                            outputPath,
                            effectiveGlyphs,
                            format,
                        );
                        console.log(`Output written to: ${outputPath}`);
                    }
                } catch (error) {
                    console.error("Error during crawl:", error);
                    process.exit(1);
                }
                return;
            }

            // Standard mode (non-crawl)
            if (!input) {
                console.error("Error: --input is required");
                process.exit(1);
            }

            if (!format && !glyphs && !text && !range && !axis) {
                console.error(
                    "Error: At least one of -f, --format; -g --glyphs; -t --text; -r --range; -a --axis or --crawl must be specified",
                );
                process.exit(1);
            }

            // Build effective glyphs from all sources
            let effectiveGlyphs = glyphs;

            // Convert text to Unicode format and combine
            if (text) {
                const textUnicode = glyphsToUnicodeFormat(text);
                effectiveGlyphs = effectiveGlyphs
                    ? `${effectiveGlyphs},${textUnicode}`
                    : textUnicode;
            }

            // Expand ranges to Unicode code points if specified
            if (range && range.length > 0) {
                const rangeStr = codePointsToUnicodeFormat(expandRanges(range));
                effectiveGlyphs = effectiveGlyphs
                    ? `${effectiveGlyphs},${rangeStr}`
                    : rangeStr;
            }

            // Handle axis slicing (variable font)
            if (axis) {
                const parsed = parseAxisSpec(axis);
                if (!parsed) {
                    console.error(
                        "Error: Invalid --axis format. Use: axis1,axis2@val1,val2;val1,val2 (e.g. ital,wght,wdth@0,400-900,100)",
                    );
                    process.exit(1);
                }

                const ext = path.extname(input);
                const base = path.basename(input, ext);
                const dir = path.dirname(input);
                const defaultOutput = path.join(
                    dir,
                    `${base}-sliced${format ? `.${format}` : ext}`,
                );
                const outputPath = output ?? defaultOutput;

                try {
                    const slicedPaths = await axisSlice(
                        input,
                        parsed.combinations,
                        outputPath,
                    );

                    // Apply subset and/or convert to each sliced output
                    const finalPaths: string[] = [];
                    for (const slicedPath of slicedPaths) {
                        const baseNoExt = path.basename(
                            slicedPath,
                            path.extname(slicedPath),
                        );
                        const outDir = path.dirname(slicedPath);
                        const finalPath = format
                            ? path.join(outDir, `${baseNoExt}.${format}`)
                            : slicedPath;
                        const shouldDeleteIntermediate =
                            path.resolve(slicedPath) !== path.resolve(finalPath);

                        if (effectiveGlyphs && format) {
                            performSubsetAndConvert(
                                slicedPath,
                                finalPath,
                                effectiveGlyphs,
                                format,
                            );
                            if (shouldDeleteIntermediate)
                                fs.unlinkSync(slicedPath);
                            finalPaths.push(finalPath);
                        } else if (effectiveGlyphs) {
                            subset(slicedPath, slicedPath, effectiveGlyphs);
                            if (format) {
                                convert(slicedPath, format, finalPath);
                                if (shouldDeleteIntermediate)
                                    fs.unlinkSync(slicedPath);
                                finalPaths.push(finalPath);
                            } else {
                                finalPaths.push(slicedPath);
                            }
                        } else if (format) {
                            convert(slicedPath, format, finalPath);
                            if (shouldDeleteIntermediate)
                                fs.unlinkSync(slicedPath);
                            finalPaths.push(finalPath);
                        } else {
                            finalPaths.push(slicedPath);
                        }
                    }

                    console.log(`Output written to: ${finalPaths.join(", ")}`);
                } catch (err) {
                    console.error("Error during axis slicing:", err);
                    process.exit(1);
                }
                return;
            }

            // Standard mode (no axis)
            const outputPath = determineOutputPath(
                input,
                output,
                format,
                !format,
            );

            if (effectiveGlyphs && format) {
                performSubsetAndConvert(
                    input,
                    outputPath,
                    effectiveGlyphs,
                    format,
                );
            } else if (effectiveGlyphs) {
                subset(input, outputPath, effectiveGlyphs);
            } else if (format) {
                convert(input, format, outputPath);
            }

            console.log(`Output written to: ${outputPath}`);
        },
    );

if (!process.argv.slice(2).length) {
    program.help();
}

program.parse(process.argv);

export default program;
