"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useApiClient } from "@/lib/useApiClient";
import type { IdeaSummary } from "@/lib/api";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight } from "lucide-react";

const statusVariant: Record<string, "default" | "success" | "warning" | "destructive"> = {
  complete: "success",
  running: "warning",
  pending: "warning",
  failed: "destructive",
};

export default function DashboardOverviewPage() {
  const { user } = useUser();
  const getApi = useApiClient();
  const [ideas, setIdeas] = useState<IdeaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const api = await getApi();
        const res = await api.get<IdeaSummary[]>("/api/ideas");
        if (!cancelled) setIdeas(res.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [getApi]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back{user?.firstName ? `, ${user.firstName}` : ""}</h1>
          <p className="text-muted-foreground">Here's what's happening with your startup ideas.</p>
        </div>
        <Link href="/dashboard/ideas/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> New validation</Button>
        </Link>
      </div>

      <StatsCards ideas={ideas} />

      <Card>
        <CardHeader>
          <CardTitle>Recent ideas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : ideas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No ideas yet.{" "}
              <Link href="/dashboard/ideas/new" className="text-primary underline">
                Validate your first one
              </Link>
              .
            </p>
          ) : (
            <div className="divide-y divide-border">
              {ideas.slice(0, 8).map((idea) => (
                <Link
                  key={idea.id}
                  href={`/dashboard/ideas/${idea.id}`}
                  className="flex items-center justify-between py-3 hover:opacity-80"
                >
                  <div>
                    <p className="font-medium">{idea.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(idea.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {idea.success_score && (
                      <span className="text-sm font-semibold">{idea.success_score.overall_score}/100</span>
                    )}
                    <Badge variant={statusVariant[idea.status] ?? "default"}>{idea.status}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
