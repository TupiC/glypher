#! /usr/bin/env node
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let commander = require("commander");
let fs = require("fs");
fs = __toESM(fs);
let path = require("path");
path = __toESM(path);

//#region src/wasm/glypher_wasm.js
var require_glypher_wasm = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* @param {Uint8Array} data
	* @param {string} format
	* @returns {Uint8Array}
	*/
	function convert_font(data, format) {
		const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
		const len0 = WASM_VECTOR_LEN;
		const ptr1 = passStringToWasm0(format, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len1 = WASM_VECTOR_LEN;
		const ret = wasm.convert_font(ptr0, len0, ptr1, len1);
		var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
		wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
		return v3;
	}
	exports.convert_font = convert_font;
	/**
	* @param {Uint8Array} data
	* @param {Uint32Array} glyphs
	* @returns {Uint8Array}
	*/
	function subset_font(data, glyphs) {
		const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
		const len0 = WASM_VECTOR_LEN;
		const ptr1 = passArray32ToWasm0(glyphs, wasm.__wbindgen_malloc);
		const len1 = WASM_VECTOR_LEN;
		const ret = wasm.subset_font(ptr0, len0, ptr1, len1);
		var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
		wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
		return v3;
	}
	exports.subset_font = subset_font;
	function __wbg_get_imports() {
		const import0 = {
			__proto__: null,
			__wbindgen_init_externref_table: function() {
				const table = wasm.__wbindgen_externrefs;
				const offset = table.grow(4);
				table.set(0, void 0);
				table.set(offset + 0, void 0);
				table.set(offset + 1, null);
				table.set(offset + 2, true);
				table.set(offset + 3, false);
			}
		};
		return {
			__proto__: null,
			"./glypher_wasm_bg.js": import0
		};
	}
	function getArrayU8FromWasm0(ptr, len) {
		ptr = ptr >>> 0;
		return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
	}
	let cachedUint32ArrayMemory0 = null;
	function getUint32ArrayMemory0() {
		if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
		return cachedUint32ArrayMemory0;
	}
	let cachedUint8ArrayMemory0 = null;
	function getUint8ArrayMemory0() {
		if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
		return cachedUint8ArrayMemory0;
	}
	function passArray32ToWasm0(arg, malloc) {
		const ptr = malloc(arg.length * 4, 4) >>> 0;
		getUint32ArrayMemory0().set(arg, ptr / 4);
		WASM_VECTOR_LEN = arg.length;
		return ptr;
	}
	function passArray8ToWasm0(arg, malloc) {
		const ptr = malloc(arg.length * 1, 1) >>> 0;
		getUint8ArrayMemory0().set(arg, ptr / 1);
		WASM_VECTOR_LEN = arg.length;
		return ptr;
	}
	function passStringToWasm0(arg, malloc, realloc) {
		if (realloc === void 0) {
			const buf = cachedTextEncoder.encode(arg);
			const ptr$1 = malloc(buf.length, 1) >>> 0;
			getUint8ArrayMemory0().subarray(ptr$1, ptr$1 + buf.length).set(buf);
			WASM_VECTOR_LEN = buf.length;
			return ptr$1;
		}
		let len = arg.length;
		let ptr = malloc(len, 1) >>> 0;
		const mem = getUint8ArrayMemory0();
		let offset = 0;
		for (; offset < len; offset++) {
			const code = arg.charCodeAt(offset);
			if (code > 127) break;
			mem[ptr + offset] = code;
		}
		if (offset !== len) {
			if (offset !== 0) arg = arg.slice(offset);
			ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
			const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
			const ret = cachedTextEncoder.encodeInto(arg, view);
			offset += ret.written;
			ptr = realloc(ptr, len, offset, 1) >>> 0;
		}
		WASM_VECTOR_LEN = offset;
		return ptr;
	}
	const cachedTextEncoder = new TextEncoder();
	if (!("encodeInto" in cachedTextEncoder)) cachedTextEncoder.encodeInto = function(arg, view) {
		const buf = cachedTextEncoder.encode(arg);
		view.set(buf);
		return {
			read: arg.length,
			written: buf.length
		};
	};
	let WASM_VECTOR_LEN = 0;
	const wasmPath = `${__dirname}/glypher_wasm_bg.wasm`;
	const wasmBytes = require("fs").readFileSync(wasmPath);
	const wasmModule = new WebAssembly.Module(wasmBytes);
	const wasm = new WebAssembly.Instance(wasmModule, __wbg_get_imports()).exports;
	wasm.__wbindgen_start();
}));

//#endregion
//#region src/commands/subset.ts
var import_glypher_wasm = require_glypher_wasm();
function subset(inputPath, outputPath, glyphs) {
	const data = fs.default.readFileSync(inputPath);
	const glyphsArray = glyphs?.split(",").map(Number) || [];
	const subsetData = (0, import_glypher_wasm.subset_font)(data, new Uint32Array(glyphsArray));
	fs.default.writeFileSync(outputPath, subsetData);
	return subsetData;
}

//#endregion
//#region src/commands/convert.ts
function convert(inputPath, format, outputPath) {
	const convertedData = (0, import_glypher_wasm.convert_font)(fs.default.readFileSync(inputPath), format);
	const finalOutputPath = outputPath || (() => {
		const ext = path.default.extname(inputPath);
		const base = path.default.basename(inputPath, ext);
		const dir = path.default.dirname(inputPath);
		return path.default.join(dir, `${base}.${format}`);
	})();
	fs.default.writeFileSync(finalOutputPath, convertedData);
	return convertedData;
}

//#endregion
//#region src/cli.ts
const program = new commander.Command();
program.name("glypher").description("A font manipulation CLI tool").version("1.0.0");
program.command("subset").description("Subset a font").requiredOption("-i, --input <path>", "Input font file").requiredOption("-o, --output <path>", "Output font file").option("-g, --glyphs <glyphs>", "Glyphs to subset").action((opts) => {
	subset(opts.input, opts.output, opts.glyphs);
});
program.command("convert").description("Convert a font").requiredOption("-i, --input <path>", "Input font file").addOption(new commander.Option("-f, --format <format>", "Output format").choices(["woff2", "woff"]).makeOptionMandatory()).option("-o, --output <path>", "Output font file").action((opts) => {
	convert(opts.input, opts.format, opts.output);
});
if (!process.argv.slice(2).length) program.help();
program.parse(process.argv);
var cli_default = program;

//#endregion
module.exports = cli_default;