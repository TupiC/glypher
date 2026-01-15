# glypher

Glypher is a successor of [glyphhanger](https://github.com/zachleat/glyphhanger), providing fast and efficient font manipulation tools.

The `glypher/wasm` package is a Rust-based WebAssembly library that handles font subsetting and conversion operations, while `glypher/cli` provides the TypeScript CLI interface that wraps the core functionality.

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
