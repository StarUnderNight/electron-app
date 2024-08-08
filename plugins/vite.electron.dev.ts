import type {Plugin} from "vite"

export const ElectronDevPlugin = () : Plugin => {
    return {
        name: "electron-dev",
        // 通过server可以监听vite服务的启动，然后读取网络及ip
        configureServer (server) {
            server.httpServer.on("listening", () => {
                const addressInfo = server.httpServer.address()
                console.log(addressInfo)
            })
        }
    }
}