import React from 'react';
import { useToolStore } from '../../store/toolStore';
import type { ToolType } from '@shared/types';
import {
  MousePointer2,
  Move,
  Square,
  Circle,
  Lasso,
  Wand2,
  Brush,
  Eraser,
  Type,
  Pen,
  Hand,
  ZoomIn,
  Pipette,
  Minus,
  Hexagon,
  Star,
  Droplet,
  Clipboard,
} from 'lucide-react';

interface ToolConfig {
  id: ToolType;
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  shortcut: string;
  group: string;
}

const tools: ToolConfig[] = [
  // Selection
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V', group: 'selection' },
  { id: 'move', icon: Move, label: 'Move', shortcut: 'V', group: 'selection' },
  
  // Marquee
  { id: 'marquee-rect', icon: Square, label: 'Marquee Select', shortcut: 'M', group: 'selection' },
  
  // Lasso
  { id: 'lasso', icon: Lasso, label: 'Lasso', shortcut: 'L', group: 'selection' },
  
  // Magic Wand
  { id: 'magic-wand', icon: Wand2, label: 'Magic Wand', shortcut: 'W', group: 'selection' },
  
  // Drawing
  { id: 'brush', icon: Brush, label: 'Brush', shortcut: 'B', group: 'drawing' },
  { id: 'pencil', icon: Clipboard, label: 'Pencil', shortcut: 'N', group: 'drawing' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E', group: 'drawing' },
  
  // Shapes
  { id: 'rect', icon: Square, label: 'Rectangle', shortcut: 'U', group: 'shapes' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse', shortcut: 'U', group: 'shapes' },
  { id: 'line', icon: Minus, label: 'Line', shortcut: 'U', group: 'shapes' },
  { id: 'polygon', icon: Hexagon, label: 'Polygon', shortcut: 'U', group: 'shapes' },
  { id: 'star', icon: Star, label: 'Star', shortcut: 'U', group: 'shapes' },
  
  // Pen
  { id: 'pen', icon: Pen, label: 'Pen', shortcut: 'P', group: 'vector' },
  { id: 'freeform-pen', icon: Pen, label: 'Freeform Pen', shortcut: 'P', group: 'vector' },
  
  // Text
  { id: 'text', icon: Type, label: 'Text', shortcut: 'T', group: 'text' },
  
  // Navigation
  { id: 'hand', icon: Hand, label: 'Hand', shortcut: 'H', group: 'navigation' },
  { id: 'zoom', icon: ZoomIn, label: 'Zoom', shortcut: 'Z', group: 'navigation' },
  
  // Color
  { id: 'eyedropper', icon: Pipette, label: 'Eyedropper', shortcut: 'I', group: 'color' },
  { id: 'gradient', icon: Droplet, label: 'Gradient', shortcut: 'G', group: 'color' },
];

const groups = [
  { id: 'selection', label: 'Selection' },
  { id: 'drawing', label: 'Drawing' },
  { id: 'shapes', label: 'Shapes' },
  { id: 'vector', label: 'Vector' },
  { id: 'text', label: 'Text' },
  { id: 'navigation', label: 'Navigate' },
  { id: 'color', label: 'Color' },
];

export const Toolbar: React.FC = () => {
  const { activeTool, temporaryTool, setActiveTool } = useToolStore();
  const currentTool = temporaryTool || activeTool;
  
  return (
    <div className="toolbar">
      {groups.map((group) => {
        const groupTools = tools.filter((t) => t.group === group.id);
        if (groupTools.length === 0) return null;
        
        return (
          <div key={group.id} className="tool-group">
            {groupTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentTool === tool.id;
              
              return (
                <button
                  key={tool.id}
                  className={`tool-button ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTool(tool.id)}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon size={20} />
                  <span className="tool-tooltip">
                    {tool.label}
                    <span className="tool-shortcut">{tool.shortcut}</span>
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};