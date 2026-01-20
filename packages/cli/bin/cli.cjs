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
let os = require("os");
os = __toESM(os);

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
	* WASM-compatible version that returns glyphs as a JSON string
	* @param {string} url
	* @param {number} depth
	* @returns {Promise<string>}
	*/
	function crawl(url, depth) {
		const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		return wasm.crawl(ptr0, len0, depth);
	}
	exports.crawl = crawl;
	/**
	* Expand multiple range names into a deduplicated array of Unicode code points
	* Takes a JSON array of range names, returns a Uint32Array of code points
	* @param {string} range_names_json
	* @returns {Uint32Array}
	*/
	function expand_ranges(range_names_json) {
		const ptr0 = passStringToWasm0(range_names_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		const ret = wasm.expand_ranges(ptr0, len0);
		if (ret[3]) throw takeFromExternrefTable0(ret[2]);
		var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
		wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
		return v2;
	}
	exports.expand_ranges = expand_ranges;
	/**
	* Find best matching ranges for a set of glyphs
	* Takes a string of glyphs, returns JSON array of RangeMatch objects
	* @param {string} glyphs
	* @returns {string}
	*/
	function find_best_matching_ranges_wasm(glyphs) {
		let deferred2_0;
		let deferred2_1;
		try {
			const ptr0 = passStringToWasm0(glyphs, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			const ret = wasm.find_best_matching_ranges_wasm(ptr0, len0);
			deferred2_0 = ret[0];
			deferred2_1 = ret[1];
			return getStringFromWasm0(ret[0], ret[1]);
		} finally {
			wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
		}
	}
	exports.find_best_matching_ranges_wasm = find_best_matching_ranges_wasm;
	/**
	* Format range matches for display
	* Takes a JSON array of RangeMatch objects, returns formatted string
	* @param {string} matches_json
	* @returns {string}
	*/
	function format_range_matches_wasm(matches_json) {
		let deferred3_0;
		let deferred3_1;
		try {
			const ptr0 = passStringToWasm0(matches_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len0 = WASM_VECTOR_LEN;
			const ret = wasm.format_range_matches_wasm(ptr0, len0);
			var ptr2 = ret[0];
			var len2 = ret[1];
			if (ret[3]) {
				ptr2 = 0;
				len2 = 0;
				throw takeFromExternrefTable0(ret[2]);
			}
			deferred3_0 = ptr2;
			deferred3_1 = len2;
			return getStringFromWasm0(ptr2, len2);
		} finally {
			wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
		}
	}
	exports.format_range_matches_wasm = format_range_matches_wasm;
	/**
	* Get all available range names for CLI choices
	* Returns a JSON array of range names
	* @returns {string}
	*/
	function get_available_range_names() {
		let deferred1_0;
		let deferred1_1;
		try {
			const ret = wasm.get_available_range_names();
			deferred1_0 = ret[0];
			deferred1_1 = ret[1];
			return getStringFromWasm0(ret[0], ret[1]);
		} finally {
			wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
		}
	}
	exports.get_available_range_names = get_available_range_names;
	/**
	* Parse a Unicode string in various formats:
	* - U+0041
	* - 0x0041
	* - 0041
	* - 65 (decimal)
	* @param {string} str
	* @returns {number}
	*/
	function parse_unicode(str) {
		const ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		const ret = wasm.parse_unicode(ptr0, len0);
		if (ret[2]) throw takeFromExternrefTable0(ret[1]);
		return ret[0] >>> 0;
	}
	exports.parse_unicode = parse_unicode;
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
			__wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(arg0, arg1) {
				const ptr1 = passStringToWasm0(debugString(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_is_function_0095a73b8b156f76: function(arg0) {
				return typeof arg0 === "function";
			},
			__wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
				return arg0 === void 0;
			},
			__wbg___wbindgen_string_get_72fb696202c56729: function(arg0, arg1) {
				const obj = arg1;
				const ret = typeof obj === "string" ? obj : void 0;
				var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				var len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
				throw new Error(getStringFromWasm0(arg0, arg1));
			},
			__wbg__wbg_cb_unref_d9b87ff7982e3b21: function(arg0) {
				arg0._wbg_cb_unref();
			},
			__wbg_abort_2f0584e03e8e3950: function(arg0) {
				arg0.abort();
			},
			__wbg_abort_d549b92d3c665de1: function(arg0, arg1) {
				arg0.abort(arg1);
			},
			__wbg_append_a992ccc37aa62dc4: function() {
				return handleError(function(arg0, arg1, arg2, arg3, arg4) {
					arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
				}, arguments);
			},
			__wbg_call_389efe28435a9388: function() {
				return handleError(function(arg0, arg1) {
					return arg0.call(arg1);
				}, arguments);
			},
			__wbg_call_4708e0c13bdc8e95: function() {
				return handleError(function(arg0, arg1, arg2) {
					return arg0.call(arg1, arg2);
				}, arguments);
			},
			__wbg_clearTimeout_3b5c565a5ec539dd: function(arg0) {
				return clearTimeout(arg0);
			},
			__wbg_done_57b39ecd9addfe81: function(arg0) {
				return arg0.done;
			},
			__wbg_entries_04679661ea6e74fc: function(arg0) {
				return arg0.entries();
			},
			__wbg_fetch_16dcf1cfbbc66b3c: function(arg0) {
				return fetch(arg0);
			},
			__wbg_fetch_afb6a4b6cacf876d: function(arg0, arg1) {
				return arg0.fetch(arg1);
			},
			__wbg_get_9b94d73e6221f75c: function(arg0, arg1) {
				return arg0[arg1 >>> 0];
			},
			__wbg_has_d4e53238966c12b6: function() {
				return handleError(function(arg0, arg1) {
					return Reflect.has(arg0, arg1);
				}, arguments);
			},
			__wbg_headers_59a2938db9f80985: function(arg0) {
				return arg0.headers;
			},
			__wbg_instanceof_Response_ee1d54d79ae41977: function(arg0) {
				let result;
				try {
					result = arg0 instanceof Response;
				} catch (_) {
					result = false;
				}
				return result;
			},
			__wbg_isArray_d314bb98fcf08331: function(arg0) {
				return Array.isArray(arg0);
			},
			__wbg_log_52c4ad396ea54a0d: function(arg0, arg1) {
				console.log(getStringFromWasm0(arg0, arg1));
			},
			__wbg_new_361308b2356cecd0: function() {
				return /* @__PURE__ */ new Object();
			},
			__wbg_new_64284bd487f9d239: function() {
				return handleError(function() {
					return new Headers();
				}, arguments);
			},
			__wbg_new_b5d9e2fb389fef91: function(arg0, arg1) {
				try {
					var state0 = {
						a: arg0,
						b: arg1
					};
					var cb0 = (arg0$1, arg1$1) => {
						const a = state0.a;
						state0.a = 0;
						try {
							return wasm_bindgen__convert__closures_____invoke__h2d2c510f8fa0f5b0(a, state0.b, arg0$1, arg1$1);
						} finally {
							state0.a = a;
						}
					};
					return new Promise(cb0);
				} finally {
					state0.a = state0.b = 0;
				}
			},
			__wbg_new_b949e7f56150a5d1: function() {
				return handleError(function() {
					return new AbortController();
				}, arguments);
			},
			__wbg_new_from_slice_a3d2629dc1826784: function(arg0, arg1) {
				return new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
			},
			__wbg_new_no_args_1c7c842f08d00ebb: function(arg0, arg1) {
				return new Function(getStringFromWasm0(arg0, arg1));
			},
			__wbg_new_with_str_and_init_a61cbc6bdef21614: function() {
				return handleError(function(arg0, arg1, arg2) {
					return new Request(getStringFromWasm0(arg0, arg1), arg2);
				}, arguments);
			},
			__wbg_next_3482f54c49e8af19: function() {
				return handleError(function(arg0) {
					return arg0.next();
				}, arguments);
			},
			__wbg_queueMicrotask_0aa0a927f78f5d98: function(arg0) {
				return arg0.queueMicrotask;
			},
			__wbg_queueMicrotask_5bb536982f78a56f: function(arg0) {
				queueMicrotask(arg0);
			},
			__wbg_resolve_002c4b7d9d8f6b64: function(arg0) {
				return Promise.resolve(arg0);
			},
			__wbg_setTimeout_cb2a856ba8315e7a: function(arg0, arg1) {
				return setTimeout(arg0, arg1);
			},
			__wbg_set_body_9a7e00afe3cfe244: function(arg0, arg1) {
				arg0.body = arg1;
			},
			__wbg_set_cache_315a3ed773a41543: function(arg0, arg1) {
				arg0.cache = __wbindgen_enum_RequestCache[arg1];
			},
			__wbg_set_credentials_c4a58d2e05ef24fb: function(arg0, arg1) {
				arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
			},
			__wbg_set_headers_cfc5f4b2c1f20549: function(arg0, arg1) {
				arg0.headers = arg1;
			},
			__wbg_set_method_c3e20375f5ae7fac: function(arg0, arg1, arg2) {
				arg0.method = getStringFromWasm0(arg1, arg2);
			},
			__wbg_set_mode_b13642c312648202: function(arg0, arg1) {
				arg0.mode = __wbindgen_enum_RequestMode[arg1];
			},
			__wbg_set_signal_f2d3f8599248896d: function(arg0, arg1) {
				arg0.signal = arg1;
			},
			__wbg_signal_d1285ecab4ebc5ad: function(arg0) {
				return arg0.signal;
			},
			__wbg_static_accessor_GLOBAL_12837167ad935116: function() {
				const ret = typeof global === "undefined" ? null : global;
				return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
			},
			__wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: function() {
				const ret = typeof globalThis === "undefined" ? null : globalThis;
				return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
			},
			__wbg_static_accessor_SELF_a621d3dfbb60d0ce: function() {
				const ret = typeof self === "undefined" ? null : self;
				return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
			},
			__wbg_static_accessor_WINDOW_f8727f0cf888e0bd: function() {
				const ret = typeof window === "undefined" ? null : window;
				return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
			},
			__wbg_status_89d7e803db911ee7: function(arg0) {
				return arg0.status;
			},
			__wbg_text_083b8727c990c8c0: function() {
				return handleError(function(arg0) {
					return arg0.text();
				}, arguments);
			},
			__wbg_then_0d9fe2c7b1857d32: function(arg0, arg1, arg2) {
				return arg0.then(arg1, arg2);
			},
			__wbg_then_b9e7b3b5f1a9e1b5: function(arg0, arg1) {
				return arg0.then(arg1);
			},
			__wbg_url_c484c26b1fbf5126: function(arg0, arg1) {
				const ret = arg1.url;
				const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg_value_0546255b415e96c1: function(arg0) {
				return arg0.value;
			},
			__wbindgen_cast_0000000000000001: function(arg0, arg1) {
				return makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__ha6d10a81ea47cd8b, wasm_bindgen__convert__closures_____invoke__hc66936fe36679af2);
			},
			__wbindgen_cast_0000000000000002: function(arg0, arg1) {
				return makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h08972669d3288663, wasm_bindgen__convert__closures_____invoke__hc612c92cdc2fa186);
			},
			__wbindgen_cast_0000000000000003: function(arg0, arg1) {
				return getStringFromWasm0(arg0, arg1);
			},
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
	function wasm_bindgen__convert__closures_____invoke__hc66936fe36679af2(arg0, arg1) {
		wasm.wasm_bindgen__convert__closures_____invoke__hc66936fe36679af2(arg0, arg1);
	}
	function wasm_bindgen__convert__closures_____invoke__hc612c92cdc2fa186(arg0, arg1, arg2) {
		wasm.wasm_bindgen__convert__closures_____invoke__hc612c92cdc2fa186(arg0, arg1, arg2);
	}
	function wasm_bindgen__convert__closures_____invoke__h2d2c510f8fa0f5b0(arg0, arg1, arg2, arg3) {
		wasm.wasm_bindgen__convert__closures_____invoke__h2d2c510f8fa0f5b0(arg0, arg1, arg2, arg3);
	}
	const __wbindgen_enum_RequestCache = [
		"default",
		"no-store",
		"reload",
		"no-cache",
		"force-cache",
		"only-if-cached"
	];
	const __wbindgen_enum_RequestCredentials = [
		"omit",
		"same-origin",
		"include"
	];
	const __wbindgen_enum_RequestMode = [
		"same-origin",
		"no-cors",
		"cors",
		"navigate"
	];
	function addToExternrefTable0(obj) {
		const idx = wasm.__externref_table_alloc();
		wasm.__wbindgen_externrefs.set(idx, obj);
		return idx;
	}
	const CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((state) => state.dtor(state.a, state.b));
	function debugString(val) {
		const type = typeof val;
		if (type == "number" || type == "boolean" || val == null) return `${val}`;
		if (type == "string") return `"${val}"`;
		if (type == "symbol") {
			const description = val.description;
			if (description == null) return "Symbol";
			else return `Symbol(${description})`;
		}
		if (type == "function") {
			const name = val.name;
			if (typeof name == "string" && name.length > 0) return `Function(${name})`;
			else return "Function";
		}
		if (Array.isArray(val)) {
			const length = val.length;
			let debug = "[";
			if (length > 0) debug += debugString(val[0]);
			for (let i = 1; i < length; i++) debug += ", " + debugString(val[i]);
			debug += "]";
			return debug;
		}
		const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
		let className;
		if (builtInMatches && builtInMatches.length > 1) className = builtInMatches[1];
		else return toString.call(val);
		if (className == "Object") try {
			return "Object(" + JSON.stringify(val) + ")";
		} catch (_) {
			return "Object";
		}
		if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack}`;
		return className;
	}
	function getArrayU32FromWasm0(ptr, len) {
		ptr = ptr >>> 0;
		return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
	}
	function getArrayU8FromWasm0(ptr, len) {
		ptr = ptr >>> 0;
		return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
	}
	let cachedDataViewMemory0 = null;
	function getDataViewMemory0() {
		if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
		return cachedDataViewMemory0;
	}
	function getStringFromWasm0(ptr, len) {
		ptr = ptr >>> 0;
		return decodeText(ptr, len);
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
	function handleError(f, args) {
		try {
			return f.apply(this, args);
		} catch (e) {
			const idx = addToExternrefTable0(e);
			wasm.__wbindgen_exn_store(idx);
		}
	}
	function isLikeNone(x) {
		return x === void 0 || x === null;
	}
	function makeMutClosure(arg0, arg1, dtor, f) {
		const state = {
			a: arg0,
			b: arg1,
			cnt: 1,
			dtor
		};
		const real = (...args) => {
			state.cnt++;
			const a = state.a;
			state.a = 0;
			try {
				return f(a, state.b, ...args);
			} finally {
				state.a = a;
				real._wbg_cb_unref();
			}
		};
		real._wbg_cb_unref = () => {
			if (--state.cnt === 0) {
				state.dtor(state.a, state.b);
				state.a = 0;
				CLOSURE_DTORS.unregister(state);
			}
		};
		CLOSURE_DTORS.register(real, state, state);
		return real;
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
	function takeFromExternrefTable0(idx) {
		const value = wasm.__wbindgen_externrefs.get(idx);
		wasm.__externref_table_dealloc(idx);
		return value;
	}
	let cachedTextDecoder = new TextDecoder("utf-8", {
		ignoreBOM: true,
		fatal: true
	});
	cachedTextDecoder.decode();
	function decodeText(ptr, len) {
		return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
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
	if (!glyphs) {
		fs.default.writeFileSync(outputPath, data);
		return data;
	}
	const unicodeValues = [];
	const glyphValues = [];
	let isUnicode = false;
	for (const item of glyphs.split(",")) try {
		const unicode = (0, import_glypher_wasm.parse_unicode)(item);
		if (unicode <= 1114111) {
			unicodeValues.push(unicode);
			isUnicode = true;
		} else glyphValues.push(unicode);
	} catch {
		const num = parseInt(item.trim(), 10);
		if (!isNaN(num)) glyphValues.push(num);
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
//#region src/commands/utils.ts
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

//#endregion
//#region src/commands/convert.ts
function convert(inputPath, format, outputPath) {
	const convertedData = (0, import_glypher_wasm.convert_font)(fs.default.readFileSync(inputPath), format);
	const finalOutputPath = outputPath || generateOutputPath(inputPath, format);
	fs.default.writeFileSync(finalOutputPath, convertedData);
	return convertedData;
}

//#endregion
//#region package.json
var version = "1.2.1";

//#endregion
//#region src/utils.ts
function getAvailableRangeNames() {
	return JSON.parse((0, import_glypher_wasm.get_available_range_names)());
}
function expandRanges(rangeNames) {
	return Array.from((0, import_glypher_wasm.expand_ranges)(JSON.stringify(rangeNames)));
}
function findBestMatchingRanges(glyphs) {
	return JSON.parse((0, import_glypher_wasm.find_best_matching_ranges_wasm)(glyphs));
}
function formatRangeMatches(matches) {
	return (0, import_glypher_wasm.format_range_matches_wasm)(JSON.stringify(matches));
}
function glyphsToUnicodeFormat(glyphs) {
	return [...glyphs].map((c) => {
		return `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`;
	}).join(",");
}
function codePointsToUnicodeFormat(codePoints) {
	return codePoints.map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`).join(",");
}
function performSubsetAndConvert(input, outputPath, glyphs, format) {
	if (format) {
		const tempPath = path.default.join(os.default.tmpdir(), `glypher-temp-${Date.now()}${path.default.extname(input)}`);
		try {
			subset(input, tempPath, glyphs);
			convert(tempPath, format, outputPath);
		} finally {
			if (fs.default.existsSync(tempPath)) fs.default.unlinkSync(tempPath);
		}
	} else subset(input, outputPath, glyphs);
}
function determineOutputPath(input, output, format, requireOutput = true) {
	if (output) return output;
	if (format) return generateOutputPath(input, format);
	if (requireOutput) {
		const ext = path.default.extname(input);
		const base = path.default.basename(input, ext);
		const dir = path.default.dirname(input);
		return path.default.join(dir, `${base}-subset${ext}`);
	}
	console.error("Error: --output is required when only subsetting");
	process.exit(1);
}

//#endregion
//#region src/cli.ts
const program = new commander.Command();
program.name("glypher").description("A font manipulation CLI tool").version(version).enablePositionalOptions().option("-i, --input <path>", "Input font file").option("-o, --output <path>", "Output font file").addOption(new commander.Option("-f, --format <format>", "Convert to format").choices(["woff2", "woff"])).option("-g, --glyphs <glyphs>", "Glyphs to subset (Unicode code points or glyph IDs)").addOption(new commander.Option("-r, --range <ranges...>", "Predefined character range(s) for subsetting").choices(getAvailableRangeNames())).option("--crawl", "Crawl a website to extract glyphs for subsetting").option("-u, --url <url>", "URL to crawl (requires --crawl)").option("-d, --depth <depth>", "Crawl depth (0 = single page only)", "0").option("--use-range", "Use best matching range instead of exact glyphs (with --crawl)").action(async (opts) => {
	const { input, output, format, glyphs, range, url, depth, useRange } = opts;
	if (opts.crawl) {
		if (!url) {
			console.error("Error: --url is required when using --crawl");
			process.exit(1);
		}
		const crawlDepth = parseInt(depth || "0", 10);
		if (isNaN(crawlDepth) || crawlDepth < 0) {
			console.error("Error: depth must be a non-negative integer");
			process.exit(1);
		}
		console.log(`\nCrawling ${url} with depth ${crawlDepth}...\n`);
		try {
			const crawledGlyphs = await (0, import_glypher_wasm.crawl)(url, crawlDepth);
			if (!crawledGlyphs || crawledGlyphs.length === 0) {
				console.log("No glyphs found on the website.");
				process.exit(0);
			}
			console.log(`\n=== Found ${crawledGlyphs.length} unique glyphs ===\n`);
			const sampleSize = Math.min(100, crawledGlyphs.length);
			console.log(`Sample (first ${sampleSize} chars): ${crawledGlyphs.slice(0, sampleSize)}`);
			if (crawledGlyphs.length > sampleSize) console.log(`... and ${crawledGlyphs.length - sampleSize} more`);
			const matches = findBestMatchingRanges(crawledGlyphs);
			if (matches.length > 0) {
				console.log("\n=== Best Matching Character Ranges ===\n");
				console.log(formatRangeMatches(matches));
				const bestMatch = matches[0];
				console.log(`\nRecommendation: Use "${bestMatch.name}" range`);
				console.log(`  - Covers ${bestMatch.range_coverage_percent.toFixed(1)}% of the range`);
				console.log(`  - ${bestMatch.glyphs_in_range}/${bestMatch.total_range_size} characters used`);
				if (bestMatch.glyphs_outside_range > 0) console.log(`  - ${bestMatch.glyphs_outside_range} glyphs fall outside this range`);
				if (!useRange) console.log("\nTip: Use --use-range to subset using the best matching range");
			}
			if (input) {
				if (!fs.default.existsSync(input)) {
					console.error(`\nError: Input font file not found: ${input}`);
					process.exit(1);
				}
				let effectiveGlyphs$1;
				if (useRange && matches.length > 0) {
					const bestRange = matches[0].name;
					console.log(`\n=== Converting font using "${bestRange}" range ===\n`);
					effectiveGlyphs$1 = codePointsToUnicodeFormat(expandRanges([bestRange]));
				} else {
					console.log("\n=== Converting font using exact glyphs found ===\n");
					effectiveGlyphs$1 = glyphsToUnicodeFormat(crawledGlyphs);
				}
				const outputPath$1 = determineOutputPath(input, output, format, true);
				performSubsetAndConvert(input, outputPath$1, effectiveGlyphs$1, format);
				console.log(`Output written to: ${outputPath$1}`);
			}
		} catch (error) {
			console.error("Error during crawl:", error);
			process.exit(1);
		}
		return;
	}
	if (!input) {
		console.error("Error: --input is required");
		process.exit(1);
	}
	if (!format && !glyphs && !range) {
		console.error("Error: At least one of -f, --format; -g --glyphs; -r --range or --crawl must be specified");
		process.exit(1);
	}
	let effectiveGlyphs = glyphs;
	if (range && range.length > 0) {
		const rangeStr = codePointsToUnicodeFormat(expandRanges(range));
		effectiveGlyphs = glyphs ? `${glyphs},${rangeStr}` : rangeStr;
	}
	const outputPath = determineOutputPath(input, output, format, !format);
	if (effectiveGlyphs && format) performSubsetAndConvert(input, outputPath, effectiveGlyphs, format);
	else if (effectiveGlyphs) subset(input, outputPath, effectiveGlyphs);
	else if (format) convert(input, format, outputPath);
	console.log(`Output written to: ${outputPath}`);
});
if (!process.argv.slice(2).length) program.help();
program.parse(process.argv);
var cli_default = program;

//#endregion
module.exports = cli_default;