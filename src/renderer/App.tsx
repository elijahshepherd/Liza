import React, { useEffect, useCallback } from 'react';
import { Canvas } from './components/Canvas/Canvas';
import { Toolbar } from './components/Toolbar/Toolbar';
import { LayersPanel } from './components/LayersPanel/LayersPanel';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { ColorPanel } from './components/ColorPanel/ColorPanel';
import { HistoryPanel } from './components/HistoryPanel/HistoryPanel';
import { MenuBar } from './components/MenuBar/MenuBar';
import { useCanvasStore } from './store/canvasStore';
import { useToolStore } from './store/toolStore';
import { useUIStore } from './store/uiStore';
import './styles.css';

// Handler functions defined outside component to avoid stale closures
async function handleOpenProject() {
  if (!window.electronAPI) return;
  const result = await window.electronAPI.openProject();
  if (result) {
    useCanvasStore.getState().loadProject(result.project);
  }
}

async function handleSaveProject() {
  if (!window.electronAPI) return;
  const project = useCanvasStore.getState().getProject();
  await window.electronAPI.saveProject(project);
}

async function handleSaveProjectAs() {
  if (!window.electronAPI) return;
  const project = useCanvasStore.getState().getProject();
  await window.electronAPI.saveProject(project, undefined);
}

async function handleExport() {
  if (!window.electronAPI) return;
  const { exportCanvas } = useCanvasStore.getState();
  const data = await exportCanvas();
  if (data) {
    await window.electronAPI.exportImage(data);
  }
}

const App: React.FC = () => {
  const { zoom, panX, panY, setZoom, setPan, undo, redo, selectAll, deselect, newProject } = useCanvasStore();
  const { activeTool, setActiveTool } = useToolStore();
  const { togglePanel } = useUIStore();

  // Initialize project on mount
  useEffect(() => {
    newProject();
  }, [newProject]);

  // Handle menu actions from main process
  const handleMenuAction = useCallback((action: string) => {
    switch (action) {
      case 'new':
        newProject();
        break;
      case 'open':
        handleOpenProject();
        break;
      case 'save':
        handleSaveProject();
        break;
      case 'save-as':
        handleSaveProjectAs();
        break;
      case 'export':
        handleExport();
        break;
      case 'undo':
        undo();
        break;
      case 'redo':
        redo();
        break;
      case 'select-all':
        selectAll();
        break;
      case 'deselect':
        deselect();
        break;
      case 'zoom-in':
        setZoom(Math.min(zoom * 1.25, 10));
        break;
      case 'zoom-out':
        setZoom(Math.max(zoom / 1.25, 0.1));
        break;
      case 'zoom-fit':
        setZoom(1);
        setPan(0, 0);
        break;
      case 'zoom-100':
        setZoom(1);
        break;
      case 'toggle-rulers':
        togglePanel('rulers');
        break;
      case 'toggle-grid':
        togglePanel('grid');
        break;
    }
  }, [newProject, undo, redo, selectAll, deselect, setZoom, setPan, togglePanel, zoom]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onMenuAction(handleMenuAction);
    }
  }, [handleMenuAction]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // Tool shortcuts
      if (!ctrl && !shift) {
        switch (key) {
          case 'v': setActiveTool('select'); break;
          case 'm': setActiveTool('marquee-rect'); break;
          case 'l': setActiveTool('lasso'); break;
          case 'w': setActiveTool('magic-wand'); break;
          case 'b': setActiveTool('brush'); break;
          case 'e': setActiveTool('eraser'); break;
          case 'p': setActiveTool('pen'); break;
          case 'u': setActiveTool('rect'); break;
          case 't': setActiveTool('text'); break;
          case 'g': setActiveTool('gradient'); break;
          case 'i': setActiveTool('eyedropper'); break;
          case 'h': setActiveTool('hand'); break;
          case 'z': setActiveTool('zoom'); break;
          case 'x': useToolStore.getState().swapColors(); break;
          case 'd': useToolStore.getState().resetColors(); break;
        }
      }

      // Ctrl shortcuts
      if (ctrl && !shift) {
        switch (key) {
          case 'z': e.preventDefault(); undo(); break;
          case 'a': e.preventDefault(); selectAll(); break;
          case 'd': e.preventDefault(); deselect(); break;
          case '0': e.preventDefault(); setZoom(1); setPan(0, 0); break;
          case '1': e.preventDefault(); setZoom(1); break;
          case '=': case '+': e.preventDefault(); setZoom(Math.min(zoom * 1.25, 10)); break;
          case '-': e.preventDefault(); setZoom(Math.max(zoom / 1.25, 0.1)); break;
        }
      }

      // Ctrl+Shift shortcuts
      if (ctrl && shift) {
        if (key === 'z') {
          e.preventDefault();
          redo();
        }
      }

      // Space for temporary hand tool
      if (key === ' ' && !e.repeat) {
        e.preventDefault();
        useToolStore.getState().setTemporaryTool('hand');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        useToolStore.getState().clearTemporaryTool();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [zoom, undo, redo, selectAll, deselect, setZoom, setPan, setActiveTool]);

  return (
    <div className="app">
      <MenuBar />
      <div className="main-content">
        <Toolbar />
        <div className="canvas-area">
          <Canvas />
        </div>
        <div className="right-panels">
          <PropertiesPanel />
          <ColorPanel />
          <HistoryPanel />
        </div>
      </div>
      <LayersPanel />
    </div>
  );
};

export default App;