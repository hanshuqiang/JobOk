import { app, BrowserWindow, net, shell, session, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import { Buffer } from "buffer";
import fs from "fs";
import { makeRequest, RequestOptions } from "../utils/makeRequest";
import { objectToFormUrlEncoded } from "../utils";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Windows 7 禁用 GPU 加速
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// 用于确保在 Windows 中正确标识和管理 Electron 应用的任务栏图标和通知
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Boss 工具箱",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    minWidth:900,
    minHeight:500,
    webPreferences: {
      preload,
      webSecurity: true,
    },
  });
  // 自动最大化主窗口
  win.maximize();
  if (VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(indexHtml);
  }

  //这个事件会在窗口的网页内容完全加载完成后触发。这意味着所有的 HTML、CSS 和 JavaScript 文件都已经被加载并执行
  win.webContents.on("did-finish-load", () => {
    // win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  //win.webContents.on("did-finish-load", args) 类似的事件还有很多，可以查看文档
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  // if (process.platform !== "darwin") app.quit();
  app.quit();
});

//处理 Electron 应用的多实例情况
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

//用于处理 Electron 应用的“激活”事件，特别是在 macOS
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// 新窗口
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      // nodeIntegration: true,
      // contextIsolation: false,
      webSecurity: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.webContents.openDevTools();
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
ipcMain.handle("close-modal", async (event, args) => {
  console.log("args", args);
  if (args) {
    let p = JSON.parse(args);
    win?.webContents.send("main-process-message", p);
  }
});

////
ipcMain.handle("get-boss-list", async (event, args) => {
  let params = JSON.parse(args);
  const jsonFilePath = path.join(process.cwd(), "config.json");
  // 读取 JSON 文件内容
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
  const headers = {
    mpt: jsonData.mpt,
  };
  const query = {
    pageSize: params.pageSize || "15",
    page: params.pageNo || "1",
    query: params.keyword,
    city: "101010100",
    source: "1",
    sortType: "0",
    subwayLineId: "",
    subwayStationId: "",
    districtCode: "",
    businessCode: "",
    longitude: "",
    latitude: "",
    position: "",
    expectId: "",
    expectPosition: "",

    appId: "10002",
  };
  let url = `https://www.zhipin.com/wapi/zpgeek/miniapp/search/joblist.json`;
  console.log("query", query);
  let res = await makeRequest({
    url: url,
    method: "GET",
    headers: headers,
    query: query,
  } as RequestOptions);
  console.log("res", res);

  return {
    code: 0,
    bossData: res,
    message: "",
  };
});
ipcMain.handle("send-msg-toboss", async (event, args) => {
  let params = JSON.parse(args);
  const jsonFilePath = path.join(process.cwd(), "config.json");
  // 读取 JSON 文件内容
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    mpt: jsonData.mpt,
    wt2: jsonData.wt2,
    zp_product_id: jsonData.zp_product_id,
  };
  const body = { ...params };
  let url = `https://www.zhipin.com/wapi/zpgeek/miniapp/friend/add.json`;

  let res = await makeRequest({
    url: url,
    method: "POST",
    headers: headers,
    body: body,
  } as RequestOptions);
  console.log("res", res);

  return {
    code: 0,
    bossData: res,
    message: "",
  };
});
ipcMain.handle("send-view-toboss", (event, args) => {
  let params = JSON.parse(args);
  shell.openExternal(`https://www.zhipin.com/job_detail/${params.jobId}.html`);
});

ipcMain.handle("account-get", (event, args) => {
  // 获取当前工作目录
  const currentDir = process.cwd();
  // 定义 JSON 文件路径
  const jsonFilePath = path.join(currentDir, "config.json");
  // 检查 JSON 文件是否存在
  if (!fs.existsSync(jsonFilePath)) {
    // 如果文件不存在,创建一个新的 JSON 文件
    const initialData = {};

    fs.writeFileSync(jsonFilePath, JSON.stringify(initialData));
    console.log("软件配置文件不存在，已自动创建:", jsonFilePath);
  }
  // 读取 JSON 文件内容
  const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
  return data;
});
ipcMain.handle("account-save", (event, args) => {
  // 获取当前工作目录
  const currentDir = process.cwd();
  // 定义 JSON 文件路径
  const jsonFilePath = path.join(currentDir, "config.json");
  // 检查 JSON 文件是否存在
  if (!fs.existsSync(jsonFilePath)) {
    // 如果文件不存在,创建一个新的 JSON 文件
    const initialData = {};

    fs.writeFileSync(jsonFilePath, JSON.stringify(initialData));
    console.log("软件配置文件不存在，已自动创建:", jsonFilePath);
  }
  let params = JSON.parse(args);
  fs.writeFileSync(jsonFilePath, JSON.stringify(params));
  return "ok";
});
