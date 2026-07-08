import sys
import os
import json
from dotenv import load_dotenv

sys.path.append(os.path.dirname(__file__))
load_dotenv()

from app.agents.graph import run_validation_pipeline

if __name__ == "__main__":
    description = "A platform that uses AI to generate customized meal plans and grocery lists based on dietary restrictions and fitness goals."
    print("Running validation pipeline...")
    result = run_validation_pipeline(description)
    
    if "error" in result:
        print("PIPELINE ERROR:")
        print(result["error"])
    else:
        print("PIPELINE SUCCESS")
        print(json.dumps(result, indent=2))
