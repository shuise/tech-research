const {app, BrowserWindow, ipcMain, clipboard} = require('electron')
const path = require('path')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800, 
    height: 600,
    'webPreferences': {
          preload: path.join(__dirname, 'node_modules/', 'screenshot/screenshot.render.js') //111.给页面注入preload.js
      }
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/requirejs-in-node.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}


/*
todo 分离到screenshot.main.js
const {takeScreenshot} = require('./node_modules/screenshot/screenshot.main')
*/
const screencapture = require('screenshot/screencaptureDebug.node')
const appCapture = new screencapture.Main;

//444 screenshot function
const takeScreenshot = (callback) => {
    // logger.info('in screenCapture');
    // if(!appCapture && qt){
    //     appCapture = new qt.Main
    // }
    try{
        appCapture.screenCapture("", function(base64){
            if (win && win.webContents) {
                win.show()
                //向screenshot.js发送截图结果
                var clipboardData = clipboard.readImage();
                console.log(clipboardData.toDataURL());
                win.webContents.send('screenshot', clipboardData.toDataURL())
            }
        });
    } 
    catch(ex){
        // logger.error(ex.toString());
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  //create window
  createWindow();

  //screen reg
  //222.接收screenshot指令，来自 preload.js里的 screenShot
  ipcMain.on('screenshot', () => {
    takeScreenshot()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.