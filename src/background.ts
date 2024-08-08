// electron主进程
import { app, BrowserWindow} from "electron"
import * as process from "process";

app.whenReady().then(() => {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,  // 可以在渲染进程中使用node的api,为安全考虑，默认禁止
            contextIsolation: false,  // 关闭渲染进程的沙箱
            webSecurity: false,  // 关闭浏览器跨域策略
        }
    })

    if (process.argv[2]) {
        // idx0:require('electron'), idx1:"dist/background.js", idx2:ipAddr
        win.loadURL(process.argv[2])  // 开发环境，文件在热更新
    } else {
        win.loadFile("index.html")  // 生产环境，使用的静态文件
    }

})