from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.syntax import Syntax
from aegis.core.domain.models import ReviewContext, ReviewFinding, Severity

console = Console()

class TerminalFormatter:
    """Beautiful terminal output for review findings."""
    console = console
    
    @staticmethod
    def display_header(context: ReviewContext):
        console.print(Panel(
            f"[bold blue]Aegis Code Review[/bold blue]\n"
            f"[dim]Session: {context.session_id}[/dim]",
            border_style="blue",
            expand=False
        ))

    @staticmethod
    def display_findings(findings: list[ReviewFinding]):
        if not findings:
            console.print("[green]No issues found! Great job.[/green]")
            return

        table = Table(title="Review Findings", show_header=True, header_style="bold magenta")
        table.add_column("File", style="dim")
        table.add_column("Lines", justify="center")
        table.add_column("Severity", justify="center")
        table.add_column("Category")
        table.add_column("Title", style="bold")

        severity_colors = {
            Severity.CRITICAL: "bold red",
            Severity.HIGH: "red",
            Severity.MEDIUM: "yellow",
            Severity.LOW: "blue",
            Severity.INFO: "dim white"
        }

        for f in findings:
            table.add_row(
                f.file_path,
                f"{f.line_start}-{f.line_end}",
                f"[{severity_colors.get(f.severity, 'white')}]{f.severity.value}[/]",
                f.category.value,
                f.title
            )
            
        console.print(table)

    @staticmethod
    def display_summary(context: ReviewContext):
        total = len(context.analysis.findings)
        console.print(f"\n[bold]Total Findings:[/bold] {total}")
        # Add more summary stats here
