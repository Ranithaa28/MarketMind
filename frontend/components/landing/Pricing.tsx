"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  { name: "Free", price: "$0", period: "/mo", features: ["1 idea validation / month", "Core market research", "Community support"], cta: "Start free" },
  { name: "Pro", price: "$29", period: "/mo", highlight: true, features: ["Unlimited validations", "Full reports (PDF & DOCX)", "AI advisor chat", "Location recommendations"], cta: "Upgrade to Pro" },
  { name: "Enterprise", price: "Custom", period: "", features: ["Team seats", "Priority support", "Custom integrations", "SLA"], cta: "Contact sales" },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're validating more than one idea a month.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={p.highlight ? "border-primary shadow-lg shadow-primary/10" : ""}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button className="w-full" variant={p.highlight ? "default" : "outline"}>{p.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
