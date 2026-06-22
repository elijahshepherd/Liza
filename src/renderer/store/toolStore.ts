import { create } from 'zustand';
import type { ToolType, ToolOptions } from '@shared/types';

interface ToolStore {
  activeTool: ToolType;
  previousTool: ToolType | null;
  temporaryTool: ToolType | null;
  toolOptions: ToolOptions;
  
  // Brush colors
  foregroundColor: string;
  backgroundColor: string;
  
  // Actions
  setActiveTool: (tool: ToolType) => void;
  setTemporaryTool: (tool: ToolType) => void;
  clearTemporaryTool: () => void;
  setToolOption: <K extends keyof ToolOptions>(key: K, value: ToolOptions[K]) => void;
  setToolOptions: (options: Partial<ToolOptions>) => void;
  
  // Color actions
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  swapColors: () => void;
  resetColors: () => void;
}

export const useToolStore = create<ToolStore>((set, get) => ({
  activeTool: 'select',
  previousTool: null,
  temporaryTool: null,
  toolOptions: {
    size: 10,
    opacity: 1,
    hardness: 1,
    spacing: 0.1,
    color: '#000000',
    strokeWidth: 2,
    fill: '#ffffff',
    fontSize: 24,
    fontFamily: 'Arial',
  },
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',

  setActiveTool: (tool) => {
    set((state) => ({
      previousTool: state.activeTool,
      activeTool: tool,
    }));
  },

  setTemporaryTool: (tool) => {
    set((state) => ({
      temporaryTool: tool,
    }));
  },

  clearTemporaryTool: () => {
    set({ temporaryTool: null });
  },

  setToolOption: (key, value) => {
    set((state) => {
      state.toolOptions[key] = value;
    });
  },

  setToolOptions: (options) => {
    set((state) => {
      Object.assign(state.toolOptions, options);
    });
  },

  setForegroundColor: (color) => {
    set({ foregroundColor: color });
    get().setToolOption('color', color);
  },

  setBackgroundColor: (color) => {
    set({ backgroundColor: color });
  },

  swapColors: () => {
    set((state) => ({
      foregroundColor: state.backgroundColor,
      backgroundColor: state.foregroundColor,
      toolOptions: {
        ...state.toolOptions,
        color: state.backgroundColor,
      },
    }));
  },

  resetColors: () => {
    set({
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      toolOptions: {
        ...get().toolOptions,
        color: '#000000',
      },
    });
  },
}));