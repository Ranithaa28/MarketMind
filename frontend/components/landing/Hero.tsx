"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-40">
      <div className="stripe-mesh" />
      {/* Background Dashed Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg viewBox="0 0 1000 1000" className="w-[1000px] h-[1000px] animate-pulse-slow">
          <circle 
            cx="500" cy="500" r="400" 
            fill="none" 
            stroke="url(#cyan-gradient-hero)" 
            strokeWidth="20" 
            strokeDasharray="15 30"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cyan-gradient-hero" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.01" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="relative mx-auto max-w-4xl text-center">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-5xl font-extrabold tracking-tight md:text-7xl leading-tight"
        >
          Validate your <span className="gradient-text">startup idea.</span><br className="hidden md:block" />
          <span className="text-muted-foreground font-medium">Before you build it.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed"
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
          <Link href="/sign-up" className={buttonVariants({ size: "lg", className: "group rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-primary text-white" })}>
            Validate my idea for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="rounded-full border-2 hover:bg-muted/50 transition-all duration-300">See how it works</Button>
          </a>
        </motion.div>

        {/* Dashboard Mockup - Stripe Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 mx-auto w-full max-w-5xl"
        >
          <div className="glass rounded-3xl p-2 shadow-2xl relative overflow-hidden border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border p-8 text-left grid md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-xl border border-primary/20 bg-background/50 hover:bg-background/80 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="h-6 w-6 text-primary rounded-sm bg-primary" style={{WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M3 3h18v18H3zM3 9h18M9 21V9\'/%3E%3C/svg%3E")', WebkitMaskSize: 'cover'}}/>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">01 Do they understand it?</h3>
                    <p className="mt-1 font-medium text-foreground">Landing page conversion</p>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">24.7%</div>
                    <div className="text-sm text-muted-foreground">Conversion rate</div>
                  </div>
                  <div className="h-12 w-32 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/40 rounded" />
                </div>
              </div>

              <div className="p-6 rounded-xl border border-primary/20 bg-background/50 hover:bg-background/80 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="h-6 w-6 text-primary rounded-sm bg-primary" style={{WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z\'/%3E%3C/svg%3E")', WebkitMaskSize: 'cover'}}/>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">02 Are they qualified?</h3>
                    <p className="mt-1 font-medium text-foreground">Qualified signup volume</p>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">318</div>
                    <div className="text-sm text-muted-foreground">Qualified signups</div>
                  </div>
                  <div className="flex gap-1 items-end h-12">
                    {[3, 5, 4, 7, 8, 12, 10].map((h, i) => (
                      <div key={i} className="w-3 rounded-t-sm bg-primary/80" style={{ height: `${h * 10}%` }} />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
