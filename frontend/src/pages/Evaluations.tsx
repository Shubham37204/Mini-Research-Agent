import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Target, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

const ACCURACY_DATA = [
  { name: 'v1.0', accuracy: 0.82, fp: 0.15 },
  { name: 'v1.1', accuracy: 0.85, fp: 0.12 },
  { name: 'v1.2', accuracy: 0.91, fp: 0.08 },
  { name: 'v1.3', accuracy: 0.94, fp: 0.05 },
];

const PROVIDER_DATA = [
  { name: 'Groq/Llama-3', accuracy: 94 },
  { name: 'GPT-4o', accuracy: 96 },
  { name: 'Claude 3.5', accuracy: 95 },
  { name: 'Gemini 1.5', accuracy: 92 },
];

export const Evaluations = () => {
  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
            <p className="text-muted-foreground mt-1">Benchmarking Aegis analysis performance</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Run Benchmark Suite
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Accuracy Trend */}
           <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                 <TrendingUp className="text-blue-500 w-5 h-5" />
                 Accuracy Trend (by Prompt Version)
              </h3>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ACCURACY_DATA}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                       <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                       <YAxis stroke="#71717a" fontSize={12} domain={[0.5, 1]} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                         itemStyle={{ color: '#3b82f6' }}
                       />
                       <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Summary Stats */}
           <div className="space-y-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-emerald-500">System Precision</span>
                    <ShieldCheck className="text-emerald-500 w-5 h-5" />
                 </div>
                 <div className="text-4xl font-bold text-emerald-500">94.2%</div>
                 <p className="text-xs text-muted-foreground mt-2">Measured across 50 benchmark cases</p>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-amber-500">False Positive Rate</span>
                    <AlertCircle className="text-amber-500 w-5 h-5" />
                 </div>
                 <div className="text-4xl font-bold text-amber-500">4.8%</div>
                 <p className="text-xs text-muted-foreground mt-2">-1.2% from previous version</p>
              </div>
           </div>
        </div>

        {/* Provider Comparison */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="text-emerald-500 w-5 h-5" />
                Provider Accuracy Benchmark
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PROVIDER_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} domain={[80, 100]} />
                        <Tooltip 
                           cursor={{ fill: '#27272a', opacity: 0.4 }}
                           contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        />
                        <Bar dataKey="accuracy" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </Shell>
  );
};
