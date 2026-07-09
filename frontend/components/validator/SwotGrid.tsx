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
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-extrabold flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid-2x2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>
          </div>
          SWOT Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {quadrants.map((q) => {
          const raw = swot[q.key];
          const items = Array.isArray(raw) 
            ? raw.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item)) 
            : (raw ? [typeof raw === 'object' ? JSON.stringify(raw) : String(raw)] : []);
          return (
            <div key={q.key} className={`rounded-2xl border bg-card shadow-sm p-5 playful-card ${q.color}`}>
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
