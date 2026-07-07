"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useApiClient } from "@/lib/useApiClient";
import type { IdeaDetail } from "@/lib/api";
import { ResultsView } from "@/components/validator/ResultsView";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const STAGES = [
  "Understanding your idea",
  "Searching the web",
  "Analyzing competitors",
  "Sizing the market",
  "Estimating investment",
  "Recommending locations",
  "Building SWOT & canvases",
  "Drafting business strategy",
  "Calculating success score",
];

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const getApi = useApiClient();
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval>>();
  const stageRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    async function poll() {
      const api = await getApi();
      const res = await api.get<IdeaDetail>(`/api/ideas/${id}`);
      setIdea(res.data);
      if (res.data.status === "complete" || res.data.status === "failed") {
        if (pollRef.current) clearInterval(pollRef.current);
        if (stageRef.current) clearInterval(stageRef.current);
      }
    }
    poll();
    pollRef.current = setInterval(poll, 4000);
    stageRef.current = setInterval(() => setStageIndex((i) => Math.min(i + 1, STAGES.length - 1)), 6000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (stageRef.current) clearInterval(stageRef.current);
    };
  }, [getApi, id]);

  if (!idea) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (idea.status === "pending" || idea.status === "running") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <p className="font-medium">{STAGES[stageIndex]}...</p>
            <p className="text-sm text-muted-foreground">This usually takes 1-3 minutes.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (idea.status === "failed") {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium text-red-500">Validation failed</p>
          <p className="mt-2 text-sm text-muted-foreground">{idea.error_message}</p>
        </CardContent>
      </Card>
    );
  }

  return <ResultsView idea={idea} />;
}
