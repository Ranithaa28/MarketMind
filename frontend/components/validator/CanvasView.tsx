"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function renderValue(v: unknown) {
  if (Array.isArray(v)) return v.join(", ");
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
          <div key={key} className="rounded-xl border border-border p-3">
            <p className="mb-1 text-xs font-medium capitalize text-muted-foreground">
              {key.replace(/_/g, " ")}
            </p>
            <p className="text-sm">{renderValue(value)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
