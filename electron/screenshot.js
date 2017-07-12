const ipcRenderer = require('electron').ipcRenderer

//暴露方法给页面dom注册调用
window.Electron = {
    screenShot: function(callback) {
    	console.log("screenShot callback");
        ipcRenderer.send('screenshot', callback);

        window.Electron.screenShotCallback = callback;
    }
};

//接收截图结果
ipcRenderer.on('screenshot', (event, data) => {
    window.Electron.screenShotCallback(data);
});