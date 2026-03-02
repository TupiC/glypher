/**
 * Parses axis values supporting:
 * - Single: 400
 * - Range: 400-900
 * - Discrete: 400,700 (comma-separated, parsed when M values for N axes with M > N)
 */
export type AxisValue = number | { min: number; max: number };

export interface AxisLimits {
    [axisTag: string]: number | [number, number] | null;
}

export interface ParsedAxisSpec {
    axisNames: string[];
    combinations: AxisLimits[];
}

/**
 * Parse a single value token - can be "400", "400-900", or part of "400,700"
 */
function parseValueToken(token: string): number | null {
    const num = parseFloat(token.trim());
    return isNaN(num) ? null : num;
}

/**
 * Parse a value spec - returns single value, range [min,max], or null for drop
 */
function parseValueSpec(
    tokens: string[],
    startIdx: number,
    count: number
): AxisValue | null {
    if (count === 0) return null;
    if (count === 1) {
        const token = tokens[startIdx];
        if (token?.toLowerCase() === "drop") return null;
        const rangeMatch = token?.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
        if (rangeMatch) {
            return {
                min: parseFloat(rangeMatch[1]),
                max: parseFloat(rangeMatch[2]),
            };
        }
        const num = parseValueToken(token ?? "");
        return num !== null ? num : null;
    }
    // Discrete: multiple values - use min/max range
    const values: number[] = [];
    for (let i = 0; i < count; i++) {
        const num = parseValueToken(tokens[startIdx + i] ?? "");
        if (num !== null) values.push(num);
    }
    if (values.length === 0) return null;
    if (values.length === 1) return values[0];
    return { min: Math.min(...values), max: Math.max(...values) };
}

/**
 * Parse the --axis parameter format (Google Fonts-like):
 * ital,wght,wdth@0,400-900,100;0,400-900,75;1,400,700,100
 *
 * - Axis names: comma-separated before @
 * - Combinations: semicolon-separated, each is comma-separated values
 * - Values: single (400), range (400-900), or discrete (400,700)
 * - When value count > axis count, extra values form discrete set for the middle axis
 */
export function parseAxisSpec(spec: string): ParsedAxisSpec | null {
    const atIdx = spec.indexOf("@");
    if (atIdx < 0) return null;

    const axisPart = spec.slice(0, atIdx).trim();
    const combosPart = spec.slice(atIdx + 1).trim();

    const axisNames = axisPart.split(",").map((a) => a.trim().toLowerCase());
    if (axisNames.length === 0 || axisNames.some((a) => !a)) return null;

    const combos: AxisLimits[] = [];
    const comboStrings = combosPart.split(";").map((s) => s.trim());

    for (const comboStr of comboStrings) {
        if (!comboStr) continue;

        const tokens = comboStr.split(",").map((s) => s.trim());
        const nAxes = axisNames.length;
        const nValues = tokens.length;

        if (nValues < nAxes) continue; // Skip invalid

        const limits: AxisLimits = {};
        let tokenIdx = 0;

        if (nValues === nAxes) {
            // One value per axis
            for (let i = 0; i < nAxes; i++) {
                const val = parseValueSpec(tokens, tokenIdx, 1);
                if (val === null) {
                    limits[axisNames[i]] = null;
                } else if (typeof val === "number") {
                    limits[axisNames[i]] = val;
                } else {
                    limits[axisNames[i]] = [val.min, val.max];
                }
                tokenIdx++;
            }
        } else {
            // Extra values: assign to second-to-last axis (e.g. wght discrete)
            const extraCount = nValues - nAxes;
            for (let i = 0; i < nAxes; i++) {
                const count = i === nAxes - 2 ? 1 + extraCount : 1;
                const val = parseValueSpec(tokens, tokenIdx, count);
                if (val === null) {
                    limits[axisNames[i]] = null;
                } else if (typeof val === "number") {
                    limits[axisNames[i]] = val;
                } else {
                    limits[axisNames[i]] = [val.min, val.max];
                }
                tokenIdx += count;
            }
        }

        combos.push(limits);
    }

    return combos.length > 0 ? { axisNames, combinations: combos } : null;
}
