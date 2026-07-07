"""
Node functions for the idea-validation LangGraph pipeline.

Each node takes the shared `IdeaState`, does one job, and returns the keys
it updates. Keeping nodes small and single-purpose makes the graph in
graph.py easy to follow and lets any node be retried/replaced independently.
"""
from typing import Any, TypedDict

from app.agents.scoring import compute_success_score
from app.agents.tools.search import gather_web_context
from app.agents.tools.trends import get_trend_score
from app.services.openai_client import generate_json


class IdeaState(TypedDict, total=False):
    raw_description: str
    title: str
    core_concept: dict[str, Any]
    web_context: list[dict]
    trend_signal: dict[str, Any]
    competitors: dict[str, Any]
    market_research: dict[str, Any]
    investment: dict[str, Any]
    locations: dict[str, Any]
    swot: dict[str, Any]
    lean_canvas: dict[str, Any]
    business_model_canvas: dict[str, Any]
    strategy: dict[str, Any]
    success_score: dict[str, Any]
    error: str


def node_understand_idea(state: IdeaState) -> dict:
    system = (
        "You are a startup analyst. Extract a structured understanding of a raw "
        "startup idea. Respond ONLY as JSON with keys: title (<=8 words), "
        "problem, solution, category, target_customer, key_features (list of "
        "strings), search_keywords (list of 3-5 short search-engine queries "
        "useful for finding competitors and market data)."
    )
    result = generate_json(system, state["raw_description"])
    return {
        "core_concept": result,
        "title": result.get("title", state["raw_description"][:60]),
    }


def node_web_search(state: IdeaState) -> dict:
    keywords = state.get("core_concept", {}).get("search_keywords") or [state["raw_description"][:60]]
    context: list[dict] = []
    for kw in keywords[:4]:
        context.extend(gather_web_context(kw))
    trend_kw = state.get("core_concept", {}).get("category") or keywords[0]
    trend = get_trend_score(trend_kw)
    return {"web_context": context[:20], "trend_signal": trend}


def node_competitor_analysis(state: IdeaState) -> dict:
    system = (
        "You are a market-intelligence analyst. Using the idea summary and web "
        "search snippets provided, identify real, named competitors worldwide "
        "where evidence supports them. If the snippets do not clearly name "
        "companies, use well-known category leaders you are confident exist, "
        "and mark 'source_confidence' as 'model_knowledge' vs 'web_evidence'. "
        "Respond ONLY as JSON: {\"competitors\": [{name, description, pricing, "
        "key_features: [], strengths: [], weaknesses: [], estimated_funding, "
        "market_position, source_confidence}]}."
    )
    user = (
        f"Idea: {state.get('core_concept')}\n\n"
        f"Web snippets: {state.get('web_context')}"
    )
    return {"competitors": generate_json(system, user)}


def node_market_research(state: IdeaState) -> dict:
    system = (
        "You are a market-sizing analyst. Estimate TAM/SAM/SOM (USD), industry "
        "growth rate, key trends, future demand outlook, and 3-5 customer pain "
        "points, using the idea, web snippets, and the Google Trends interest "
        "signal provided. Be explicit that figures are estimates. Respond ONLY "
        "as JSON: {tam_usd, sam_usd, som_usd, industry_growth_rate_pct, "
        "trends: [], future_demand_outlook, customer_pain_points: [], "
        "methodology_note}."
    )
    user = (
        f"Idea: {state.get('core_concept')}\n"
        f"Trend signal: {state.get('trend_signal')}\n"
        f"Web snippets: {state.get('web_context')}"
    )
    return {"market_research": generate_json(system, user)}


