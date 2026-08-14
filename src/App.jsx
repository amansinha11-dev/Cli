import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ComposedChart, Line, Cell, LabelList,
} from "recharts";
import {
  Flame, Target, Wallet, Users, ShieldAlert, Boxes, TrendingUp, TrendingDown,
  Download, Printer, Search, Trophy, Layers, BarChart3, ShieldCheck, HardHat
} from "lucide-react";

/* =========================================================================
   EMERGENT THEME, FONTS & STYLES
   ========================================================================= */
const STYLES = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
    
    body { background: #0C0A07; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    
    .cil-dash { font-family: 'Inter', sans-serif; color: #F1EAD9; }
    .cil-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
    .cil-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    
    .cil-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
    .cil-scroll::-webkit-scrollbar-track { background: transparent; }
    .cil-scroll::-webkit-scrollbar-thumb { background: #3B3427; border-radius: 4px; }
    .cil-scroll::-webkit-scrollbar-thumb:hover { background: #E8760C; }

    ::selection { background: rgba(232, 118, 12, 0.35); color: #F1EAD9; }

    .cil-dash button {
      font: inherit;
      min-height: 46px;
      letter-spacing: 0.02em;
    }

    .cil-dash button:not([disabled]) {
      cursor: pointer;
    }
    
    @keyframes cil-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cil-dash { animation: cil-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  `}</style>
);

const C = {
  void: "#0C0A07", panel: "#15130F", panelAlt: "#1E1B15", panelHi: "#2A251D",
  line: "#3B3427", lineHi: "#5A513E", bone: "#F1EAD9", boneDim: "#D4CBB6",
  ash: "#9C9280", ashDim: "#7A7263",
  ember: "#E8760C", emberHi: "#FF9533", emberSoft: "rgba(232,118,12,0.15)", emberGlow: "rgba(232,118,12,0.35)",
  gold: "#D4A24C", green: "#6FA06B", red: "#C1584A", steel: "#5C89A6",
};

const BCCL_LOGO = "/image_9983e0.jpg";

/* =========================================================================
   DATA & SCORING LOGIC (Merged from cilData.js)
   ========================================================================= */
const DATA = {
  subsidiaries: [
    { name: "ECL", production: { coking25: 0.017, nonCoking25: 52.018, total25: 52.035, total24: 47.56, growthPct: 9.41 }, mining: { ug25: 8.475, oc25: 43.56, ugSharePct: 16.29 }, offtake: { target25: 54.0, achieved25: 49.76, pctAchieved: 92.0, achieved24: 43.75, growthYoY: 13.7 }, stock: { value25: 1050.43, value24: 808.09, months25: 0.88, months24: 0.7 }, pbt: { fy25: 301.22, fy24: 213.49, changePct: 41.09 }, receivables: { gross25: 2345.52, net25: 2059.08, collectionEff25: 87.79 }, capex: { be25: 1250.0, actual25: 1654.82, utilPct25: 132.39 }, equipment: { Dragline: 1, Shovel: 53, Dumper: 175, Dozer: 77, Drill: 45, "Surface Miner": 0, total: 351 }, safety: { fatalAccidents: 3, fatalities: 4, seriousAccidents: 3, seriousInjuries: 3, fatalityRate: 0.08, injuryRate: 0.08 }, manpower: { fy24: 48711, fy25: 46996, changePct: -3.52 }, derived: { prodPerEmployee_t: 1107.2 } },
    { name: "BCCL", production: { coking25: 38.888, nonCoking25: 1.614, total25: 40.502, total24: 41.096, growthPct: -1.45 }, mining: { ug25: 1.139, oc25: 39.363, ugSharePct: 2.81 }, offtake: { target25: 45.0, achieved25: 38.25, pctAchieved: 85.0, achieved24: 39.19, growthYoY: -2.4 }, stock: { value25: 1828.36, value24: 1264.42, months25: 1.68, months24: 1.15 }, pbt: { fy25: 1702.89, fy24: 2091.67, changePct: -18.59 }, receivables: { gross25: 1847.76, net25: 1847.76, collectionEff25: 100.0 }, capex: { be25: 1000.0, actual25: 1814.94, utilPct25: 181.49 }, equipment: { Dragline: 1, Shovel: 73, Dumper: 285, Dozer: 92, Drill: 69, "Surface Miner": 0, total: 520 }, safety: { fatalAccidents: 0, fatalities: 0, seriousAccidents: 3, seriousInjuries: 4, fatalityRate: 0.0, injuryRate: 0.19 }, manpower: { fy24: 33920, fy25: 32124, changePct: -5.29 }, derived: { prodPerEmployee_t: 1260.8 } },
    { name: "CCL", production: { coking25: 20.539, nonCoking25: 66.998, total25: 87.537, total24: 86.054, growthPct: 1.72 }, mining: { ug25: 0.705, oc25: 86.832, ugSharePct: 0.81 }, offtake: { target25: 100.0, achieved25: 85.69, pctAchieved: 86.0, achieved24: 82.91, growthYoY: 3.3 }, stock: { value25: 1643.38, value24: 1146.75, months25: 1.27, months24: 0.9 }, pbt: { fy25: 5418.79, fy24: 4729.9, changePct: 14.56 }, receivables: { gross25: 1881.76, net25: 1628.91, collectionEff25: 86.56 }, capex: { be25: 2050.0, actual25: 5030.37, utilPct25: 245.38 }, equipment: { Dragline: 0, Shovel: 99, Dumper: 357, Dozer: 168, Drill: 100, "Surface Miner": 1, total: 725 }, safety: { fatalAccidents: 3, fatalities: 3, seriousAccidents: 1, seriousInjuries: 1, fatalityRate: 0.03, injuryRate: 0.04 }, manpower: { fy24: 33990, fy25: 33096, changePct: -2.63 }, derived: { prodPerEmployee_t: 2644.9 } },
    { name: "NCL", production: { coking25: 0.0, nonCoking25: 139.0, total25: 139.0, total24: 136.148, growthPct: 2.09 }, mining: { ug25: 0.0, oc25: 139.0, ugSharePct: 0.0 }, offtake: { target25: 139.0, achieved25: 137.7, pctAchieved: 99.0, achieved24: 137.63, growthYoY: 0.0 }, stock: { value25: 372.98, value24: 261.82, months25: 0.2, months24: 0.14 }, pbt: { fy25: 12803.13, fy24: 10843.63, changePct: 18.07 }, receivables: { gross25: 2514.72, net25: 2426.43, collectionEff25: 96.49 }, capex: { be25: 2170.0, actual25: 3289.56, utilPct25: 151.59 }, equipment: { Dragline: 24, Shovel: 109, Dumper: 529, Dozer: 166, Drill: 144, "Surface Miner": 14, total: 986 }, safety: { fatalAccidents: 5, fatalities: 6, seriousAccidents: 4, seriousInjuries: 9, fatalityRate: 0.04, injuryRate: 0.35 }, manpower: { fy24: 13770, fy25: 13312, changePct: -3.33 }, derived: { prodPerEmployee_t: 10441.7 } },
    { name: "WCL", production: { coking25: 0.0, nonCoking25: 69.121, total25: 69.121, total24: 69.113, growthPct: 0.01 }, mining: { ug25: 2.776, oc25: 66.345, ugSharePct: 4.02 }, offtake: { target25: 69.0, achieved25: 68.56, pctAchieved: 99.0, achieved24: 70.25, growthYoY: -2.4 }, stock: { value25: 1537.05, value24: 1423.78, months25: 1.2, months24: 1.04 }, pbt: { fy25: 4375.55, fy24: 4181.67, changePct: 4.64 }, receivables: { gross25: 2973.54, net25: 1536.18, collectionEff25: 51.66 }, capex: { be25: 1100.0, actual25: 2832.54, utilPct25: 257.5 }, equipment: { Dragline: 0, Shovel: 76, Dumper: 321, Dozer: 152, Drill: 66, "Surface Miner": 0, total: 615 }, safety: { fatalAccidents: 1, fatalities: 1, seriousAccidents: 5, seriousInjuries: 5, fatalityRate: 0.01, injuryRate: 0.2 }, manpower: { fy24: 33352, fy25: 32267, changePct: -3.25 }, derived: { prodPerEmployee_t: 2142.2 } },
    { name: "SECL", production: { coking25: 0.223, nonCoking25: 167.264, total25: 167.487, total24: 187.376, growthPct: -10.61 }, mining: { ug25: 11.868, oc25: 155.619, ugSharePct: 7.09 }, offtake: { target25: 206.0, achieved25: 170.75, pctAchieved: 83.0, achieved24: 180.6, growthYoY: -5.5 }, stock: { value25: 1757.61, value24: 1583.33, months25: 0.94, months24: 0.76 }, pbt: { fy25: 6196.26, fy24: 9047.98, changePct: -31.52 }, receivables: { gross25: 858.81, net25: 355.99, collectionEff25: 41.45 }, capex: { be25: 4150.0, actual25: 5223.44, utilPct25: 125.87 }, equipment: { Dragline: 0, Shovel: 69, Dumper: 463, Dozer: 126, Drill: 64, "Surface Miner": 10, total: 732 }, safety: { fatalAccidents: 7, fatalities: 8, seriousAccidents: 14, seriousInjuries: 14, fatalityRate: 0.05, injuryRate: 0.48 }, manpower: { fy24: 39641, fy25: 37528, changePct: -5.33 }, derived: { prodPerEmployee_t: 4463.0 } },
    { name: "MCL", production: { coking25: 0.0, nonCoking25: 225.174, total25: 225.174, total24: 206.099, growthPct: 9.26 }, mining: { ug25: 0.479, oc25: 224.695, ugSharePct: 0.21 }, offtake: { target25: 225.0, achieved25: 212.02, pctAchieved: 94.0, achieved24: 199.02, growthYoY: 6.5 }, stock: { value25: 1630.29, value24: 1021.11, months25: 0.85, months24: 0.51 }, pbt: { fy25: 14161.56, fy24: 15589.92, changePct: -9.16 }, receivables: { gross25: 2719.7, net25: 2676.05, collectionEff25: 98.4 }, capex: { be25: 2767.0, actual25: 2904.86, utilPct25: 104.98 }, equipment: { Dragline: 0, Shovel: 73, Dumper: 316, Dozer: 128, Drill: 62, "Surface Miner": 21, total: 600 }, safety: { fatalAccidents: 3, fatalities: 3, seriousAccidents: 1, seriousInjuries: 1, fatalityRate: 0.01, injuryRate: 0.03 }, manpower: { fy24: 21493, fy25: 21060, changePct: -2.01 }, derived: { prodPerEmployee_t: 10692.0 } },
  ],
  cil: {
    production: { total25: 781.056, total24: 773.647 },
    offtake: { target25: 838.24, achieved25: 762.98, pctAchieved: 91, growthYoY: 1.26 },
    pbt: { fy25: 17097.5, fy24: 16042.12 },
    safety: { fatalAccidents: 22, fatalities: 25, seriousAccidents: 31, seriousInjuries: 37 },
    manpower: { fy24: 228861, fy25: 220272 },
  },
};

const SUBS = DATA.subsidiaries;
const totalCapexActual = SUBS.reduce((a, s) => a + s.capex.actual25, 0);
const totalCapexBE = SUBS.reduce((a, s) => a + s.capex.be25, 0);
const prodGrowthCIL = ((DATA.cil.production.total25 - DATA.cil.production.total24) / DATA.cil.production.total24) * 100;
const pbtGrowthCIL = ((DATA.cil.pbt.fy25 - DATA.cil.pbt.fy24) / DATA.cil.pbt.fy24) * 100;
const manpGrowthCIL = ((DATA.cil.manpower.fy25 - DATA.cil.manpower.fy24) / DATA.cil.manpower.fy24) * 100;

const fmt = (v, d = 1) => v === undefined || v === null || isNaN(v) ? "—" : v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (v) => v === undefined || v === null ? "—" : v.toLocaleString("en-IN");

function scaleHigher(arr, v) { const min = Math.min(...arr), max = Math.max(...arr); return max === min ? 50 : ((v - min) / (max - min)) * 100; }
function scaleLower(arr, v) { const min = Math.min(...arr), max = Math.max(...arr); return max === min ? 50 : ((max - v) / (max - min)) * 100; }

const scored = SUBS.map((s) => {
  const nProd = scaleHigher(SUBS.map(x=>x.production.growthPct), s.production.growthPct);
  const nOfftake = scaleHigher(SUBS.map(x=>x.offtake.pctAchieved), s.offtake.pctAchieved);
  const nPbt = scaleHigher(SUBS.map(x=>x.pbt.changePct), s.pbt.changePct);
  const nCapex = scaleHigher(SUBS.map(x=> 100 - Math.abs(x.capex.utilPct25 - 100)), 100 - Math.abs(s.capex.utilPct25 - 100));
  const nColl = scaleHigher(SUBS.map(x=>x.receivables.collectionEff25), s.receivables.collectionEff25);
  const nSafety = scaleLower(SUBS.map(x=>x.safety.fatalities), s.safety.fatalities);
  const nManp = scaleHigher(SUBS.map(x=>x.derived.prodPerEmployee_t), s.derived.prodPerEmployee_t);
  const overall = (nProd + nOfftake + nPbt + nCapex + nColl + nSafety + nManp) / 7;
  return { name: s.name, nProd, nOfftake, nPbt, nCapex, nColl, nSafety, nManp, overall };
});

const fieldAvg = Object.fromEntries(["nProd", "nOfftake", "nPbt", "nCapex", "nColl", "nSafety", "nManp"].map(k => [k, scored.reduce((a, s) => a + s[k], 0) / scored.length]));
const ranked = [...scored].sort((a, b) => b.overall - a.overall).map((s, i) => ({ ...s, rank: i + 1 }));
function scoreColor(v) { return v >= 66 ? C.green : v >= 40 ? C.gold : C.red; }

/* =========================================================================
   ATOMS
   ========================================================================= */
function Delta({ value, suffix = "%" }) {
  if (value === undefined || value === null || Number.isNaN(value)) return null;
  const up = value >= 0;
  return (
    <span className="inline-flex items-center gap-1 cil-mono text-[11px] font-semibold" style={{ color: up ? C.green : C.red }}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}{fmt(value, 2)}{suffix}
    </span>
  );
}

function StatTile({ icon, label, value, unit, delta, deltaLabel, testId }) {
  return (
    <div data-testid={testId} className="relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(135deg, ${C.panelAlt} 0%, ${C.panel} 100%)`,
        border: `1px solid ${C.line}`,
        boxShadow: `0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.6)`,
      }}>
      <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-40" style={{ background: C.emberGlow }} />
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <span style={{ color: C.ember }}>{icon}</span>
        <span className="cil-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: C.ash }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="cil-display text-3xl font-semibold leading-none" style={{ color: C.bone }}>{value}</span>
        <span className="cil-mono text-[11px] leading-tight" style={{ color: C.boneDim }}>{unit}</span>
      </div>
      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-2 relative z-10">
          <Delta value={delta} />
          <span className="cil-mono text-[10px]" style={{ color: C.ashDim }}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children, icon, testId }) {
  return (
    <button data-testid={testId} onClick={onClick}
      className="cil-mono text-[12px] uppercase tracking-[0.16em] px-5 py-3 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
      style={{
        background: active ? C.ember : "transparent", color: active ? C.void : C.boneDim,
        border: `1px solid ${active ? C.ember : C.line}`, boxShadow: active ? `0 8px 24px -8px ${C.emberGlow}` : `0 8px 18px -16px rgba(0,0,0,0.7)`,
        fontWeight: 600,
      }}>
      {icon}{children}
    </button>
  );
}

function ChartCard({ title, subtitle, children, span = "", testId }) {
  return (
    <div data-testid={testId} className={`h-full rounded-xl p-5 flex flex-col ${span}`} style={{ background: C.panel, border: `1px solid ${C.line}` }}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h3 className="cil-display text-sm font-semibold" style={{ color: C.bone }}>{title}</h3>
          {subtitle && <p className="cil-mono text-[10px] mt-1" style={{ color: C.ashDim }}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/* =========================================================================
   STRATA BAR
   ========================================================================= */
function StrataBar({ selected, onSelect }) {
  const total = SUBS.reduce((a, s) => a + s.production.total25, 0);
  return (
    <div data-testid="strata-bar" className="rounded-xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="cil-display text-sm font-semibold" style={{ color: C.bone }}>FY 2024-25 Production Share</p>
          <p className="cil-mono text-[10px] mt-0.5" style={{ color: C.ashDim }}>Coal-seam cross-section — click a stratum to select</p>
        </div>
        <div className="cil-mono text-[11px]" style={{ color: C.boneDim }}><span style={{ color: C.ember }}>{fmt(total, 1)}</span> MT total</div>
      </div>
      <div className="flex w-full rounded-md overflow-hidden" style={{ height: 44, border: `1px solid ${C.lineHi}`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)` }}>
        {SUBS.map((s, i) => {
          const pct = (s.production.total25 / total) * 100;
          const isSel = selected === s.name;
          const baseShade = i % 2 === 0 ? `linear-gradient(180deg, ${C.emberHi} 0%, ${C.ember} 100%)` : `linear-gradient(180deg, ${C.gold} 0%, #A6802E 100%)`;
          return (
            <button key={s.name} data-testid={`strata-seam-${s.name}`} onClick={() => onSelect(s.name)}
              title={`${s.name}: ${fmt(pct, 1)}% (${fmt(s.production.total25, 1)} MT)`}
              className="h-full flex items-center justify-center transition-all cil-mono text-[12px] font-semibold"
              style={{
                width: `${pct}%`, minWidth: 70, background: isSel ? `linear-gradient(180deg, #FFAE55 0%, ${C.ember} 100%)` : `linear-gradient(180deg, ${i % 2 === 0 ? C.emberHi : C.gold} 0%, ${i % 2 === 0 ? C.ember : "#A6802E"} 100%)`,
                color: C.void, borderRight: `1px solid ${C.void}`, opacity: isSel ? 1 : 0.88, cursor: "pointer", transform: isSel ? "scaleY(1.06)" : "scaleY(1)", boxShadow: isSel ? `0 10px 24px -14px ${C.emberGlow}` : `inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}>
              {pct > 5 ? s.name : ""}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {SUBS.map((s) => {
          const pct = (s.production.total25 / total) * 100;
          return <div key={s.name} className="text-center" style={{ width: `${pct}%` }}><div className="cil-mono text-[9px]" style={{ color: C.ashDim }}>{fmt(pct, 1)}%</div></div>;
        })}
      </div>
    </div>
  );
}

function ActionCard({ label, detail, onClick, icon, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group h-full text-left rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: active ? `linear-gradient(135deg, ${C.emberSoft} 0%, rgba(21,19,15,0.95) 100%)` : C.panelAlt,
        border: `1px solid ${active ? C.ember : C.line}`,
        boxShadow: active ? `0 16px 30px -16px ${C.emberGlow}` : `0 16px 30px -20px rgba(0,0,0,0.55)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1" style={{ color: active ? C.ember : C.bone }}>
            {icon}
            <span className="cil-display text-sm font-semibold">{label}</span>
          </div>
          <p className="cil-mono text-[10px] leading-relaxed" style={{ color: C.ashDim }}>{detail}</p>
        </div>
        <span className="cil-mono text-[9px] uppercase tracking-[0.18em] px-2 py-1 rounded" style={{ color: active ? C.void : C.ashDim, background: active ? C.ember : C.panel, border: `1px solid ${active ? C.ember : C.line}` }}>
          Open
        </span>
      </div>
    </button>
  );
}

/* =========================================================================
   RECHARTS TOOLTIP
   ========================================================================= */
function DarkTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md p-3 cil-mono text-[11px]" style={{ background: C.void, border: `1px solid ${C.ember}`, boxShadow: `0 12px 30px -10px ${C.emberGlow}`, color: C.bone }}>
      <div className="cil-display font-semibold mb-1.5" style={{ color: C.ember }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: p.color || p.stroke }} />
            <span style={{ color: C.boneDim }}>{p.name}</span>
          </span>
          <span style={{ color: C.bone }}>{valueFormatter ? valueFormatter(p.value) : (typeof p.value === "number" ? fmt(p.value, 2) : p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   TABS
   ========================================================================= */
function ScorecardTab({ selected, onSelect }) {
  const radarData = ["nProd", "nOfftake", "nPbt", "nCapex", "nColl", "nSafety", "nManp"].map((k) => {
    const labelMap = { nProd: "Prod. Growth", nOfftake: "Offtake Ach.", nPbt: "PBT Growth", nCapex: "Capex Disc.", nColl: "Collections", nSafety: "Safety", nManp: "Manpower Eff." };
    const sel = scored.find((s) => s.name === selected);
    return { metric: labelMap[k], [selected]: Math.round(sel[k]), "Peer Avg.": Math.round(fieldAvg[k]) };
  });

  const headers = ["#", "Subsidiary", "Prod. Δ%", "Offtake %", "PBT Δ%", "Capex Util%", "Collections%", "Safety (F/SI)", "Score"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div data-testid="scorecard-table" className="xl:col-span-2 rounded-xl p-5 overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} style={{ color: C.ember }} />
          <h3 className="cil-display text-sm font-semibold" style={{ color: C.bone }}>Peer Leaderboard</h3>
        </div>
        <div className="overflow-x-auto cil-scroll">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                {headers.map((h) => <th key={h} className="cil-mono text-[10px] uppercase tracking-[0.14em] text-left py-2.5 pr-3" style={{ color: C.ashDim, borderBottom: `1px solid ${C.line}` }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {ranked.map((r) => {
                const raw = SUBS.find((s) => s.name === r.name);
                const isSel = r.name === selected;
                return (
                  <tr key={r.name} data-testid={`scorecard-row-${r.name}`} onClick={() => onSelect(r.name)} className="cursor-pointer transition-colors" style={{ background: isSel ? C.emberSoft : "transparent", borderBottom: `1px solid ${C.line}` }}>
                    <td className="py-3 pr-3"><span className="inline-flex items-center justify-center w-7 h-7 rounded-md cil-mono text-[11px] font-semibold" style={{ background: r.rank <= 3 ? C.emberSoft : "transparent", color: r.rank <= 3 ? C.ember : C.boneDim, border: `1px solid ${r.rank <= 3 ? C.ember : C.line}` }}>{r.rank}</span></td>
                    <td className="py-3 pr-3 cil-display font-semibold" style={{ color: C.bone }}>{r.name}</td>
                    <td className="py-3 pr-3 cil-mono text-[12px]" style={{ color: raw.production.growthPct >= 0 ? C.green : C.red }}>{raw.production.growthPct >= 0 ? "+" : ""}{fmt(raw.production.growthPct, 2)}%</td>
                    <td className="py-3 pr-3 cil-mono text-[12px]" style={{ color: C.boneDim }}>{fmt(raw.offtake.pctAchieved, 0)}%</td>
                    <td className="py-3 pr-3 cil-mono text-[12px]" style={{ color: raw.pbt.changePct >= 0 ? C.green : C.red }}>{raw.pbt.changePct >= 0 ? "+" : ""}{fmt(raw.pbt.changePct, 2)}%</td>
                    <td className="py-3 pr-3 cil-mono text-[12px]" style={{ color: C.boneDim }}>{fmt(raw.capex.utilPct25, 0)}%</td>
                    <td className="py-3 pr-3 cil-mono text-[12px]" style={{ color: C.boneDim }}>{fmt(raw.receivables.collectionEff25, 0)}%</td>
                    <td className="py-3 pr-3 cil-mono text-[12px]" style={{ color: C.boneDim }}><span style={{ color: raw.safety.fatalities > 0 ? C.red : C.green }}>{raw.safety.fatalities}F</span>{" / "}<span style={{ color: raw.safety.seriousInjuries > 5 ? C.gold : C.boneDim }}>{raw.safety.seriousInjuries}SI</span></td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2 min-w-[110px]">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.line }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${r.overall}%`, background: scoreColor(r.overall), boxShadow: `0 0 8px ${scoreColor(r.overall)}80` }} />
                        </div>
                        <span className="cil-mono text-[12px] font-semibold" style={{ color: scoreColor(r.overall), minWidth: 24 }}>{fmt(r.overall, 0)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="cil-mono text-[10px] mt-3 leading-relaxed" style={{ color: C.ashDim }}>Score = average of 7 min–max normalised indicators (0–100, higher is better) across the peer set. F = fatalities, SI = serious injuries (CY2024).</p>
      </div>

      <ChartCard title={`${selected} vs. Peer Average`} subtitle="7-dimension performance radar (0–100)" testId="scorecard-radar">
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={radarData} outerRadius="70%">
            <PolarGrid stroke={C.line} />
            <PolarAngleAxis dataKey="metric" tick={{ fill: C.boneDim, fontSize: 10, fontFamily: "JetBrains Mono" }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: C.ashDim, fontSize: 9 }} stroke={C.line} />
            <Radar name={selected} dataKey={selected} stroke={C.ember} fill={C.ember} fillOpacity={0.45} strokeWidth={2} />
            <Radar name="Peer Avg." dataKey="Peer Avg." stroke={C.steel} fill={C.steel} fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 3" />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Tooltip content={<DarkTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ProductionTab({ selected }) {
  const totalData  = SUBS.map((s) => ({ name: s.name, "FY 2024-25": s.production.total25, "FY 2023-24": s.production.total24 }));
  const gradeData  = SUBS.map((s) => ({ name: s.name, Coking: s.production.coking25, "Non-Coking": s.production.nonCoking25 }));
  const methodData = SUBS.map((s) => ({ name: s.name, Underground: s.mining.ug25, Opencast: s.mining.oc25 }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Total Production (MT)" subtitle="FY 2024-25 vs FY 2023-24" span="lg:col-span-2" testId="chart-production-total">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={totalData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="FY 2023-24" fill={C.steel} radius={[4, 4, 0, 0]} />
            <Bar dataKey="FY 2024-25" radius={[4, 4, 0, 0]}>
              {totalData.map((d) => (<Cell key={d.name} fill={d.name === selected ? C.emberHi : C.ember} />))}
              <LabelList dataKey="FY 2024-25" position="top" formatter={(v) => fmt(v, 1)} style={{ fill: C.boneDim, fontSize: 10, fontFamily: "JetBrains Mono" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Coking vs Non-Coking Mix" subtitle="FY 2024-25, MT (stacked)" testId="chart-production-grade">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={gradeData} stackOffset="expand">
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="Coking" stackId="a" fill={C.gold} />
            <Bar dataKey="Non-Coking" stackId="a" fill={C.ember} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Underground vs Opencast" subtitle="Mining method share, FY 2024-25" testId="chart-production-method">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={methodData} stackOffset="expand">
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="Underground" stackId="a" fill={C.steel} />
            <Bar dataKey="Opencast" stackId="a" fill={C.ember} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function OfftakeStockTab({ selected }) {
  const offtakeData = SUBS.map((s) => ({ name: s.name, Target: s.offtake.target25, Achieved: s.offtake.achieved25, pct: s.offtake.pctAchieved }));
  const stockData = SUBS.map((s) => ({ name: s.name, "FY 2024-25": s.stock.months25, "FY 2023-24": s.stock.months24 }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Offtake — Target vs Achieved" subtitle="FY 2024-25 (MT) with % achievement" span="lg:col-span-2" testId="chart-offtake">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={offtakeData} margin={{ top: 30, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis yAxisId="left" tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} label={{ value: "MT", position: "insideLeft", fill: C.ashDim, fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar yAxisId="left" dataKey="Target" fill={C.steel} radius={[4,4,0,0]} />
            <Bar yAxisId="left" dataKey="Achieved" radius={[4,4,0,0]}>
              {offtakeData.map((d) => <Cell key={d.name} fill={d.pct >= 95 ? C.green : d.pct >= 85 ? C.gold : C.red} />)}
              <LabelList dataKey="pct" position="top" formatter={(v) => `${v}%`} style={{ fill: C.boneDim, fontSize: 10, fontFamily: "JetBrains Mono" }} />
            </Bar>
            <Line yAxisId="right" dataKey="pct" name="% Achieved" stroke={C.ember} strokeWidth={2} dot={{ r: 3, fill: C.ember }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Stock (Months of Production)" subtitle="Higher = slower liquidation" testId="chart-stock">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stockData}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="FY 2023-24" fill={C.steel} radius={[4,4,0,0]} />
            <Bar dataKey="FY 2024-25" radius={[4,4,0,0]}>{stockData.map((d) => (<Cell key={d.name} fill={d.name === selected ? C.emberHi : C.ember} />))}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Stock Value (₹ Cr)" subtitle="Closing inventory carried" testId="chart-stock-value">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={SUBS.map((s) => ({ name: s.name, "FY 2023-24": s.stock.value24, "FY 2024-25": s.stock.value25 }))}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="FY 2023-24" fill={C.steel} radius={[4,4,0,0]} />
            <Bar dataKey="FY 2024-25" fill={C.gold} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function FinancialsTab({ selected }) {
  const pbtData   = SUBS.map((s) => ({ name: s.name, "PBT FY25 (₹ Cr)": s.pbt.fy25, "PBT FY24 (₹ Cr)": s.pbt.fy24, changePct: s.pbt.changePct }));
  const capexData = SUBS.map((s) => ({ name: s.name, BE: s.capex.be25, Actual: s.capex.actual25, util: s.capex.utilPct25 }));
  const recvData  = SUBS.map((s) => ({ name: s.name, Gross: s.receivables.gross25, Net: s.receivables.net25 }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="PBT — Year-on-Year (₹ Cr)" subtitle="FY 2024-25 vs FY 2023-24" span="lg:col-span-2" testId="chart-pbt">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={pbtData}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="PBT FY24 (₹ Cr)" fill={C.steel} radius={[4,4,0,0]} />
            <Bar dataKey="PBT FY25 (₹ Cr)" radius={[4,4,0,0]}>
              {pbtData.map((d) => (<Cell key={d.name} fill={d.changePct >= 0 ? C.green : C.red} />))}
              <LabelList dataKey="changePct" position="top" formatter={(v) => `${v >= 0 ? "+" : ""}${fmt(v, 1)}%`} style={{ fill: C.boneDim, fontSize: 10, fontFamily: "JetBrains Mono" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Capex — BE vs Actual (₹ Cr)" subtitle="With utilisation % overlay" testId="chart-capex">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={capexData}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis yAxisId="left" tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar yAxisId="left" dataKey="BE" fill={C.steel} radius={[4,4,0,0]} />
            <Bar yAxisId="left" dataKey="Actual" fill={C.ember} radius={[4,4,0,0]} />
            <Line yAxisId="right" dataKey="util" name="Util %" stroke={C.gold} strokeWidth={2} dot={{ r: 3, fill: C.gold }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Receivables (₹ Cr)" subtitle="Gross vs Net — collection gap" testId="chart-receivables">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={recvData}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="Gross" fill={C.steel} radius={[4,4,0,0]} />
            <Bar dataKey="Net" radius={[4,4,0,0]}>{recvData.map((d) => (<Cell key={d.name} fill={d.name === selected ? C.emberHi : C.gold} />))}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function SafetyManpowerTab({ selected, onSelect }) {
  const safetyData = SUBS.map((s) => ({ name: s.name, "Fatality rate (per Mt)": s.safety.fatalityRate, "Serious injury rate": s.safety.injuryRate }));
  const manpData = SUBS.map((s) => ({ name: s.name, "FY24": s.manpower.fy24, "FY25": s.manpower.fy25, changePct: s.manpower.changePct }));
  const sel = SUBS.find((s) => s.name === selected);
  const eqEntries = Object.entries(sel.equipment).filter(([k]) => k !== "total");
  const eqMax = Math.max(...eqEntries.map(([, v]) => v));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Safety Rates" subtitle="Per Mt production (CY2024)" span="lg:col-span-2" testId="chart-safety">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={safetyData}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Legend wrapperStyle={{ color: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="Fatality rate (per Mt)" fill={C.red} radius={[4,4,0,0]} />
            <Bar dataKey="Serious injury rate" fill={C.gold} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Manpower Change YoY" subtitle="FY25 headcount vs FY24 (%)" testId="chart-manpower">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={manpData}>
            <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.boneDim, fontSize: 11, fontFamily: "JetBrains Mono" }} stroke={C.line} />
            <YAxis tick={{ fill: C.ashDim, fontSize: 10 }} stroke={C.line} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: C.panelHi }} />
            <Bar dataKey="changePct" radius={[4,4,0,0]}>
              {manpData.map((d) => (<Cell key={d.name} fill={d.changePct >= 0 ? C.green : C.red} />))}
              <LabelList dataKey="changePct" position="top" formatter={(v) => `${v >= 0 ? "+" : ""}${fmt(v, 2)}%`} style={{ fill: C.boneDim, fontSize: 10, fontFamily: "JetBrains Mono" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div data-testid="equipment-mix" className="rounded-xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HardHat size={16} style={{ color: C.ember }} />
            <h3 className="cil-display text-sm font-semibold" style={{ color: C.bone }}>Equipment Mix — {selected}</h3>
            <span className="cil-mono text-[11px]" style={{ color: C.boneDim }}>{fmtInt(sel.equipment.total)} HEMM units</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {SUBS.map((s) => (
              <button key={s.name} data-testid={`equipment-pill-${s.name}`} onClick={() => onSelect(s.name)}
                className="px-3 py-1.5 text-[11px] cil-mono rounded-xl transition-all"
                style={{ background: s.name === selected ? `linear-gradient(180deg, ${C.emberHi} 0%, ${C.ember} 100%)` : `linear-gradient(180deg, rgba(42,37,29,0.96) 0%, rgba(21,19,15,0.96) 100%)`, color: s.name === selected ? C.void : C.boneDim, border: `1px solid ${s.name === selected ? C.ember : C.lineHi}`, boxShadow: s.name === selected ? `0 10px 24px -14px ${C.emberGlow}` : `0 8px 18px -18px rgba(0,0,0,0.75)` }}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2.5">
          {eqEntries.map(([type, count]) => (
            <div key={type} className="flex items-center gap-3">
              <div className="cil-mono text-[11px] w-24" style={{ color: C.boneDim }}>{type}</div>
              <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: C.panelAlt, border: `1px solid ${C.line}` }}>
                <div className="h-full flex items-center justify-end pr-2 rounded-md transition-all"
                  style={{ width: `${eqMax === 0 ? 0 : (count / eqMax) * 100}%`, background: `linear-gradient(90deg, ${C.gold} 0%, ${C.ember} 100%)`, minWidth: count > 0 ? 24 : 0 }}>
                  <span className="cil-mono text-[10px] font-semibold" style={{ color: C.void }}>{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   EXPORT LOGIC
   ========================================================================= */
function exportCSV() {
  const rows = [
    ["Subsidiary","Prod FY25 (MT)","Prod FY24 (MT)","Growth %","Offtake Target","Offtake Achieved","Offtake %","PBT FY25 (₹Cr)","PBT FY24 (₹Cr)","PBT Δ%","Capex BE","Capex Actual","Capex Util%","Gross Recv","Net Recv","Coll Eff%","Fatalities","Serious Injuries","FY25 Manpower","Prod/Employee (t)"],
    ...SUBS.map(s => [
      s.name, s.production.total25, s.production.total24, s.production.growthPct, s.offtake.target25, s.offtake.achieved25, s.offtake.pctAchieved,
      s.pbt.fy25, s.pbt.fy24, s.pbt.changePct, s.capex.be25, s.capex.actual25, s.capex.utilPct25, s.receivables.gross25, s.receivables.net25, s.receivables.collectionEff25,
      s.safety.fatalities, s.safety.seriousInjuries, s.manpower.fy25, s.derived.prodPerEmployee_t,
    ]),
  ];
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cil_subsidiary_scorecard_FY25.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/* =========================================================================
   MAIN DASHBOARD COMPONENT
   ========================================================================= */
export default function App() {
  const [selected, setSelected] = useState("BCCL");
  const [tab, setTab]           = useState("scorecard");
  const [query, setQuery]       = useState("");

  const tabs = [
    { key: "scorecard",  label: "Scorecard",         icon: <Trophy size={14} /> },
    { key: "production", label: "Production",        icon: <Layers size={14} /> },
    { key: "offtake",    label: "Offtake & Stock",   icon: <BarChart3 size={14} /> },
    { key: "financials", label: "Financials",        icon: <Wallet size={14} /> },
    { key: "safety",     label: "Safety & Manpower", icon: <ShieldCheck size={14} /> },
  ];

  const filteredSubs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUBS;
    return SUBS.filter(s => s.name.toLowerCase().includes(q));
  }, [query]);

  const selectedData = SUBS.find(s => s.name === selected);
  const selectedRank = ranked.find((r) => r.name === selected);
  const peerOverall = scored.reduce((a, s) => a + s.overall, 0) / scored.length;
  const bestOverall = ranked[0];
  const bestProduction = [...SUBS].sort((a, b) => b.production.growthPct - a.production.growthPct)[0];
  const bestOfftake = [...SUBS].sort((a, b) => b.offtake.pctAchieved - a.offtake.pctAchieved)[0];
  const bestCollections = [...SUBS].sort((a, b) => b.receivables.collectionEff25 - a.receivables.collectionEff25)[0];
  const safest = [...SUBS].sort((a, b) => a.safety.fatalities - b.safety.fatalities || a.safety.seriousInjuries - b.safety.seriousInjuries)[0];
  const highestPbt = [...SUBS].sort((a, b) => b.pbt.changePct - a.pbt.changePct)[0];
  const mostAggressiveCapex = [...SUBS].sort((a, b) => b.capex.utilPct25 - a.capex.utilPct25)[0];

  const focusActions = [
    { label: "Leaderboard leader", detail: `${bestOverall.name} currently tops the peer board`, icon: <Trophy size={13} />, active: selected === bestOverall?.name, onClick: () => { setSelected(bestOverall.name); setTab("scorecard"); } },
    { label: "Production surge", detail: `${bestProduction.name} posted the strongest output growth`, icon: <Flame size={13} />, active: selected === bestProduction?.name, onClick: () => { setSelected(bestProduction.name); setTab("production"); } },
    { label: "Offtake champion", detail: `${bestOfftake.name} has the highest achievement rate`, icon: <Target size={13} />, active: selected === bestOfftake?.name, onClick: () => { setSelected(bestOfftake.name); setTab("offtake"); } },
    { label: "Collections leader", detail: `${bestCollections.name} leads receivable efficiency`, icon: <Wallet size={13} />, active: selected === bestCollections?.name, onClick: () => { setSelected(bestCollections.name); setTab("financials"); } },
    { label: "Safety watch", detail: `${safest.name} reports the lowest incident load`, icon: <ShieldCheck size={13} />, active: selected === safest?.name, onClick: () => { setSelected(safest.name); setTab("safety"); } },
    { label: "Capex heat", detail: `${mostAggressiveCapex.name} is running the hottest capex utilisation`, icon: <Boxes size={13} />, active: selected === mostAggressiveCapex?.name, onClick: () => { setSelected(mostAggressiveCapex.name); setTab("financials"); } },
  ];

  return (
    <div className="cil-dash min-h-screen w-full" data-testid="cil-dashboard">
      {STYLES}
      <div aria-hidden className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(1200px 600px at 85% -10%, ${C.emberGlow} 0%, transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(92,137,166,0.12) 0%, transparent 60%), ${C.void}`,
          zIndex: 0,
        }} />
      <div aria-hidden className="fixed inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        zIndex: 0,
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <header className="mb-8" data-testid="dashboard-header">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 pb-6" style={{ borderBottom: `1px solid ${C.line}` }}>
            <div className="flex items-center justify-center rounded-2xl p-2 shrink-0" style={{ background: "#FFFFFF", border: `1px solid ${C.line}`, boxShadow: `0 12px 30px -10px ${C.emberGlow}`, width: 160, height: 88 }}>
              <img src={BCCL_LOGO} alt="BCCL Logo" className="max-h-full max-w-full object-contain" data-testid="bccl-logo" />
            </div>
            <div className="flex-1 min-w-0 max-w-[920px]">
              <div className="flex flex-col gap-1 mb-3">
                <span className="cil-mono text-[10px] uppercase tracking-[0.24em] px-2 py-1 rounded" style={{ background: C.emberSoft, color: C.ember, border: `1px solid ${C.ember}` }}>FY 2024-25</span>
                <span className="cil-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: C.ashDim }}>Integrated Annual Report · Independent Analytical View</span>
              </div>
              <h1 className="cil-display font-semibold tracking-tight leading-tight text-2xl md:text-[32px] xl:text-[36px]" style={{ color: C.bone }}>
                Coal India Limited<span style={{ color: C.ember }}> · </span>Subsidiary Performance Scorecard
              </h1>
              <p className="mt-1 text-sm md:text-[13px]" style={{ color: C.boneDim, maxWidth: 720 }}>
                Production, offtake, financials, safety and manpower across CIL&apos;s seven coal-producing subsidiaries — FY 2024-25 vs FY 2023-24.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button data-testid="btn-export-csv" onClick={exportCSV} className="cil-mono text-[12px] uppercase tracking-[0.14em] px-4 py-3 rounded-xl flex items-center gap-2 transition-all hover:-translate-y-0.5" style={{ background: `linear-gradient(180deg, rgba(42,37,29,0.98), rgba(21,19,15,0.98))`, color: C.bone, border: `1px solid ${C.lineHi}`, fontWeight: 600, boxShadow: `0 10px 24px -18px rgba(0,0,0,0.85)` }}><Download size={15} />CSV</button>
              <button data-testid="btn-print" onClick={() => window.print()} className="cil-mono text-[12px] uppercase tracking-[0.14em] px-4 py-3 rounded-xl flex items-center gap-2 transition-all hover:-translate-y-0.5" style={{ background: `linear-gradient(180deg, ${C.emberHi} 0%, ${C.ember} 100%)`, color: C.void, border: `1px solid ${C.ember}`, fontWeight: 700, boxShadow: `0 12px 26px -10px ${C.emberGlow}` }}><Printer size={15} />Print</button>
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-2xl p-4 md:p-5" style={{ background: `linear-gradient(135deg, rgba(42, 37, 29, 0.96) 0%, rgba(21, 19, 15, 0.96) 100%)`, border: `1px solid ${C.line}`, boxShadow: `0 24px 60px -34px rgba(0,0,0,0.9)` }}>
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-4">
            <div>
              <div className="cil-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: C.ashDim }}>Live command deck</div>
              <h2 className="cil-display text-lg md:text-xl font-semibold mt-1" style={{ color: C.bone }}>Jump to the most important story in one click</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl px-3 py-2" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                <div className="cil-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: C.ashDim }}>Rank</div>
                <div className="cil-display text-lg font-semibold" style={{ color: C.bone }}>#{selectedRank?.rank ?? "—"}</div>
              </div>
              <div className="rounded-xl px-3 py-2" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                <div className="cil-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: C.ashDim }}>Overall</div>
                <div className="cil-display text-lg font-semibold" style={{ color: C.bone }}>{fmt(selectedRank?.overall ?? 0, 0)}</div>
              </div>
              <div className="rounded-xl px-3 py-2" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                <div className="cil-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: C.ashDim }}>Peer avg.</div>
                <div className="cil-display text-lg font-semibold" style={{ color: C.bone }}>{fmt(peerOverall, 0)}</div>
              </div>
              <div className="rounded-xl px-3 py-2" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                <div className="cil-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: C.ashDim }}>Gap</div>
                <div className="cil-display text-lg font-semibold" style={{ color: (selectedRank?.overall ?? 0) >= peerOverall ? C.green : C.red }}>
                  {(selectedRank?.overall ?? 0) >= peerOverall ? "+" : ""}{fmt((selectedRank?.overall ?? 0) - peerOverall, 0)}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-stretch auto-rows-fr">
            {focusActions.map((action) => (
              <ActionCard key={action.label} {...action} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 items-stretch" data-testid="kpi-row">
          <div role="button" tabIndex={0} onClick={() => { setTab("production"); setSelected(bestProduction.name); }} className="cursor-pointer h-full">
            <StatTile testId="kpi-production" icon={<Flame size={14} />} label="Coal Production (CIL)" value={fmt(DATA.cil.production.total25, 1)} unit="MT" delta={prodGrowthCIL} deltaLabel="vs FY24" />
          </div>
          <div role="button" tabIndex={0} onClick={() => { setTab("offtake"); setSelected(bestOfftake.name); }} className="cursor-pointer h-full">
            <StatTile testId="kpi-offtake" icon={<Target size={14} />} label="Offtake Achievement" value={fmt(DATA.cil.offtake.pctAchieved, 0)} unit="% of target" delta={DATA.cil.offtake.growthYoY} deltaLabel="YoY growth" />
          </div>
          <div role="button" tabIndex={0} onClick={() => { setTab("financials"); setSelected(highestPbt.name); }} className="cursor-pointer h-full">
            <StatTile testId="kpi-pbt" icon={<Wallet size={14} />} label="PBT (Standalone)" value={fmt(DATA.cil.pbt.fy25, 0)} unit="₹ Cr" delta={pbtGrowthCIL} deltaLabel="vs FY24" />
          </div>
          <div role="button" tabIndex={0} onClick={() => { setTab("financials"); setSelected(mostAggressiveCapex.name); }} className="cursor-pointer h-full">
            <StatTile testId="kpi-capex" icon={<Boxes size={14} />} label="Subsidiary Capex" value={fmt(totalCapexActual, 0)} unit={`₹ Cr / BE ${fmt(totalCapexBE, 0)}`} delta={((totalCapexActual - totalCapexBE) / totalCapexBE) * 100} deltaLabel="over budget" />
          </div>
          <div role="button" tabIndex={0} onClick={() => { setTab("safety"); setSelected(safest.name); }} className="cursor-pointer h-full">
            <StatTile testId="kpi-fatalities" icon={<ShieldAlert size={14} />} label="Fatalities (CY2024)" value={DATA.cil.safety.fatalities} unit={`${DATA.cil.safety.fatalAccidents} accidents`} />
          </div>
          <div role="button" tabIndex={0} onClick={() => { setTab("financials"); setSelected(bestCollections.name); }} className="cursor-pointer h-full">
            <StatTile testId="kpi-manpower" icon={<Users size={14} />} label="Manpower" value={fmtInt(DATA.cil.manpower.fy25)} unit="employees" delta={manpGrowthCIL} deltaLabel="vs FY24" />
          </div>
        </div>

        <div className="mb-6"><StrataBar selected={selected} onSelect={setSelected} /></div>

        <div className="sticky top-3 z-20 mb-5 rounded-2xl p-4" style={{ background: `rgba(21, 19, 15, 0.84)`, border: `1px solid ${C.line}`, backdropFilter: "blur(16px)", boxShadow: `0 20px 50px -30px rgba(0,0,0,0.8)` }}>
          <div className="flex flex-wrap items-center gap-3 mb-4" data-testid="subsidiary-selector">
            <span className="cil-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: C.ashDim }}>Focus:</span>
            {filteredSubs.map(s => (
                <button key={s.name} data-testid={`select-sub-${s.name}`} onClick={() => setSelected(s.name)} className="cil-mono text-[12px] font-semibold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5" style={{ background: s.name === selected ? `linear-gradient(180deg, ${C.emberHi} 0%, ${C.ember} 100%)` : `linear-gradient(180deg, rgba(42,37,29,0.96) 0%, rgba(21,19,15,0.96) 100%)`, color: s.name === selected ? C.void : C.boneDim, border: `1px solid ${s.name === selected ? C.ember : C.lineHi}`, boxShadow: s.name === selected ? `0 10px 24px -14px ${C.emberGlow}` : `0 8px 18px -18px rgba(0,0,0,0.75)` }}>{s.name}</button>
            ))}
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-md focus-within:border-[#E8760C] transition-colors" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              <Search size={12} style={{ color: C.ashDim }} />
              <input data-testid="input-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter subsidiaries…" className="bg-transparent outline-none cil-mono text-[11px] w-40" style={{ color: C.bone }} />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto cil-scroll pb-1" data-testid="tab-nav">
            {tabs.map(t => (
              <TabButton key={t.key} testId={`tab-${t.key}`} active={tab === t.key} onClick={() => setTab(t.key)} icon={t.icon}>{t.label}</TabButton>
            ))}
          </div>
        </div>

        <div data-testid="focus-snapshot" className="mb-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 rounded-2xl p-4 transition-all" style={{ background: `linear-gradient(135deg, ${C.panel} 0%, ${C.panelAlt} 100%)`, border: `1px solid ${C.line}` }}>
          <div className="col-span-2 md:col-span-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: C.emberSoft, border: `1px solid ${C.ember}` }}>
              <span className="cil-display font-bold text-sm" style={{ color: C.ember }}>{selected.slice(0,2)}</span>
            </div>
            <div>
              <div className="cil-display font-semibold" style={{ color: C.bone }}>{selected}</div>
              <div className="cil-mono text-[10px]" style={{ color: C.ashDim }}>Rank #{selectedRank?.rank} of 7</div>
            </div>
          </div>
          {[
            { k: "Production", v: `${fmt(selectedData.production.total25, 1)} MT`, d: selectedData.production.growthPct },
            { k: "Offtake", v: `${fmt(selectedData.offtake.pctAchieved, 0)}%`, d: selectedData.offtake.growthYoY },
            { k: "PBT", v: `₹${fmt(selectedData.pbt.fy25, 0)} Cr`, d: selectedData.pbt.changePct },
            { k: "Capex Util", v: `${fmt(selectedData.capex.utilPct25, 0)}%`, d: null },
            { k: "Collect. Eff.", v: `${fmt(selectedData.receivables.collectionEff25, 0)}%`, d: null },
            { k: "Manpower", v: fmtInt(selectedData.manpower.fy25), d: selectedData.manpower.changePct },
          ].map((m, i) => (
            <div key={i}>
              <div className="cil-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: C.ashDim }}>{m.k}</div>
              <div className="cil-display font-semibold text-[15px]" style={{ color: C.bone }}>{m.v}</div>
              {m.d !== null && m.d !== undefined && <div className="mt-0.5"><Delta value={m.d} /></div>}
            </div>
          ))}
          <div className="col-span-2 md:col-span-4 lg:col-span-7 pt-2">
            <div className="cil-mono text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: C.ashDim }}>Quick pivot</div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              <ActionCard label="Open Scorecard" detail="Peer ranking and radar comparison for the current subsidiary." icon={<Trophy size={13} />} onClick={() => setTab("scorecard")} active={tab === "scorecard"} />
              <ActionCard label="Open Production" detail="Production mix, method split, and year-on-year output view." icon={<Flame size={13} />} onClick={() => setTab("production")} active={tab === "production"} />
              <ActionCard label="Open Safety & Manpower" detail="Safety rates, headcount movement, and equipment composition." icon={<ShieldCheck size={13} />} onClick={() => setTab("safety")} active={tab === "safety"} />
            </div>
          </div>
        </div>

        <div data-testid="tab-content" className="animate-in fade-in duration-500">
          {tab === "scorecard"  && <ScorecardTab selected={selected} onSelect={setSelected} />}
          {tab === "production" && <ProductionTab selected={selected} />}
          {tab === "offtake"    && <OfftakeStockTab selected={selected} />}
          {tab === "financials" && <FinancialsTab selected={selected} />}
          {tab === "safety"     && <SafetyManpowerTab selected={selected} onSelect={setSelected} />}
        </div>

        <footer className="mt-10 pt-5 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: `1px solid ${C.line}` }} data-testid="dashboard-footer">
          <p className="cil-mono text-[10px] leading-relaxed max-w-3xl" style={{ color: C.ashDim }}>
            Source: Coal India Ltd — Integrated Annual Report 2024-25. Scorecard is an independent analytical construct, not an official CIL metric.
          </p>
          <div className="cil-mono text-[10px]" style={{ color: C.ashDim }}>
            <span style={{ color: C.ember }}>◆</span> Prepared as an interactive dashboard
          </div>
        </footer>
      </div>
    </div>
  );
}