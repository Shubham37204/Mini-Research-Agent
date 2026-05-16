import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Search, Filter, History, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_SESSIONS = [
  { id: 'ae06b9fa', timestamp: '2026-05-16 10:32:01', model: 'Llama 3.3', findings: 10, severity: 'critical' },
  { id: '5bc75c4e', timestamp: '2026-05-16 09:15:22', model: 'GPT-4o', findings: 5, severity: 'high' },
  { id: '2d8a1c92', timestamp: '2026-05-15 16:45:10', model: 'Claude 3.5 Sonnet', findings: 12, severity: 'medium' },
];

export const Sessions = () => {
  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Review Sessions</h1>
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter sessions..." 
                  className="bg-zinc-900 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                />
             </div>
             <button className="p-2 border border-border rounded-md hover:bg-secondary transition-colors">
                <Filter size={18} className="text-muted-foreground" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_SESSIONS.map((session) => (
            <Link 
              key={session.id} 
              to={`/session/${session.id}`}
              className="bg-card border border-border p-4 rounded-lg flex items-center justify-between hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="p-3 rounded-md bg-secondary text-secondary-foreground">
                  <History size={20} />
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    Session {session.id}
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                      session.severity === 'critical' ? 'text-red-500 border-red-500/20 bg-red-500/10' :
                      session.severity === 'high' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' :
                      'text-blue-500 border-blue-500/20 bg-blue-500/10'
                    }`}>
                      {session.severity}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {session.timestamp} • {session.model}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                 <div className="text-right">
                    <div className="text-lg font-bold">{session.findings}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">Findings</div>
                 </div>
                 <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
};
