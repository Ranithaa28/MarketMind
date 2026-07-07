"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useApiClient } from "@/lib/useApiClient";
import type { IdeaSummary } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Archive, Trash2, Plus } from "lucide-react";

const statusVariant: Record<string, "default" | "success" | "warning" | "destructive"> = {
  complete: "success",
  running: "warning",
  pending: "warning",
  failed: "destructive",
  archived: "default",
};

export default function IdeasListPage() {
  const getApi = useApiClient();
  const [ideas, setIdeas] = useState<IdeaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const api = await getApi();
    const res = await api.get<IdeaSummary[]>("/api/ideas", { params: { include_archived: true } });
    setIdeas(res.data);
    setLoading(false);
  }, [getApi]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDuplicate(id: string) {
    const api = await getApi();
    await api.post(`/api/ideas/${id}/duplicate`);
    toast.success("Duplicated — re-validating now.");
    load();
  }

  async function handleArchive(id: string, archived: boolean) {
    const api = await getApi();
    await api.patch(`/api/ideas/${id}/archive`, null, { params: { archived } });
    toast.success(archived ? "Archived." : "Restored.");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this idea permanently?")) return;
    const api = await getApi();
    await api.delete(`/api/ideas/${id}`);
    toast.success("Deleted.");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ideas</h1>
        <Link href="/dashboard/ideas/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> New validation</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : ideas.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ideas yet.</p>
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea) => (
            <Card key={idea.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <Link href={`/dashboard/ideas/${idea.id}`} className="flex-1">
                  <p className="font-medium">{idea.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(idea.created_at).toLocaleString()}</p>
                </Link>
                <div className="flex items-center gap-2">
                  {idea.success_score && (
                    <span className="text-sm font-semibold">{idea.success_score.overall_score}/100</span>
                  )}
                  <Badge variant={statusVariant[idea.status] ?? "default"}>{idea.status}</Badge>
                  <Button size="icon" variant="ghost" title="Duplicate" onClick={() => handleDuplicate(idea.id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Archive" onClick={() => handleArchive(idea.id, idea.status !== "archived")}>
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Delete" onClick={() => handleDelete(idea.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
