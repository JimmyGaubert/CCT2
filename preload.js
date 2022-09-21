const { contextBridge, ipcRenderer, ipcMain } = require('electron')
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // we can also expose variables, not just functions
})
contextBridge.exposeInMainWorld('stages', {
    init: () => ipcRenderer.invoke('init'),
})
contextBridge.exposeInMainWorld('msg', {
    send: (channel, data) => {
        let validChannels = ["toMain"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
})
contextBridge.exposeInMainWorld('buttons', {
    support: () => ipcRenderer.invoke('support'),
    switchToEn: () => ipcRenderer.invoke('switchToEn'),
    switchToFr: () => ipcRenderer.invoke('switchToFr'),
    switchToEs: () => ipcRenderer.invoke('switchToEs'),
    switchToIt: () => ipcRenderer.invoke('switchToIt'),
    switchToRu: () => ipcRenderer.invoke('switchToRu'),
    switchToDe: () => ipcRenderer.invoke('switchToDe'),
    switchToTr: () => ipcRenderer.invoke('switchToTr'),
    exit: () => ipcRenderer.invoke('exit'),
})