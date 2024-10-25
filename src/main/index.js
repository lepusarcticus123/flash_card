import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { type } from 'os'
import EventSource from 'eventsource'
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
    model: 'glm-4-flashx',
    messages: [
      {
        role: 'system',
        content: `我是一个初学者，想了解一个特定单词的详细信息。请以全英文格式返回以下内容：
1. 单词: 我提供的单词。
2. 音标: 单词的国际音标（IPA）。
3. 释义: 请为单词的每个意思单独列出，并包含以下信息：
   - 词性: 单词在该释义下的词性（名词、动词等）。
   - 释义: 该词义对应的解释。
   - 示例句: 该词义对应的例句。
4. 派生词: 请提供常见的派生词（如名词、形容词、动词、反义词等），并包含以下信息：
   - 词性: 派生词的词性。
   - 音标: 派生词的国际音标（IPA）。
   - 释义: 派生词的解释。
   - 示例句: 该派生词的示例句。

请返回全英文JSON格式，便于我解析这些内容。`
      },
      {
        role: 'user',
        content: word
      }
    ]
  }
  const apiKey = process.env.ZP_PASSWORD

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(prompt)
    })
  } catch (error) {
    console.error('Fetch failed', error)
    throw error
  }
})
