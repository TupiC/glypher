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
npx glypher [options]
```

## Usage

Glypher uses a unified command structure where you can subset, convert, or do both in a single command.

```bash
npx glypher -i <input> [-o <output>] [-f <format>] [-g <glyphs>]
```

### Options

-   `-i, --input <path>`: Input font file (required)
-   `-o, --output <path>`: Output font file (required when only subsetting, optional when converting)
-   `-f, --format <format>`: Convert to format - `woff` or `woff2` (optional)
-   `-g, --glyphs <glyphs>`: Glyphs to subset - Unicode code points or glyph IDs (optional)

**Note:** At least one of `--format` or `--glyphs` must be specified.

## Examples

### Convert Only

Convert a font file to WOFF2 format:

```bash
npx glypher -i input.ttf -f woff2
```

Convert with explicit output path:

```bash
npx glypher -i input.ttf -f woff2 -o output.woff2
```

### Subset Only

Subset a font to include only specific glyphs:

**Using Unicode code points (recommended):**

```bash
# Using range notation
npx glypher -i input.ttf -o output.ttf -r LATIN_BASIC

# Using U+ notation
npx glypher -i input.ttf -o output.ttf -g U+0041,U+0042,U+0043

# Using hex notation
npx glypher -i input.ttf -o output.ttf -g 0x0041,0x0042,0x0043

# Using plain hex (without prefix)
npx glypher -i input.ttf -o output.ttf -g 0041,0042,0043
```

**Using glyph IDs (font-specific):**

```bash
npx glypher -i input.ttf -o output.ttf -g 36,37,38
```

### Subset and Convert

Subset a font and convert to WOFF2 in a single command:

```bash
npx glypher -i input.ttf -f woff2 -g U+0041,U+0042,U+0043 -o output.woff2
```

This will:

1. Subset the font to include only the specified glyphs
2. Convert the subsetted font to WOFF2 format

You can omit `-o` when using `-f`, and the output filename will be auto-generated:

```bash
npx glypher -i input.ttf -f woff2 -g U+0041,U+0042,U+0043
# Outputs: input.woff2
```

## Notes

-   **Unicode code points** are font-independent and recommended for subsetting
-   **Glyph IDs** are font-specific and may vary between fonts
-   When only using `--format`, the output path defaults to the input filename with the new extension
-   When only using `--glyphs`, the `--output` option is required
