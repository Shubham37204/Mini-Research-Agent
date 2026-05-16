import { useMemo, useRef } from 'react';
import type { Finding, Severity } from '@/schemas/domain';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, ShieldAlert, CircleSlash } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const config = {
    critical: { icon: <ShieldAlert size={14} />, className: "text-red-500 bg-red-500/10 border-red-500/20" },
    high: { icon: <AlertTriangle size={14} />, className: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    medium: { icon: <Info size={14} />, className: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    low: { icon: <Info size={14} />, className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    info: { icon: <CircleSlash size={14} />, className: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20" },
  };

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase border tracking-wider", config[severity].className)}>
      {config[severity].icon}
      {severity}
    </div>
  );
};

const columnHelper = createColumnHelper<Finding>();

export const FindingsTable = ({ findings }: { findings: Finding[] }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => [
    columnHelper.accessor('severity', {
      header: 'Severity',
      cell: info => <SeverityBadge severity={info.getValue()} />,
      size: 120,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
          {info.getValue()}
        </span>
      ),
      size: 140,
    }),
    columnHelper.accessor('title', {
      header: 'Finding',
      cell: info => (
        <div className="py-1">
          <div className="font-medium text-foreground">{info.getValue()}</div>
          <div className="text-xs text-muted-foreground truncate max-w-lg">
            {info.row.original.description}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('confidence', {
      header: 'Confidence',
      cell: info => {
        const val = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden w-16">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  val > 0.8 ? "bg-emerald-500" : val > 0.5 ? "bg-amber-500" : "bg-red-500"
                )}
                style={{ width: `${val * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
              {Math.round(val * 100)}%
            </span>
          </div>
        );
      },
      size: 100,
    }),
    columnHelper.accessor('file_path', {
      header: 'File',
      cell: info => (
        <span className="text-xs font-mono text-muted-foreground">
          {info.getValue()}:{info.row.original.line_start}
        </span>
      ),
      size: 180,
    }),
  ], []);

  const table = useReactTable({
    data: findings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 54, // Average row height
    overscan: 10,
  });

  return (
    <div 
      ref={tableContainerRef}
      className="w-full border border-border rounded-lg bg-card overflow-auto max-h-[600px] relative"
    >
      <table className="w-full text-sm text-left border-collapse border-spacing-0">
        <thead className="sticky top-0 z-10 bg-zinc-900 shadow-sm">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  className="px-4 py-3 font-semibold text-muted-foreground"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody 
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const row = rows[virtualRow.index];
            return (
              <tr 
                key={row.id} 
                className="hover:bg-zinc-800/30 transition-colors group cursor-pointer absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="px-4 py-2 border-b border-border/50 align-middle"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {findings.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          No findings detected in this session.
        </div>
      )}
    </div>
  );
};
