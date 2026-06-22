import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Ellipse, Line, Text, Transformer, Group } from 'react-konva';
import { useCanvasStore } from '../../store/canvasStore';
import { useToolStore } from '../../store/toolStore';
import type { CanvasObject, RectObject, EllipseObject, TextObject, LineObject } from '@shared/types';
import Konva from 'konva';

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  
  const {
    canvas,
    layers,
    activeLayerId,
    selectedObjectIds,
    setZoom,
    setPan,
    selectObjects,
    deselectAll,
    updateObject,
    getActiveLayer,
  } = useCanvasStore();
  
  const { activeTool, temporaryTool, toolOptions, foregroundColor } = useToolStore();
  
  const currentTool = temporaryTool || activeTool;
  
  // Handle container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    
    const nodes = selectedObjectIds
      .map((id) => stageRef.current?.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];
    
    transformerRef.current.nodes(nodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedObjectIds]);
  
  // Handle stage click for deselection
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      deselectAll();
    }
  }, [deselectAll]);
  
  // Handle object selection
  const handleObjectClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>, objectId: string) => {
    e.cancelBubble = true;
    const layer = getActiveLayer();
    if (!layer) return;
    
    if (e.evt.shiftKey) {
      // Add to selection
      if (selectedObjectIds.includes(objectId)) {
        selectObjects(selectedObjectIds.filter((id) => id !== objectId));
      } else {
        selectObjects([...selectedObjectIds, objectId]);
      }
    } else {
      selectObjects([objectId]);
    }
  }, [selectedObjectIds, selectObjects, getActiveLayer]);
  
  // Handle object drag
  const handleObjectDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
    const layer = getActiveLayer();
    if (!layer) return;
    
    updateObject(layer.id, objectId, {
      x: e.target.x(),
      y: e.target.y(),
    });
  }, [getActiveLayer, updateObject]);
  
  // Handle transform end
  const handleTransformEnd = useCallback((e: Konva.KonvaEventObject<Event>, objectId: string) => {
    const layer = getActiveLayer();
    if (!layer) return;
    
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale and apply to width/height
    node.scaleX(1);
    node.scaleY(1);
    
    updateObject(layer.id, objectId, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  }, [getActiveLayer, updateObject]);
  
  // Handle wheel for zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = canvas.zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    const mousePointTo = {
      x: (pointer.x - canvas.panX) / oldScale,
      y: (pointer.y - canvas.panY) / oldScale,
    };
    
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
    const clampedScale = Math.max(0.1, Math.min(10, newScale));
    
    setZoom(clampedScale);
    setPan(
      pointer.x - mousePointTo.x * clampedScale,
      pointer.y - mousePointTo.y * clampedScale
    );
  }, [canvas.zoom, canvas.panX, canvas.panY, setZoom, setPan]);
  
  // Render object based on type
  const renderObject = (obj: CanvasObject) => {
    const isSelected = selectedObjectIds.includes(obj.id);
    const layer = layers.find((l) => l.objects.some((o) => o.id === obj.id));
    const isLocked = layer?.locked || obj.locked;
    
    const commonProps = {
      id: obj.id,
      x: obj.x,
      y: obj.y,
      rotation: obj.rotation,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      opacity: obj.opacity,
      visible: obj.visible,
      draggable: !isLocked && currentTool === 'select',
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => handleObjectClick(e, obj.id),
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => handleObjectDragEnd(e, obj.id),
      onTransformEnd: (e: Konva.KonvaEventObject<Event>) => handleTransformEnd(e, obj.id),
    };
    
    switch (obj.type) {
      case 'rect': {
        const rectObj = obj as RectObject;
        return (
          <Rect
            key={obj.id}
            {...commonProps}
            width={obj.width}
            height={obj.height}
            fill={rectObj.fill}
            stroke={rectObj.stroke}
            strokeWidth={rectObj.strokeWidth}
            cornerRadius={rectObj.cornerRadius}
          />
        );
      }
      case 'ellipse': {
        const ellipseObj = obj as EllipseObject;
        return (
          <Ellipse
            key={obj.id}
            {...commonProps}
            radiusX={obj.width / 2}
            radiusY={obj.height / 2}
            fill={ellipseObj.fill}
            stroke={ellipseObj.stroke}
            strokeWidth={ellipseObj.strokeWidth}
          />
        );
      }
      case 'line': {
        const lineObj = obj as LineObject;
        return (
          <Line
            key={obj.id}
            {...commonProps}
            points={lineObj.points}
            stroke={lineObj.stroke}
            strokeWidth={lineObj.strokeWidth}
          />
        );
      }
      case 'text': {
        const textObj = obj as TextObject;
        return (
          <Text
            key={obj.id}
            {...commonProps}
            text={textObj.text}
            fontSize={textObj.fontSize}
            fontFamily={textObj.fontFamily}
            fill={textObj.fill}
            align={textObj.align}
            width={obj.width}
          />
        );
      }
      default:
        return null;
    }
  };
  
  // Calculate stage position and scale
  const stageX = canvas.panX + (containerSize.width - canvas.width * canvas.zoom) / 2;
  const stageY = canvas.panY + (containerSize.height - canvas.height * canvas.zoom) / 2;
  
  return (
    <div ref={containerRef} className="canvas-container">
      <div className="canvas-wrapper">
        <Stage
          ref={stageRef}
          width={containerSize.width}
          height={containerSize.height}
          onClick={handleStageClick}
          onWheel={handleWheel}
          scaleX={canvas.zoom}
          scaleY={canvas.zoom}
          x={stageX}
          y={stageY}
          className="canvas-stage"
        >
          {/* Background layer */}
          <Layer>
            <Rect
              x={0}
              y={0}
              width={canvas.width}
              height={canvas.height}
              fill={canvas.background}
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={10}
              shadowOffset={{ x: 0, y: 4 }}
            />
          </Layer>
          
          {/* Content layers */}
          {layers.filter((l) => l.visible).map((layer) => (
            <Layer
              key={layer.id}
              opacity={layer.opacity}
              visible={layer.visible}
            >
              {layer.objects.map((obj) => renderObject(obj))}
            </Layer>
          ))}
          
          {/* Transformer for selected objects */}
          <Layer>
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              anchorFill="#0078d4"
              anchorStroke="#ffffff"
              anchorSize={8}
              anchorCornerRadius={2}
              borderStroke="#0078d4"
              borderStrokeWidth={1}
            />
          </Layer>
        </Stage>
      </div>
      
      {/* Zoom indicator */}
      <div className="zoom-indicator">
        {Math.round(canvas.zoom * 100)}%
      </div>
    </div>
  );
};