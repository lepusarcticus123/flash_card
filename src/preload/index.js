import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getversion: async () => {
    const version = await ipcRenderer.invoke('get-app-version')
    return version // 返回获取到的版本
  },

  getdata: async (word) => {
    try {
      const result = await ipcRenderer.invoke('fetch-data', word)
      return result
    } catch (error) {
      throw error
    }
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
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
//跟主进程通信
ipcRenderer.send('saveFile')
//跟渲染进程通信
contextBridge.exposeInMainWorld('message', {
  name: 'lepus',
  info: 'hello world'
})
//建立起桥梁使主进程和渲染进程通信
contextBridge.exposeInMainWorld('func', {
  fn: () => {
    ipcRenderer.send('getFile')
  },
  //渲染进程主进程双向通信
  upload: async () => {
    const path = await ipcRenderer.invoke('setFile')
    console.log(path)
  }
})
