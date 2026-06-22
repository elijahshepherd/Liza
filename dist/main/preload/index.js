"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // File operations
    openFile: () => electron_1.ipcRenderer.invoke('dialog:openFile'),
    saveFile: (data, path) => electron_1.ipcRenderer.invoke('dialog:saveFile', data, path),
    saveProject: (project, path) => electron_1.ipcRenderer.invoke('dialog:saveProject', project, path),
    openProject: () => electron_1.ipcRenderer.invoke('dialog:openProject'),
    exportImage: (data, path, format) => electron_1.ipcRenderer.invoke('dialog:exportImage', data, path, format),
    // Image processing
    processImage: (data, options) => electron_1.ipcRenderer.invoke('image:process', data, options),
    // App info
    getAppVersion: () => electron_1.ipcRenderer.invoke('app:version'),
    // Menu actions
    onMenuAction: (callback) => {
        electron_1.ipcRenderer.on('menu-action', (_, action) => callback(action));
    },
});
//# sourceMappingURL=index.js.map