// Desktop shell. Loads the built frontend from dist/. No backend, no network except free exchange rates.
const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('node:path');

app.setAppUserModelId('com.danyadanileckiy.subtrack'); // required for Windows toast notifications

function createWindow() {
  const win = new BrowserWindow({
    width: 1200, height: 820, minWidth: 380, minHeight: 600, title: 'SubTrack',
    backgroundColor: '#f8fafc', autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) e.preventDefault(); });
  win.webContents.session.setPermissionRequestHandler((_wc, perm, cb) => cb(perm === 'notifications'));
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(() => {
  if (process.platform !== 'darwin') Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
