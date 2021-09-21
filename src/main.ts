import path from 'path';
import { BrowserWindow, app, session } from 'electron';
import { searchDevtools } from 'electron-search-devtools';

const isDev = process.env.NODE_ENV === 'development';

// const execPath =
//   process.platform === 'win32'
//     ? '../node_modules/electron/dist/electron.exe'
//     : '../node_modules/.bin/electron';

// 開発モードの場合はホットリロードする
// if (isDev) {
//   require('electron-reload')(__dirname, {
//     electron: path.resolve(__dirname, execPath),
//     forceHardReset: true,
//     hardResetMethod: 'exit',
//   });
// }

// BrowserWindow インスタンスを作成する関数
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    // ウィンドウ作成時のオプション
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
    width: 1000,
    height: 1000,
    transparent: true, // ウィンドウの背景を透過
    frame: false, // 枠の無いウィンドウ
    resizable: false, // ウィンドウのリサイズを禁止
    hasShadow: false, //残像が残らないようにする
  });
  mainWindow.setAlwaysOnTop(false); // 常に最背面
  if (isDev) {
    // 開発モードの場合はデベロッパーツールを開く
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');
};

app.whenReady().then(async () => {
  if (isDev) {
    // 開発モードの場合は React Devtools をロード
    const devtools = await searchDevtools('REACT');
    if (devtools) {
      await session.defaultSession.loadExtension(devtools, {
        allowFileAccess: true,
      });
    }
  }

  // BrowserWindow インスタンスを作成
  createWindow();
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());
