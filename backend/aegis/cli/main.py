import typer
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from aegis.core.domain.models import (
    ReviewContext, ReviewTarget, ExecutionContext, 
    ProviderContext, TokenBudget, AnalysisContext
)
from aegis.core.pipeline.base import PipelineEngine
from aegis.core.analysis.stages import DiffExtractionStage, AIReviewStage, RuleAnalysisStage
from aegis.core.analysis.policy import PolicyEvaluationStage
from aegis.core.analysis.deduplication import AggregationStage
from aegis.core.prompts.registry import PromptRegistry
from aegis.cli.formatter import TerminalFormatter
from aegis.core.infrastructure.cache import ReviewCache

load_dotenv()

app = typer.Typer(help="Aegis: Production-grade AI Code Reviewer")

async def run_review_flow(repo_path: str, model: str):
    # Initialize Context
    target = ReviewTarget(
        repo_path=repo_path,
        base_ref="HEAD",
        head_ref="staged",
        diff_content=""
    )
    
    execution = ExecutionContext(
        prompt_version="v1",
        config_hash="default"
    )
    
    provider_ctx = ProviderContext(
        provider_name="groq",
        model_id=model,
        token_budget=TokenBudget(model_limit=32000, available_input=30000)
    )
    
    context = ReviewContext(
        target=target,
        execution=execution,
        provider=provider_ctx
    )
    
    cache = ReviewCache()
    review_hash = cache.generate_hash(context)
    
    cached_findings = cache.get(review_hash)
    if cached_findings:
        print(f"DEBUG: Cache hit! Using stored findings for {review_hash[:8]}")
        context.analysis.findings = cached_findings
        TerminalFormatter.display_findings(context.analysis.findings)
        TerminalFormatter.display_summary(context)
        return
    
    # Initialize Engine & Stages
    registry = PromptRegistry(Path(__file__).parent.parent / "prompts")
    semaphore = asyncio.Semaphore(5) # Limit to 5 parallel AI calls
    
    stages = [
        DiffExtractionStage(),
        RuleAnalysisStage(),
        AIReviewStage(registry, semaphore=semaphore),
        AggregationStage(),
        PolicyEvaluationStage()
    ]
    
    engine = PipelineEngine(stages)
    
    # Execute
    TerminalFormatter.display_header(context)
    with TerminalFormatter.console.status("[bold green]Analyzing code..."):
        context = await engine.execute(context)
        # Store in cache
        cache.set(review_hash, context.analysis.findings)
    
    # Report
    TerminalFormatter.display_findings(context.analysis.findings)
    TerminalFormatter.display_summary(context)

@app.command()
def review(
    path: str = typer.Argument(".", help="Path to the git repository"),
    model: str = typer.Option("groq/llama-3.1-70b-versatile", help="Model to use for review")
):
    """Run a code review on the current git diff."""
    print(f"DEBUG: path={path}, model={model}")
    asyncio.run(run_review_flow(os.path.abspath(path), model))

if __name__ == "__main__":
    app()
