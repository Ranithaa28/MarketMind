"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApiClient } from "@/lib/useApiClient";
import type { IdeaDetail } from "@/lib/api";
import { Loader2, Sparkles } from "lucide-react";

const schema = z.object({
  description: z
    .string()
    .min(10, "Tell us a bit more — at least 10 characters.")
    .max(2000, "Keep it under 2000 characters."),
});
type FormValues = z.infer<typeof schema>;

const examples = [
  "An AI fitness coach app that builds personalized workout plans from a phone camera.",
  "A marketplace connecting small manufacturers in Southeast Asia with US retailers.",
  "A Chrome extension that auto-summarizes long Slack threads for remote teams.",
];

export function IdeaForm() {
  const router = useRouter();
  const getApi = useApiClient();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const api = await getApi();
      const res = await api.post<IdeaDetail>("/api/ideas", values);
      toast.success("Validation started — this usually takes 1-3 minutes.");
      router.push(`/dashboard/ideas/${res.data.id}`);
    } catch (err) {
      toast.error("Couldn't start validation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Describe your startup idea</CardTitle>
        <CardDescription>One or two sentences is enough. Our AI agent will do the rest.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            placeholder="I want to build an AI Fitness Coach..."
            rows={5}
            {...register("description")}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                type="button"
                key={ex}
                onClick={() => setValue("description", ex, { shouldValidate: true })}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                {ex.slice(0, 40)}…
              </button>
            ))}
          </div>

          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {submitting ? "Starting validation..." : "Validate my idea"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
