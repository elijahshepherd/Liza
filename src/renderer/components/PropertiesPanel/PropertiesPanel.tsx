import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useToolStore } from '../../store/toolStore';

export const PropertiesPanel: React.FC = () => {
  const { canvas, selectedObjectIds, updateObject, setCanvasSize, setBackground } = useCanvasStore();
  const { toolOptions, setToolOption } = useToolStore();
  const { layers, activeLayerId } = useCanvasStore();
  
  const activeLayer = layers.find((l) => l.id === activeLayerId);
  const selectedObject = activeLayer?.objects.find((o) => selectedObjectIds.includes(o.id));
  
  return (
    <div className="properties-panel panel">
      <div className="panel-header">
        <span>Properties</span>
      </div>
      <div className="panel-content">
        {/* Canvas Properties */}
        <div className="property-group">
          <div className="property-group-title">Canvas</div>
          <div className="property-row">
            <label className="property-label">Width</label>
            <input
              type="number"
              className="property-input property-input-small"
              value={canvas.width}
              onChange={(e) => setCanvasSize(parseInt(e.target.value) || canvas.width, canvas.height)}
            />
          </div>
          <div className="property-row">
            <label className="property-label">Height</label>
            <input
              type="number"
              className="property-input property-input-small"
              value={canvas.height}
              onChange={(e) => setCanvasSize(canvas.width, parseInt(e.target.value) || canvas.height)}
            />
          </div>
          <div className="property-row">
            <label className="property-label">Background</label>
            <input
              type="color"
              className="property-input"
              value={canvas.background}
              onChange={(e) => setBackground(e.target.value)}
              style={{ padding: '2px 4px', width: '60px' }}
            />
          </div>
        </div>
        
        {/* Tool Options */}
        <div className="property-group">
          <div className="property-group-title">Tool Options</div>
          <div className="property-row">
            <label className="property-label">Size</label>
            <input
              type="range"
              className="slider"
              min="1"
              max="100"
              value={toolOptions.size}
              onChange={(e) => setToolOption('size', parseInt(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ width: '40px', textAlign: 'right', fontSize: '12px' }}>
              {toolOptions.size}px
            </span>
          </div>
          <div className="property-row">
            <label className="property-label">Opacity</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={toolOptions.opacity * 100}
              onChange={(e) => setToolOption('opacity', parseInt(e.target.value) / 100)}
              style={{ flex: 1 }}
            />
            <span style={{ width: '40px', textAlign: 'right', fontSize: '12px' }}>
              {Math.round(toolOptions.opacity * 100)}%
            </span>
          </div>
          <div className="property-row">
            <label className="property-label">Hardness</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={toolOptions.hardness * 100}
              onChange={(e) => setToolOption('hardness', parseInt(e.target.value) / 100)}
              style={{ flex: 1 }}
            />
            <span style={{ width: '40px', textAlign: 'right', fontSize: '12px' }}>
              {Math.round(toolOptions.hardness * 100)}%
            </span>
          </div>
        </div>
        
        {/* Selected Object Properties */}
        {selectedObject && (
          <div className="property-group">
            <div className="property-group-title">Object</div>
            <div className="property-row">
              <label className="property-label">X</label>
              <input
                type="number"
                className="property-input property-input-small"
                value={Math.round(selectedObject.x)}
                onChange={(e) => {
                  if (activeLayerId) {
                    updateObject(activeLayerId, selectedObject.id, { x: parseInt(e.target.value) || 0 });
                  }
                }}
              />
            </div>
            <div className="property-row">
              <label className="property-label">Y</label>
              <input
                type="number"
                className="property-input property-input-small"
                value={Math.round(selectedObject.y)}
                onChange={(e) => {
                  if (activeLayerId) {
                    updateObject(activeLayerId, selectedObject.id, { y: parseInt(e.target.value) || 0 });
                  }
                }}
              />
            </div>
            <div className="property-row">
              <label className="property-label">Width</label>
              <input
                type="number"
                className="property-input property-input-small"
                value={Math.round(selectedObject.width)}
                onChange={(e) => {
                  if (activeLayerId) {
                    updateObject(activeLayerId, selectedObject.id, { width: parseInt(e.target.value) || 1 });
                  }
                }}
              />
            </div>
            <div className="property-row">
              <label className="property-label">Height</label>
              <input
                type="number"
                className="property-input property-input-small"
                value={Math.round(selectedObject.height)}
                onChange={(e) => {
                  if (activeLayerId) {
                    updateObject(activeLayerId, selectedObject.id, { height: parseInt(e.target.value) || 1 });
                  }
                }}
              />
            </div>
            <div className="property-row">
              <label className="property-label">Rotation</label>
              <input
                type="number"
                className="property-input property-input-small"
                value={Math.round(selectedObject.rotation)}
                onChange={(e) => {
                  if (activeLayerId) {
                    updateObject(activeLayerId, selectedObject.id, { rotation: parseInt(e.target.value) || 0 });
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};