"""
Web search tools used by the competitor / market-research agent nodes.

Tavily is the primary provider (built for LLM agents: it returns clean,
citation-friendly snippets). Google Custom Search and NewsAPI are optional
supplementary sources.
"""
from app.core.config import get_settings

settings = get_settings()


def tavily_search(query: str, max_results: int = 5) -> list[dict]:
    if not settings.TAVILY_API_KEY:
        return []
    from tavily import TavilyClient

    client = TavilyClient(api_key=settings.TAVILY_API_KEY)
    result = client.search(query=query, max_results=max_results, search_depth="advanced")
    return [
        {
            "title": r.get("title"),
            "url": r.get("url"),
            "content": r.get("content"),
        }
        for r in result.get("results", [])
    ]


def google_cse_search(query: str, max_results: int = 5) -> list[dict]:
    if not (settings.GOOGLE_CSE_API_KEY and settings.GOOGLE_CSE_ENGINE_ID):
        return []
    import httpx

    resp = httpx.get(
        "https://www.googleapis.com/customsearch/v1",
        params={
            "key": settings.GOOGLE_CSE_API_KEY,
            "cx": settings.GOOGLE_CSE_ENGINE_ID,
            "q": query,
            "num": min(max_results, 10),
        },
        timeout=15,
    )
    resp.raise_for_status()
    items = resp.json().get("items", [])
    return [{"title": i.get("title"), "url": i.get("link"), "content": i.get("snippet")} for i in items]


def news_search(query: str, max_results: int = 5) -> list[dict]:
    if not settings.NEWSAPI_KEY:
        return []
    import httpx

    resp = httpx.get(
        "https://newsapi.org/v2/everything",
        params={"q": query, "pageSize": max_results, "sortBy": "relevancy", "apiKey": settings.NEWSAPI_KEY},
        timeout=15,
    )
    resp.raise_for_status()
    articles = resp.json().get("articles", [])
    return [
        {"title": a.get("title"), "url": a.get("url"), "content": a.get("description")}
        for a in articles
    ]


def gather_web_context(query: str) -> list[dict]:
    """Combine all configured providers, deduplicated by URL."""
    combined = tavily_search(query) + google_cse_search(query) + news_search(query)
    seen = set()
    deduped = []
    for item in combined:
        url = item.get("url")
        if url and url not in seen:
            seen.add(url)
            deduped.append(item)
    return deduped
