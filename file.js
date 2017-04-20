var utils = {};


/*
Electron
file-electron.js
*/
utils.file = (function(Electron){
	return {
		download : function(file){

		},
		cancelDownlad: function() {
            Electron.cancelDownload(this.fileUrl);
        },
        openFile: function (url) {
            // var localUrl = '/Users/zy/Downloads/index.php';
            var localUrl = this.message.content.localPath;
            var url = localUrl || this.fileUrl;
            var localPath = Electron.chkFileExists(url);
            if(localPath) {
                Electron.openFile(localPath);
            } else {
                // common.handleError('download-404');
                // this.downloadStatus = 'READY';   
            }
        },
        openFolder: function() {
            // var localUrl = '/Users/zy/Downloads/index.php';
            var localUrl = this.message.content.localPath;
            var url = localUrl || this.fileUrl;
            var localPath = Electron.chkFileExists(url);
            if(localPath) {
                Electron.openFileDir(localPath);
            } else {
                // common.handleError('download-404');
                // this.downloadStatus = 'READY'; 
            }
        }
	};
})(Electron);

/*
web
file-web.js
*/ 
utils.file = (function(){
	return {
		download : function(file){

		},
		cancelDownlad: null,
        openFile: function (url) {
        	location.href = url;
        },
        openFolder: null
	};
})();