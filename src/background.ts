"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import fs from "fs";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";
console.log(__dirname, "__dirname");
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  async function searchDirectory(path: string) {
    const files = await fs.readdirSync(path);
    let fileList: any = [];
    for (const file of files) {
      const isDirectory = fs.lstatSync(`${path}/${file}`).isDirectory();
      if (isDirectory) {
        const dirFileList = await searchDirectory(`${path}/${file}`);
        fileList = fileList.concat(dirFileList);
      } else {
        fileList.push(`${path}/${file}`);
      }
    }
    return fileList;
  }

  ipcMain.handle("convertFolderImage", async (event, arg) => {
    let rootPath: string = arg.path;
    rootPath = rootPath.replaceAll("\\", "/");
    if (!fs.lstatSync(rootPath).isDirectory()) return false;
    const dirFileList = await searchDirectory(rootPath);
    const parentFolderPath = path.dirname(rootPath);
    const folderName = `${path.basename(rootPath)}_converted`;
    const convertedFolderPath = path.join(parentFolderPath, folderName);

    const copying = async (convertOriginPath, convertResultPath) => {
      return new Promise((resolve, reject) => {
        fs.copyFile(convertOriginPath, convertResultPath, (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    };

    const makeFolder = async (path) => {
      return new Promise((resolve, reject) => {
        fs.mkdir(path, { recursive: true }, (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    };

    await makeFolder(convertedFolderPath);

    const promiseList: Array<any> = [];
    for (const filePath of dirFileList) {
      if (filePath.includes("DS_Store")) continue;
      const originPath = filePath.replaceAll(rootPath, convertedFolderPath);
      const nameWithoutConvertedFolderName = originPath.replaceAll(
        `${convertedFolderPath}/`,
        ""
      );
      const convertedName = `${path.basename(
        rootPath
      )}_${nameWithoutConvertedFolderName.replaceAll("/", "_")}`;
      const resultPath = path.join(convertedFolderPath, convertedName);

      promiseList.push(copying(filePath, resultPath));
    }

    const promiseResultList = await Promise.allSettled(promiseList);
    const erroredPromise = promiseResultList.filter(
      (promiseResult: any) => promiseResult.status == "rejected"
    );

    if (erroredPromise.length != 0) return false;

    return true;
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    await win.loadURL(`app://./index.html/#Folder-Desolder`);
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
