import { v4 as uuidv4 } from 'uuid';
import type { CanvasObject, RectObject, EllipseObject, TextObject, LineObject, PathObject } from '@shared/types';

// Factory functions for creating canvas objects
export function createRectObject(options: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}): RectObject {
  return {
    id: uuidv4(),
    type: 'rect',
    name: 'Rectangle',
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    blendMode: 'normal',
    fill: options.fill || '#cccccc',
    stroke: options.stroke || '#000000',
    strokeWidth: options.strokeWidth || 0,
    cornerRadius: options.cornerRadius || 0,
  };
}

export function createEllipseObject(options: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}): EllipseObject {
  return {
    id: uuidv4(),
    type: 'ellipse',
    name: 'Ellipse',
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    blendMode: 'normal',
    fill: options.fill || '#cccccc',
    stroke: options.stroke || '#000000',
    strokeWidth: options.strokeWidth || 0,
  };
}

export function createTextObject(options: {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
}): TextObject {
  return {
    id: uuidv4(),
    type: 'text',
    name: 'Text',
    x: options.x,
    y: options.y,
    width: 200,
    height: options.fontSize || 24,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    blendMode: 'normal',
    text: options.text,
    fontSize: options.fontSize || 24,
    fontFamily: options.fontFamily || 'Arial',
    fontStyle: 'normal',
    fill: options.fill || '#000000',
    align: 'left',
  };
}

export function createLineObject(options: {
  points: number[];
  stroke?: string;
  strokeWidth?: number;
}): LineObject {
  const minX = Math.min(...options.points.filter((_, i) => i % 2 === 0));
  const minY = Math.min(...options.points.filter((_, i) => i % 2 === 1));
  const maxX = Math.max(...options.points.filter((_, i) => i % 2 === 0));
  const maxY = Math.max(...options.points.filter((_, i) => i % 2 === 1));
  
  return {
    id: uuidv4(),
    type: 'line',
    name: 'Line',
    x: minX,
    y: minY,
    width: maxX - minX || 1,
    height: maxY - minY || 1,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    blendMode: 'normal',
    points: options.points,
    stroke: options.stroke || '#000000',
    strokeWidth: options.strokeWidth || 2,
  };
}

// Color utilities
export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

export function rgbaToHex(rgba: string): string {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  return '#' + [match[1], match[2], match[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
}

// Math utilities
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Point utilities
export function getPointOnLine(
  x1: number, y1: number,
  x2: number, y2: number,
  t: number
): { x: number; y: number } {
  return {
    x: lerp(x1, x2, t),
    y: lerp(y1, y2, t),
  };
}

// Bezier utilities
export function cubicBezier(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

// Rectangle utilities
export function rectContainsPoint(
  rect: { x: number; y: number; width: number; height: number },
  point: { x: number; y: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function rectsIntersect(
  r1: { x: number; y: number; width: number; height: number },
  r2: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}