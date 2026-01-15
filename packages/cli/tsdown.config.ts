import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/cli.ts"],
    format: ["cjs"],
    outDir: "bin",
    exports: true,
});
