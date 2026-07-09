"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useApiClient } from "@/lib/useApiClient";
import type { IdeaDetail } from "@/lib/api";
import { ResultsView } from "@/components/validator/ResultsView";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";



export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const getApi = useApiClient();
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [wsMessage, setWsMessage] = useState("Initializing AI agents...");
  const [retryCount, setRetryCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    async function poll() {
      const api = await getApi();
      const res = await api.get<IdeaDetail>(`/api/ideas/${id}`);
      setIdea(res.data);
      if (res.data.status === "complete" || res.data.status === "failed") {
        if (pollRef.current) clearInterval(pollRef.current);
        if (wsRef.current) wsRef.current.close();
      }
    }
    poll();
    pollRef.current = setInterval(poll, 4000);

    // Set up WebSocket for real-time status
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, "") 
      : window.location.host;
    
    wsRef.current = new WebSocket(`${protocol}//${host}/api/ideas/${id}/progress/ws`);
    wsRef.current.onmessage = (event) => {
      setWsMessage(event.data);
    };

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [getApi, id, retryCount]);

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
            <p className="font-medium">{wsMessage}</p>
            <p className="text-sm text-muted-foreground">This usually takes 1-3 minutes.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (idea.status === "failed") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div>
            <p className="font-medium text-red-500">Validation failed</p>
            <p className="mt-2 text-sm text-muted-foreground">{idea.error_message}</p>
          </div>
          <button 
            onClick={async () => {
              const api = await getApi();
              await api.post(`/api/ideas/${id}/revalidate`);
              setIdea({ ...idea, status: "pending" });
              setWsMessage("Initializing AI agents...");
              setRetryCount(c => c + 1);
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retry Validation
          </button>
        </CardContent>
      </Card>
    );
  }

  return <ResultsView idea={idea} />;
}
