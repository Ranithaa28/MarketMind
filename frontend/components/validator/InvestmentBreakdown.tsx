"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Investment {
  development_cost?: number | string;
  marketing_cost?: number | string;
  infrastructure_cost?: number | string;
  team_cost?: number | string;
  legal_cost?: number | string;
  monthly_operating_cost?: number | string;
  yearly_operating_cost?: number | string;
  funding_needed?: number | string;
  breakeven_estimate?: string;
  roi_estimate?: string;
  assumptions?: string[];
}

const COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#eab308", "#ef4444"];

function toNumber(v: number | string | undefined): number {
  if (v === undefined) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(v.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

export function InvestmentBreakdown({ data }: { data: Investment }) {
  if (!data) return null;
  const pieData = [
    { name: "Development", value: toNumber(data.development_cost) },
    { name: "Marketing", value: toNumber(data.marketing_cost) },
    { name: "Infrastructure", value: toNumber(data.infrastructure_cost) },
    { name: "Team", value: toNumber(data.team_cost) },
    { name: "Legal", value: toNumber(data.legal_cost) },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Estimate</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="h-64 w-full">
          {pieData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="space-y-3 text-sm">
          <Row label="Monthly operating cost" value={formatCurrency(data.monthly_operating_cost)} />
          <Row label="Yearly operating cost" value={formatCurrency(data.yearly_operating_cost)} />
          <Row label="Funding needed" value={formatCurrency(data.funding_needed)} />
          <Row label="Break-even estimate" value={data.breakeven_estimate ?? "—"} />
          <Row label="ROI estimate" value={data.roi_estimate ?? "—"} />
          {!!data.assumptions?.length && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Assumptions</p>
              <ul className="list-inside list-disc text-xs text-muted-foreground">
                {data.assumptions.map((a, idx) => (
                  <li key={idx}>{typeof a === 'object' ? JSON.stringify(a) : String(a)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/50 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
