const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    console.log('Update beschikbaar');
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('Update gedownload, app wordt herstart');
    autoUpdater.quitAndInstall();
  });
});