def node_investment_estimate(state: IdeaState) -> dict:
    system = (
        "You are a startup CFO. Given the idea and its technical/market "
        "complexity, estimate coarse-grained costs in USD for: development, "
        "marketing, infrastructure, team, legal, operating, and derive monthly "
        "cost, yearly cost, funding needed for 18 months runway, estimated "
        "break-even timeframe, and a rough ROI estimate range. Respond ONLY as "
        "JSON: {development_cost, marketing_cost, infrastructure_cost, "
        "team_cost, legal_cost, monthly_operating_cost, yearly_operating_cost, "
        "funding_needed, breakeven_estimate, roi_estimate, assumptions: []}."
    )
    return {"investment": generate_json(system, str(state.get("core_concept")))}


def node_location_recommendation(state: IdeaState) -> dict:
    system = (
        "You are an international startup-ecosystem advisor. Recommend 3-5 "
        "countries (and a lead city in each) well suited to launching this "
        "idea, with lat/lng for the city, reasons, market opportunity, "
        "startup ecosystem strength, government support, tax benefits, and "
        "competition level (low/medium/high). Respond ONLY as JSON: "
        "{recommendations: [{country, city, latitude, longitude, reasons, "
        "market_opportunity, ecosystem_strength, government_support, "
        "tax_benefits, competition_level}]}."
    )
    return {"locations": generate_json(system, str(state.get("core_concept")))}


def node_swot_and_canvases(state: IdeaState) -> dict:
    system = (
        "You are a business strategist. Produce: (1) a SWOT analysis, (2) a "
        "Lean Canvas, and (3) a Business Model Canvas for this startup idea, "
        "grounded in the market research and competitor data given. Respond "
        "ONLY as JSON: {swot: {strengths: [], weaknesses: [], opportunities: "
        "[], threats: []}, lean_canvas: {problem: [], solution: [], "
        "key_metrics: [], unique_value_proposition, customer_segments: [], "
        "channels: [], cost_structure: [], revenue_streams: []}, "
        "business_model_canvas: {key_partners: [], key_activities: [], "
        "key_resources: [], value_propositions: [], customer_relationships: "
        "[], channels: [], customer_segments: [], cost_structure: [], "
        "revenue_streams: []}}."
    )
    user = (
        f"Idea: {state.get('core_concept')}\n"
        f"Competitors: {state.get('competitors')}\n"
        f"Market research: {state.get('market_research')}"
    )
    result = generate_json(system, user)
    return {
        "swot": result.get("swot", {}),
        "lean_canvas": result.get("lean_canvas", {}),
        "business_model_canvas": result.get("business_model_canvas", {}),
    }


def node_business_strategy(state: IdeaState) -> dict:
    system = (
        "You are a go-to-market strategist. Define the business model, revenue "
        "streams, pricing model, marketing plan, go-to-market strategy, growth "
        "strategy, monetization plan, and customer acquisition approach. "
        "Respond ONLY as JSON: {business_model, revenue_streams: [], "
        "pricing_model, marketing_plan: [], go_to_market_strategy: [], "
        "growth_strategy: [], monetization_plan, customer_acquisition: []}."
    )
    user = f"Idea: {state.get('core_concept')}\nMarket research: {state.get('market_research')}"
    return {"strategy": generate_json(system, user)}


def node_success_score(state: IdeaState) -> dict:
    system = (
        "You are an impartial startup evaluator. Rate these 10 factors for "
        "the idea, each 0-10, with a one-sentence reason grounded in the data "
        "provided: market_demand, competition, innovation, "
        "technology_complexity, scalability, revenue_potential, "
        "execution_difficulty, funding_availability, timing, risk. Respond "
        "ONLY as JSON: {\"<factor>\": {\"score\": number, \"reason\": string}, ...} "
        "for all 10 factors."
    )
    user = (
        f"Idea: {state.get('core_concept')}\n"
        f"Market research: {state.get('market_research')}\n"
        f"Competitors: {state.get('competitors')}\n"
        f"Investment: {state.get('investment')}\n"
        f"Trend signal: {state.get('trend_signal')}"
    )
    factor_ratings = generate_json(system, user)
    return {"success_score": compute_success_score(factor_ratings)}
