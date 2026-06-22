import type { ToolType, ToolOptions } from '@shared/types';

export interface Tool {
  id: ToolType;
  name: string;
  cursor: string;
  icon: string;
  
  // Tool behavior
  isDrawingTool: boolean;
  isShapeTool: boolean;
  isSelectionTool: boolean;
  
  // Default options
  defaultOptions: Partial<ToolOptions>;
  
  // Event handlers
  onMouseDown?: (e: ToolEvent) => void;
  onMouseMove?: (e: ToolEvent) => void;
  onMouseUp?: (e: ToolEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
}

export interface ToolEvent {
  x: number;
  y: number;
  pressure: number;
  tiltX: number;
  tiltY: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

// Tool definitions
export const tools: Record<ToolType, Tool> = {
  select: {
    id: 'select',
    name: 'Select',
    cursor: 'default',
    icon: 'mouse-pointer',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: true,
    defaultOptions: {},
  },
  
  move: {
    id: 'move',
    name: 'Move',
    cursor: 'move',
    icon: 'move',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: {},
  },
  
  'marquee-rect': {
    id: 'marquee-rect',
    name: 'Marquee Select',
    cursor: 'crosshair',
    icon: 'square',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: true,
    defaultOptions: {},
  },
  
  'marquee-ellipse': {
    id: 'marquee-ellipse',
    name: 'Elliptical Marquee',
    cursor: 'crosshair',
    icon: 'circle',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: true,
    defaultOptions: {},
  },
  
  lasso: {
    id: 'lasso',
    name: 'Lasso',
    cursor: 'crosshair',
    icon: 'lasso',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: true,
    defaultOptions: {},
  },
  
  'lasso-polygon': {
    id: 'lasso-polygon',
    name: 'Polygonal Lasso',
    cursor: 'crosshair',
    icon: 'lasso',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: true,
    defaultOptions: {},
  },
  
  'magic-wand': {
    id: 'magic-wand',
    name: 'Magic Wand',
    cursor: 'crosshair',
    icon: 'wand',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: true,
    defaultOptions: { size: 10 },
  },
  
  brush: {
    id: 'brush',
    name: 'Brush',
    cursor: 'crosshair',
    icon: 'brush',
    isDrawingTool: true,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { size: 10, opacity: 1, hardness: 1, spacing: 0.1 },
  },
  
  pencil: {
    id: 'pencil',
    name: 'Pencil',
    cursor: 'crosshair',
    icon: 'pencil',
    isDrawingTool: true,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { size: 2, opacity: 1, hardness: 1, spacing: 0.1 },
  },
  
  eraser: {
    id: 'eraser',
    name: 'Eraser',
    cursor: 'crosshair',
    icon: 'eraser',
    isDrawingTool: true,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { size: 20, opacity: 1, hardness: 1 },
  },
  
  'clone-stamp': {
    id: 'clone-stamp',
    name: 'Clone Stamp',
    cursor: 'crosshair',
    icon: 'stamp',
    isDrawingTool: true,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { size: 20, opacity: 1 },
  },
  
  'healing-brush': {
    id: 'healing-brush',
    name: 'Healing Brush',
    cursor: 'crosshair',
    icon: 'healing',
    isDrawingTool: true,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { size: 20, opacity: 1 },
  },
  
  rect: {
    id: 'rect',
    name: 'Rectangle',
    cursor: 'crosshair',
    icon: 'square',
    isDrawingTool: false,
    isShapeTool: true,
    isSelectionTool: false,
    defaultOptions: { fill: '#cccccc', stroke: '#000000', strokeWidth: 0 },
  },
  
  ellipse: {
    id: 'ellipse',
    name: 'Ellipse',
    cursor: 'crosshair',
    icon: 'circle',
    isDrawingTool: false,
    isShapeTool: true,
    isSelectionTool: false,
    defaultOptions: { fill: '#cccccc', stroke: '#000000', strokeWidth: 0 },
  },
  
  line: {
    id: 'line',
    name: 'Line',
    cursor: 'crosshair',
    icon: 'minus',
    isDrawingTool: false,
    isShapeTool: true,
    isSelectionTool: false,
    defaultOptions: { stroke: '#000000', strokeWidth: 2 },
  },
  
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    cursor: 'crosshair',
    icon: 'hexagon',
    isDrawingTool: false,
    isShapeTool: true,
    isSelectionTool: false,
    defaultOptions: { fill: '#cccccc', stroke: '#000000', strokeWidth: 0 },
  },
  
  star: {
    id: 'star',
    name: 'Star',
    cursor: 'crosshair',
    icon: 'star',
    isDrawingTool: false,
    isShapeTool: true,
    isSelectionTool: false,
    defaultOptions: { fill: '#cccccc', stroke: '#000000', strokeWidth: 0 },
  },
  
  pen: {
    id: 'pen',
    name: 'Pen',
    cursor: 'crosshair',
    icon: 'pen',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: {},
  },
  
  'freeform-pen': {
    id: 'freeform-pen',
    name: 'Freeform Pen',
    cursor: 'crosshair',
    icon: 'pen',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: {},
  },
  
  text: {
    id: 'text',
    name: 'Text',
    cursor: 'text',
    icon: 'type',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { fontSize: 24, fontFamily: 'Arial', fill: '#000000' },
  },
  
  'text-vertical': {
    id: 'text-vertical',
    name: 'Vertical Text',
    cursor: 'text',
    icon: 'type',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { fontSize: 24, fontFamily: 'Arial', fill: '#000000' },
  },
  
  hand: {
    id: 'hand',
    name: 'Hand',
    cursor: 'grab',
    icon: 'hand',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: {},
  },
  
  zoom: {
    id: 'zoom',
    name: 'Zoom',
    cursor: 'zoom-in',
    icon: 'zoom-in',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: { size: 10 },
  },
  
  eyedropper: {
    id: 'eyedropper',
    name: 'Eyedropper',
    cursor: 'crosshair',
    icon: 'pipette',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: {},
  },
  
  fill: {
    id: 'fill',
    name: 'Fill',
    cursor: 'crosshair',
    icon: 'droplet',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: {},
  },
  
  gradient: {
    id: 'gradient',
    name: 'Gradient',
    cursor: 'crosshair',
    icon: 'gradient',
    isDrawingTool: false,
    isShapeTool: false,
    isSelectionTool: false,
    defaultOptions: {},
  },
};

export function getTool(id: ToolType): Tool {
  return tools[id];
}

export function getToolCursor(id: ToolType): string {
  return tools[id]?.cursor || 'default';
}