from typing import List, Dict, Tuple
from pydantic import BaseModel
from aegis.core.domain.models import ReviewFinding, ReviewContext
import re

class FindingFingerprint(BaseModel):
    file_path: str
    line_range: Tuple[int, int]
    category: str
    normalized_title: str

    @classmethod
    def create(cls, finding: ReviewFinding) -> "FindingFingerprint":
        # Normalize title: lowercase, remove punctuation, remove common filler words
        normalized = finding.title.lower()
        normalized = re.sub(r'[^\w\s]', '', normalized)
        
        return cls(
            file_path=finding.file_path,
            line_range=(finding.line_start, finding.line_end),
            category=finding.category.value,
            normalized_title=normalized
        )

    def __hash__(self):
        return hash((self.file_path, self.line_range, self.category, self.normalized_title))

    def __eq__(self, other):
        if not isinstance(other, FindingFingerprint):
            return False
        return (self.file_path == other.file_path and 
                self.line_range == other.line_range and 
                self.category == other.category and 
                self.normalized_title == other.normalized_title)

class Aggregator:
    """Aggregates and deduplicates findings."""
    
    def aggregate(self, findings: List[ReviewFinding]) -> List[ReviewFinding]:
        # Group by file and line and category
        grouped: Dict[Tuple[str, int, str], List[ReviewFinding]] = {}
        
        for finding in findings:
            key = (finding.file_path, finding.line_start, finding.category.value)
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(finding)
            
        aggregated = []
        for key, group in grouped.items():
            if len(group) == 1:
                aggregated.append(group[0])
            else:
                # Merge findings on the same line/category
                merged = self._merge(group)
                aggregated.append(merged)
                
        return aggregated

    def _merge(self, findings: List[ReviewFinding]) -> ReviewFinding:
        # Prioritize rule engine for deterministic metadata
        rule_findings = [f for f in findings if "rule_engine" in f.engine_id]
        primary = rule_findings[0] if rule_findings else findings[0]
        
        # Combine titles if different
        unique_titles = list(dict.fromkeys([f.title for f in findings]))
        primary.title = " / ".join(unique_titles) if len(unique_titles) > 1 else unique_titles[0]
        
        # Combine descriptions
        unique_descriptions = list(dict.fromkeys([f.description for f in findings]))
        primary.description = "\n---\n".join(unique_descriptions)
        
        # Track sources in metadata
        primary.metadata["merged_sources"] = list(set(f.engine_id for f in findings))
        primary.confidence = max(f.confidence for f in findings)
        
        return primary

class AggregationStage:
    """Pipeline stage for deduplication."""
    
    @property
    def name(self) -> str:
        return "aggregation"

    async def run(self, context: ReviewContext) -> ReviewContext:
        aggregator = Aggregator()
        context.analysis.findings = aggregator.aggregate(context.analysis.findings)
        return context
