import { describe, it, expect } from "vitest";
import { parseAxisSpec } from "../../src/axis/parse";

describe("parseAxisSpec", () => {
    it("parses simple single combination", () => {
        const result = parseAxisSpec("ital,wght,wdth@0,400-900,100");
        expect(result).not.toBeNull();
        expect(result!.axisNames).toEqual(["ital", "wght", "wdth"]);
        expect(result!.combinations).toHaveLength(1);
        expect(result!.combinations[0]).toEqual({
            ital: 0,
            wght: [400, 900],
            wdth: 100,
        });
    });

    it("parses multiple combinations", () => {
        const result = parseAxisSpec(
            "ital,wght,wdth@0,400-900,100;0,400-900,75;1,400,700,100"
        );
        expect(result).not.toBeNull();
        expect(result!.axisNames).toEqual(["ital", "wght", "wdth"]);
        expect(result!.combinations).toHaveLength(3);
        expect(result!.combinations[0]).toEqual({
            ital: 0,
            wght: [400, 900],
            wdth: 100,
        });
        expect(result!.combinations[1]).toEqual({
            ital: 0,
            wght: [400, 900],
            wdth: 75,
        });
        expect(result!.combinations[2]).toEqual({
            ital: 1,
            wght: [400, 700],
            wdth: 100,
        });
    });

    it("parses discrete values (extra values for middle axis)", () => {
        const result = parseAxisSpec("ital,wght,wdth@1,400,700,100");
        expect(result).not.toBeNull();
        expect(result!.combinations[0]).toEqual({
            ital: 1,
            wght: [400, 700],
            wdth: 100,
        });
    });

    it("parses single pin values", () => {
        const result = parseAxisSpec("ital,wght@0,700");
        expect(result).not.toBeNull();
        expect(result!.combinations[0]).toEqual({
            ital: 0,
            wght: 700,
        });
    });

    it("returns null for invalid format (no @)", () => {
        expect(parseAxisSpec("ital,wght,wdth")).toBeNull();
    });

    it("returns null for empty combinations", () => {
        expect(parseAxisSpec("ital,wght@")).toBeNull();
    });

    it("normalizes axis names to lowercase", () => {
        const result = parseAxisSpec("ITAL,Wght,Wdth@0,400,100");
        expect(result!.axisNames).toEqual(["ital", "wght", "wdth"]);
    });
});
