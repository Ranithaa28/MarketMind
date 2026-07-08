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

export function ResultsView({ idea }: { idea: IdeaDetail }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{idea.title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{idea.raw_description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">{idea.status}</Badge>
          <ReportActions ideaId={idea.id} />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="strategy">Strategy & Canvas</TabsTrigger>
          <TabsTrigger value="chat">AI Advisor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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

        <TabsContent value="chat">
          <ChatPanel ideaId={idea.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
