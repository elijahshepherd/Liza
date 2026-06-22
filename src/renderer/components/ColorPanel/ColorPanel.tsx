import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useToolStore } from '../../store/toolStore';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';

export const ColorPanel: React.FC = () => {
  const {
    foregroundColor,
    backgroundColor,
    setForegroundColor,
    setBackgroundColor,
    swapColors,
    resetColors,
  } = useToolStore();
  
  const [showPicker, setShowPicker] = useState<'fg' | 'bg' | null>(null);
  const [pickerColor, setPickerColor] = useState(foregroundColor);
  
  const handleColorClick = (type: 'fg' | 'bg') => {
    setPickerColor(type === 'fg' ? foregroundColor : backgroundColor);
    setShowPicker(showPicker === type ? null : type);
  };
  
  const handleColorChange = (color: string) => {
    setPickerColor(color);
    if (showPicker === 'fg') {
      setForegroundColor(color);
    } else if (showPicker === 'bg') {
      setBackgroundColor(color);
    }
  };
  
  return (
    <div className="color-panel panel">
      <div className="panel-header">
        <span>Color</span>
      </div>
      <div className="panel-content">
        {/* Color preview */}
        <div className="color-preview">
          <div className="color-fg-bg">
            <div
              className={`color-swatch ${showPicker === 'fg' ? 'active' : ''}`}
              style={{ backgroundColor: foregroundColor }}
              onClick={() => handleColorClick('fg')}
              title="Foreground Color"
            />
            <div
              className={`color-swatch ${showPicker === 'bg' ? 'active' : ''}`}
              style={{ backgroundColor: backgroundColor }}
              onClick={() => handleColorClick('bg')}
              title="Background Color"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              className="btn btn-icon"
              onClick={swapColors}
              title="Swap Colors (X)"
            >
              <ArrowLeftRight size={14} />
            </button>
            <button
              className="btn btn-icon"
              onClick={resetColors}
              title="Reset Colors (D)"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
        
        {/* Color picker popup */}
        {showPicker && (
          <div className="color-picker-popup">
            <HexColorPicker color={pickerColor} onChange={handleColorChange} />
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="color-input"
                value={pickerColor}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
        
        {/* Color values */}
        <div className="color-values">
          <div className="color-input-group">
            <div className="color-input-label">Foreground</div>
            <input
              type="text"
              className="color-input"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
            />
          </div>
          <div className="color-input-group">
            <div className="color-input-label">Background</div>
            <input
              type="text"
              className="color-input"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
        </div>
        
        {/* Quick colors */}
        <div className="property-group">
          <div className="property-group-title">Quick Colors</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
            {[
              '#000000', '#ffffff', '#ff0000', '#00ff00',
              '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
              '#808080', '#c0c0c0', '#800000', '#008000',
              '#000080', '#808000', '#800080', '#008080',
            ].map((color) => (
              <div
                key={color}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
                onClick={() => setForegroundColor(color)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setBackgroundColor(color);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};