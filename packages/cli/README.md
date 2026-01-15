# glypher CLI

Fast and efficient font manipulation tool.

The `glypher` CLI provides a TypeScript interface that wraps the core WebAssembly functionality for font subsetting and conversion operations.

## Installation

```bash
npm install -g glypher
```

Or use with npx:

```bash
npx glypher <command>
```

## Commands

### Subset

Subset a font file to include only specific glyphs:

```bash
npx glypher subset -i input.ttf -o output.ttf -g 65,66,67
```

-   `-i, --input <path>`: Input font file (required)
-   `-o, --output <path>`: Output font file (required)
-   `-g, --glyphs <glyphs>`: Comma-separated list of glyph IDs to include (optional)

### Convert

Convert a font file to WOFF or WOFF2 format:

```bash
npx glypher convert -i input.ttf -f woff2 -o output.woff2
```

-   `-i, --input <path>`: Input font file (required)
-   `-f, --format <format>`: Output format - `woff` or `woff2` (required)
-   `-o, --output <path>`: Output font file (optional, defaults to input filename with new extension)
