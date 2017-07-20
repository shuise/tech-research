/*
https://electron.atom.io/docs/api/ipc-main/
*/
const ipcRenderer = require('electron').ipcRenderer

//暴露方法给页面dom注册调用
window.Electron = {
    screenShot: function(callback) {
    	console.log("screenShot callback");
        ipcRenderer.send('screenshot', callback);

        window.Electron.screenShotCallback = callback;
    },
    upgrade: function(params){
    	var { updateList} = params;
    	ipcRenderer.send('upgrade', updateList);
    }
};

//接收截图结果
ipcRenderer.on('screenshot', (event, data) => {
    window.Electron.screenShotCallback(data);
});


/*
https://www.npmjs.com/package/zip-dir
*/ 
window.RongDesktop = {
	zipDir : function(callback){
			//zip dir
		let zipdir = require('zip-dir');
		let _dir = "/Users/xuezhengfeng/rongcloud/websdk-demo";
		let name = "websdk-demo" + ".zip";
		const saveTo = __dirname + "/" + name;

		zipdir(_dir, { saveTo: saveTo}, function (err, buffer) {
			callback({
				path : saveTo,
				data : buffer
			});
		  // `buffer` is the buffer of the zipped file 
		  // And the buffer was saved to `~/myzip.zip` 
		});
	}
};