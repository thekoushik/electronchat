const {app, BrowserWindow, Menu, Tray,dialog } = require('electron');
/*const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
*/

const path = require('path');
const url = require('url');
var chat=require('./utils/Chat');
const server = require('./utils/server');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null;
const iconPath=process.env.ELECTRON_START_URL ? path.join(__dirname, '/../public/') : path.join(__dirname, '/../build/');

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (shouldQuit)
  app.quit()

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    if(process.env.ELECTRON_START_URL) mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    tray = new Tray(iconPath+'favicon.ico');
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Game Mode', type: 'radio'},
        {label: 'Normal Mode', type: 'radio', checked: true},
        {label: 'About', click:()=>{
            dialog.showMessageBox(mainWindow,{
                type:"info",
                title:"Electron Chat App",
                message:"Electron Chat App",
                detail: "author: thekoushik"
            });
        }}
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
    /*tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    });*/

    chat.init(mainWindow,tray,dialog);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.