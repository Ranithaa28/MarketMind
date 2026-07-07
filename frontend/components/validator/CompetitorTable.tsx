"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Competitor {
  name: string;
  description?: string;
  pricing?: string;
  key_features?: string[];
  strengths?: string[];
  weaknesses?: string[];
  estimated_funding?: string;
  market_position?: string;
  source_confidence?: string;
}

export function CompetitorTable({ competitors }: { competitors: Competitor[] }) {
  if (!competitors?.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Analysis</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Pricing</th>
              <th className="py-2 pr-4">Strengths</th>
              <th className="py-2 pr-4">Weaknesses</th>
              <th className="py-2 pr-4">Funding</th>
              <th className="py-2 pr-4">Market Position</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.name} className="border-b border-border/50 align-top">
                <td className="py-3 pr-4 font-medium">
                  {c.name}
                  {c.source_confidence && (
                    <div>
                      <Badge variant={c.source_confidence === "web_evidence" ? "success" : "outline"} className="mt-1">
                        {c.source_confidence === "web_evidence" ? "web-verified" : "model knowledge"}
                      </Badge>
                    </div>
                  )}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{c.pricing ?? "—"}</td>
                <td className="py-3 pr-4 text-muted-foreground">{(c.strengths ?? []).join(", ") || "—"}</td>
                <td className="py-3 pr-4 text-muted-foreground">{(c.weaknesses ?? []).join(", ") || "—"}</td>
                <td className="py-3 pr-4 text-muted-foreground">{c.estimated_funding ?? "—"}</td>
                <td className="py-3 pr-4 text-muted-foreground">{c.market_position ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
