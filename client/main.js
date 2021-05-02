const {app, BrowserWindow, globalShortcut, Menu, ipcMain} = require('electron');
const wallpaper = require('wallpaper')
const exec = require('child_process').execFile
const path = require('path');

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'js/preload.js')
    }
  });
  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools(); // 打开开发者工具
    mainWindow.loadURL('http://localhost:8080/index.html');
    // if (process.platform === 'win32') {
    //   // windows 系统
    //   exec(path.join(__dirname, '../service/service.exe'))
    // } else {
    //   exec(path.join(__dirname, '../service/service'))
    // }
  } else {
    mainWindow.loadFile(process.resourcesPath + '/index.html');
    // if (process.platform === 'win32') {
    //   // windows 系统
    //   exec(process.resourcesPath + '/service.exe')
    // } else {
    //   exec(process.resourcesPath + '/service')
    // }
  }
  // 注册快捷键
  globalShortcut.register('f10', () => {
    mainWindow.openDevTools(); // 打开开发者工具
  });

};
Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  app.exit(0);
})