import { create } from 'zustand';

interface AppState {
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  currentSessionId: null,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
