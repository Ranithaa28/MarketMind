"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function renderValue(v: unknown): string {
  if (Array.isArray(v)) {
    return v.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(", ");
  }
  if (typeof v === 'object' && v !== null) {
    return JSON.stringify(v);
  }
  return String(v ?? "—");
}

export function CanvasView({ title, canvas }: { title: string; canvas: Record<string, unknown> | string }) {
  if (!canvas) return null;
  if (typeof canvas !== "object" || Array.isArray(canvas)) {
    return (
      <Card>
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-3xl font-extrabold flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-template"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{String(canvas)}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-0 pt-0 mb-4">
        <CardTitle className="text-3xl font-extrabold flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-template"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(canvas).map(([key, value]) => (
          <div key={key} className="rounded-2xl border bg-card shadow-sm p-5 playful-card">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {key.replace(/_/g, " ")}
            </p>
            <p className="text-sm font-medium leading-relaxed">{renderValue(value)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
