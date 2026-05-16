import React from 'react';
import { LayoutGrid, FileText, Activity, ShieldCheck, Settings, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const NavItem = ({ icon, label, to }: NavItemProps) => {
  const location = useLocation();
  const active = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors w-full text-left",
        active 
          ? "bg-secondary text-secondary-foreground" 
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <ShieldCheck className="text-blue-500 w-6 h-6" />
          <span className="font-bold tracking-tight text-lg">AEGIS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutGrid size={18} />} label="Overview" to="/overview" />
          <NavItem icon={<FileText size={18} />} label="Review Sessions" to="/sessions" />
          <NavItem icon={<Activity size={18} />} label="Telemetry" to="/telemetry" />
          <NavItem icon={<Database size={18} />} label="Evaluations" to="/evaluations" />
        </nav>
        
        <div className="p-4 border-t border-border">
          <NavItem icon={<Settings size={18} />} label="Settings" to="/settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6">
          <div className="flex-1 text-sm font-medium text-muted-foreground">
            Project / <span className="text-foreground">aegis-platform</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full font-semibold border border-emerald-500/20">
               LIVE
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
