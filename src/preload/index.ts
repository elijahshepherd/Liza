import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data: ArrayBuffer, path?: string) => ipcRenderer.invoke('dialog:saveFile', data, path),
  saveProject: (project: object, path?: string) => ipcRenderer.invoke('dialog:saveProject', project, path),
  openProject: () => ipcRenderer.invoke('dialog:openProject'),
  exportImage: (data: ArrayBuffer, path?: string, format?: string) => ipcRenderer.invoke('dialog:exportImage', data, path, format),
  
  // Image processing
  processImage: (data: ArrayBuffer, options: object) => ipcRenderer.invoke('image:process', data, options),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('app:version'),
  
  // Menu actions
  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-action', (_, action) => callback(action));
  },
});