import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  fetchSongData: (songsterrUrl) => ipcRenderer.invoke('fetch-song-data', songsterrUrl)
});
