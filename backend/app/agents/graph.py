"""
Assembles the idea-validation pipeline as a LangGraph StateGraph:

  understand_idea -> web_search -> competitor_analysis -> market_research
    -> investment_estimate -> location_recommendation -> swot_and_canvases
    -> business_strategy -> success_score -> END

Each stage is a plain function in nodes.py, which keeps them independently
unit-testable. Errors in any node are caught here and stored on state rather
than raising, so a partial report can still be returned to the user instead
of a hard 500.
"""
from langgraph.graph import END, StateGraph

from app.agents.nodes import (
    IdeaState,
    node_business_strategy,
    node_competitor_analysis,
    node_investment_estimate,
    node_location_recommendation,
    node_market_research,
    node_success_score,
    node_swot_and_canvases,
    node_understand_idea,
    node_web_search,
)


def _safe(fn):
    """Wrap a node so one provider hiccup doesn't kill the whole pipeline."""

    def wrapped(state: IdeaState) -> dict:
        try:
            return fn(state)
        except Exception as exc:  # noqa: BLE001 - deliberately broad, logged upstream
            return {"error": f"{fn.__name__} failed: {exc}"}

    return wrapped


def build_graph():
    graph = StateGraph(IdeaState)

    graph.add_node("understand_idea", _safe(node_understand_idea))
    graph.add_node("web_search", _safe(node_web_search))
    graph.add_node("competitor_analysis", _safe(node_competitor_analysis))
    graph.add_node("market_research", _safe(node_market_research))
    graph.add_node("investment_estimate", _safe(node_investment_estimate))
    graph.add_node("location_recommendation", _safe(node_location_recommendation))
    graph.add_node("swot_and_canvases", _safe(node_swot_and_canvases))
    graph.add_node("business_strategy", _safe(node_business_strategy))
    graph.add_node("success_score", _safe(node_success_score))

    graph.set_entry_point("understand_idea")
    graph.add_edge("understand_idea", "web_search")
    graph.add_edge("web_search", "competitor_analysis")
    graph.add_edge("competitor_analysis", "market_research")
    graph.add_edge("market_research", "investment_estimate")
    graph.add_edge("investment_estimate", "location_recommendation")
    graph.add_edge("location_recommendation", "swot_and_canvases")
    graph.add_edge("swot_and_canvases", "business_strategy")
    graph.add_edge("business_strategy", "success_score")
    graph.add_edge("success_score", END)

    return graph.compile()


_compiled_graph = None


def run_validation_pipeline(raw_description: str) -> IdeaState:
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()
    initial_state: IdeaState = {"raw_description": raw_description}
    return _compiled_graph.invoke(initial_state)
