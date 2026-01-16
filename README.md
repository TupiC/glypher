# glypher

Glypher is a successor of [glyphhanger](https://github.com/zachleat/glyphhanger), providing fast and efficient font manipulation tools. You had to install external tools like `pyftsubset`, `brotli` or `zopfli` to enable specific features. This project focuses on providing all the features in a single tool without the need for external installations or dependencies.

## Installation

```bash
npm install -g glypher
```

or

```bash
npx glypher -i input.ttf -f woff2
```

## Usage

Glypher uses a unified command where subsetting and conversion can be done separately or together:

```bash
glypher -i <input> [-o <output>] [-f <format>] [-g <glyphs>]
```

### Convert a font to WOFF2

```bash
glypher -i input.ttf -f woff2
```

### Subset a font

```bash
glypher -i input.ttf -o output.ttf -g U+0041,U+0042,U+0043
```

### Subset and convert in one command

```bash
glypher -i input.ttf -f woff2 -g U+0041,U+0042,U+0043 -o output.woff2
```

More information about the commands and options can be found in [packages/cli/README.md](./packages/cli/README.md).

## Packages

-   `glypher/wasm`: Rust-based WebAssembly library that handles font subsetting and conversion operations
-   `glypher/cli`: TypeScript CLI interface that wraps the core functionality

For CLI usage and commands, see [packages/cli/README.md](./packages/cli/README.md).

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Reporting Issues

Issues are welcomed! If you encounter a bug or have a feature request, please [open an issue](https://github.com/TupiC/glypher/issues).
