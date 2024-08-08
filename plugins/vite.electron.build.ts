import type { Plugin } from "vite"
import fs from "node:fs"
import * as electronBuilder from "electron-builder"
import path from "path";

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
/**
 * 打包需要先等vite打包完成后，才有dist/index.html文件，再执行electron-builder打包
 * @constructor
 */
export const ElectronBuildPlugin = () : Plugin => {
    return {
        name: "electron-build",
        closeBundle () {
            buildBackground()
            // electron-builder需要指定package.json的main属性
            const json = JSON.parse(fs.readFileSync("package.json", "utf-8"))
            json.main = "background.js"
            fs.writeFileSync("dist/package.json", JSON.stringify(json, null, 4))
            // bug: electron-builder会下载垃圾文件，解决这个bug的方法是给他直接创建一个空的node_modules文件夹
            fs.mkdirSync("dist/node_modules")

            electronBuilder.build({
                config: {
                    directories: {
                        output: path.resolve(process.cwd(), "release"),
                        app: path.resolve(process.cwd(), "dist"),
                    },
                    files: ["**/*"],
                    asar: true, // 打包为压缩包
                    appId: "com.example.app",
                    productName: "electron-app",
                    nsis: {
                        oneClick: false, // 取消一键安装
                        allowToChangeInstallationDirectory: true, // 允许用户安装目录
                    },
                    linux: {
                        "target": ["deb"],
                        "maintainer": "hcx <1424249401@qq.com>",
                    }
                }
            })
        }
    }
}