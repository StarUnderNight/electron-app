// electron主进程
import { app, BrowserWindow} from "electron"

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

    // win.loadURL()
})