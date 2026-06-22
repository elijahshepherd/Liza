"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = __importDefault(require("electron"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const electron_log_1 = __importDefault(require("electron-log"));
const sharp_1 = __importDefault(require("sharp"));
const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = electron_1.default;
// Configure logging
electron_log_1.default.transports.file.level = 'info';
electron_log_1.default.transports.console.level = 'debug';
electron_log_1.default.info('Liza Editor starting...');
let mainWindow = null;
const isDev = !electron_1.default.app.isPackaged;
function createWindow() {
    electron_log_1.default.info('Creating main window...');
    mainWindow = new electron_1.default.BrowserWindow({
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
    const menuTemplate = [
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
                { label: 'Exit', accelerator: 'Alt+F4', click: () => electron_1.default.app.quit() },
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
    const menu = electron_1.default.Menu.buildFromTemplate(menuTemplate);
    electron_1.default.Menu.setApplicationMenu(menu);
    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    electron_log_1.default.info('Main window created successfully');
}
function showAboutDialog() {
    dialog.showMessageBox({
        type: 'info',
        title: 'About Liza Editor',
        message: 'Liza Editor',
        detail: `Version 0.1.0\n\nA professional graphic design application.\n\n© 2026 Elijah Shepherd`,
    });
}
// IPC Handlers
ipcMain.handle('dialog:openFile', async () => {
    electron_log_1.default.info('Opening file dialog...');
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
    electron_log_1.default.info('Opening project dialog...');
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
ipcMain.handle('dialog:saveFile', async (_, data, filePath) => {
    electron_log_1.default.info('Save file dialog...');
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
ipcMain.handle('dialog:saveProject', async (_, project, filePath) => {
    electron_log_1.default.info('Save project dialog...');
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
ipcMain.handle('dialog:exportImage', async (_, data, filePath, format) => {
    electron_log_1.default.info('Export image dialog...');
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
    let outputBuffer;
    if (format === 'jpg') {
        outputBuffer = await (0, sharp_1.default)(inputBuffer).jpeg({ quality: 90 }).toBuffer();
    }
    else if (format === 'webp') {
        outputBuffer = await (0, sharp_1.default)(inputBuffer).webp({ quality: 90 }).toBuffer();
    }
    else {
        outputBuffer = await (0, sharp_1.default)(inputBuffer).png().toBuffer();
    }
    fs.writeFileSync(filePath, outputBuffer);
    return true;
});
ipcMain.handle('image:process', async (_, data, options) => {
    electron_log_1.default.info('Processing image...');
    let img = (0, sharp_1.default)(Buffer.from(data));
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
electron_1.default.app.whenReady().then(() => {
    electron_log_1.default.info('App ready, creating window...');
    createWindow();
    electron_1.default.app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.default.app.on('window-all-closed', () => {
    electron_log_1.default.info('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
electron_1.default.app.on('before-quit', () => {
    electron_log_1.default.info('App quitting...');
});
//# sourceMappingURL=index.js.map