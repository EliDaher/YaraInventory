import { describe, it, expect } from "vitest";
import {
  decimal,
  roundNumber,
  formatNumber,
  normalizeNumbers,
  formatNumericField,
} from "./numbers";

describe("two decimal precision", () => {
  it.each([
    [1.005, 1.01],
    [-1.005, -1.01],
    [12.345, 12.35],
    [12.344, 12.34],
    [0.1 + 0.2, 0.3],
    [-0.001, 0],
  ])("rounds %s to %s", (input, expected) => {
    expect(roundNumber(input)).toBe(expected);
    expect(Object.is(roundNumber(input), -0)).toBe(false);
  });
  it("keeps exact intermediate decimal calculations", () => {
    expect(roundNumber(decimal("1.005").times(3))).toBe(3.02);
    expect(roundNumber(decimal(1).div(8))).toBe(0.13);
  });
  it("uses at most two digits without trailing zeroes", () => {
    expect(formatNumber(12.345)).toBe("12.35");
    expect(formatNumber(12.3)).toBe("12.3");
    expect(formatNumber(12)).toBe("12");
    expect(formatNumber(1234.567)).toBe("1,234.57");
    expect(formatNumber(-0.001)).toBe("0");
  });
  it("normalizes only numeric domain fields without mutating the original", () => {
    const legacy = {
      id: "001.234",
      number: "0991234567",
      timestamp: 123456789,
      date: "2026-11-09",
      balance: 1.005,
      products: [{ qty: "2.345", sellPrice: 12.999 }],
    };
    const normalized = normalizeNumbers(legacy);
    expect(normalized).toEqual({
      ...legacy,
      balance: 1.01,
      products: [{ qty: 2.35, sellPrice: 13 }],
    });
    expect(legacy.balance).toBe(1.005);
    expect(formatNumericField(legacy.balance, "balance")).toBe("1.01");
    expect(formatNumericField(legacy.number, "number")).toBe(legacy.number);
    expect(formatNumericField(1234, "id")).toBe(1234);
  });
  it("does not accept non-finite domain values", () => {
    expect(() => roundNumber(Infinity)).toThrow();
    expect(() => normalizeNumbers({ amount: "bad" })).toThrow();
  });
});
