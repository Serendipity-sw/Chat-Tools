const { app, BrowserWindow } = require('electron');

function createWindow () {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });
  // 加载index.html文件
  win.loadFile('./dist/index.html');
}

app.whenReady().then(createWindow);
