"use client";

import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  { quote: "Saved us three weeks of manual competitor research before our seed round.", name: "Amara O.", role: "Founder, HealthTrack" },
  { quote: "The success score breakdown is the first one I've seen that actually explains itself.", name: "Diego R.", role: "Solo founder" },
  { quote: "We used the location recommendations to pick our first international market.", name: "Priya S.", role: "COO, Fintech startup" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Founders trust the numbers</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
