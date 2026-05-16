import subprocess
import asyncio
from aegis.core.pipeline.base import PipelineStage
from aegis.core.domain.models import ReviewContext, ReviewTarget
from aegis.core.providers.groq import LiteLLMProvider, validate_findings
from aegis.core.prompts.registry import PromptRegistry
from typing import List
from pathlib import Path

class DiffExtractionStage(PipelineStage):
    """Extracts git diff from the local repository."""
    
    @property
    def name(self) -> str:
        return "diff_extraction"

    async def run(self, context: ReviewContext) -> ReviewContext:
        # For simplicity, extract staged diff
        repo_path = str(context.target.repo_path)
        try:
            # Use shell=True for Windows compatibility with git
            result = subprocess.run(
                ["git", "diff", "--staged"], 
                capture_output=True, 
                text=True, 
                cwd=repo_path,
                shell=True
            )
            diff = result.stdout
            
            if not diff:
                # Fallback to last commit if no staged diff
                result = subprocess.run(
                    ["git", "diff", "HEAD~1"], 
                    capture_output=True, 
                    text=True, 
                    cwd=repo_path,
                    shell=True
                )
                diff = result.stdout
                
            context.target.diff_content = diff
            return context
        except Exception as e:
            raise RuntimeError(f"Failed to extract git diff from {repo_path}: {e}")

from aegis.core.analysis.rules import DEFAULT_RULES, BaseRule

class RuleAnalysisStage(PipelineStage):
    """Deterministic rule-based analysis stage."""
    
    def __init__(self, rules: List[BaseRule] = DEFAULT_RULES):
        self.rules = rules

    @property
    def name(self) -> str:
        return "rule_analysis"

    async def run(self, context: ReviewContext) -> ReviewContext:
        if not context.target.diff_content:
            return context
            
        # Parse diff into files (very simple version for now)
        # In production, we would use a diff parser
        findings = []
        for rule in self.rules:
            # Analyze the whole diff for simplicity in this MVP slice
            # Ideally analyze file by file
            rule_findings = rule.analyze("diff_content", context.target.diff_content)
            findings.extend(rule_findings)
            
        context.analysis.findings.extend(findings)
        context.analysis.rule_results["executed_rules"] = [r.metadata.rule_id for r in self.rules]
        
        return context

class AIReviewStage(PipelineStage):
    """Runs the AI review analysis."""
    
    def __init__(self, registry: PromptRegistry, semaphore: asyncio.Semaphore = None):
        self.registry = registry
        self.semaphore = semaphore or asyncio.Semaphore(10) # Default limit

    @property
    def name(self) -> str:
        return "ai_review"

    async def run(self, context: ReviewContext) -> ReviewContext:
        if not context.target.diff_content:
            return context
            
        provider = LiteLLMProvider(context.provider)
        prompt = self.registry.load("review", context.execution.prompt_version)
        
        user_prompt = prompt.user_template.replace("{{diff_content}}", context.target.diff_content)
        
        async with self.semaphore:
            raw_results = await provider.complete_review(
                system_prompt=prompt.system_prompt + (prompt.schema_instructions or ""),
                user_prompt=user_prompt,
                response_model=True
            )
        
        findings = validate_findings(raw_results)
        context.analysis.findings.extend(findings)
        context.analysis.ai_results["raw_response"] = raw_results
        
        return context
