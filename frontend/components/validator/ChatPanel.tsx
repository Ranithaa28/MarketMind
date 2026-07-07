"use client";

import { useEffect, useRef, useState } from "react";
import { useApiClient } from "@/lib/useApiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const suggestions = [
  "How can I improve this idea?",
  "Suggest 3 features to differentiate from competitors",
  "How should I price this?",
  "What funding options make sense here?",
];

export function ChatPanel({ ideaId }: { ideaId: string }) {
  const getApi = useApiClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const api = await getApi();
      const res = await api.get<Message[]>(`/api/chat/${ideaId}`);
      setMessages(res.data);
    })();
  }, [getApi, ideaId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    setSending(true);
    setMessages((m) => [...m, { role: "user", content: text, created_at: new Date().toISOString() }]);
    setInput("");
    try {
      const api = await getApi();
      const res = await api.post<Message>(`/api/chat/${ideaId}`, { message: text });
      setMessages((m) => [...m, res.data]);
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="flex h-[520px] flex-col">
      <CardHeader>
        <CardTitle>Ask the AI advisor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a follow-up question..." />
          <Button type="submit" size="icon" disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
