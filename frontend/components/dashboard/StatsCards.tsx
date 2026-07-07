import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, FileText, Clock } from "lucide-react";
import type { IdeaSummary } from "@/lib/api";

export function StatsCards({ ideas }: { ideas: IdeaSummary[] }) {
  const total = ideas.length;
  const completed = ideas.filter((i) => i.status === "complete").length;
  const avgScore =
    completed > 0
      ? Math.round(
          ideas.reduce((sum, i) => sum + (i.success_score?.overall_score ?? 0), 0) / completed
        )
      : 0;
  const inProgress = ideas.filter((i) => i.status === "pending" || i.status === "running").length;

  const stats = [
    { label: "Total ideas", value: total, icon: Lightbulb },
    { label: "Avg. success score", value: `${avgScore}/100`, icon: TrendingUp },
    { label: "Completed reports", value: completed, icon: FileText },
    { label: "In progress", value: inProgress, icon: Clock },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            <s.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{s.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
