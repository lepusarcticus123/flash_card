import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { type } from 'os'
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
//跟预脚本通信
ipcMain.on('saveFile', () => {
  console.log('saveFile')
})
ipcMain.on('getFile', () => {
  console.log('getFile')
})
//双向通信
ipcMain.handle('setFile', async (event) => {
  const obj = await dialog.showOpenDialog({})
  return obj.filePaths
})
ipcMain.handle('get-app-version', () => {
  return process.env.VERSION
})
ipcMain.handle('fetch-data', async (event, word) => {
  const prompt = {
    model: 'generalv3.5',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Give me the meaning of the word that I input.'
      },
      {
        role: 'user',
        content: word
      }
    ],
    stream: false,
    max_tokens: 1024,
    temperature: 0.9,
    top_p: 0.7
  }
  const password = process.env.XF_PASSWORD // 替换为获取到的密码
  try {
    const response = await fetch('https://spark-api-open.xf-yun.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password}`
      },
      body: prompt
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Fetch failed', error)
    return null
  }
})
