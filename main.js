const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { exec } = require('child_process')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: true,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'media/microphone.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')
  mainWindow.removeMenu()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-app', async (event, appName) => {
  return new Promise((resolve) => {
    const normalizedName = appName.toLowerCase().trim()
    
    const isWindows = process.platform === 'win32'
    const isLinux = process.platform === 'linux'
    const isMac = process.platform === 'darwin'
    
    let appMappings = {}
    
    if (isWindows) {
      appMappings = {
        'notepad': 'notepad.exe',
        'kladblok': 'notepad.exe',
        'calculator': 'calc.exe',
        'rekenmachine': 'calc.exe',
        'paint': 'mspaint.exe',
        'verf': 'mspaint.exe',
        'chrome': 'chrome.exe',
        'firefox': 'firefox.exe',
        'edge': 'msedge.exe',
        'explorer': 'explorer.exe',
        'verkenner': 'explorer.exe',
        'cmd': 'cmd.exe',
        'command prompt': 'cmd.exe',
        'opdrachtprompt': 'cmd.exe',
        'powershell': 'powershell.exe',
        'task manager': 'taskmgr.exe',
        'taakbeheer': 'taskmgr.exe',
        'control panel': 'control.exe',
        'configuratiescherm': 'control.exe',
        'settings': 'ms-settings:',
        'instellingen': 'ms-settings:',
        'word': 'winword.exe',
        'excel': 'excel.exe',
        'powerpoint': 'powerpnt.exe',
        'outlook': 'outlook.exe',
        'teams': 'teams.exe',
        'skype': 'skype.exe',
        'discord': 'discord.exe',
        'spotify': 'spotify.exe',
        'steam': 'steam.exe',
        'vlc': 'vlc.exe',
        'photoshop': 'photoshop.exe',
        'vs code': 'code.exe',
        'code': 'code.exe'
      }
    } else if (isLinux) {
      appMappings = {
        'notepad': 'gedit',
        'kladblok': 'gedit',
        'teksteditor': 'gedit',
        'calculator': 'gnome-calculator',
        'rekenmachine': 'gnome-calculator',
        'chrome': 'google-chrome',
        'firefox': 'firefox',
        'browser': 'firefox',
        'explorer': 'nautilus',
        'verkenner': 'nautilus',
        'bestandsbeheer': 'nautilus',
        'terminal': 'gnome-terminal',
        'cmd': 'gnome-terminal',
        'opdrachtprompt': 'gnome-terminal',
        'task manager': 'gnome-system-monitor',
        'taakbeheer': 'gnome-system-monitor',
        'systeemmonitor': 'gnome-system-monitor',
        'settings': 'gnome-control-center',
        'instellingen': 'gnome-control-center',
        'configuratie': 'gnome-control-center',
        'vs code': 'code',
        'code': 'code',
        'vlc': 'vlc',
        'mediaspeler': 'vlc',
        'spotify': 'spotify',
        'discord': 'discord',
        'telegram': 'telegram-desktop',
        'libreoffice': 'libreoffice',
        'writer': 'libreoffice --writer',
        'calc': 'libreoffice --calc',
        'impress': 'libreoffice --impress',
        'gimp': 'gimp',
        'fotobewerking': 'gimp'
      }
    } else if (isMac) {
      appMappings = {
        'notepad': 'open -a TextEdit',
        'kladblok': 'open -a TextEdit',
        'calculator': 'open -a Calculator',
        'rekenmachine': 'open -a Calculator',
        'chrome': 'open -a "Google Chrome"',
        'firefox': 'open -a Firefox',
        'safari': 'open -a Safari',
        'finder': 'open -a Finder',
        'verkenner': 'open -a Finder',
        'terminal': 'open -a Terminal',
        'vs code': 'open -a "Visual Studio Code"',
        'code': 'open -a "Visual Studio Code"'
      }
    }

    const executable = appMappings[normalizedName]
    
    if (executable) {
      let command
      if (isWindows) {
        command = `start ${executable}`
      } else if (isLinux) {
        command = `${executable} &`
      } else if (isMac) {
        command = executable
      }
      
      exec(command, (error) => {
        if (error) {
          resolve({ success: false, error: error.message })
        } else {
          resolve({ success: true })
        }
      })
    } else {
      let command
      if (isWindows) {
        command = `start ${normalizedName}`
      } else if (isLinux) {
        command = `${normalizedName} &`
      } else if (isMac) {
        command = `open -a "${normalizedName}"`
      }
      
      exec(command, (error) => {
        if (error) {
          resolve({ success: false, error: `App "${appName}" niet gevonden` })
        } else {
          resolve({ success: true })
        }
      })
    }
  })
})

ipcMain.handle('show-error-dialog', async (event, message, heardText) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: 'App niet gevonden',
    message: message,
    detail: `Ik hoorde: "${heardText}"\n\nTyp de juiste app naam hieronder:`,
    buttons: ['OK', 'Annuleren'],
    defaultId: 0,
    cancelId: 1
  })
  
  return result.response === 0
})

