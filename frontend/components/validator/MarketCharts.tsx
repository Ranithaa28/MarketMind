"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface MarketResearch {
  tam_usd?: number | string;
  sam_usd?: number | string;
  som_usd?: number | string;
  industry_growth_rate_pct?: number | string;
  trends?: string[];
  future_demand_outlook?: string;
  customer_pain_points?: string[];
  methodology_note?: string;
}

function toNumber(v: number | string | undefined): number {
  if (v === undefined) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(v.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

export function MarketCharts({ data }: { data: MarketResearch }) {
  if (!data) return null;
  const chartData = [
    { name: "TAM", value: toNumber(data.tam_usd) },
    { name: "SAM", value: toNumber(data.sam_usd) },
    { name: "SOM", value: toNumber(data.som_usd) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Research</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
              <YAxis stroke="currentColor" fontSize={12} tickFormatter={(v) => formatCurrency(v)} width={90} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="value" fill="hsl(258 90% 66%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Industry growth rate</p>
            <p>{data.industry_growth_rate_pct ?? "—"}%</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Future demand outlook</p>
            <p>{data.future_demand_outlook ?? "—"}</p>
          </div>
        </div>

        {!!data.trends?.length && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Key trends</p>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {data.trends.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        )}

        {!!data.customer_pain_points?.length && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Customer pain points</p>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {data.customer_pain_points.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        )}

        {data.methodology_note && <p className="text-xs italic text-muted-foreground">{data.methodology_note}</p>}
      </CardContent>
    </Card>
  );
}
