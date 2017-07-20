const {app, BrowserWindow, ipcMain, clipboard} = require('electron')
const conf = require('../../module-conf.json');
//333 screenshot module,mac only
const screencapture = require(conf['screencapture'])
const appCapture = new screencapture.Main;

const takeScreenshot = (callback) => {
    try{
        appCapture.screenCapture("", function(base64){
                var clipboardData = clipboard.readImage();
                var error = null;
                callback(error, clipboardData.toDataURL());
        });
    } 
    catch(ex){
        console.log(ex);
    }
}

module.exports = {
    takeScreenshot : takeScreenshot
};