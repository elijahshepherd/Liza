import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Eye, EyeOff, Lock, Unlock, Copy, Trash2, Plus } from 'lucide-react';

export const LayersPanel: React.FC = () => {
  const {
    layers,
    activeLayerId,
    selectLayer,
    addLayer,
    removeLayer,
    duplicateLayer,
    toggleLayerVisibility,
    toggleLayerLock,
  } = useCanvasStore();
  
  return (
    <div className="layers-panel panel">
      <div className="panel-header" onClick={() => useCanvasStore.getState()}>
        <span>Layers</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn btn-icon" onClick={() => addLayer()} title="New Layer">
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="layers-list">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className={`layer-item ${layer.id === activeLayerId ? 'selected' : ''}`}
            onClick={() => selectLayer(layer.id)}
          >
            <div
              className={`layer-visibility ${!layer.visible ? 'hidden' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerVisibility(layer.id);
              }}
            >
              {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </div>
            <div className="layer-thumb" />
            <span className="layer-name">{layer.name}</span>
            <div
              className="layer-visibility"
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerLock(layer.id);
              }}
              style={{ marginLeft: 'auto' }}
            >
              {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
            </div>
            <div className="layer-actions">
              <button
                className="btn btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateLayer(layer.id);
                }}
                title="Duplicate Layer"
              >
                <Copy size={12} />
              </button>
              <button
                className="btn btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeLayer(layer.id);
                }}
                title="Delete Layer"
                disabled={layers.length <= 1}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};