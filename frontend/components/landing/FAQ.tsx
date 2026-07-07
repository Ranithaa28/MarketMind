"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How is the success score calculated?", a: "We rate 10 named factors (market demand, competition, innovation, and so on) 0-10 each with a written reason, then combine them with fixed, documented weights. You can see the full breakdown in every report — it's never a random number." },
  { q: "Where does the market and competitor data come from?", a: "Live web search (Tavily, Google Custom Search, NewsAPI) and Google Trends, combined with the model's own knowledge where search evidence is incomplete. Every competitor entry is labeled with its confidence source." },
  { q: "Can I export a report?", a: "Yes — every completed validation can be exported as a PDF or Word document covering the executive summary, competitors, market research, investment estimate, SWOT, and strategy." },
  { q: "Is my idea data private?", a: "Your ideas and reports are private to your account. Enterprise plans support additional data-handling agreements." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border">
          {faqs.map((f, i) => (
            <div key={f.q} className="p-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between text-left font-medium"
              >
                {f.q}
                <ChevronDown className={`h-4 w-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
