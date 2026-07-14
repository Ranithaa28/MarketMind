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
from app.core.config import get_settings
from app.core.progress import set_progress
from app.agents.schemas import (
    GatekeeperResult,
    CoreConcept,
    CompetitorAnalysis,
    MarketResearch,
    InvestmentEstimate,
    LocationRecommendations,
    SwotAndCanvases,
    BusinessStrategy,
    SuccessScoreRatings
)

settings = get_settings()

class IdeaState(TypedDict, total=False):
    idea_id: str
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


def publish_progress(state: IdeaState, message: str):
    if "idea_id" in state:
        set_progress(state["idea_id"], message)


def node_gatekeeper(state: IdeaState) -> dict:
    publish_progress(state, "Validating idea coherence...")
    system = (
        "You are a gatekeeper. Evaluate if the given text is a coherent, "
        "understandable business/startup idea. If it's random gibberish (e.g. 'asdfg') "
        "or completely nonsensical, reject it. If it's a valid attempt at an idea, accept it. "
    )
    result = generate_json(system, state["raw_description"], pydantic_model=GatekeeperResult)
    if not result.get("is_valid"):
        return {"error": result.get("reason", "Invalid idea submitted.")}
    return {}


def node_understand_idea(state: IdeaState) -> dict:
    publish_progress(state, "Understanding your idea...")
    system = (
        "You are a startup analyst. Extract a structured understanding of a raw "
        "startup idea."
    )
    result = generate_json(system, state["raw_description"], pydantic_model=CoreConcept)
    return {
        "core_concept": result,
        "title": result.get("title", state["raw_description"][:60]),
    }


def node_web_search(state: IdeaState) -> dict:
    publish_progress(state, "Searching the web for market context...")
    keywords = state.get("core_concept", {}).get("search_keywords") or [state["raw_description"][:60]]
    context: list[dict] = []
    
    import concurrent.futures
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(gather_web_context, keywords[:4]))
        for r in results:
            context.extend(r)
            
    # Truncate content of each snippet to avoid massive payloads
    for c in context:
        if c.get("content") and isinstance(c["content"], str):
            c["content"] = c["content"][:400]
            
    trend_kw = state.get("core_concept", {}).get("category") or keywords[0]
    trend = get_trend_score(trend_kw)
    return {"web_context": context[:8], "trend_signal": trend}


def node_competitor_analysis(state: IdeaState) -> dict:
    publish_progress(state, "Analyzing competitors...")
    system = (
        "You are a market-intelligence analyst. Using the idea summary and web "
        "search snippets provided, identify real, named competitors worldwide "
        "where evidence supports them. If the snippets do not clearly name "
        "companies, use well-known category leaders you are confident exist, "
        "and mark 'source_confidence' as 'model_knowledge' vs 'web_evidence'. "
    )
    user = (
        f"Idea: {state.get('core_concept')}\n\n"
        f"Web snippets: {state.get('web_context')}"
    )
    result = generate_json(system, user, pydantic_model=CompetitorAnalysis)
    return {"competitors": result}


def node_market_research(state: IdeaState) -> dict:
    publish_progress(state, "Sizing the market...")
    system = (
        "You are a rigorous financial market-sizing analyst. You MUST use a bottom-up "
        "Fermi estimation methodology to calculate TAM, SAM, and SOM (USD) with maximum "
        "logical accuracy. You must define the target population, estimated adoption rate, "
        "and ARPU (Average Revenue Per User) based on the web snippets provided. Ensure "
        "strict logical consistency (TAM > SAM > SOM). "
        "Be explicit that figures are estimates, but show the exact mathematical formulas used. "
    )
    user = (
        f"Idea: {state.get('core_concept')}\n"
        f"Trend signal: {state.get('trend_signal')}\n"
        f"Web snippets: {state.get('web_context')}"
    )
    result = generate_json(system, user, pydantic_model=MarketResearch)
    return {"market_research": result}


def node_investment_estimate(state: IdeaState) -> dict:
    publish_progress(state, "Estimating investment requirements...")
    system = (
        "You are a rigorous startup CFO. You MUST use an itemized, bottom-up calculation "
        "methodology to achieve maximum accuracy. Estimate specific headcounts, average "
        "market salaries, specific server costs, and Customer Acquisition Cost (CAC). "
        "Calculate coarse-grained costs in USD for: development, marketing, infrastructure, "
        "team, legal, operating. Then derive monthly cost, yearly cost, funding needed for "
        "18 months runway, break-even timeframe, and ROI. "
    )
    result = generate_json(system, str(state.get("core_concept")), pydantic_model=InvestmentEstimate)
    return {"investment": result}


def node_location_recommendation(state: IdeaState) -> dict:
    publish_progress(state, "Recommending launch locations...")
    system = (
        "You are an international startup-ecosystem advisor. Recommend 3-5 "
        "countries (and a lead city in each) well suited to launching this "
        "idea, with lat/lng for the city, reasons, market opportunity, "
        "startup ecosystem strength, government support, tax benefits, and "
        "competition level (low/medium/high). "
    )
    result = generate_json(system, str(state.get("core_concept")), pydantic_model=LocationRecommendations)
    return {"locations": result}


def node_swot_and_canvases(state: IdeaState) -> dict:
    publish_progress(state, "Building SWOT & business canvases...")
    system = (
        "You are a business strategist. Produce: (1) a SWOT analysis, (2) a "
        "Lean Canvas, and (3) a Business Model Canvas for this startup idea, "
        "grounded in the market research and competitor data given."
    )
    user = (
        f"Idea: {state.get('core_concept')}\n"
        f"Competitors: {state.get('competitors')}\n"
        f"Market research: {state.get('market_research')}"
    )
    result = generate_json(system, user, pydantic_model=SwotAndCanvases)
    return {
        "swot": result.get("swot", {}),
        "lean_canvas": result.get("lean_canvas", {}),
        "business_model_canvas": result.get("business_model_canvas", {}),
    }


def node_business_strategy(state: IdeaState) -> dict:
    publish_progress(state, "Drafting go-to-market strategy...")
    system = (
        "You are a go-to-market strategist. Define the business model, revenue "
        "streams, pricing model, marketing plan, go-to-market strategy, growth "
        "strategy, monetization plan, and customer acquisition approach."
    )
    user = f"Idea: {state.get('core_concept')}\nMarket research: {state.get('market_research')}"
    result = generate_json(system, user, pydantic_model=BusinessStrategy)
    return {"strategy": result}


def node_success_score(state: IdeaState) -> dict:
    publish_progress(state, "Calculating final success score...")
    system = (
        "You are a highly critical, brutal but fair venture capitalist evaluator. "
        "Most startup ideas fail. Rate these 10 factors for the idea, each 0-10, with "
        "a one-sentence reason grounded in the data provided. Use the FULL 0-10 scale. "
        "Do NOT sugarcoat. Average ideas should score 3-5. Only generational companies "
        "deserve 9-10. Do not blindly give 8s. Be extremely harsh on execution, risk, "
        "and competition. The factors are: market_demand, competition, innovation, "
        "technology_complexity, scalability, revenue_potential, execution_difficulty, "
        "funding_availability, timing, risk. "
    )
    user = (
        f"Idea: {state.get('core_concept')}\n"
        f"Market research: {state.get('market_research')}\n"
        f"Competitors: {state.get('competitors')}\n"
        f"Investment: {state.get('investment')}\n"
        f"Trend signal: {state.get('trend_signal')}"
    )
    factor_ratings = generate_json(system, user, pydantic_model=SuccessScoreRatings)
    return {"success_score": compute_success_score(factor_ratings)}
