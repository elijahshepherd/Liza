import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type { Layer, CanvasObject, CanvasState, HistoryState, LizaProject, RectObject, EllipseObject, TextObject } from '@shared/types';

interface CanvasStore {
  // Canvas state
  canvas: CanvasState;
  layers: Layer[];
  activeLayerId: string | null;
  selectedObjectIds: string[];
  
  // History
  history: HistoryState[];
  historyIndex: number;
  maxHistory: number;
  
  // Project
  projectPath: string | null;
  isDirty: boolean;

  // Actions
  setCanvasSize: (width: number, height: number) => void;
  setBackground: (color: string) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  
  // Layer actions
  addLayer: (name?: string) => void;
  removeLayer: (id: string) => void;
  selectLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  mergeDown: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  setLayerBlendMode: (id: string, blendMode: string) => void;
  
  // Object actions
  addObject: (layerId: string, object: CanvasObject) => void;
  updateObject: (layerId: string, objectId: string, updates: Partial<CanvasObject>) => void;
  removeObject: (layerId: string, objectId: string) => void;
  selectObjects: (objectIds: string[]) => void;
  deselectAll: () => void;
  selectAll: () => void;
  
  // History actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  // Project actions
  newProject: () => void;
  loadProject: (project: LizaProject) => void;
  getProject: () => LizaProject;
  setProjectPath: (path: string) => void;
  setDirty: (dirty: boolean) => void;
  
  // Export
  exportCanvas: () => Promise<ArrayBuffer | null>;
  
  // Helpers
  getActiveLayer: () => Layer | null;
  getSelectedObjects: () => CanvasObject[];
  getObjectBounds: (objectId: string) => Rect | null;
}

