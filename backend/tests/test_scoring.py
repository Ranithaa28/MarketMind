from app.agents.scoring import compute_success_score


def test_compute_success_score_neutral_defaults():
    result = compute_success_score({})
    assert 0 <= result["overall_score"] <= 100
    assert "methodology" in result
    assert "disclaimer" in result
    assert len(result["breakdown"]) == 10


def test_compute_success_score_high_inputs_score_higher():
    strong = {
        "market_demand": {"score": 10, "reason": "x"},
        "competition": {"score": 2, "reason": "x"},
        "innovation": {"score": 10, "reason": "x"},
        "technology_complexity": {"score": 2, "reason": "x"},
        "scalability": {"score": 10, "reason": "x"},
        "revenue_potential": {"score": 10, "reason": "x"},
        "execution_difficulty": {"score": 2, "reason": "x"},
        "funding_availability": {"score": 10, "reason": "x"},
        "timing": {"score": 10, "reason": "x"},
        "risk": {"score": 2, "reason": "x"},
    }
    weak = {k: {"score": 10 - v["score"], "reason": "x"} for k, v in strong.items()}
    assert compute_success_score(strong)["overall_score"] > compute_success_score(weak)["overall_score"]
