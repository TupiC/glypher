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
	* @param {Uint16Array} glyphs
	* @returns {Uint8Array}
	*/
	function subset_font(data, glyphs) {
		const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
		const len0 = WASM_VECTOR_LEN;
		const ptr1 = passArray16ToWasm0(glyphs, wasm.__wbindgen_malloc);
		const len1 = WASM_VECTOR_LEN;
		const ret = wasm.subset_font(ptr0, len0, ptr1, len1);
		var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
		wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
		return v3;
	}
	exports.subset_font = subset_font;
	/**
	* @param {Uint8Array} data
	* @param {Uint32Array} unicodes
	* @returns {Uint8Array}
	*/
	function subset_font_by_unicodes(data, unicodes) {
		const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
		const len0 = WASM_VECTOR_LEN;
		const ptr1 = passArray32ToWasm0(unicodes, wasm.__wbindgen_malloc);
		const len1 = WASM_VECTOR_LEN;
		const ret = wasm.subset_font_by_unicodes(ptr0, len0, ptr1, len1);
		var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
		wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
		return v3;
	}
	exports.subset_font_by_unicodes = subset_font_by_unicodes;
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
	let cachedUint16ArrayMemory0 = null;
	function getUint16ArrayMemory0() {
		if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer);
		return cachedUint16ArrayMemory0;
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
	function passArray16ToWasm0(arg, malloc) {
		const ptr = malloc(arg.length * 2, 2) >>> 0;
		getUint16ArrayMemory0().set(arg, ptr / 2);
		WASM_VECTOR_LEN = arg.length;
		return ptr;
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
//#region src/commands/utils.ts
var import_glypher_wasm = require_glypher_wasm();
/**
* Generates an output path based on the input path and desired format.
* Replaces the file extension with the specified format extension.
*
* @param inputPath - The path to the input file
* @param format - The desired output format (woff2 or woff)
* @returns The generated output path with the new extension
*/
function generateOutputPath(inputPath, format) {
	const ext = path.default.extname(inputPath);
	const base = path.default.basename(inputPath, ext);
	const dir = path.default.dirname(inputPath);
	return path.default.join(dir, `${base}.${format}`);
}
/**
* Parse a Unicode string in various formats:
* - U+0041
* - 0x0041
* - 0041
* - 65 (decimal)
*/
function parseUnicode(str) {
	str = str.trim().toUpperCase();
	if (str.startsWith("U+")) return parseInt(str.slice(2), 16);
	if (str.startsWith("0X")) return parseInt(str.slice(2), 16);
	if (/^[0-9A-F]+$/.test(str)) {
		if (/[A-F]/.test(str) || str.length >= 4) {
			const hex = parseInt(str, 16);
			if (hex <= 1114111) return hex;
		}
		return parseInt(str, 10);
	}
	const decimal = parseInt(str, 10);
	if (!isNaN(decimal)) return decimal;
	return null;
}

//#endregion
//#region src/commands/subset.ts
function subset(inputPath, outputPath, glyphs) {
	const data = fs.default.readFileSync(inputPath);
	if (!glyphs) {
		fs.default.writeFileSync(outputPath, data);
		return data;
	}
	const unicodeValues = [];
	const glyphValues = [];
	let isUnicode = false;
	for (const item of glyphs.split(",")) {
		const unicode = parseUnicode(item);
		if (unicode !== null) if (unicode <= 1114111) {
			unicodeValues.push(unicode);
			isUnicode = true;
		} else glyphValues.push(unicode);
		else {
			const num = parseInt(item.trim(), 10);
			if (!isNaN(num)) glyphValues.push(num);
		}
	}
	let subsetData;
	if (isUnicode && unicodeValues.length > 0) subsetData = (0, import_glypher_wasm.subset_font_by_unicodes)(data, new Uint32Array(unicodeValues));
	else if (glyphValues.length > 0) subsetData = (0, import_glypher_wasm.subset_font)(data, new Uint16Array(glyphValues));
	else {
		fs.default.writeFileSync(outputPath, data);
		return data;
	}
	fs.default.writeFileSync(outputPath, subsetData);
	return subsetData;
}

//#endregion
//#region src/commands/convert.ts
function convert(inputPath, format, outputPath) {
	const convertedData = (0, import_glypher_wasm.convert_font)(fs.default.readFileSync(inputPath), format);
	const finalOutputPath = outputPath || generateOutputPath(inputPath, format);
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