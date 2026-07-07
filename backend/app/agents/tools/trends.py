"""Google Trends signal via pytrends (unofficial API, no key required)."""


def get_trend_score(keyword: str) -> dict:
    try:
        from pytrends.request import TrendReq

        pytrends = TrendReq(hl="en-US", tz=360)
        pytrends.build_payload([keyword], timeframe="today 12-m")
        data = pytrends.interest_over_time()
        if data.empty:
            return {"keyword": keyword, "average_interest": None, "trend": "unknown"}

        series = data[keyword]
        avg = float(series.mean())
        # Compare last quarter vs first quarter of the series to gauge direction.
        first_q = series.iloc[: max(len(series) // 4, 1)].mean()
        last_q = series.iloc[-max(len(series) // 4, 1):].mean()
        trend = "rising" if last_q > first_q * 1.1 else "declining" if last_q < first_q * 0.9 else "stable"
        return {"keyword": keyword, "average_interest": round(avg, 1), "trend": trend}
    except Exception:
        # pytrends is rate-limited and occasionally blocked by Google;
        # never let it fail the whole pipeline.
        return {"keyword": keyword, "average_interest": None, "trend": "unavailable"}
