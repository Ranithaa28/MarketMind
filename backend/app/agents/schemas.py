from typing import List, Optional
from pydantic import BaseModel, Field

class CoreConcept(BaseModel):
    title: str = Field(description="Short title, <=8 words")
    problem: str
    solution: str
    category: str
    target_customer: str
    key_features: List[str]
    search_keywords: List[str] = Field(description="List of 3-5 short search-engine queries useful for finding competitors and market data")

class Competitor(BaseModel):
    name: str
    description: str
    pricing: str
    key_features: List[str]
    strengths: List[str]
    weaknesses: List[str]
    estimated_funding: str
    market_position: str
    source_confidence: str = Field(description="Either 'model_knowledge' or 'web_evidence'")

class CompetitorAnalysis(BaseModel):
    competitors: List[Competitor]

class MarketResearch(BaseModel):
    tam_usd: str = Field(description="String representing TAM estimate (e.g. '$10B')")
    sam_usd: str = Field(description="String representing SAM estimate")
    som_usd: str = Field(description="String representing SOM estimate")
    industry_growth_rate_pct: str = Field(description="String representing percentage, e.g. '15%'")
    trends: List[str]
    future_demand_outlook: str
    customer_pain_points: List[str]
    methodology_note: str = Field(description="Detailed mathematical breakdown")

class InvestmentEstimate(BaseModel):
    development_cost: str
    marketing_cost: str
    infrastructure_cost: str
    team_cost: str
    legal_cost: str
    monthly_operating_cost: str
    yearly_operating_cost: str
    funding_needed: str
    breakeven_estimate: str
    roi_estimate: str
    assumptions: List[str] = Field(description="List step-by-step math here")

class LocationRecommendation(BaseModel):
    country: str
    city: str
    latitude: float
    longitude: float
    reasons: str
    market_opportunity: str
    ecosystem_strength: str
    government_support: str
    tax_benefits: str
    competition_level: str = Field(description="'low', 'medium', or 'high'")

class LocationRecommendations(BaseModel):
    recommendations: List[LocationRecommendation]

class Swot(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class LeanCanvas(BaseModel):
    problem: List[str]
    solution: List[str]
    key_metrics: List[str]
    unique_value_proposition: str
    customer_segments: List[str]
    channels: List[str]
    cost_structure: List[str]
    revenue_streams: List[str]

class BusinessModelCanvas(BaseModel):
    key_partners: List[str]
    key_activities: List[str]
    key_resources: List[str]
    value_propositions: List[str]
    customer_relationships: List[str]
    channels: List[str]
    customer_segments: List[str]
    cost_structure: List[str]
    revenue_streams: List[str]

class SwotAndCanvases(BaseModel):
    swot: Swot
    lean_canvas: LeanCanvas
    business_model_canvas: BusinessModelCanvas

class BusinessStrategy(BaseModel):
    business_model: str
    revenue_streams: List[str]
    pricing_model: str
    marketing_plan: List[str]
    go_to_market_strategy: List[str]
    growth_strategy: List[str]
    monetization_plan: str
    customer_acquisition: List[str]

class SuccessFactor(BaseModel):
    score: int = Field(ge=0, le=10)
    reason: str

class SuccessScoreRatings(BaseModel):
    market_demand: SuccessFactor
    competition: SuccessFactor
    innovation: SuccessFactor
    technology_complexity: SuccessFactor
    scalability: SuccessFactor
    revenue_potential: SuccessFactor
    execution_difficulty: SuccessFactor
    funding_availability: SuccessFactor
    timing: SuccessFactor
    risk: SuccessFactor

class GatekeeperResult(BaseModel):
    is_valid: bool = Field(description="True if it's a valid, coherent business idea, false if gibberish or nonsense")
    reason: str
