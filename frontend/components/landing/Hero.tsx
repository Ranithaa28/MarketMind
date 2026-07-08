"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(258_90%_66%/0.18),_transparent_60%)]" />
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-powered market research in minutes, not weeks
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight md:text-6xl"
        >
          Validate your startup idea<br className="hidden md:block" />
          <span className="gradient-text"> before you build it</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Validate. Analyze. Launch.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Describe your idea in one sentence. Our AI agent researches competitors, sizes
          the market, estimates investment, and scores your odds of success — with a
          full report you can act on.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="group">
            <Link href="/sign-up">
              Validate my idea for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <a href="#features">
            <Button size="lg" variant="outline">See how it works</Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
