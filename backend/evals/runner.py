import asyncio
import json
from pathlib import Path
from typing import List, Dict, Any
from aegis.core.domain.models import ReviewContext, ReviewTarget, ExecutionContext, ProviderContext, TokenBudget
from aegis.core.pipeline.base import PipelineEngine
from aegis.core.analysis.stages import AIReviewStage, RuleAnalysisStage
from aegis.core.analysis.policy import PolicyEvaluationStage
from aegis.core.prompts.registry import PromptRegistry

async def run_eval():
    dataset_path = Path(__file__).parent / "dataset.json"
    with open(dataset_path, "r") as f:
        cases = json.load(f)
        
    registry = PromptRegistry(Path(__file__).parent.parent / "aegis" / "prompts")
    
    results = []
    
    for case in cases:
        print(f"Running eval case: {case['id']} - {case['description']}")
        
        target = ReviewTarget(
            repo_path=".",
            base_ref="HEAD",
            head_ref="eval",
            diff_content=case["diff"]
        )
        
        context = ReviewContext(
            target=target,
            execution=ExecutionContext(prompt_version="v1", config_hash="eval"),
            provider=ProviderContext(
                provider_name="groq",
                model_id="groq/llama-3.3-70b-versatile",
                token_budget=TokenBudget(model_limit=32000, available_input=30000)
            )
        )
        
        engine = PipelineEngine([
            RuleAnalysisStage(),
            AIReviewStage(registry),
            PolicyEvaluationStage()
        ])
        
        context = await engine.execute(context)
        
        # Debug: Print findings
        for f in context.analysis.findings:
            print(f"    - Found: {f.title} ({f.category}) from {f.engine_id}")
            
        # Check findings
        found_matches = []
        for expected in case["expected_findings"]:
            match = any(
                expected["category"] == f.category.value and 
                (expected["title"].lower() in f.title.lower() or f.title.lower() in expected["title"].lower())
                for f in context.analysis.findings
            )
            found_matches.append(match)
            
        case_passed = all(found_matches)
        results.append({
            "case_id": case["id"],
            "passed": case_passed,
            "findings_count": len(context.analysis.findings)
        })
        
        print(f"  Result: {'PASSED' if case_passed else 'FAILED'}")
        
    print("\nEvaluation Summary:")
    for res in results:
        status = "PASSED" if res["passed"] else "FAILED"
        print(f"  {res['case_id']}: {status} ({res['findings_count']} findings)")

if __name__ == "__main__":
    asyncio.run(run_eval())
