from abc import ABC, abstractmethod
from typing import List
from aegis.core.domain.models import ReviewContext

class PipelineStage(ABC):
    """Base class for all pipeline stages."""
    
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    async def run(self, context: ReviewContext) -> ReviewContext:
        """
        Execute the stage logic.
        
        Args:
            context: The current review context.
            
        Returns:
            A new (or updated) ReviewContext.
        """
        pass

class PipelineEngine:
    """Orchestrates the execution of pipeline stages."""
    
    def __init__(self, stages: List[PipelineStage]):
        self.stages = stages

    async def execute(self, initial_context: ReviewContext) -> ReviewContext:
        context = initial_context
        
        for stage in self.stages:
            # Logic for telemetry could be added here or inside stages
            context.telemetry.events.append({
                "event_type": "stage_started",
                "stage": stage.name
            })
            
            context = await stage.run(context)
            
            context.telemetry.events.append({
                "event_type": "stage_completed",
                "stage": stage.name
            })
            
        return context
