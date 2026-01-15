#! /usr/bin/env node

import { Command, Option } from "commander";
import { subset } from "./commands/subset";
import { convert } from "./commands/convert";
import type { ConvertFormat } from "./types/convert.types";

const program = new Command();

program
    .name("glypher")
    .description("A font manipulation CLI tool")
    .version("1.0.0");

program
    .command("subset")
    .description("Subset a font")
    .requiredOption("-i, --input <path>", "Input font file")
    .requiredOption("-o, --output <path>", "Output font file")
    .option("-g, --glyphs <glyphs>", "Glyphs to subset")
    .action((opts: { input: string; output: string; glyphs: string }) => {
        subset(opts.input, opts.output, opts.glyphs);
    });

program
    .command("convert")
    .description("Convert a font")
    .requiredOption("-i, --input <path>", "Input font file")
    .addOption(
        new Option("-f, --format <format>", "Output format")
            .choices(["woff2", "woff"])
            .makeOptionMandatory()
    )
    .option("-o, --output <path>", "Output font file")
    .action(
        (opts: { input: string; format: ConvertFormat; output?: string }) => {
            convert(opts.input, opts.format, opts.output);
        }
    );

if (!process.argv.slice(2).length) {
    program.help();
}

program.parse(process.argv);

export default program;
