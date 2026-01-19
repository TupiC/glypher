import { vi } from "vitest";

export const get_available_range_names = vi.fn(() => "[]");
export const expand_ranges = vi.fn(() => new Uint32Array([]));
export const find_best_matching_ranges_wasm = vi.fn(() => "[]");
export const format_range_matches_wasm = vi.fn(() => "");
