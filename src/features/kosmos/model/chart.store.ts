import { create } from 'zustand';

interface ChartStore {
  isChartTooltipVisible: boolean;
  isChartLoading: boolean;
  onToggleIsChartTooltipVisible: (payload: boolean) => void;
  onToggleIsChartLoading: (payload: boolean) => void;
}

export const useChartStore = create<ChartStore>((set) => ({
  isChartTooltipVisible: false,
  isChartLoading: false,

  onToggleIsChartTooltipVisible: (isChartTooltipVisible) =>
    set({ isChartTooltipVisible }),
  onToggleIsChartLoading: (isChartLoading) => set({ isChartLoading })
}));
