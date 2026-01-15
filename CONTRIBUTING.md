# Contributing to glypher

Thank you for your interest in contributing to glypher! We welcome contributions of all kinds, including bug reports, feature requests, documentation improvements, and code contributions.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (version compatible with pnpm 10.6.2)
-   [pnpm](https://pnpm.io/) (version 10.6.2 or compatible)
-   [Rust](https://www.rust-lang.org/) (for working on the WASM package)
-   [wasm-pack](https://rustwasm.github.io/wasm-pack/) (for building the WASM package)

### Setting Up the Development Environment

1. Clone the repository:

    ```bash
    git clone https://github.com/TupiC/glypher.git
    cd glypher
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Build the project:
    ```bash
    pnpm build
    ```

## Project Structure

This is a monorepo managed with pnpm workspaces and Turbo:

-   `packages/wasm/`: Rust-based WebAssembly library for font manipulation
-   `packages/cli/`: TypeScript CLI interface

## How to Contribute

### Reporting Issues

We welcome bug reports and feature requests! When opening an issue, please:

-   Use a clear and descriptive title
-   Provide a detailed description of the issue or feature
-   Include steps to reproduce (for bugs)
-   Mention your environment (OS, Node.js version, etc.)
-   For bug reports, include error messages or logs if applicable

### Submitting Code Changes

1. **Fork the repository** and create a new branch from `main`:

    ```bash
    git checkout -b feat/your-feature-name
    # or
    git checkout -b fix/your-bug-fix
    ```

2. **Make your changes**:

    - Write clear, readable code
    - Follow existing code style and patterns
    - Add comments for complex logic
    - Update documentation if needed

3. **Test your changes**:

    - Ensure the project builds successfully: `pnpm build`
    - Test the CLI commands if you modified CLI functionality
    - Test the WASM package if you modified Rust code

4. **Commit your changes**:

    - Write clear, descriptive commit messages
    - Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification

5. **Push and create a Pull Request**:
    - Push your branch to your fork
    - Open a Pull Request with a clear description of your changes
    - Reference any related issues
    - The PR title should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification

## Development Workflow

### Building

Build all packages:

```bash
pnpm build
```

### Testing

Run tests (if available):

```bash
pnpm test
```

### Working on the WASM Package

The WASM package is written in Rust. To work on it:

1. Navigate to `packages/wasm/`
2. Make your changes to the Rust source files
3. Build with `wasm-pack` (or use the build script from the root)

### Working on the CLI Package

The CLI package is written in TypeScript:

1. Navigate to `packages/cli/`
2. Make your changes
3. The build process will compile TypeScript to JavaScript

## Questions?

If you have questions about contributing, feel free to open an issue with the `question` label.

Thank you for contributing to glypher! 🎉
