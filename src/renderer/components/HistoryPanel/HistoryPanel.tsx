import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Undo2, Redo2, Clock } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { history, historyIndex, undo, redo } = useCanvasStore();
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  return (
    <div className="history-panel panel">
      <div className="panel-header">
        <span>History</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="btn btn-icon"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            className="btn btn-icon"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>
      <div className="history-list">
        {history.length === 0 ? (
          <div style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
            No history yet
          </div>
        ) : (
          history.map((state, index) => {
            const isCurrent = index === historyIndex;
            const isFuture = index > historyIndex;
            
            return (
              <div
                key={state.timestamp}
                className={`history-item ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}
                onClick={() => {
                  // Jump to this history state
                  const store = useCanvasStore.getState();
                  while (store.historyIndex < index) {
                    store.redo();
                  }
                  while (store.historyIndex > index) {
                    store.undo();
                  }
                }}
              >
                <Clock size={14} className="history-icon" />
                <span>
                  {index === 0 ? 'Initial State' : `State ${index}`}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};