import electron from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import log from 'electron-log';
import sharp from 'sharp';

const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = electron;

// Configure logging
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

log.info('Liza Editor starting...');

let mainWindow: electron.BrowserWindow | null = null;

const isDev = !electron.app.isPackaged;

function createWindow(): void {
  log.info('Creating main window...');

  mainWindow = new electron.BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Liza Editor',
    backgroundColor: '#1e1e1e',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload', 'index.js'),
    },
  });

  // Create application menu
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu-action', 'new') },
        { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: () => mainWindow?.webContents.send('menu-action', 'open') },
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu-action', 'save') },
        { label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: () => mainWindow?.webContents.send('menu-action', 'save-as') },
        { type: 'separator' },
        { label: 'Export...', accelerator: 'CmdOrCtrl+E', click: () => mainWindow?.webContents.send('menu-action', 'export') },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'Alt+F4', click: () => electron.app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: () => mainWindow?.webContents.send('menu-action', 'undo') },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', click: () => mainWindow?.webContents.send('menu-action', 'redo') },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { type: 'separator' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', click: () => mainWindow?.webContents.send('menu-action', 'select-all') },
        { label: 'Deselect', accelerator: 'CmdOrCtrl+D', click: () => mainWindow?.webContents.send('menu-action', 'deselect') },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', click: () => mainWindow?.webContents.send('menu-action', 'zoom-in') },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => mainWindow?.webContents.send('menu-action', 'zoom-out') },
        { label: 'Fit to Screen', accelerator: 'CmdOrCtrl+0', click: () => mainWindow?.webContents.send('menu-action', 'zoom-fit') },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+1', click: () => mainWindow?.webContents.send('menu-action', 'zoom-100') },
        { type: 'separator' },
        { label: 'Toggle Rulers', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.webContents.send('menu-action', 'toggle-rulers') },
        { label: 'Toggle Grid', accelerator: 'CmdOrCtrl+\'', click: () => mainWindow?.webContents.send('menu-action', 'toggle-grid') },
        { type: 'separator' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', click: () => mainWindow?.webContents.toggleDevTools() },
      ],
    },
    {
      label: 'Layer',
      submenu: [
        { label: 'New Layer', accelerator: 'CmdOrCtrl+Shift+N', click: () => mainWindow?.webContents.send('menu-action', 'layer-new') },
        { label: 'Duplicate Layer', accelerator: 'CmdOrCtrl+J', click: () => mainWindow?.webContents.send('menu-action', 'layer-duplicate') },
        { label: 'Delete Layer', click: () => mainWindow?.webContents.send('menu-action', 'layer-delete') },
        { type: 'separator' },
        { label: 'Group Layers', accelerator: 'CmdOrCtrl+G', click: () => mainWindow?.webContents.send('menu-action', 'layer-group') },
        { label: 'Ungroup Layers', accelerator: 'CmdOrCtrl+Shift+G', click: () => mainWindow?.webContents.send('menu-action', 'layer-ungroup') },
        { type: 'separator' },
        { label: 'Merge Down', accelerator: 'CmdOrCtrl+E', click: () => mainWindow?.webContents.send('menu-action', 'layer-merge-down') },
        { label: 'Flatten Image', click: () => mainWindow?.webContents.send('menu-action', 'layer-flatten') },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About Liza Editor', click: () => showAboutDialog() },
        { type: 'separator' },
        { label: 'Documentation', click: () => shell.openExternal('https://github.com/elijahshepherd/Liza') },
      ],
    },
  ];

  const menu = electron.Menu.buildFromTemplate(menuTemplate);
  electron.Menu.setApplicationMenu(menu);

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  log.info('Main window created successfully');
}

function showAboutDialog(): void {
  dialog.showMessageBox({
    type: 'info',
    title: 'About Liza Editor',
    message: 'Liza Editor',
    detail: `Version 0.1.0\n\nA professional graphic design application.\n\n© 2026 Elijah Shepherd`,
  });
}

// IPC Handlers
ipcMain.handle('dialog:openFile', async () => {
  log.info('Opening file dialog...');
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const data = fs.readFileSync(filePath);
  
  return { path: filePath, data: data.buffer };
});

ipcMain.handle('dialog:openProject', async () => {
  log.info('Opening project dialog...');
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Liza Project', extensions: ['liza'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const content = fs.readFileSync(filePath, 'utf-8');
  const project = JSON.parse(content);
  
  return { path: filePath, project };
});

ipcMain.handle('dialog:saveFile', async (_, data: ArrayBuffer, filePath?: string) => {
  log.info('Save file dialog...');
  
  if (!filePath) {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'PNG Image', extensions: ['png'] },
        { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] },
        { name: 'WebP Image', extensions: ['webp'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (result.canceled || !result.filePath) {
      return false;
    }
    filePath = result.filePath;
  }

  fs.writeFileSync(filePath, Buffer.from(data));
  return true;
});

ipcMain.handle('dialog:saveProject', async (_, project: object, filePath?: string) => {
  log.info('Save project dialog...');
  
  if (!filePath) {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'Liza Project', extensions: ['liza'] },
      ],
    });

    if (result.canceled || !result.filePath) {
      return false;
    }
    filePath = result.filePath;
  }

  fs.writeFileSync(filePath, JSON.stringify(project, null, 2));
  return true;
});

ipcMain.handle('dialog:exportImage', async (_, data: ArrayBuffer, filePath?: string, format?: string) => {
  log.info('Export image dialog...');
  
  if (!filePath) {
    const filters = [
      { name: 'PNG Image', extensions: ['png'] },
      { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] },
      { name: 'WebP Image', extensions: ['webp'] },
    ];
    
    const result = await dialog.showSaveDialog({
      filters: format === 'jpg' ? [filters[1]] : format === 'webp' ? [filters[2]] : [filters[0]],
    });

    if (result.canceled || !result.filePath) {
      return false;
    }
    filePath = result.filePath;
  }

  const inputBuffer = Buffer.from(data);
  
  // Convert to desired format if needed
  let outputBuffer: Buffer;
  if (format === 'jpg') {
    outputBuffer = await sharp(inputBuffer).jpeg({ quality: 90 }).toBuffer();
  } else if (format === 'webp') {
    outputBuffer = await sharp(inputBuffer).webp({ quality: 90 }).toBuffer();
  } else {
    outputBuffer = await sharp(inputBuffer).png().toBuffer();
  }

  fs.writeFileSync(filePath, outputBuffer);
  return true;
});

ipcMain.handle('image:process', async (_, data: ArrayBuffer, options: { width?: number; height?: number; blur?: number; sharpen?: number }) => {
  log.info('Processing image...');
  let img = sharp(Buffer.from(data));
  
  if (options.width && options.height) {
    img = img.resize(options.width, options.height);
  }
  if (options.blur) {
    img = img.blur(options.blur);
  }
  if (options.sharpen) {
    img = img.sharpen(options.sharpen);
  }
  
  const result = await img.toBuffer();
  return result.buffer;
});

ipcMain.handle('app:version', () => {
  return app.getVersion();
});

// App lifecycle
electron.app.whenReady().then(() => {
  log.info('App ready, creating window...');
  createWindow();

  electron.app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

electron.app.on('window-all-closed', () => {
  log.info('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

electron.app.on('before-quit', () => {
  log.info('App quitting...');
});