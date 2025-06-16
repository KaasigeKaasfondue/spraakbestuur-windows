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

  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
      console.log('Zoekt naar updates...');
    });

    autoUpdater.on('update-available', () => {
      console.log('Update beschikbaar');
    });

    autoUpdater.on('update-not-available', () => {
      console.log('Geen updates beschikbaar');
    });

    autoUpdater.on('error', (err) => {
      console.error('Update fout:', err);
    });

    autoUpdater.on('update-downloaded', () => {
      console.log('Update gedownload, herstart de app');
      autoUpdater.quitAndInstall();
    });
  }
});