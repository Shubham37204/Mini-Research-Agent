import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { FindingsTable } from '@/features/findings/components/FindingsTable';
import { PipelineTimeline } from '@/features/telemetry/components/PipelineTimeline';
import type { Finding } from '@/schemas/domain';
import { Shield, Bug, Zap, Fingerprint, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor';

const MOCK_FINDINGS: Finding[] = [
  {
    id: "f1",
    file_path: "backend/vulnerable.py",
    line_start: 5,
    line_end: 5,
    category: "security",
    severity: "critical",
    confidence: 0.98,
    title: "OS Command Injection",
    description: "User input is directly concatenated into an os.system call, allowing for arbitrary command execution.",
    suggestion: "Use subprocess.run with shell=False and pass arguments as a list.",
    engine_id: "rule_engine:dangerous_subprocess",
    metadata: {}
  },
  {
    id: "f2",
    file_path: "backend/vulnerable.py",
    line_start: 9,
    line_end: 9,
    category: "security",
    severity: "critical",
    confidence: 1.0,
    title: "Potential Secret Exposure",
    description: "A hardcoded API key (gsk_...) was detected in the source code.",
    suggestion: "Move secrets to environment variables or a secure vault.",
    engine_id: "rule_engine:secrets_detection",
    metadata: {}
  },
  {
    id: "f3",
    file_path: "backend/vulnerable.py",
    line_start: 13,
    line_end: 13,
    category: "bug",
    severity: "medium",
    confidence: 0.75,
    title: "Potential IndexError",
    description: "Accessing items[10] without checking the length of 'items' might cause a runtime error.",
    suggestion: "Check if len(items) > 10 before accessing.",
    engine_id: "ai_review_engine",
    metadata: {}
  }
];

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <div className="bg-card border border-border p-4 rounded-lg flex items-center gap-4">
    <div className={cn("p-2 rounded-md bg-opacity-10", color)}>
      {icon}
    </div>
    <div>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export const Overview = () => {
  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Review Session</h1>
            <p className="text-muted-foreground mt-1">Session ID: 5bc75c4e-929e-46aa-825a-7f59604ef669</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
               Re-run Analysis
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
               Export SARIF
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<Shield className="text-red-500" />} label="Critical Issues" value="2" color="bg-red-500" />
          <StatCard icon={<Bug className="text-blue-500" />} label="Total Findings" value="3" color="bg-blue-500" />
          <StatCard icon={<Cpu className="text-zinc-500" />} label="Model" value="Llama 3.3" color="bg-zinc-500" />
          <StatCard icon={<Zap className="text-amber-500" />} label="Duration" value="2.6s" color="bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Findings Table - Left Column (Main) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Fingerprint className="text-blue-500 w-5 h-5" />
                Security Findings
              </h2>
            </div>
            <ErrorBoundary>
              <PerformanceMonitor id="FindingsTable">
                <FindingsTable findings={MOCK_FINDINGS} />
              </PerformanceMonitor>
            </ErrorBoundary>
          </div>

          {/* Telemetry - Right Column */}
          <div className="space-y-8">
             <div className="bg-card border border-border rounded-lg p-6">
                <PipelineTimeline />
             </div>
             
             <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Provider Metadata</h3>
                <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Provider</span>
                      <span className="font-mono">Groq</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tokens (In/Out)</span>
                      <span className="font-mono">1,240 / 450</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cache Status</span>
                      <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">MISS</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};
