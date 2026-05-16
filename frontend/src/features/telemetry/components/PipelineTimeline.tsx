import React from 'react';
import { CheckCircle2, Clock, AlertCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stage {
  id: string;
  name: string;
  status: 'completed' | 'running' | 'failed' | 'pending';
  duration?: string;
  timestamp?: string;
}

const STAGES: Stage[] = [
  { id: '1', name: 'Diff Extraction', status: 'completed', duration: '120ms', timestamp: '10:32:01' },
  { id: '2', name: 'Rule Analysis', status: 'completed', duration: '45ms', timestamp: '10:32:01' },
  { id: '3', name: 'AI Review (Groq/Llama-3.3)', status: 'completed', duration: '2.4s', timestamp: '10:32:04' },
  { id: '4', name: 'Aggregation & Deduplication', status: 'completed', duration: '12ms', timestamp: '10:32:04' },
  { id: '5', name: 'Policy Evaluation', status: 'completed', duration: '8ms', timestamp: '10:32:04' },
];

export const PipelineTimeline = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Pipeline Execution</h3>
      <div className="space-y-1">
        {STAGES.map((stage, idx) => (
          <div 
            key={stage.id} 
            className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-zinc-800/50 transition-colors group"
          >
            <div className="relative flex flex-col items-center">
              {stage.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500 bg-background" />}
              {stage.status === 'running' && <PlayCircle size={16} className="text-blue-500 animate-pulse bg-background" />}
              {stage.status === 'failed' && <AlertCircle size={16} className="text-red-500 bg-background" />}
              {stage.status === 'pending' && <Clock size={16} className="text-zinc-600 bg-background" />}
              
              {idx !== STAGES.length - 1 && (
                <div className="w-[1px] h-4 bg-zinc-800 mt-1" />
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-between">
              <span className={cn(
                "text-sm font-medium",
                stage.status === 'completed' ? "text-foreground" : "text-muted-foreground"
              )}>
                {stage.name}
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                <span>{stage.duration}</span>
                <span>{stage.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
