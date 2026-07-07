"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/lib/useApiClient";
import { apiBaseUrl } from "@/lib/api";
import { FileDown, Loader2 } from "lucide-react";

export function ReportActions({ ideaId }: { ideaId: string }) {
  const getApi = useApiClient();
  const [generating, setGenerating] = useState<"pdf" | "docx" | null>(null);

  async function handleGenerate(fmt: "pdf" | "docx") {
    setGenerating(fmt);
    try {
      const api = await getApi();
      const res = await api.post(`/api/reports/${ideaId}/${fmt}`);
      window.open(`${apiBaseUrl}${res.data.download_url}`, "_blank");
    } catch {
      toast.error("Couldn't generate the report. Try again once validation is complete.");
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => handleGenerate("pdf")} disabled={generating !== null} className="gap-2">
        {generating === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleGenerate("docx")} disabled={generating !== null} className="gap-2">
        {generating === "docx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} DOCX
      </Button>
    </div>
  );
}
