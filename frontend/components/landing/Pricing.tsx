"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  { name: "Free", price: "$0", period: "/mo", features: ["1 idea validation / month", "Core market research", "Community support"], cta: "Start free" },
  { name: "Pro", price: "$29", period: "/mo", highlight: false, features: ["Unlimited validations", "Full reports (PDF & DOCX)", "AI advisor chat", "Location recommendations"], cta: "Pay via Admin ID" },
  { name: "Enterprise", price: "Custom", period: "", features: ["Team seats", "Priority support", "Custom integrations", "SLA"], cta: "Pay via Admin ID" },
];

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
};

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Simple, transparent pricing.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when you're validating more than one idea a month.</p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {plans.map((p) => (
            <motion.div key={p.name} variants={item}>
              <Card className="h-full border-border bg-transparent shadow-none hover:bg-muted/30 transition-colors duration-500">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-muted-foreground">{p.name}</CardTitle>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">{p.price}</span>
                    <span className="text-sm font-medium text-muted-foreground">{p.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="mt-6">
                  <ul className="mb-8 space-y-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-foreground">
                        <Check className="h-4 w-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up">
                    <Button className="w-full h-12" variant={p.name === 'Pro' ? 'default' : 'outline'}>{p.cta}</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
