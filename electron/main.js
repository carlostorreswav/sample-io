const { app, BrowserWindow, ipcMain, dialog, autoUpdater } = require("electron")
const path = require("path")
const url = require("url")
const fs = require("fs")
const { getSampleCloud, getTagCloud, getTempoCloud, getToneCloud } = require("./Core")
const Store = require("electron-store")
const store = new Store()
var crypto = require("crypto")

// PYTHON SHELL
let { PythonShell } = require("python-shell")

const pathMaker = args => args.map(arg => path.join(__dirname, arg))
const pythonScript = path.join(__dirname, "./python/my_script.py")

// const startPython = async () => {
//   PythonShell.run(path.join(__dirname, "./python/my_script.py"), options, function (err, results) {
//     if (err) throw err
//     // results is an array consisting of messages collected during execution
//     console.log("results: %j", results)
//   })
// }

const pythonPath = path.join(__dirname, "./python/env/bin/python2")

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

const CLOG = str => mainWindow.webContents.send("CLOG", str)

const startAutoUpdater = () => {
  const server = "https://hazeltest.vercel.app"
  const hazelUrl = `${server}/update/${process.platform}/${app.getVersion()}`
  app.isPackaged && autoUpdater.setFeedURL({ url: hazelUrl })
  const UPDATE_CHECK_INTERVAL = 1000 * 60 * 5

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, UPDATE_CHECK_INTERVAL)

  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail: "A new version has been downloaded. Restart the application to apply the updates.",
    }
    dialog.showMessageBox(dialogOpts).then(returnValue => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 220,
    height: 1400,
    icon: path.join(__dirname, "/icons/icon.icns"),
    minWidth: 180,
    maxWidth: 400,
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
    startAutoUpdater()
    // startPython()
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  !app.isPackaged && mainWindow.webContents.openDevTools({ mode: "detach" })
}

const iconName = path.join(__dirname, "./icons/transparent.png")

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

ipcMain.handle("rescanFolder", async (_, folderID) => {
  const actualArray = store.get("userData")
  const selectedFolder = actualArray.filter(item => item.folderID == folderID)[0]
  const sampleCloud = await getSampleCloud(selectedFolder.root, mainWindow)
  const tagCloud = await getTagCloud(sampleCloud)
  const tempoCloud = await getTempoCloud(sampleCloud)
  const toneCloud = await getToneCloud(sampleCloud)
  const result = {
    root: selectedFolder.root,
    sampleCloud,
    tempoCloud,
    toneCloud,
    tagCloud,
    folderName: selectedFolder.folderName,
    folderID: selectedFolder.folderID,
  }
  const newArray = actualArray.map(item => {
    if (item.folderID == folderID) {
      return result
    } else {
      return item
    }
  })
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

ipcMain.handle("startMatch", async (_, match) => {
  const options = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ["-u"], // get print results in real-time
    args: [
      match.target.path,
      match.reference.path,
      match.target.path.replace(".wav", "_processed.wav"),
    ],
  }
  return new Promise((resolve, reject) => {
    PythonShell.run(pythonScript, options, function (err, results) {
      if (err) throw err
      // results is an array consisting of messages collected during execution
      resolve(match.target.path.replace(".wav", "_processed.wav"))
    })
  })
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
  // json = JSON.stringify(userData) //convert it back to json
  // fs.writeFile(path.join(__dirname, "jsonFile.json"), json, "utf8", () => console.log("ok")) // write it back
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
