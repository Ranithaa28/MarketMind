"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SuccessScore } from "@/lib/api";

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function SuccessScoreGauge({ score }: { score: SuccessScore }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score.overall_score / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Success Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
            <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke="hsl(258 90% 66%)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
            <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor">
              {score.overall_score}
            </text>
            <text x="70" y="86" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.6">
              / 100
            </text>
          </svg>
          <div className="flex-1 space-y-3">
            <Meter label="Strength" value={score.strength_meter} color="#22c55e" />
            <Meter label="Risk" value={score.risk_meter} color="#ef4444" />
            <Meter label="Opportunity" value={score.opportunity_meter} color="#3b82f6" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">How this was calculated</p>
          {score.breakdown.map((b) => (
            <div key={b.factor} className="flex items-center justify-between text-xs">
              <span className="capitalize text-muted-foreground">{b.factor.replace(/_/g, " ")}</span>
              <span>{b.raw_score}/10 {b.inverted && "(inverted)"}</span>
            </div>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">{score.methodology}</p>
          <p className="text-xs italic text-muted-foreground">{score.disclaimer}</p>
        </div>
      </CardContent>
    </Card>
  );
}
