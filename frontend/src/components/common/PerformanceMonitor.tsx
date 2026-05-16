import React, { Profiler, type ReactNode } from 'react';

interface Props {
  id: string;
  children: ReactNode;
}

export const PerformanceMonitor = ({ id, children }: Props) => {
  const onRender = (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number
  ) => {
    if (actualDuration > 16) { // Flag frames slower than 60fps
      console.warn(`[Performance] Slow render in ${id}: ${actualDuration.toFixed(2)}ms (${phase})`);
    }
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
};
