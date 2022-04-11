const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
  startDrag: file => {
    ipcRenderer.send("ondragstart", file)
  },
  showDialog: async () => ipcRenderer.invoke("dialog:open"),
  getData: async () => ipcRenderer.invoke("getData"),
  getRawData: async file => ipcRenderer.invoke("getRawData", file),
  getClouds: async sampleArray => ipcRenderer.invoke("getClouds", sampleArray),
  deleteFolder: async folderID => ipcRenderer.invoke("deleteFolder", folderID),
  replaceTrack: async Track => ipcRenderer.invoke("replaceTrack", Track),
  receive: (channel, func) => {
    let validChannels = ["sampleProcessing", "CLOG"]
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      const subscription = (event, ...args) => func(...args)
      ipcRenderer.on(channel, subscription)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
  },
})
