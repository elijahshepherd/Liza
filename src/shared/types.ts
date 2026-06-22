// Shared types for Liza Editor

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

// Canvas object types
export type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' 
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
  | 'hard-light' | 'soft-light' | 'difference' | 'exclusion'
  | 'hue' | 'saturation' | 'color' | 'luminosity';

export type ObjectType = 'rect' | 'ellipse' | 'line' | 'path' | 'text' | 'image' | 'group';

export interface BaseObject {
  id: string;
  type: ObjectType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  blendMode: BlendMode;
}

export interface RectObject extends BaseObject {
  type: 'rect';
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface EllipseObject extends BaseObject {
  type: 'ellipse';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface LineObject extends BaseObject {
  type: 'line';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface PathObject extends BaseObject {
  type: 'path';
  data: string; // SVG path data
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface TextObject extends BaseObject {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  fill: string;
  align: 'left' | 'center' | 'right';
}

export interface ImageObject extends BaseObject {
  type: 'image';
  src: string;
  originalWidth: number;
  originalHeight: number;
}

export type CanvasObject = RectObject | EllipseObject | LineObject | PathObject | TextObject | ImageObject;

// Layer types
export type LayerType = 'raster' | 'vector' | 'text' | 'group' | 'adjustment';

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  objects: CanvasObject[];
  children?: string[]; // For groups
  parentId?: string; // For nested layers
}

// Canvas state
export interface CanvasState {
  width: number;
  height: number;
  background: string;
  zoom: number;
  panX: number;
  panY: number;
}

// Project file format
export interface LizaProject {
  version: string;
  metadata: {
    name: string;
    created: string;
    modified: string;
  };
  canvas: CanvasState;
  layers: Layer[];
  settings: ProjectSettings;
}

export interface ProjectSettings {
  snapToGrid: boolean;
  gridSize: number;
  rulersVisible: boolean;
  showGrid: boolean;
}

// Tool types
export type ToolType = 
  | 'select' | 'move'
  | 'marquee-rect' | 'marquee-ellipse' | 'lasso' | 'lasso-polygon' | 'magic-wand'
  | 'brush' | 'pencil' | 'eraser' | 'clone-stamp' | 'healing-brush'
  | 'rect' | 'ellipse' | 'line' | 'polygon' | 'star' | 'pen' | 'freeform-pen'
  | 'text' | 'text-vertical'
  | 'hand' | 'zoom'
  | 'eyedropper' | 'fill' | 'gradient';

export interface ToolOptions {
  size: number;
  opacity: number;
  hardness: number;
  spacing: number;
  color: string;
  strokeWidth: number;
  fill: string;
  fontSize: number;
  fontFamily: string;
}

// History
export interface HistoryState {
  layers: Layer[];
  canvas: CanvasState;
  timestamp: number;
}

// Selection
export interface Selection {
  objectIds: string[];
  layerId: string;
  bounds: Rect | null;
}

// Color
export interface ColorRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

// IPC types
export interface IpcApi {
  openFile: () => Promise<{ path: string; data: ArrayBuffer } | null>;
  saveFile: (data: ArrayBuffer, path: string) => Promise<boolean>;
  saveProject: (project: LizaProject, path: string) => Promise<boolean>;
  openProject: () => Promise<{ path: string; project: LizaProject } | null>;
  exportImage: (data: ArrayBuffer, path: string, format: string) => Promise<boolean>;
  processImage: (data: ArrayBuffer, options: ImageProcessOptions) => Promise<ArrayBuffer>;
  getAppVersion: () => Promise<string>;
  onMenuAction: (callback: (action: string) => void) => void;
}

export interface ImageProcessOptions {
  width?: number;
  height?: number;
  format?: 'png' | 'jpg' | 'webp';
  quality?: number;
  blur?: number;
  sharpen?: number;
}

declare global {
  interface Window {
    electronAPI: IpcApi;
  }
}