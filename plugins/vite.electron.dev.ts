import type { Plugin } from "vite"
import type { AddressInfo } from "net";
import {spawn} from "child_process"
import fs from "node:fs"

const buildBackground = () => {
    // vite开发环境使用esbuild,打包环境使用rollup
    require("esbuild").buildSync({
        entryPoints: ["src/background.ts"],   // 入口文件，即要编译的文件
        bundle: true,  //  是否要将所有依赖打包进入
        outfile: "dist/background.js",  // 需要将编译后的文件放在哪儿
        platform: "node",  // 编译环境
        target: "node12",  // 版本，多少都可以
        external: ["electron"],  // 不需要将electron打包进去，因为已经有这个依赖了
    })
}

export const ElectronDevPlugin = () : Plugin => {
    return {
        name: "electron-dev",
        /**
         * 通过server可以监听vite服务的启动，获取ip地址，将ip地址传递给electron服务
         */
        configureServer (server) {
            buildBackground()  // 默认先调用一次
            server?.httpServer?.once("listening", () => {
                const addressInfo = server?.httpServer?.address() as AddressInfo
                const ipAddr = `http://${addressInfo.address}:${addressInfo.port}`
                console.log(ipAddr)

                /** 进程传参法
                 * 参数1是electron入口文件, 参数2是数组，可以传递多个数据
                 * require寻找electron,返回的是一个路径
                 * electron无法识别ts文件，需要将background.ts编译为ts文件
                 */
                let electronProcess = spawn(require('electron'), ["dist/background.js", ipAddr])

                // 实现background.ts文件热更新
                fs.watchFile("src/background.ts", () => {
                    electronProcess.kill()
                    buildBackground()
                    electronProcess = spawn(require('electron'), ["dist/background.js", ipAddr])
                })
                electronProcess.stderr.on("data", (data) => {
                    console.log("日志：", data.toString())
                })
            })
        }
    }
}