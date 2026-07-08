"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Target, TrendingUp, Users, DollarSign, Megaphone, Briefcase } from "lucide-react";

interface StrategyData {
  business_model?: string;
  revenue_streams?: string[];
  pricing_model?: string;
  marketing_plan?: string[];
  go_to_market_strategy?: string[];
  growth_strategy?: string[];
  monetization_plan?: string;
  customer_acquisition?: string[];
}

function Section({ title, icon: Icon, content, list }: { title: string, icon: any, content?: string, list?: string[] }) {
  if (!content && (!list || list.length === 0)) return null;
  
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      {content && <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>}
      
      {list && list.length > 0 && (
        <ul className="space-y-3 mt-2">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary/70 mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StrategyView({ strategy }: { strategy: StrategyData }) {
  if (!strategy) return null;

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Business Strategy Playbook
        </CardTitle>
        <p className="text-muted-foreground text-sm mt-1">
          A clear, actionable roadmap for taking your idea to market and scaling it effectively.
        </p>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid gap-6 md:grid-cols-2">
          <Section 
            title="Business & Pricing Model" 
            icon={DollarSign}
            content={strategy.business_model}
            list={strategy.pricing_model ? [strategy.pricing_model] : undefined} 
          />
          <Section 
            title="Revenue Streams" 
            icon={TrendingUp}
            list={strategy.revenue_streams} 
          />
          <Section 
            title="Go-To-Market Strategy" 
            icon={Target}
            list={strategy.go_to_market_strategy} 
          />
          <Section 
            title="Customer Acquisition" 
            icon={Users}
            list={strategy.customer_acquisition} 
          />
          <Section 
            title="Marketing Plan" 
            icon={Megaphone}
            list={strategy.marketing_plan} 
          />
          <Section 
            title="Growth & Monetization" 
            icon={TrendingUp}
            content={strategy.monetization_plan}
            list={strategy.growth_strategy} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
