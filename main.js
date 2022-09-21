const { app, BrowserWindow, ipcMain, shell } = require('electron')
if (require('electron-squirrel-startup')) return app.quit();
const fs = require('fs')
const path = require('path')
 
let userlang = 'en'
const createWindow = () => {
    const win = new BrowserWindow({
        minWidth: 250,
        minHeight: 250,
        width: 500,
        height: 250,
        backgroundColor: '#000',
        titleBarStyle: 'hidden', /* hidden = cache la barre des titres */
        // transparent: true, /* true = rend le fond transparent */
        //movable: true,
        //focusable: true,
        opacity: 0.7,
        icon: './cct2.png',
        //alwaysOnTop: true,
        fullScreenable: false,
        movable: true,
        hasShadow: false,
        /*
        titleBarOverlay: {
            color: '#000',
            symbolColor: '#95D5A8',
            height: 10,
            width: 10
          }, //true, // true = default
        */
        titleBarOverlay: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            devTools: true,
            preload: path.join(__dirname, 'preload.js'),
            nativeWindowOpen: true,
        },
    })
    win.setAlwaysOnTop(true, 'normal')
    win.loadFile('index.html')
    win.webContents.send('fromMain', `Initialization ...`);
    ipcMain.handle('exit', () => {
        console.log('received exit from main')
        win.close()
    })
    ipcMain.handle('switchToEn', () => {
        userlang = 'en'
    })
    ipcMain.handle('switchToFr', () => {
        userlang = 'fr'
    })
    ipcMain.handle('switchToEs', () => {
        userlang = 'es'
    })
    ipcMain.handle('switchToIt', () => {
        userlang = 'it'
    })
    ipcMain.handle('switchToRu', () => {
        userlang = 'ru'
    })
    ipcMain.handle('switchToDe', () => {
        userlang = 'de'
    })
    ipcMain.handle('switchToTr', () => {
        userlang = 'tr'
    })
    ipcMain.handle('support', () => {
        shell.openExternal('https://discord.gg/cknUdH94Cn', {
            activate: true,
        })
    })
    ipcMain.on("toMain", (event, args) => {
        console.log(args)
        /*
        switch () {
            case value:
                
                break;
        
            default:
                break;
        }*/
    });
    ipcMain.handle('init', () => {
        win.webContents.send('fromMain', `Searching for /Logs in your %Document% ...`);
        fs.readdir(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs`, (error, folders) => {
            if (error) { console.error(error); return win.webContents.send('fromMain', `Error encountered...`); }
            win.webContents.send('fromMain', `Found :||green`)
            win.webContents.send('fromMain', `C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs||green`)
            win.webContents.send('fromMain', `Searching for the last child in this folder...`)

            fs.readdir(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}`, async (error, list) => {
                if (error) { console.error(error); return win.webContents.send('fromMain', `Error encountered !`); }
                win.webContents.send('fromMain', `Found :||green`)
                win.webContents.send('fromMain', `${folders[(folders.length - 1)]}||green`)
                win.webContents.send('fromMain', `Searching for a chat.log file in this folder...`)
                if (!list.find(file => file === 'chat.log')) { return win.webContents.send('fromMain', `chat.log not found inside ${folders[(folders.length - 1)]}. Please, write something in the in-game chat then restart the app ^^`) }
                // ici demander le choix de langue ?
                win.webContents.send('fromMain', `Found :||green`)
                win.webContents.send('fromMain', `/${folders[(folders.length - 1)]}/chat.log||green`)
                win.webContents.send('fromMain', `CLEAN_IT`)
                win.webContents.send('fromMain', `Starting to read the changes in chat.log :)||green`)
                let linesArray = []

                setInterval(() => {
                    fs.readFile(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}/chat.log`, (error, filedata) => {
                        if (error) { return console.error(error); }
                    });
                }, 200);
                fs.watch(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}/chat.log`, (eventType, filename) => {
                    if (eventType === 'change') {
                        fs.readFile(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}/chat.log`, 'utf8', (err, data) => {
                            const lines = data.split(/\r?\n/);
                            const lastline = lines[lines.length - 2];
                            if (!(/\]/).test(lastline)) return;
                            if (!linesArray.find(e => e == lastline)) {
                                linesArray.push(lastline);
                                setTimeout(() => {
                                    for (let i = 0; i < linesArray.length; i++) {
                                        if (linesArray[i] === lastline) { linesArray.splice(i, 1) }
                                    }
                                }, 500);
                                const logstimer = lastline.slice(0, 5);
                                let playername;
                                ((lastline.split('[')[1].split(' #')[0].trim().length) % 2 == 0) ? playername = lastline.split('[')[1].split(' #')[0].padEnd(25, ' ') : playername = lastline.split('[')[1].split(' #')[0].padEnd(16, ' ') + " ";
                                const translate = require('@iamtraction/google-translate');
                                translate(lastline.split('] ')[1].replace('#^#^', '^^'), { to: `${userlang}` }).then(res => {
                                    async function Send(time, type, name, text, color) {
                                        win.webContents.send('fromMain', `${time} ${type} ${name}: ${text} ||${color}`);
                                    }
                                    if ((/PRIVATE From/).test(lastline)) {

                                        Send(logstimer, 'PRIVATE FROM', playername, res.text, 'purple')

                                    } else if ((/PRIVATE To/).test(lastline)) {

                                        Send(logstimer, 'PRIVATE TO', playername, res.text, 'purple')

                                    } else if ((/team_/).test(lastline)) {

                                        Send(logstimer, 'TEAM', playername, res.text, 'cyan')

                                    } else if ((/clan_/).test(lastline)) {

                                        Send(logstimer, 'CLAN', playername, res.text, 'green')

                                    } else if ((/party_/).test(lastline) || (/custom_game/).test(lastline)) {

                                        Send(logstimer, 'PARTY', playername, res.text, 'blue')

                                    } else {

                                        Send(logstimer, 'GENERAL', playername, res.text, 'white')
                                    }
                                }).catch(err => {
                                    console.error(err);
                                });
                            }
                        })
                    };
                });
            });
        });
    })
}
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})