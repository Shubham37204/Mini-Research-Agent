import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Terminal, Activity } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const LATENCY_DATA = [
  { time: '10:00', latency: 2.1 },
  { time: '10:05', latency: 2.4 },
  { time: '10:10', latency: 2.2 },
  { time: '10:15', latency: 3.1 },
  { time: '10:20', latency: 2.8 },
  { time: '10:25', latency: 2.5 },
  { time: '10:30', latency: 2.6 },
];

export const Telemetry = () => {
  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Telemetry</h1>
            <p className="text-muted-foreground mt-1">Operational visibility and pipeline tracing</p>
          </div>
          <div className="flex gap-2">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-border text-xs font-mono text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Stream Active
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-card border border-border p-4 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Avg Latency</div>
              <div className="text-2xl font-bold mt-1">2.45s</div>
           </div>
           <div className="bg-card border border-border p-4 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Success Rate</div>
              <div className="text-2xl font-bold mt-1 text-emerald-500">99.2%</div>
           </div>
           <div className="bg-card border border-border p-4 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Token Throughput</div>
              <div className="text-2xl font-bold mt-1">45k/hr</div>
           </div>
           <div className="bg-card border border-border p-4 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Cache Hit Rate</div>
              <div className="text-2xl font-bold mt-1 text-blue-500">32%</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                 <Activity className="text-blue-500 w-5 h-5" />
                 Provider Latency (seconds)
              </h3>
              <ErrorBoundary>
                <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={LATENCY_DATA}>
                         <defs>
                            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                         <XAxis dataKey="time" stroke="#71717a" fontSize={12} />
                         <YAxis stroke="#71717a" fontSize={12} />
                         <Tooltip 
                           contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                         />
                         <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLatency)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </ErrorBoundary>
           </div>

           <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-0 overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
                 <Terminal size={14} className="text-muted-foreground" />
                 <span className="text-xs font-mono font-bold text-zinc-400">Live Trace Log</span>
              </div>
              <ErrorBoundary>
                <div className="flex-1 p-4 font-mono text-[11px] space-y-2 overflow-auto max-h-[300px]">
                   <div className="text-zinc-500">[10:32:01] <span className="text-blue-400">INFO</span> Pipeline initialized for session ae06b9fa</div>
                   <div className="text-zinc-500">[10:32:01] <span className="text-emerald-400">SUCCESS</span> Stage 'Diff Extraction' completed in 120ms</div>
                   <div className="text-zinc-500">[10:32:01] <span className="text-emerald-400">SUCCESS</span> Stage 'Rule Analysis' found 5 issues</div>
                   <div className="text-zinc-500">[10:32:01] <span className="text-zinc-400">TRACE</span> AI Review started (model=llama-3.3-70b)</div>
                   <div className="text-zinc-500">[10:32:04] <span className="text-emerald-400">SUCCESS</span> AI Review completed in 2.4s</div>
                   <div className="text-zinc-500">[10:32:04] <span className="text-blue-400">INFO</span> Aggregating 8 total findings...</div>
                   <div className="text-zinc-500">[10:32:04] <span className="text-emerald-400">SUCCESS</span> Review session finalized</div>
                   <div className="text-zinc-400 animate-pulse">_</div>
                </div>
              </ErrorBoundary>
           </div>
        </div>
      </div>
    </Shell>
  );
};
