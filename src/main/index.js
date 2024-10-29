import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon2.png?asset'
import { type } from 'os'
import axios from 'axios'
require('dotenv').config()

const menuItems = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Quit',
        click: () => {
          app.quit() // 点击 "Quit" 菜单项时退出应用
        }
      },
      { role: 'close' },
      { role: 'reload' }
    ]
  },
  {
    label: 'More',
    submenu: [
      {
        label: 'Source Code',
        click: async () => {
          await shell.openExternal('https://github.com/lepusarcticus123/flash_card') // 点击 "more" 菜单项时输出 "more" 到控制台
        }
      },
      { type: 'separator' }
    ]
  }
]

// 构建并设置应用菜单
const menu = Menu.buildFromTemplate(menuItems)
Menu.setApplicationMenu(menu)

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    icon: icon,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url) //默认浏览器打开而不是当前窗口
    return { action: 'deny' }
  })
  //开发环境生产环境加载不同地址
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.FlashCard.MyApp')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.handle('get-app-version', () => {
  return process.env.VERSION
})
ipcMain.handle('get-api-key', () => {
  return process.env.API_KEY
})
ipcMain.handle('fetch-tts', async (event, text) => {
  try {
    const response = await axios.get(
      `https://texttospeech.responsivevoice.org/v1/text:synthesize`,
      {
        params: {
          text: 'hello world',
          lang: 'en-GB',
          engine: 'g1',
          pitch: 0.5,
          rate: 0.5,
          volume: 1,
          key: 'SYtdTdUZ',
          gender: 'female'
        },
        responseType: 'arraybuffer' // 用于返回音频数据
      }
    )
    return response.data
  } catch (error) {
    console.error('TTS request error:', error.message, error.response?.status, error.response?.data)
    // throw error
  }
})
