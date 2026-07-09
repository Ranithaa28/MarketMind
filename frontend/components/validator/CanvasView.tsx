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
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{String(canvas)}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(canvas).map(([key, value]) => (
          <div key={key} className="rounded-xl border bg-transparent p-4">
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
