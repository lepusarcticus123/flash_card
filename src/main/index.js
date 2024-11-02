import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
require('dotenv').config()

let mainWindow // 将 mainWindow 声明为全局变量

const menuItems = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Quit',
        click: () => {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'More',
    submenu: [
      {
        label: 'Source Code',
        click: async () => {
          await shell.openExternal('https://github.com/lepusarcticus123/flash_card')
        }
      }
      // { type: 'separator' }
    ]
  }
]

// 构建并设置应用菜单
const menu = Menu.buildFromTemplate(menuItems)
Menu.setApplicationMenu(menu)

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
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
    shell.openExternal(details.url) // 默认浏览器打开而不是当前窗口
    return { action: 'deny' }
  })

  // 开发环境生产环境加载不同地址
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // mainWindow.webContents.openDevTools() // 将开发工具打开放在这里，确保 mainWindow 已定义
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.FlashCard.MyApp')
  process.on('uncaughtException', (error) => console.error(error))

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

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

// 数据库版本信息
ipcMain.handle('get-app-version', () => {
  return process.env.VERSION
})

// LLM's APIKey
ipcMain.handle('get-api-key', () => {
  return process.env.API_KEY
})

// fetch audio
ipcMain.handle('play', async (event, text, nation, gender) => {
  try {
    const response = await axios.get(
      `https://texttospeech.responsivevoice.org/v1/text:synthesize`,
      {
        params: {
          text: text,
          lang: `en-${nation}`,
          engine: 'g1',
          pitch: 0.5,
          rate: 0.5,
          volume: 1,
          key: 'SYtdTdUZ',
          gender: gender
        },
        responseType: 'arraybuffer' // 用于返回音频数据
      }
    )
    return response.data
  } catch (error) {
    console.error('TTS request error:', error.message, error.response?.status, error.response?.data)
  }
})
