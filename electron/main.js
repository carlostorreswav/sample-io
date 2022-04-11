const { app, BrowserWindow, ipcMain, dialog, autoUpdater } = require("electron")
const path = require("path")
const url = require("url")
const fs = require("fs")
const { getSampleCloud, getTagCloud, getTempoCloud, getToneCloud } = require("./Core")
const Store = require("electron-store")
const store = new Store()
var crypto = require("crypto")

let mainWindow

if (!app.isPackaged) {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require("electron-devtools-installer")
  app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log("An error occurred: ", err))
  })
}

// const { app, autoUpdater } = require("electron")

const server = "https://hazeltest.vercel.app"

const hazelUrl = `${server}/update/${process.platform}/${app.getVersion()}`

app.isPackaged && autoUpdater.setFeedURL({ url: hazelUrl })

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: app.isPackaged ? 220 : 800,
    height: 1400,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })
  mainWindow.loadURL(
    !app.isPackaged
      ? process.env.ELECTRON_START_URL
      : url.format({
          pathname: path.join(__dirname, "../index.html"),
          protocol: "file:",
          slashes: true,
        })
  )

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  !app.isPackaged && mainWindow.webContents.openDevTools()
}

const iconName = path.join(__dirname, "drag-and-drop.png")

ipcMain.on("ondragstart", async (event, file) => {
  event.sender.startDrag({
    file: file.path,
    icon: iconName,
  })
})

ipcMain.handle("getRawData", async (event, path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
    // })
  })
})

ipcMain.handle("dialog:open", async (_, args) => {
  const folder = await dialog.showOpenDialog({ properties: ["openDirectory"] })
  const rootFolder = folder.filePaths[0]
  const folderName = /[^/]*$/.exec(rootFolder)[0]
  const folderID = crypto.randomUUID()
  const sampleCloud = await getSampleCloud(rootFolder, mainWindow)
  const tagCloud = await getTagCloud(sampleCloud)
  const tempoCloud = await getTempoCloud(sampleCloud)
  const toneCloud = await getToneCloud(sampleCloud)
  const result = {
    root: rootFolder,
    sampleCloud,
    tempoCloud,
    toneCloud,
    tagCloud,
    folderName,
    folderID,
  }
  const actualArray = store.get("userData") || []
  const newArray = [...actualArray, result]
  store.set("userData", newArray)
  return newArray
})

//store.set("userData", [])

ipcMain.handle("deleteFolder", async (_, folderID) => {
  const actualArray = store.get("userData")
  const newArray = actualArray.filter(item => item.folderID !== folderID)
  store.set("userData", newArray)
  return newArray
})

ipcMain.handle("replaceTrack", async (_, Track) => {
  const actualArray = store.get("userData")
  const newArray = actualArray.map(folder => {
    return {
      ...folder,
      sampleCloud: folder.sampleCloud.map(sample => {
        if (sample.id === Track.id) {
          return Track
        } else {
          return sample
        }
      }),
    }
  })
  // console.log("newArray", newArray)
  store.set("userData", newArray)
  return newArray
})

ipcMain.handle("getClouds", async (event, sampleArray) => {
  const tagCloud = await getTagCloud(sampleArray)
  // const tempoCloud = await getTempoCloud(sampleArray)
  // const toneCloud = await getToneCloud(sampleArray)
  // console.log("tagCloud", tagCloud)
  return {
    // tempoCloud,
    // toneCloud,
    tagCloud,
  }
})

ipcMain.handle("getData", async event => {
  const userData = store.get("userData")
  return userData
})

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})
