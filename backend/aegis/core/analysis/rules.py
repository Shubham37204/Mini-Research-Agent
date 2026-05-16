import re
from abc import ABC, abstractmethod
from typing import List, Pattern, Optional
from pydantic import BaseModel, Field
from aegis.core.domain.models import ReviewFinding, FindingCategory, Severity
import uuid

class RuleMetadata(BaseModel):
    rule_id: str
    category: FindingCategory
    confidence: float = 1.0
    cwe: Optional[str] = None
    owasp: Optional[str] = None

class BaseRule(ABC):
    @property
    @abstractmethod
    def metadata(self) -> RuleMetadata:
        pass

    @abstractmethod
    def analyze(self, file_path: str, content: str) -> List[ReviewFinding]:
        pass

class RegexRule(BaseRule):
    def __init__(
        self, 
        rule_id: str, 
        pattern: str, 
        category: FindingCategory,
        title: str,
        description: str,
        suggestion: str,
        severity: Severity = Severity.MEDIUM,
        cwe: str = None,
        owasp: str = None
    ):
        self._metadata = RuleMetadata(
            rule_id=rule_id,
            category=category,
            cwe=cwe,
            owasp=owasp
        )
        self.pattern: Pattern = re.compile(pattern, re.MULTILINE)
        self.category = category
        self.title = title
        self.description = description
        self.suggestion = suggestion
        self.severity = severity

    @property
    def metadata(self) -> RuleMetadata:
        return self._metadata

    def analyze(self, file_path: str, content: str) -> List[ReviewFinding]:
        findings = []
        for match in self.pattern.finditer(content):
            # Calculate line number (naive implementation)
            line_no = content.count('\n', 0, match.start()) + 1
            
            findings.append(ReviewFinding(
                file_path=file_path,
                line_start=line_no,
                line_end=line_no,
                category=self.category,
                severity=self.severity,
                confidence=self.metadata.confidence,
                title=self.title,
                description=self.description,
                suggestion=self.suggestion,
                engine_id=f"rule_engine:{self.metadata.rule_id}",
                cwe=self.metadata.cwe,
                owasp=self.metadata.owasp
            ))
        return findings

# Predefined Rules
DEFAULT_RULES = [
    RegexRule(
        rule_id="secrets_detection",
        pattern=r"(?i)['\"]?(api_key|secret|password|token)['\"]?\s*[:=]\s*['\"][a-z0-9/+=_]{10,}['\"]",
        category=FindingCategory.SECURITY,
        title="Potential Secret Exposure",
        description="A hardcoded secret or API key was detected in the source code.",
        suggestion="Move secrets to environment variables or a secure vault.",
        severity=Severity.CRITICAL,
        cwe="CWE-798",
        owasp="A07:2021-Identification and Authentication Failures"
    ),
    RegexRule(
        rule_id="debug_print",
        pattern=r"(?i)(^|\s)print\(",
        category=FindingCategory.MAINTAINABILITY,
        title="Debug Print Detected",
        description="Explicit print statements are often used for debugging and should be removed or replaced with logging.",
        suggestion="Use a logging library (e.g., 'logging' or 'loguru') instead of print().",
        severity=Severity.LOW
    ),
    RegexRule(
        rule_id="dangerous_subprocess",
        pattern=r"subprocess\.(run|call|Popen)\(.*shell\s*=\s*True",
        category=FindingCategory.SECURITY,
        title="Dangerous Subprocess with shell=True",
        description="Executing shell commands with shell=True is a major security risk (OS Command Injection).",
        suggestion="Avoid shell=True and pass arguments as a list.",
        severity=Severity.HIGH
    ),
    RegexRule(
        rule_id="unsafe_eval",
        pattern=r"(^|\s)(eval|exec)\(",
        category=FindingCategory.SECURITY,
        title="Unsafe eval/exec usage",
        description="Use of eval() or exec() can lead to arbitrary code execution if inputs are not sanitized.",
        suggestion="Refactor to avoid eval() or use safer alternatives like literal_eval.",
        severity=Severity.CRITICAL
    ),
    RegexRule(
        rule_id="sql_concatenation",
        pattern=r"(?i)(SELECT|INSERT|UPDATE|DELETE).*\+.*",
        category=FindingCategory.SECURITY,
        title="Potential SQL Injection via Concatenation",
        description="Building SQL queries via string concatenation is prone to SQL Injection.",
        suggestion="Use parameterized queries or an ORM.",
        severity=Severity.HIGH
    )
]
