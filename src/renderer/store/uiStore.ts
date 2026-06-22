import { create } from 'zustand';

interface UIStore {
  // Panel visibility
  panels: {
    layers: boolean;
    properties: boolean;
    color: boolean;
    history: boolean;
    rulers: boolean;
    grid: boolean;
  };
  
  // Panel collapsed state
  collapsed: {
    layers: boolean;
    properties: boolean;
    color: boolean;
    history: boolean;
  };
  
  // Dialogs
  dialogs: {
    newProject: boolean;
    openProject: boolean;
    export: boolean;
    preferences: boolean;
  };
  
  // Actions
  togglePanel: (panel: keyof UIStore['panels']) => void;
  setPanelVisible: (panel: keyof UIStore['panels'], visible: boolean) => void;
  toggleCollapsed: (panel: keyof UIStore['collapsed']) => void;
  openDialog: (dialog: keyof UIStore['dialogs']) => void;
  closeDialog: (dialog: keyof UIStore['dialogs']) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  panels: {
    layers: true,
    properties: true,
    color: true,
    history: true,
    rulers: true,
    grid: false,
  },
  
  collapsed: {
    layers: false,
    properties: false,
    color: false,
    history: false,
  },
  
  dialogs: {
    newProject: false,
    openProject: false,
    export: false,
    preferences: false,
  },

  togglePanel: (panel) => {
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: !state.panels[panel],
      },
    }));
  },

  setPanelVisible: (panel, visible) => {
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: visible,
      },
    }));
  },

  toggleCollapsed: (panel) => {
    set((state) => ({
      collapsed: {
        ...state.collapsed,
        [panel]: !state.collapsed[panel],
      },
    }));
  },

  openDialog: (dialog) => {
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [dialog]: true,
      },
    }));
  },

  closeDialog: (dialog) => {
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [dialog]: false,
      },
    }));
  },
}));