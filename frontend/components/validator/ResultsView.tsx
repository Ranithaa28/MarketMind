"use client";

import type { IdeaDetail } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SuccessScoreGauge } from "@/components/validator/SuccessScoreGauge";
import { CompetitorTable } from "@/components/validator/CompetitorTable";
import { MarketCharts } from "@/components/validator/MarketCharts";
import { InvestmentBreakdown } from "@/components/validator/InvestmentBreakdown";
import { SwotGrid } from "@/components/validator/SwotGrid";
import { CanvasView } from "@/components/validator/CanvasView";
import { LocationMap } from "@/components/validator/LocationMap";
import { StrategyView } from "@/components/validator/StrategyView";
import { ChatPanel } from "@/components/validator/ChatPanel";
import { ReportActions } from "@/components/validator/ReportActions";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function ResultsView({ idea }: { idea: IdeaDetail }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-[#1E2433]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_5px_30px_-5px_rgba(0,0,0,0.3)]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">{idea.title}</h1>
          <p className="max-w-2xl mt-2 text-base text-muted-foreground">{idea.raw_description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">{idea.status}</Badge>
          <ReportActions ideaId={idea.id} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="p-1 h-auto mb-8 flex flex-wrap justify-start border border-white/5 bg-[#1a1e29]/60 backdrop-blur-md rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all py-2 px-4">Overview</TabsTrigger>
          <TabsTrigger value="competitors" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all py-2 px-4">Competitors</TabsTrigger>
          <TabsTrigger value="market" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all py-2 px-4">Market</TabsTrigger>
          <TabsTrigger value="investment" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all py-2 px-4">Investment</TabsTrigger>
          <TabsTrigger value="locations" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all py-2 px-4">Locations</TabsTrigger>
          <TabsTrigger value="strategy" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all py-2 px-4">Strategy & Canvas</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all py-2 px-4">AI Advisor</TabsTrigger>
        </TabsList>

        <motion.div
          key="tabs-container"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TabsContent value="overview" className="mt-0">
          {idea.success_score && <SuccessScoreGauge score={idea.success_score} />}
        </TabsContent>

        <TabsContent value="competitors">
          {idea.competitors?.competitors && <CompetitorTable competitors={idea.competitors.competitors as any} />}
        </TabsContent>

        <TabsContent value="market">
          {idea.market_research && <MarketCharts data={idea.market_research} />}
        </TabsContent>

        <TabsContent value="investment">
          {idea.investment && <InvestmentBreakdown data={idea.investment} />}
        </TabsContent>

        <TabsContent value="locations">
          {idea.locations?.recommendations && <LocationMap recommendations={idea.locations.recommendations as any} />}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          {idea.swot && <SwotGrid swot={idea.swot} />}
          {idea.lean_canvas && <CanvasView title="Lean Canvas" canvas={idea.lean_canvas} />}
          {idea.business_model_canvas && <CanvasView title="Business Model Canvas" canvas={idea.business_model_canvas} />}
          {idea.strategy && <StrategyView strategy={idea.strategy as any} />}
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <ChatPanel ideaId={idea.id} />
        </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}
