"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Swot {
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
}

const quadrants: { key: keyof Swot; label: string; color: string }[] = [
  { key: "strengths", label: "Strengths", color: "border-emerald-500/40 bg-emerald-500/5" },
  { key: "weaknesses", label: "Weaknesses", color: "border-red-500/40 bg-red-500/5" },
  { key: "opportunities", label: "Opportunities", color: "border-blue-500/40 bg-blue-500/5" },
  { key: "threats", label: "Threats", color: "border-amber-500/40 bg-amber-500/5" },
];

export function SwotGrid({ swot }: { swot: Swot }) {
  if (!swot) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>SWOT Analysis</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {quadrants.map((q) => (
          <div key={q.key} className={`rounded-xl border p-4 ${q.color}`}>
            <p className="mb-2 text-sm font-semibold">{q.label}</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {(Array.isArray(swot[q.key]) ? swot[q.key] : (swot[q.key] ? [String(swot[q.key])] : [])).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
