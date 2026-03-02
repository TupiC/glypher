# glypher

Fast and efficient font manipulation tool.

[![npm version](https://img.shields.io/npm/v/glypher)](https://www.npmjs.com/package/glypher)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![npm](https://img.shields.io/npm/dt/glypher)

Glypher is a successor of [glyphhanger](https://github.com/zachleat/glyphhanger), providing fast and efficient font manipulation tools. You had to install external tools like `pyftsubset`, `brotli` or `zopfli` to enable specific features. This project focuses on providing all the features in a single tool without the need for external installations or dependencies.

The `glypher` CLI provides a TypeScript interface that wraps the core WebAssembly functionality for font subsetting and conversion operations.

## Features

-   Subset fonts to include only specific glyphs
-   Slice variable font axes (restrict weight, width, italic, etc.)
-   Convert fonts to different formats (WOFF, WOFF2)
-   Crawl websites to extract glyphs
    - Limitation: CSR, SSR websites not fully supported since content might be added after page load
-   Use predefined Unicode ranges for common scripts
-   Use best matching ranges instead of exact glyphs
-   Use Unicode code points or glyph IDs
-   Use range notation or U+ notation
-   Use hex notation or plain hex (without prefix)

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
npx glypher -i <input> [-o <output>] [-f <format>] [-g <glyphs>] [-r <ranges...>]
```

## Options

| Option | Alias | Description | Required |
|--------|-------|-------------|----------|
| `--input <path>` | `-i` | Input font file | Yes (except with `--crawl` only) |
| `--output <path>` | `-o` | Output font file | When subsetting without format |
| `--format <format>` | `-f` | Convert to format: `woff` or `woff2` | No |
| `--axis <spec>` | `-a` | Slice variable font axes (Google Fonts-like format) | No |
| `--glyphs <glyphs>` | `-g` | Glyphs to subset (Unicode code points or glyph IDs) | No |
| `--range <ranges...>` | `-r` | Predefined character range(s) for subsetting | No |
| `--crawl` | | Crawl a website to extract glyphs | No |
| `--url <url>` | `-u` | URL to crawl (requires `--crawl`) | When using `--crawl` |
| `--depth <depth>` | `-d` | Crawl depth (0 = single page only, default: 0) | No |
| `--use-range` | | Use best matching range instead of exact glyphs (with `--crawl`) | No |

**Note:** At least one of `--format`, `--glyphs`, `--range`, `--axis`, or `--crawl` must be specified.

## Examples

### Variable Font Axis Slicing

Slice variable fonts to reduce file size by restricting axis ranges. Uses a Google Fonts-like format: `axis1,axis2,axis3@valueCombinations`.

**Format:** `axisNames@combinations` where combinations are semicolon-separated, each with comma-separated values per axis. Supports:
- Single value: `400`
- Range: `400-900`
- Discrete values: `400,700` (uses min-max range)

**Example – restrict weight and width:**

```bash
# Single combination: ital=0, wght=400-900, wdth=100
npx glypher -i NotoSans-VF.woff2 -a "ital,wght,wdth@0,400-900,100" -f woff2 -o output.woff2

# Multiple combinations (outputs multiple files: output-0.woff2, output-1.woff2)
npx glypher -i NotoSans-VF.woff2 -a "ital,wght,wdth@0,400-900,100;0,400-900,75;1,400,700,100" -f woff2 -o output.woff2
```

**Combine with subsetting:**

```bash
npx glypher -i NotoSans-VF.woff2 -a "ital,wght@0,400-700;1,400-700" -r LATIN -f woff2 -o output.woff2
```

### Convert Only

Convert a font file to WOFF2 format:

```bash
npx glypher -i input.ttf -f woff2
```

Convert to WOFF format:

```bash
npx glypher -i input.ttf -f woff
```

Convert with explicit output path:

```bash
npx glypher -i input.ttf -f woff2 -o output.woff2
```

### Subset Only

Subset a font to include only specific glyphs:

**Using predefined ranges (recommended for language support):**

```bash
# Single range
npx glypher -i input.ttf -o output.ttf -r LATIN_BASIC

# Multiple ranges
npx glypher -i input.ttf -o output.ttf -r LATIN_BASIC GREEK

# Extended Latin support
npx glypher -i input.ttf -o output.ttf -r LATIN_EXTENDED
```

**Using Unicode code points:**

```bash
# Using U+ notation
npx glypher -i input.ttf -o output.ttf -g U+0041,U+0042,U+0043

# Using hex notation (0x prefix)
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

Using predefined ranges with conversion:

```bash
npx glypher -i input.ttf -f woff2 -r LATIN_BASIC -o output.woff2
```

You can omit `-o` when using `-f`, and the output filename will be auto-generated:

```bash
npx glypher -i input.ttf -f woff2 -r LATIN_BASIC
# Outputs: input.woff2
```

### Website Crawling

Crawl a website to discover which glyphs are actually used:

**Basic crawl (analyze only):**

```bash
npx glypher --crawl -u https://example.com
```

**Crawl with depth (follow links):**

```bash
# Crawl the page and one level of linked pages
npx glypher --crawl -u https://example.com -d 1

# Crawl two levels deep
npx glypher --crawl -u https://example.com -d 2
```

**Crawl and subset a font with exact glyphs found:**

```bash
npx glypher --crawl -u https://example.com -i input.ttf -o output.ttf
```

**Crawl and subset using the best matching range:**

```bash
npx glypher --crawl -u https://example.com -i input.ttf -o output.ttf --use-range
```

**Crawl, subset, and convert in one command:**

```bash
npx glypher --crawl -u https://example.com -i input.ttf -f woff2 -o output.woff2
```

**Crawl with range matching and convert:**

```bash
npx glypher --crawl -u https://example.com -i input.ttf -f woff2 --use-range
```

## Output Path Behavior

- When using `--format` without `--output`: Output file uses the input filename with the new extension (e.g., `input.ttf` → `input.woff2`)
- When only subsetting without `--output`: Output file is auto-generated as `<input>-subset.<ext>` (e.g., `input.ttf` → `input-subset.ttf`)
- When `--output` is specified: Uses the exact path provided

## Notes

-   **Unicode code points** are font-independent and recommended for subsetting
-   **Glyph IDs** are font-specific and may vary between fonts
-   **Predefined ranges** are useful for ensuring full language support
-   The `--use-range` flag with `--crawl` helps ensure you include a complete character set rather than only the exact glyphs found
-   Website crawling works best with static HTML content; dynamically loaded content (CSR/SSR) may not be captured


## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Reporting Issues

Issues are welcomed! If you encounter a bug or have a feature request, please [open an issue](https://github.com/TupiC/glypher/issues).