export const useCanvasStore = create<CanvasStore>()(
  immer((set, get) => ({
    canvas: {
      width: 1920,
      height: 1080,
      background: '#ffffff',
      zoom: 1,
      panX: 0,
      panY: 0,
    },
    layers: [],
    activeLayerId: null,
    selectedObjectIds: [],
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    projectPath: null,
    isDirty: false,

    setCanvasSize: (width, height) => {
      set((state) => {
        state.canvas.width = width;
        state.canvas.height = height;
      });
      get().pushHistory();
    },

    setBackground: (color) => {
      set((state) => {
        state.canvas.background = color;
      });
      get().pushHistory();
    },

    setZoom: (zoom) => {
      set((state) => {
        state.canvas.zoom = Math.max(0.1, Math.min(10, zoom));
      });
    },

    setPan: (x, y) => {
      set((state) => {
        state.canvas.panX = x;
        state.canvas.panY = y;
      });
    },

    addLayer: (name) => {
      const id = uuidv4();
      set((state) => {
        const layer: Layer = {
          id,
          name: name || `Layer ${state.layers.length + 1}`,
          type: 'raster',
          visible: true,
          locked: false,
          opacity: 1,
          blendMode: 'normal',
          objects: [],
        };
        state.layers.push(layer);
        state.activeLayerId = id;
      });
      get().pushHistory();
    },

    removeLayer: (id) => {
      set((state) => {
        const index = state.layers.findIndex((l) => l.id === id);
        if (index !== -1) {
          state.layers.splice(index, 1);
          if (state.activeLayerId === id) {
            state.activeLayerId = state.layers[Math.max(0, index - 1)]?.id || null;
          }
        }
      });
      get().pushHistory();
    },

    selectLayer: (id) => {
      set((state) => {
        state.activeLayerId = id;
      });
    },

    duplicateLayer: (id) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === id);
        if (layer) {
          const newLayer: Layer = {
            ...JSON.parse(JSON.stringify(layer)),
            id: uuidv4(),
            name: `${layer.name} copy`,
          };
          const index = state.layers.findIndex((l) => l.id === id);
          state.layers.splice(index + 1, 0, newLayer);
          state.activeLayerId = newLayer.id;
        }
      });
      get().pushHistory();
    },

    mergeDown: (id) => {
      set((state) => {
        const index = state.layers.findIndex((l) => l.id === id);
        if (index > 0) {
          const upperLayer = state.layers[index];
          const lowerLayer = state.layers[index - 1];
          lowerLayer.objects = [...lowerLayer.objects, ...upperLayer.objects];
          state.layers.splice(index, 1);
          state.activeLayerId = lowerLayer.id;
        }
      });
      get().pushHistory();
    },

    reorderLayers: (fromIndex, toIndex) => {
      set((state) => {
        const [layer] = state.layers.splice(fromIndex, 1);
        state.layers.splice(toIndex, 0, layer);
      });
      get().pushHistory();
    },

    toggleLayerVisibility: (id) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === id);
        if (layer) {
          layer.visible = !layer.visible;
        }
      });
    },

    toggleLayerLock: (id) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === id);
        if (layer) {
          layer.locked = !layer.locked;
        }
      });
    },

    setLayerOpacity: (id, opacity) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === id);
        if (layer) {
          layer.opacity = Math.max(0, Math.min(1, opacity));
        }
      });
    },

    setLayerBlendMode: (id, blendMode) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === id);
        if (layer) {
          layer.blendMode = blendMode as any;
        }
      });
    },

    addObject: (layerId, object) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId);
        if (layer) {
          layer.objects.push(object);
        }
      });
      get().pushHistory();
    },

    updateObject: (layerId, objectId, updates) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId);
        if (layer) {
          const obj = layer.objects.find((o) => o.id === objectId);
          if (obj) {
            Object.assign(obj, updates);
          }
        }
      });
    },

    removeObject: (layerId, objectId) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId);
        if (layer) {
          const index = layer.objects.findIndex((o) => o.id === objectId);
          if (index !== -1) {
            layer.objects.splice(index, 1);
          }
        }
        state.selectedObjectIds = state.selectedObjectIds.filter((id) => id !== objectId);
      });
      get().pushHistory();
    },

    selectObjects: (objectIds) => {
      set((state) => {
        state.selectedObjectIds = objectIds;
      });
    },

    deselectAll: () => {
      set((state) => {
        state.selectedObjectIds = [];
      });
    },

    selectAll: () => {
      const { layers, activeLayerId } = get();
      const layer = layers.find((l) => l.id === activeLayerId);
      if (layer) {
        set((state) => {
          state.selectedObjectIds = layer.objects.map((o) => o.id);
        });
      }
    },

    pushHistory: () => {
      set((state) => {
        const historyState: HistoryState = {
          layers: JSON.parse(JSON.stringify(state.layers)),
          canvas: { ...state.canvas },
          timestamp: Date.now(),
        };
        
        // Remove any redo states
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(historyState);
        
        // Limit history size
        if (state.history.length > state.maxHistory) {
          state.history.shift();
        }
        state.historyIndex = state.history.length - 1;
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        set((state) => {
          state.historyIndex--;
          const prevState = state.history[state.historyIndex];
          state.layers = JSON.parse(JSON.stringify(prevState.layers));
          state.canvas = { ...prevState.canvas };
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        set((state) => {
          state.historyIndex++;
          const nextState = state.history[state.historyIndex];
          state.layers = JSON.parse(JSON.stringify(nextState.layers));
          state.canvas = { ...nextState.canvas };
        });
      }
    },

    newProject: () => {
      set((state) => {
        state.canvas = {
          width: 1920,
          height: 1080,
          background: '#ffffff',
          zoom: 1,
          panX: 0,
          panY: 0,
        };
        state.layers = [{
          id: uuidv4(),
          name: 'Layer 1',
          type: 'raster',
          visible: true,
          locked: false,
          opacity: 1,
          blendMode: 'normal',
          objects: [],
        }];
        state.activeLayerId = state.layers[0].id;
        state.selectedObjectIds = [];
        state.history = [];
        state.historyIndex = -1;
        state.projectPath = null;
        state.isDirty = false;
      });
      get().pushHistory();
    },

    loadProject: (project) => {
      set((state) => {
        state.canvas = project.canvas;
        state.layers = project.layers;
        state.activeLayerId = project.layers[0]?.id || null;
        state.selectedObjectIds = [];
        state.history = [];
        state.historyIndex = -1;
        state.isDirty = false;
      });
      get().pushHistory();
    },

    getProject: (): LizaProject => {
      const { canvas, layers } = get();
      return {
        version: '0.1.0',
        metadata: {
          name: 'Untitled',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
        canvas,
        layers,
        settings: {
          snapToGrid: false,
          gridSize: 10,
          rulersVisible: true,
          showGrid: false,
        },
      };
    },

    setProjectPath: (path) => {
      set((state) => {
        state.projectPath = path;
      });
    },

    setDirty: (dirty) => {
      set((state) => {
        state.isDirty = dirty;
      });
    },

    exportCanvas: async (): Promise<ArrayBuffer | null> => {
      // This would render the canvas to an image
      // Implementation depends on Konva's toDataURL or similar
      return null;
    },

    getActiveLayer: () => {
      const { layers, activeLayerId } = get();
      return layers.find((l) => l.id === activeLayerId) || null;
    },

    getSelectedObjects: () => {
      const { layers, activeLayerId, selectedObjectIds } = get();
      const layer = layers.find((l) => l.id === activeLayerId);
      if (!layer) return [];
      return layer.objects.filter((o) => selectedObjectIds.includes(o.id));
    },

    getObjectBounds: (objectId) => {
      const { layers } = get();
      for (const layer of layers) {
        const obj = layer.objects.find((o) => o.id === objectId);
        if (obj) {
          return {
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
          };
        }
      }
      return null;
    },
  }))
);

// Initialize with a default layer
useCanvasStore.getState().newProject();