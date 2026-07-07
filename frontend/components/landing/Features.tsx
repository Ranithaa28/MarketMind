"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Globe2, ShieldCheck, Coins, MessageSquare, FileText } from "lucide-react";

const features = [
  { icon: Globe2, title: "Competitor discovery", desc: "Finds real competitors worldwide with pricing, strengths, weaknesses, and funding." },
  { icon: BarChart3, title: "Market sizing", desc: "TAM/SAM/SOM, growth rate, and demand trends backed by live web and search-trend data." },
  { icon: Coins, title: "Investment estimate", desc: "Development, marketing, legal, and operating costs, plus break-even and ROI ranges." },
  { icon: ShieldCheck, title: "Transparent success score", desc: "A weighted, explainable score across 10 factors — never a random percentage." },
  { icon: MessageSquare, title: "AI advisor chat", desc: "Ask follow-up questions about pricing, features, or go-to-market, with full context." },
  { icon: FileText, title: "Exportable reports", desc: "One-click PDF and Word reports covering every section of the analysis." },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Everything you need to validate, before you spend a dollar building</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="glass">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
