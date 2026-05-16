from typing import List, Dict
from aegis.core.domain.models import ReviewFinding, Severity, FindingCategory

class ReviewPolicy:
    """
    Enforces organizational policies on review findings.
    Decouples risk detection from final severity/action decisions.
    """
    
    def __init__(self, config: Dict = None):
        self.config = config or {}

    def apply(self, findings: List[ReviewFinding]) -> List[ReviewFinding]:
        """
        Process a list of findings and adjust their properties based on policy.
        """
        for finding in findings:
            # Example Policy: Elevate all security findings in certain categories
            if finding.category == FindingCategory.SECURITY:
                if "SQL Injection" in finding.title:
                    finding.severity = Severity.CRITICAL
                elif "Secret" in finding.title:
                    finding.severity = Severity.CRITICAL

            # Example Policy: Downgrade 'style' issues if they are from AI (less reliable)
            if finding.category == FindingCategory.STYLE and "ai_review" in finding.engine_id:
                finding.severity = Severity.INFO

            # Future: Load these rules from YAML
            
        return findings

class PolicyEvaluationStage:
    """Pipeline stage to apply policies."""
    
    def __init__(self, policy: ReviewPolicy = None):
        self.policy = policy or ReviewPolicy()

    @property
    def name(self) -> str:
        return "policy_evaluation"

    async def run(self, context: any) -> any:
        # We use 'any' for context to avoid circular imports if needed, 
        # but here we know it's ReviewContext
        context.analysis.findings = self.policy.apply(context.analysis.findings)
        return context
