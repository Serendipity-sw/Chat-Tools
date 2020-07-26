const { app, BrowserWindow, Menu } = require('electron');
let mainWindow;
const createWindow = () => {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });
  // 加载index.html文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8090/index.html');
  } else {
    mainWindow.loadFile(process.resourcesPath + '/index.html');
  }
};
// 菜单
const menuList = [
  {
    label: 'dev',
    submenu: [
      {
        label: '调试',
        click: () => {
          mainWindow.webContents.openDevTools();
        }
      }
    ]
  }
];
const appMenu = Menu.buildFromTemplate(menuList);
Menu.setApplicationMenu(appMenu);
app.whenReady().then(createWindow);


