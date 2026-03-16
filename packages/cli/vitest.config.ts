import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        alias: {
            // Mock the WASM module since it's built during the build process
            // and may not exist during test runs
            "./wasm/glypher_wasm": path.resolve(
                __dirname,
                "tests/__mocks__/glypher_wasm.ts"
            ),
            "../wasm/glypher_wasm": path.resolve(
                __dirname,
                "tests/__mocks__/glypher_wasm.ts"
            ),
        },
    },
});
