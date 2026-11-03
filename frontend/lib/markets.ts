export interface MarketQuote {
  name: string;
  symbol: string;
  value: string;
  change: string;
  changePct: string;
  isPositive: boolean;
}

export interface FxPair {
  pair: string;
  name: string;
  rate: string;
  change: string;
  isPositive: boolean;
}

export interface Commodity {
  name: string;
  symbol: string;
  value: string;
  unit: string;
  change: string;
  isPositive: boolean;
}

export interface MacroIndicator {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  note: string;
}

export interface YieldPoint {
  tenor: string;
  value: number;
}

export const globalIndices: MarketQuote[] = [
  { name: "NGX All-Share", symbol: "NGX ASI", value: "98,412.10", change: "+412.05", changePct: "+0.42%", isPositive: true },
  { name: "S&P 500", symbol: "SPX", value: "5,932.44", change: "+18.71", changePct: "+0.32%", isPositive: true },
  { name: "FTSE 100", symbol: "UKX", value: "8,271.09", change: "-24.30", changePct: "-0.29%", isPositive: false },
  { name: "Nikkei 225", symbol: "N225", value: "39,402.88", change: "+210.44", changePct: "+0.54%", isPositive: true },
  { name: "DAX", symbol: "DAX", value: "19,203.11", change: "+38.20", changePct: "+0.20%", isPositive: true },
  { name: "Shanghai", symbol: "SSEC", value: "3,215.67", change: "-12.44", changePct: "-0.39%", isPositive: false },
];

export const currencies: FxPair[] = [
  { pair: "USD/NGN", name: "US Dollar", rate: "1,521.30", change: "-0.18%", isPositive: false },
  { pair: "EUR/NGN", name: "Euro", rate: "1,652.44", change: "+0.21%", isPositive: true },
  { pair: "GBP/NGN", name: "British Pound", rate: "1,921.08", change: "+0.11%", isPositive: true },
  { pair: "USD/EUR", name: "US Dollar / Euro", rate: "0.9206", change: "-0.32%", isPositive: false },
  { pair: "USD/JPY", name: "US Dollar / Yen", rate: "151.42", change: "+0.47%", isPositive: true },
  { pair: "USD/CNY", name: "US Dollar / Yuan", rate: "7.1245", change: "-0.05%", isPositive: false },
];

export const commodities: Commodity[] = [
  { name: "Brent Crude", symbol: "BRENT", value: "74.12", unit: "USD/bbl", change: "+1.03%", isPositive: true },
  { name: "WTI Crude", symbol: "WTI", value: "70.88", unit: "USD/bbl", change: "+0.96%", isPositive: true },
  { name: "Gold", symbol: "XAU", value: "2,654.30", unit: "USD/oz", change: "-0.42%", isPositive: false },
  { name: "Cocoa", symbol: "COCOA", value: "7,420.00", unit: "USD/ton", change: "+2.11%", isPositive: true },
  { name: "Natural Gas", symbol: "NATGAS", value: "2.84", unit: "USD/MMBtu", change: "+1.24%", isPositive: true },
];

export const macroIndicators: MacroIndicator[] = [
  { label: "Nigeria CPI (YoY)", value: "24.6%", change: "-1.1pp", isPositive: true, note: "Headline inflation, latest release" },
  { label: "CBN Monetary Policy Rate", value: "24.75%", change: "Hold", isPositive: true, note: "Last MPC decision" },
  { label: "Nigeria GDP growth (Q2)", value: "3.42%", change: "+0.3pp", isPositive: true, note: "Services-led expansion" },
  { label: "US Fed Funds Rate", value: "4.25–4.50%", change: "Hold", isPositive: true, note: "FOMC target range" },
  { label: "US CPI (YoY)", value: "2.7%", change: "+0.1pp", isPositive: false, note: "Sticky core inflation" },
  { label: "Eurozone GDP (Q3)", value: "0.4%", change: "+0.2pp", isPositive: true, note: "Quarter-on-quarter" },
];

export const ngYieldCurve: YieldPoint[] = [
  { tenor: "1M", value: 22.1 },
  { tenor: "3M", value: 21.4 },
  { tenor: "6M", value: 20.2 },
  { tenor: "1Y", value: 19.6 },
  { tenor: "5Y", value: 18.4 },
  { tenor: "10Y", value: 17.9 },
  { tenor: "30Y", value: 18.2 },
];

export const usYieldCurve: YieldPoint[] = [
  { tenor: "1M", value: 4.45 },
  { tenor: "3M", value: 4.42 },
  { tenor: "6M", value: 4.31 },
  { tenor: "1Y", value: 4.12 },
  { tenor: "5Y", value: 4.02 },
  { tenor: "10Y", value: 4.18 },
  { tenor: "30Y", value: 4.46 },
];

export function tone(isPositive: boolean): string {
  return isPositive ? "text-emerald-600" : "text-red-600";
}
