const { app, BrowserWindow, dialog } = require('electron');
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
    autoUpdater.checkForUpdates();

    autoUpdater.on('checking-for-update', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Status',
        message: 'Zoekt naar updates...',
        detail: `Huidige versie: ${app.getVersion()}`,
      });
    });

    autoUpdater.on('update-available', (info) => {
      dialog
        .showMessageBox({
          type: "info",
          title: "Update Beschikbaar",
          message: "Er is een nieuwe update gevonden!",
          detail: `Huidige versie: ${app.getVersion()}\nNieuwe versie: ${
            info.version
          }\n\nRelease-notes:\n${
            info.releaseNotes || "Geen release-notes beschikbaar."
          }`,
          buttons: ["Download en Installeer", "Annuleren"],
        })
        .then(({ response }) => {
          if (response === 0) {
            autoUpdater.downloadUpdate();
          }
        });
    });

    autoUpdater.on('update-not-available', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Geen Update',
        message: 'Je hebt de nieuwste versie.',
        detail: `Huidige versie: ${app.getVersion()}`,
      });
    });

    autoUpdater.on('error', (err) => {
      dialog.showMessageBox({
        type: 'error',
        title: 'Update Fout',
        message: 'Er is een fout opgetreden tijdens het updaten.',
        detail: `${err == null ? 'Onbekende fout' : (err.stack || err).toString()}`,
      });
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = `Downloaded ${Math.floor(progressObj.percent)}% (${Math.floor(progressObj.transferred / 1024)} KB of ${Math.floor(progressObj.total/1024)} KB)`;
    });

    autoUpdater.on('update-downloaded', (info) => {
      dialog.showMessageBox({
        type: 'question',
        title: 'Herstart voor Installatie',
        message: 'Update gedownload!',
        detail: `Huidige versie: ${app.getVersion()}\nNieuwe versie: ${info.version}\n\nWil je nu herstarten om de update te installeren?`,
        buttons: ['Herstart Nu', 'Later']
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });
  }
});
