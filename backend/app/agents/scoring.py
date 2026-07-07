"""
AI Success Score.

The score is NOT sampled from the LLM directly. Instead, the model rates
10 named factors on a 0-10 scale with a short justification for each, and
this module combines them with a fixed, documented weighting. This keeps
the score reproducible and explainable, and keeps "how was this calculated"
answerable to the end user.
"""
from typing import Any

# Weights sum to 1.0. Documented so the frontend/report can show the
# breakdown, and so the weighting can be tuned in one place.
WEIGHTS: dict[str, float] = {
    "market_demand": 0.15,
    "competition": 0.10,
    "innovation": 0.10,
    "technology_complexity": 0.08,  # inverted: higher complexity -> lower score contribution
    "scalability": 0.12,
    "revenue_potential": 0.15,
    "execution_difficulty": 0.08,  # inverted
    "funding_availability": 0.08,
    "timing": 0.09,
    "risk": 0.05,  # inverted
}

INVERTED_FACTORS = {"technology_complexity", "execution_difficulty", "risk"}


def compute_success_score(factor_ratings: dict[str, Any]) -> dict[str, Any]:
    """
    factor_ratings: { factor_name: {"score": 0-10, "reason": str} }
    Returns overall score (0-100), a strength/risk/opportunity meter, and the
    full breakdown so the UI/report can show exactly how the number was derived.
    """
    breakdown = []
    weighted_total = 0.0

    for factor, weight in WEIGHTS.items():
        rating = factor_ratings.get(factor, {"score": 5, "reason": "No data provided; assumed neutral."})
        raw_score = max(0, min(10, float(rating.get("score", 5))))
        effective_score = (10 - raw_score) if factor in INVERTED_FACTORS else raw_score
        contribution = effective_score * weight
        weighted_total += contribution
        breakdown.append(
            {
                "factor": factor,
                "raw_score": raw_score,
                "weight": weight,
                "inverted": factor in INVERTED_FACTORS,
                "contribution": round(contribution, 3),
                "reason": rating.get("reason", ""),
            }
        )

    overall = round(weighted_total * 10, 1)  # scale 0-10 weighted avg to 0-100

    strength_meter = round(
        (factor_ratings.get("innovation", {}).get("score", 5)
         + factor_ratings.get("scalability", {}).get("score", 5)
         + factor_ratings.get("revenue_potential", {}).get("score", 5)) / 3 * 10, 1
    )
    risk_meter = round(
        (factor_ratings.get("risk", {}).get("score", 5)
         + factor_ratings.get("execution_difficulty", {}).get("score", 5)
         + factor_ratings.get("technology_complexity", {}).get("score", 5)) / 3 * 10, 1
    )
    opportunity_meter = round(
        (factor_ratings.get("market_demand", {}).get("score", 5)
         + factor_ratings.get("timing", {}).get("score", 5)
         + (10 - factor_ratings.get("competition", {}).get("score", 5))) / 3 * 10, 1
    )

    return {
        "overall_score": overall,
        "strength_meter": strength_meter,
        "risk_meter": risk_meter,
        "opportunity_meter": opportunity_meter,
        "breakdown": breakdown,
        "methodology": (
            "Score is a weighted average of 10 factors (market demand, competition, "
            "innovation, technology complexity, scalability, revenue potential, "
            "execution difficulty, funding availability, timing, and risk), each "
            "rated 0-10 by the analysis model with a written justification. "
            "Complexity, execution difficulty, and risk are inverted before "
            "weighting since higher values there are worse for the founder. "
            "This is an estimate to aid research, not a guarantee of outcome."
        ),
        "disclaimer": "This score is an AI-generated estimate based on available data. It is not financial or investment advice and does not guarantee startup success or failure.",
    }
