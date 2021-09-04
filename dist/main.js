"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_search_devtools_1 = require("electron-search-devtools");
const isDev = process.env.NODE_ENV === 'development';
const execPath = process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/.bin/electron';
// 開発モードの場合はホットリロードする
if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path_1.default.resolve(__dirname, execPath),
        forceHardReset: true,
        hardResetMethod: 'exit',
    });
}
// BrowserWindow インスタンスを作成する関数
const createWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        webPreferences: {
            preload: path_1.default.resolve(__dirname, 'preload.js'),
        },
    });
    if (isDev) {
        // 開発モードの場合はデベロッパーツールを開く
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
};
electron_1.app.whenReady().then(async () => {
    if (isDev) {
        // 開発モードの場合は React Devtools をロード
        const devtools = await (0, electron_search_devtools_1.searchDevtools)('REACT');
        if (devtools) {
            await electron_1.session.defaultSession.loadExtension(devtools, {
                allowFileAccess: true,
            });
        }
    }
    // BrowserWindow インスタンスを作成
    createWindow();
});
// すべてのウィンドウが閉じられたらアプリを終了する
electron_1.app.once('window-all-closed', () => electron_1.app.quit());
//# sourceMappingURL=main.js.map