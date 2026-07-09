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

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function Features() {
  return (
    <section id="features" className="px-6 py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px] mix-blend-screen" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Everything you need to validate. <span className="text-muted-foreground font-medium">Before you spend a dollar.</span></h2>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Card className="h-full border border-primary/20 bg-[#1E2433]/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,229,255,0.03)] playful-card">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground tracking-wide">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">{f.desc}</CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
