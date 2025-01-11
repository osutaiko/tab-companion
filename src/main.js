import { app, BrowserWindow } from 'electron';
import { getSearchResultFromSongsterrUrl, downloadTabFile } from './songsterr.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('https://www.songsterr.com/');

  win.webContents.on('did-navigate', async () => {
    const currentUrl = win.webContents.getURL();
    await fetchAndLogTabInfo(currentUrl);
  });

  win.webContents.on('did-navigate-in-page', async () => {
    const currentUrl = win.webContents.getURL();
    await fetchAndLogTabInfo(currentUrl);
  });

  createOverlayWindow();
}

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 300,
    height: 200,
    alwaysOnTop: true,
    frame: true,
    transparent: true,
    resizable: false,
    movable: true,
    webPreferences: {
      contextIsolation: true,
    },
  });

  overlayWindow.loadURL(path.join(__dirname, 'overlay.html'));
  
  overlayWindow.on('close', (e) => {
    e.preventDefault();
  });
}

async function fetchAndLogTabInfo(songsterrUrl) {
  try {
    const result = await getSearchResultFromSongsterrUrl(songsterrUrl);
    console.log('Song Info:', result);
    if (result) {
      await downloadTabFile(result.source, result.songId + '.gp');
    }
  } catch (error) {
    console.error('Error fetching song data:', error);
  }
}

app.whenReady().then(() => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
