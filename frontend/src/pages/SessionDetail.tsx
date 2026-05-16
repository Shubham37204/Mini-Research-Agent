import { Suspense, lazy } from 'react';
import { Shell } from '@/components/layout/Shell';
import { ArrowLeft, ChevronRight, FileCode, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const CodeDiff = lazy(() => import('@/features/diff-viewer/components/CodeDiff').then(m => ({ default: m.CodeDiff })));

const CodeDiffSkeleton = () => (
  <div className="h-[600px] w-full bg-zinc-950 border border-border rounded-lg flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin" />
      <span className="text-sm font-medium">Initializing Monaco Editor...</span>
    </div>
  </div>
);

const MOCK_ORIGINAL = `
def process_data(data):
    # Process the data
    os.system("echo " + data)
    
    items = data.split(",")
    print(items[10])
    
    return items
`;

const MOCK_MODIFIED = `
import os
import subprocess

def process_data(data):
    # Process the data safely
    subprocess.run(["echo", data], shell=False)
    
    items = data.split(",")
    if len(items) > 10:
        print(items[10])
    
    return items
`;

export const SessionDetail = () => {
  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/overview" className="hover:text-foreground transition-colors">Sessions</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">Session ae06b9fa</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link to="/overview" className="p-2 hover:bg-secondary rounded-md transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Vulnerability Analysis</h1>
                <p className="text-sm text-muted-foreground">Comparing HEAD~1 vs staged changes</p>
              </div>
           </div>
           
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search code..." 
                className="w-full bg-zinc-900 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
           </div>
        </div>

        {/* Diff Viewer Section */}
        <div className="grid grid-cols-1 gap-6">
           <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-zinc-900/50 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <FileCode size={16} className="text-blue-500" />
                    backend/vulnerable.py
                 </div>
                 <div className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    PYTHON
                 </div>
              </div>
              <div className="p-1">
                <ErrorBoundary>
                  <Suspense fallback={<CodeDiffSkeleton />}>
                    <CodeDiff original={MOCK_ORIGINAL} modified={MOCK_MODIFIED} />
                  </Suspense>
                </ErrorBoundary>
              </div>
           </div>
        </div>

        {/* Quick Findings Panel */}
        <div className="bg-zinc-900/30 border border-border rounded-lg p-6 space-y-4">
           <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Inline Context</h3>
           <div className="space-y-3">
              <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-md flex gap-4">
                 <div className="w-1 bg-red-500 rounded-full" />
                 <div>
                    <div className="text-sm font-bold text-red-500">CRITICAL: OS Command Injection</div>
                    <div className="text-xs text-muted-foreground mt-1">Line 5: User input is directly concatenated into os.system. This allows for arbitrary code execution.</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Shell>
  );
};
