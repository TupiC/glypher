# glypher

Fast and efficient font manipulation tool.

Glypher is a successor of [glyphhanger](https://github.com/zachleat/glyphhanger), providing fast and efficient font manipulation tools. You had to install external tools like `pyftsubset`, `brotli` or `zopfli` to enable specific features. This project focuses on providing all the features in a single tool without the need for external installations or dependencies.

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

Subset a font file to include only specific glyphs. You can specify either Unicode code points or glyph IDs:

**Using Unicode code points (recommended):**

```bash
# Using U+ notation
npx glypher subset -i input.ttf -o output.ttf -g U+0041,U+0042,U+0043

# Using hex notation
npx glypher subset -i input.ttf -o output.ttf -g 0x0041,0x0042,0x0043

# Using plain hex (without prefix)
npx glypher subset -i input.ttf -o output.ttf -g 0041,0042,0043
```

**Using glyph IDs (font-specific):**

```bash
npx glypher subset -i input.ttf -o output.ttf -g 36,37,38
```

-   `-i, --input <path>`: Input font file (required)
-   `-o, --output <path>`: Output font file (required)
-   `-g, --glyphs <glyphs>`: Comma-separated list of Unicode code points (U+0041, 0x0041, or 0041) or glyph IDs to include (optional)

**Note:** Unicode code points are font-independent and recommended. Glyph IDs are font-specific and may vary between fonts.

### Convert

Convert a font file to WOFF or WOFF2 format:

```bash
npx glypher convert -i input.ttf -f woff2 -o output.woff2
```

-   `-i, --input <path>`: Input font file (required)
-   `-f, --format <format>`: Output format - `woff` or `woff2` (required)
-   `-o, --output <path>`: Output font file (optional, defaults to input filename with new extension)
