"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Swot {
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
}

const quadrants: { key: keyof Swot; label: string; color: string }[] = [
  { key: "strengths", label: "Strengths", color: "border-border text-foreground" },
  { key: "weaknesses", label: "Weaknesses", color: "border-border text-foreground" },
  { key: "opportunities", label: "Opportunities", color: "border-border text-foreground" },
  { key: "threats", label: "Threats", color: "border-border text-foreground" },
];

export function SwotGrid({ swot }: { swot: Swot }) {
  if (!swot) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>SWOT Analysis</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {quadrants.map((q) => {
          const raw = swot[q.key];
          const items = Array.isArray(raw) ? raw : (raw ? [String(raw)] : []);
          return (
            <div key={q.key} className={`rounded-xl border bg-transparent p-4 ${q.color}`}>
              <p className="mb-2 text-sm font-semibold">{q.label}</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {items.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
