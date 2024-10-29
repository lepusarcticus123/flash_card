import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  //数据库版本环境变量
  getversion: async () => {
    const version = await ipcRenderer.invoke('get-app-version')
    return version
  },
  getApiKey: async () => {
    const apiKey = await ipcRenderer.invoke('get-api-key')
    return apiKey
  },
  getaudio: async () => {
    const audio = await ipcRenderer.invoke('fetch-tts')
    return audio
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
