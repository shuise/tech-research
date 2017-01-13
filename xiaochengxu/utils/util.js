module.exports = (function(wx){
    /*
    https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html#wxrequestobject

    1 url 中不能有端口
    2 链接默认和最大超时时间都是 60s
    3 referer固定为https://servicewechat.com/{appid}/{version}/page-frame.html，
        {appid} 为小程序的 appid，
        {version} 为小程序的版本号，版本号为 0 表示为开发版。

    */ 
    function request(option, callbacks) {
        var url = option.url;
        var method = option.method || "get";
            method = method.toUpperCase();
        var data = option.data || {};
        var header = option.header || {};

        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            method : method,
            data: data,
            header : header,
            success: callbacks.success,
            fail: callbacks.fail
        });
    }

    /*
    option = {url,method,data={},header={}}
    callbacks = {open,close,message,error};

    socket(option,{
        open : function(_socket,res){
            //发送消息
            var msg = {};
            _socket.sendSocketMessage({
              data:msg
            });

            //关闭
            _socket.closeSocket();
        }
    });
    */ 
    function socket(option, callbacks){
        var url = option.url;
        var method = option.method || "get";
            method = method.toUpperCase(); //必须大写
        var data = option.data || {};
        var header = option.header || {};

        wx.connectSocket({
            url: url,
            data: data,
            method: method,
            header: header
        });

        wx.onSocketOpen(function(res) {
            callbacks.open(wx,res);
        });
        wx.onSocketError(callbacks.error);

        wx.onSocketMessage(callbacks.message);

        wx.onSocketClose(callbacks.close);
    }



    function file(){
        /*
        https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-file.html?t=2017112#wxuploadfileobject
        */ 
        function open(filePath,fail){
            wx.openDocument({
                filePath: filePath,
                success: function (res) {
                    console.log('打开文档成功')
                },
                fail : fail
            })
        }

        function save(res,callback){
            var tempFilePath = res.tempFilePath
            wx.saveFile({
                tempFilePath: tempFilePath,
                success: function(res) {
                    var savedFilePath = res.savedFilePath;
                    callback(res);
                }
            });
        }

        function upload(files,option,callbacks){
            // var files = select.result;
            var url = option.url;
            var data = option.data;
            files.forEach(function(file){
                var name = 'file-' + new Date().getTime(); //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
                wx.uploadFile({
                    url: url, //仅为示例，非真实的接口地址
                    filePath: file,
                    name: name,
                    formData: data,
                    success: function(res){
                        res.data.name = name;
                        callbacks.success(res);
                    },
                    fail : callbacks.fail
                });
            });
        }

        function download(filePath,callbacks){
            wx.downloadFile({
                url: filePath,
                success: function (res) {
                    var tempFilePath = res.tempFilePath 
                    callbacks.success(tempFilePath);
                },
                fail : callbacks.fail
            });
        }

        return {
            upload : upload,
            download : download,
            save : save,
            open : open
        }
    }

    function image(){
        /*
        https://mp.weixin.qq.com/debug/wxadoc/dev/api/media-picture.html?t=2017112#wxchooseimageobject
        */
        function select(option,callbacks){
            var count = option.count || 1;
            var sizeType = option.sizeType || "compressed"; //原图、压缩图
            var sourceType = option.sourceType || "album,camera"; //相册、相机
            wx.chooseImage({
                count: count,
                sizeType: sizeType.split(","), 
                sourceType: sourceType.split(","), 
                success: function (res) {
                    //照片的本地文件路径列表，可作为img显示
                    var tempFilePaths = res.tempFilePaths;
                    callbacks.success(tempFilePaths);
                },
                fail : function(res){
                    callbacks.fail(res);
                }
            });
        }

        function getThumb(filePath, callback){
            var id = getUid();
            var ctx = wx.createCanvasContext(id)
                ctx.drawImage(filePath, 0, 0, 150, 100);
                ctx.draw();
            wx.canvasToTempFilePath({
                canvasId: id,
                success(res) {
                    //todo tempFilePath -> url、base64
                    callback(res.tempFilePath)
                } 
            });
        }

        function preview(urls){
            wx.previewImage({
                urls: urls // 需要预览的图片http链接列表
            }); 
        }

        return {
            select : select,
            getThumb: getThumb,
            preview : preview
        };
    }


    /*
    https://mp.weixin.qq.com/debug/wxadoc/dev/api/data.html?t=2017112#wxsetstorageobject
    */ 
    function cache(){
        function set(key, value){
            wx.setStorageSync(key, value);
        }

        function get(key){
            return wx.getStorageSync(key);
        }
        
        function remove(key){
            wx.removeStorageSync(key);
        }

        function search(keyword){
            var res = wx.getStorageInfoSync();
            var keys = res.keys;
            var result = {};
            keys.forEach(function(key){
                if(key.indexOf(keyword) > -1){
                    result[key] = get(key);
                }
            });
            return result;
        }

        return{
            set : set,
            get : get,
            search : search,
            remove : remove
        }
    }

    function getUid(){
        return 'Rong' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
    }

    return {
        getUid : getUid,
        request : request,
        socket : socket,
        image : image(),
        file : file(),
        cache : cache()
    };
})(wx);