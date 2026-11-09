import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Banknote } from "lucide-react";
import { DataTable } from "./DataTable";
import { StatsCard } from "./StatsCard";

describe("numeric presentation", () => {
  it("formats every numeric table cell while preserving IDs, phones and source values", () => {
    const row = {
      id: "001.234",
      number: "0991234567",
      amount: 12.3456789,
      balance: -1.005,
      quantity: 12,
      sellPrice: "12.3000",
      payPrice: 1234.567,
    };
    const columns = Object.keys(row).map((key) => ({
      key,
      label: key,
      sortable: true,
    }));
    const html = renderToStaticMarkup(
      <DataTable title="Numbers" columns={columns} data={[row]} amountBold />,
    );
    for (const text of [
      "001.234",
      "0991234567",
      "12.35",
      "1.01",
      "12.3",
      "1,234.57",
    ])
      expect(html).toContain(text);
    expect(html).not.toContain("12.3456789");
    expect(html).not.toContain("12.3000");
    expect(html).not.toContain("12.00");
    expect(row.amount).toBe(12.3456789);
    expect(row.payPrice).toBe(1234.567);
  });
  it("formats numeric cards and trends without altering text labels", () => {
    const html = renderToStaticMarkup(
      <StatsCard
        title="Balance"
        value={1234.567}
        icon={Banknote}
        trend={{ value: 1.005, isPositive: true }}
      />,
    );
    expect(html).toContain("1,234.57");
    expect(html).toContain("1.01");
    const text = renderToStaticMarkup(
      <StatsCard title="Label" value="12 products" icon={Banknote} />,
    );
    expect(text).toContain("12 products");
  });
});
