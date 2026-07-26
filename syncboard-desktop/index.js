const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "SyncBoard Desktop",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Load the index.html from Tauri's src folder
  win.loadFile(path.join(__dirname, 'src', 'index.html'))
  
  // Optional: open devtools
  // win.webContents.openDevTools()
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
