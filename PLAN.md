# Liza Editor Version 0.1 - Comprehensive Development Plan

> **Status:** Planning Complete - Awaiting Go-Ahead
> **Created:** 2026-06-22

---

## Executive Summary

Liza Editor is a professional-grade graphic design application built with Electron + React. Version 0.1 focuses on establishing the core architecture, essential tools, and fundamental features that make a design app functional. The app aims to be **extremely easy to use** while providing **hundreds of tools** more than professional editors.

**Tech Stack:**
- **Framework:** Electron (desktop)
- **UI:** React + TypeScript
- **Canvas:** Konva.js (react-konva) for 2D canvas rendering
- **State:** Zustand with immer middleware
- **Image Processing:** Sharp (main process) + Canvas API (renderer)
- **Build:** electron-builder, Vite

---

## 1. Architecture Overview

### 1.1 Project Structure

```
Liza/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts             # Entry point
│   │   ├── ipc/                 # IPC handlers
│   │   │   ├── fileHandlers.ts  # File open/save
│   │   │   └── imageProcessor.ts# Sharp-based processing
│   │   ├── menu.ts              # Application menu
│   │   └── window.ts            # Window management
│   ├── preload/                 # Preload scripts (context bridge)
│   │   └── index.ts
│   ├── renderer/                # React application
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Canvas/          # Main canvas area
│   │   │   ├── Toolbar/         # Left tool panel
│   │   │   ├── LayersPanel/     # Layer management
│   │   │   ├── PropertiesPanel/  # Object properties
│   │   │   ├── ColorPanel/      # Color picker
│   │   │   ├── HistoryPanel/    # Undo/redo
│   │   │   └── MenuBar/         # Top menu
│   │   ├── store/               # Zustand stores
│   │   │   ├── canvasStore.ts   # Canvas state
│   │   │   ├── toolStore.ts     # Active tool state
│   │   │   └── uiStore.ts       # UI state (panels)
│   │   ├── tools/               # Tool implementations
│   │   │   ├── SelectionTool.ts
│   │   │   ├── BrushTool.ts
│   │   │   ├── ShapeTool.ts
│   │   │   ├── TextTool.ts
│   │   │   ├── TransformTool.ts
│   │   │   └── ... (100+ tools)
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils/               # Utilities
│   └── shared/                   # Shared types
│       └── types.ts
├── electron-builder.yml
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 1.2 Core Systems Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React UI Layer                         │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐ │
│  │ Toolbar │ │  Layers  │ │ Properties│ │ Color Picker  │ │
│  └─────────┘ └──────────┘ └───────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    State Management (Zustand)               │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Canvas   │ │   Tool    │ │   UI     │ │  History   │  │
│  │  Store   │ │   Store   │ │  Store   │ │   Store    │  │
│  └──────────┘ └───────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Canvas Rendering (Konva)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Stage → Layer → Objects (shapes, images, groups)   │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Tool System                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BaseTool → Selection | Brush | Shape | Text | etc.  │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    IPC Bridge (Electron)                    │
├─────────────────────────────────────────────────────────────┤
│                    Main Process Services                    │
│  ┌────────────┐ ┌───────────────┐ ┌───────────────────┐  │
│  │File System │ │Image Processing│ │ Window Management │  │
│  │  (Sharp)   │ │   (Sharp)     │ │                   │  │
│  └────────────┘ └───────────────┘ └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Feature Inventory (Version 0.1)

### 2.1 Selection Tools (15+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| Move Tool | V | Move objects, layers |
| Marquee Select (Rect) | M | Rectangular selection |
| Marquee Select (Ellipse) | M (hold) | Elliptical selection |
| Lasso Select (Freehand) | L | Freeform selection |
| Lasso Select (Polygonal) | L (hold) | Straight-edge selection |
| Magic Wand | W | Color-based selection |
| Quick Selection | W (hold) | AI-assisted selection |
| Select All | Ctrl+A | Select entire canvas |
| Deselect | Ctrl+D | Clear selection |
| Inverse Select | Ctrl+Shift+I | Invert selection |
| Refine Edge | Ctrl+Alt+R | Refine selection boundaries |
| Transform Selection | Ctrl+T | Transform selection marquee |
| Selection Brush | Shift+B | Paint to add to selection |
| Selection Grow | - | Expand selection by color |
| Selection Similar | - | Select matching colors |

### 2.2 Drawing & Painting Tools (20+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| Paintbrush | B | Standard brush |
| Airbrush | A | Soft gradient brush |
| Pencil | N | Hard-edge brush |
| Eraser | E | Standard eraser |
| Background Eraser | E (hold) | Erase to transparency |
| Magic Eraser | E (hold) | Erase similar colors |
| Clone Stamp | S | Clone from source |
| Healing Brush | J | Content-aware repair |
| Pattern Stamp | Shift+S | Paint with pattern |
| Color Replacement | Shift+C | Replace specific colors |
| Mixer Brush | Shift+X | Wet paint blending |
| History Brush | Shift+H | Paint from history |
| Art Brush | - | Brush with vector paths |
| Calligraphic Brush | - | Angle-based strokes |
| Watercolor Brush | - | Soft wet-edge effect |
| Charcoal Brush | - | Natural texture |
| Ink Brush | - | Pen-like strokes |
| Marker Brush | - | Flat color strokes |
| Custom Brush | - | User-defined brush |

### 2.3 Shape & Vector Tools (25+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| Rectangle | U | Standard rectangle |
| Rounded Rectangle | U (hold) | Rectangle with radius |
| Ellipse | U (hold) | Ellipse/circle |
| Polygon | U (hold) | Multi-sided polygon |
| Star | U (hold) | Star shapes |
| Line | U (hold) | Straight lines |
| Arrow | Shift+A | Lines with arrows |
| Custom Shape | Shift+U | Preset shapes |
| Pen Tool | P | Bezier path creation |
| Freeform Pen | P (hold) | Freehand path |
| Add Anchor Point | = | Add path point |
| Delete Anchor Point | - | Remove path point |
| Convert Anchor Point | Shift+C | Convert point type |
| Path Selection | A | Select entire path |
| Direct Selection | A (hold) | Select individual points |
| Path Boolean (Unite) | - | Combine shapes |
| Path Boolean (Minus) | - | Subtract shapes |
| Path Boolean (Intersect) | - | Keep overlap |
| Path Boolean (Exclude) | - | Remove overlap |
| Outline Stroke | - | Convert stroke to fill |
| Offset Path | - | Create parallel path |
| Simplify Path | - | Reduce anchor points |
| Smooth Path | - | Reduce sharp angles |
| Vector Crop Mask | - | Vector-based masking |

### 2.4 Text Tools (12+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| Horizontal Text | T | Standard text |
| Vertical Text | Shift+T | Top-to-bottom text |
| Text on Path | - | Text following path |
| Text Mask | - | Text as mask |
| Font Family | - | Select font |
| Font Size | - | Size adjustment |
| Font Weight | - | Bold/light |
| Letter Spacing | Alt+←/→ | Tracking |
| Line Spacing | Alt+↑/↓ | Leading |
| Text Align | - | Left/Center/Right/Justify |
| Text Transform | - | Upper/Lower/Title case |
| Warp Text | - | Arc, wave, bulge |

### 2.5 Transform Tools (10+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| Move | V | Reposition |
| Scale | Ctrl+T | Resize |
| Rotate | R | Rotate object |
| Skew | - | Slant transformation |
| Flip Horizontal | Shift+F | Mirror left-right |
| Flip Vertical | Shift+F (hold) | Mirror top-bottom |
| Perspective | - | Apply perspective |
| Warp | Ctrl+Shift+W | Custom distortion |
| Free Transform | Ctrl+T | Combined transforms |
| Puppet Warp | - | Point-based deformation |

### 2.6 Navigation Tools (8+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| Hand | H / Space | Pan canvas |
| Zoom In | Ctrl++ | Increase magnification |
| Zoom Out | Ctrl+- | Decrease magnification |
| Zoom to Fit | Ctrl+0 | Fit canvas to view |
| Actual Pixels | Ctrl+1 | 100% zoom |
| Navigator | - | Overview panel |
| Rulers | Ctrl+R | Show/hide rulers |
| Grid | Ctrl+' | Show/hide grid |

### 2.7 Color Tools (15+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| Foreground Color | - | Primary color |
| Background Color | - | Secondary color |
| Swap Colors | X | Swap fg/bg |
| Default Colors | D | Reset to black/white |
| Eyedropper | I | Sample color |
| Color Picker | - | Full color selector |
| Swatches | - | Saved colors |
| Gradients | G | Gradient editor |
| Color Balance | - | Shadow/Mid/Highlight tint |
| Hue/Saturation | - | Color adjustment |
| Match Color | - | Match between images |
| Replace Color | - | Target and replace |
| Gradient Map | - | Map to gradient |
| Posterize | - | Reduce color levels |
| Invert | Ctrl+I | Invert colors |

### 2.8 Layer Tools (20+ tools)

| Tool | Shortcut | Description |
|------|----------|-------------|
| New Layer | Ctrl+Shift+N | Create layer |
| Duplicate Layer | Ctrl+J | Copy layer |
| Delete Layer | - | Remove layer |
| Merge Down | Ctrl+E | Merge with below |
| Merge Visible | Ctrl+Shift+E | Merge all visible |
| Flatten Image | - | Flatten all layers |
| Group Layers | Ctrl+G | Create group |
| Ungroup | Ctrl+Shift+G | Dissolve group |
| Lock Layer | / | Prevent editing |
| Hide/Show Layer | - | Toggle visibility |
| Layer Opacity | - | Adjust opacity |
| Layer Blend Mode | - | Change blending |
| Create Clipping Mask | Ctrl+Alt+G | Clip to below |
| Layer Style | - | Drop shadow, glow, etc. |
| Layer Mask | - | Add raster mask |
| Vector Mask | - | Add path mask |
| Enable Layer Mask | - | Toggle mask |
| Refine Layer | - | Advanced layer editing |
| Layer Comps | - | Save layer states |

### 2.9 Filter Categories (100+ filters)

#### Blur Filters (8)
Gaussian Blur, Motion Blur, Radial Blur, Smart Blur, Box Blur, Surface Blur, Zoom Blur, Tilt-Shift

#### Sharpen Filters (6)
Sharpen, Sharpen Edges, Sharpen More, Unsharp Mask, Smart Sharpen, Shake Reduction

#### Color Adjustments (15)
Levels, Curves, Exposure, Brightness/Contrast, Hue/Saturation, Color Balance, Black & White, Photo Filter, Channel Mixer, Invert, Posterize, Threshold, Desaturate, Match Color, Replace Color

#### Artistic Filters (15)
Cutout, Dry Brush, Film Grain, Fresco, Neon Glow, Paint Daubs, Palette Knife, Plastic Wrap, Poster Edges, Rough Pastels, Smudge Stick, Spatter, Sponge, Underpainting, Watercolor

#### Distortion Filters (12)
Diffuse Glow, Displace, Glass, Lens Correction, Pinch, Polar Coordinates, Ripple, Shear, Spherize, Twirl, Wave, ZigZag

#### Noise Filters (8)
Add Noise, Despeckle, Dust & Scratches, Median, Reduce Noise, Scratch Removal, Texture, Texturizer

#### Render Filters (6)
Clouds, Difference Clouds, Fibers, Lens Flare, Lighting Effects, Texture Fill

#### Stylize Filters (5)
Find Edges, Trace Contour, Solarize, Tiles, Wind

### 2.10 Export Formats (12+ formats)

| Format | Extension | Layers | Transparency |
|--------|-----------|--------|--------------|
| PNG | .png | No | Yes |
| JPEG | .jpg | No | No |
| WebP | .webp | No | Yes |
| TIFF | .tiff | Yes | Yes |
| GIF | .gif | No | Yes |
| BMP | .bmp | No | Yes |
| SVG | .svg | Yes | Yes |
| PDF | .pdf | Yes | Yes |
| PSD | .psd | Yes | Yes |
| Liza Project | .liza | Yes | Yes |

---

## 3. UI Layout Design

### 3.1 Default Workspace Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  File  Edit  View  Image  Layer  Filter  Window  Help                │
├────┬────────────────────────────────────────────────────────┬───────┤
│    │                                                        │       │
│ T  │                                                        │   P   │
│ O  │                                                        │   R   │
│ O  │                                                        │   O   │
│ L  │                    CANVAS AREA                         │   P   │
│ B  │                                                        │   E   │
│ A  │                                                        │   R   │
│ R  │                                                        │   T   │
│    │                                                        │   I   │
│    │                                                        │   E   │
│    │                                                        │   S   │
├────┴────────────────────────────────────────────────────────┴───────┤
│  Layers Panel                                                       │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ ☑ Layer 1  │ ☑ Layer 2  │ 🔒 Background  │ + │                  ││
│  └────────────────────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────────────────────┤
│  Color Bar: [Foreground] [Background] [Swap] [Picker] [Swatches]    │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 Panel System

**Dockable Panels:**
- Tools Panel (left) - Vertical tool strip
- Properties Panel (right) - Context-sensitive properties
- Layers Panel (bottom) - Layer management
- Color Panel (right) - Color selection
- History Panel (right) - Undo/redo steps
- Navigator Panel (floating) - Canvas overview
- Swatches Panel (floating) - Color libraries
- Brushes Panel (floating) - Brush management

**Panel Features:**
- Collapsible/expandable
- Drag to dock/undock
- Tabbed panel groups
- Auto-hide capability
- Resize handles

---

## 4. Implementation Phases

### Phase 1: Project Foundation (Foundation)
- [ ] Initialize Electron + React + Vite project
- [ ] Set up TypeScript configuration
- [ ] Configure electron-builder
- [ ] Implement basic window management
- [ ] Set up IPC communication
- [ ] Create preload script with context bridge

### Phase 2: Canvas Core (Critical)
- [ ] Implement Konva canvas with react-konva
- [ ] Create Stage, Layer, Group components
- [ ] Implement basic shapes (Rect, Ellipse, Line)
- [ ] Object selection and transformation
- [ ] Canvas zoom and pan
- [ ] Basic rendering pipeline

### Phase 3: State Management (Critical)
- [ ] Set up Zustand stores
- [ ] Canvas state (objects, layers, selection)
- [ ] Tool state (active tool, tool options)
- [ ] UI state (panel visibility, positions)
- [ ] History state (undo/redo stack)
- [ ] Persistence layer

### Phase 4: Core Tools (Essential)
- [ ] Selection tools (marquee, lasso, magic wand)
- [ ] Move tool
- [ ] Basic shape tools
- [ ] Pen tool (basic)
- [ ] Text tool
- [ ] Transform tools

### Phase 5: Drawing Tools (Essential)
- [ ] Brush engine
- [ ] Eraser tool
- [ ] Clone stamp
- [ ] Gradient tool
- [ ] Eyedropper

### Phase 6: Layer System (Essential)
- [ ] Layer panel UI
- [ ] Layer operations (create, delete, reorder)
- [ ] Layer visibility and locking
- [ ] Layer opacity and blend modes
- [ ] Layer groups
- [ ] Layer masks

### Phase 7: Color System (Essential)
- [ ] Color picker component
- [ ] Foreground/background colors
- [ ] Swatches panel
- [ ] Gradient editor
- [ ] Color palettes

### Phase 8: Filter System (Foundation)
- [ ] Filter infrastructure
- [ ] Blur filters
- [ ] Sharpen filters
- [ ] Color adjustments
- [ ] Distortion filters

### Phase 9: File Operations (Essential)
- [ ] File open dialog
- [ ] File save dialog
- [ ] Export functionality
- [ ] Recent files
- [ ] Auto-save

### Phase 10: Polish & UX (Important)
- [ ] Keyboard shortcuts
- [ ] Context menus
- [ ] Tooltips
- [ ] Panel docking
- [ ] Workspace presets
- [ ] Performance optimization

---

## 5. Technical Decisions

### 5.1 Canvas Library: Konva.js

**Why Konva:**
- Excellent React integration (react-konva)
- Good performance for moderate object counts
- Built-in transformer for selections
- Active maintenance
- Good documentation

**Alternatives considered:**
- Fabric.js: More features but slower with many objects
- Paper.js: Better for vectors but steeper learning curve
- Plain Canvas: Full control but too much work

### 5.2 State Management: Zustand

**Why Zustand:**
- Lightweight
- Works well with immer for immutable updates
- Simple API
- Good TypeScript support
- Works well with canvas (no re-render issues)

### 5.3 Image Processing Strategy

**Renderer Process (real-time):**
- Canvas API for filters and adjustments
- CSS filters for quick previews
- Direct pixel manipulation for custom effects

**Main Process (heavy lifting):**
- Sharp for format conversion
- Sharp for resize, crop, rotate
- Sharp for export at full quality

### 5.4 Performance Strategies

1. **Viewport culling:** Only render visible objects
2. **Layer caching:** Cache static layers as images
3. **Dirty rectangles:** Only redraw changed areas
4. **Debounced updates:** Batch rapid changes
5. **Web Workers:** Offload heavy computation
6. **Lazy loading:** Load images on demand

---

## 6. Keyboard Shortcuts (Version 0.1)

### Essential Shortcuts
| Shortcut | Action |
|----------|--------|
| V | Move/Select tool |
| M | Marquee selection |
| L | Lasso selection |
| W | Magic wand |
| B | Brush |
| E | Eraser |
| P | Pen tool |
| T | Text tool |
| U | Shape tool |
| G | Gradient tool |
| I | Eyedropper |
| H | Hand tool |
| Z | Zoom tool |
| Space (hold) | Temporary hand |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+A | Select all |
| Ctrl+D | Deselect |
| Ctrl+S | Save |
| Ctrl+Shift+S | Save as |
| Ctrl+O | Open |
| Ctrl+E | Export |
| Ctrl+N | New project |
| Ctrl++ | Zoom in |
| Ctrl+- | Zoom out |
| Ctrl+0 | Fit to screen |
| Ctrl+1 | Actual pixels |
| Delete | Delete selection |
| Ctrl+J | Duplicate |
| Ctrl+G | Group |
| Ctrl+Shift+G | Ungroup |
| Ctrl+T | Free transform |
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Ctrl+X | Cut |
| Ctrl+/ | Toggle panel |

---

## 7. File Format (.liza)

### Project File Structure

```json
{
  "version": "0.1.0",
  "metadata": {
    "name": "Untitled",
    "created": "2026-06-22T00:00:00Z",
    "modified": "2026-06-22T00:00:00Z",
    "canvas": {
      "width": 1920,
      "height": 1080,
      "background": "#FFFFFF"
    }
  },
  "layers": [
    {
      "id": "layer-1",
      "name": "Layer 1",
      "type": "raster",
      "visible": true,
      "locked": false,
      "opacity": 1,
      "blendMode": "normal",
      "objects": []
    }
  ],
  "resources": [],
  "settings": {
    "snapToGrid": false,
    "gridSize": 10,
    "rulersVisible": true
  }
}
```

---

## 8. Development Roadmap

### Version 0.1 (Current) - Foundation
- Core architecture
- Essential tools (50+ tools)
- Basic layer system
- File open/save
- Export to major formats

### Version 0.2 - Enhanced Tools
- Advanced brush engine
- Full pen tool with bezier
- Advanced layer features
- Adjustment layers
- Smart objects

### Version 0.3 - Professional Features
- Vector path operations
- Advanced filters
- Text on path
- 3D capabilities
- Plugin architecture

### Version 0.4 - Collaboration
- Cloud storage
- Real-time collaboration
- Version history
- Asset libraries
- Community plugins

---

## 9. Dependencies

### Core Dependencies
```json
{
  "electron": "^28.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-konva": "^18.2.10",
  "konva": "^9.2.0",
  "zustand": "^4.4.0",
  "immer": "^10.0.0",
  "sharp": "^0.33.0",
  "electron-builder": "^24.9.0",
  "vite": "^5.0.0",
  "typescript": "^5.3.0"
}
```

### UI Dependencies
```json
{
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^2.0.0",
  "@radix-ui/react-slider": "^1.0.0",
  "@radix-ui/react-tooltip": "^1.0.0",
  "react-colorful": "^5.6.1",
  "lucide-react": "^0.294.0",
  "clsx": "^2.0.0"
}
```

---

## 10. Success Criteria for Version 0.1

1. **Functional:** User can create, edit, and export basic designs
2. **Usable:** Interface is intuitive and easy to learn
3. **Performant:** 60fps with up to 50 objects on canvas
4. **Complete:** Core tools work without crashes
5. **Exportable:** Can export to PNG, JPEG, WebP

---

## Next Steps

When you say "go", I will:

1. Initialize the Electron + React + Vite project
2. Set up the complete project structure
3. Implement all core systems
4. Build out the tool system
5. Create the UI panels
6. Implement file operations
7. Add export functionality

This will be a comprehensive implementation covering all the features outlined above.