YUI({
	combine : true,
	comboBase : 'http://img4.cache.netease.com/service/combo?'
}).use('uploader', 'overlay', "json-parse",function (Y) {
	if (logined) {
		if (Y.Uploader.TYPE != "none") {
			var selectFile = Y.one('#selectFile'), //浏览
			selectFileBtn = Y.one('#selectFileBtn'), //选择按钮
			fileInput = Y.one('#fileInput'),
			uploading = Y.one("#uploading"), //上传进度box
			uploadProgess = Y.one('#uploadProgess'), //进度条
			//uploadRate = Y.one('#uploadRate'), //速度
			timeRemaining = Y.one('#timeRemaining'), //剩余时间
			uploadFinish = Y.one('#uploadFinish'), //上传完成
			uploadSuccess = Y.one('#uploadSuccess'), //上传成功
			videoInfo = Y.one('#videoInfo'), //视频信息
			bytesLoaded = 0,
			timer,
			file, //文件
			fileName,
			fileSize,
			videoForm = Y.one('#videoForm'), //视频信息box
			cancelUploadOl, //弹窗
			errorUploadOl,
			videoId, //视频id
			videoData = {
				type : 60
			},
			videoInfoForm = videoForm.one('form'),
			videoType = '原创', //存储视频类型用于显示
			hasFilledIn = false, //是否提交信息
			isUploadComplete = false, //是否上传完
			inputTitle = Y.one('#inputTitle'),
			inputDescription = Y.one('#inputDescription'),
			inputTag = Y.one('#inputTag'),
			inputType=Y.one('#inputType'),
			wordCount = Y.one('#descriptionTips span'),
			unloadEvent,
			uploader = new Y.Uploader({
					selectFilesButton : Y.one('#selectFilesButton'),
					buttonClassNames : {
						hover :
						'v-upload-btn-hover',
						active :
						'',
						disabled :
						'',
						focus :
						''
					},
					swfURL : "http://swf.ws.126.net/v/flashuploader.swf?" + Math.random(),
					uploadURL : "http://ugcv.ws.netease.com/video/transcode?watermark=1&enctype=1&ugc=1"
				});
			uploader.render('#selectFileBtn');
			//发送视频信息
			function sendvideoForm() {
				hasFilledIn = false;
				isUploadComplete = false;
				document.domain = "163.com";
				document.getElementById('crossdomain').contentWindow.Y.io('http://so.v.163.com/ugc/addvideoasync.do', {
					method : 'POST',
					data : videoData,
					on : {
						success : function (id,o) {
							data = Y.JSON.parse(o.responseText);
							if(data.info=='add success'){
								uploading.addClass('hidden');
								videoInfo.addClass('hidden');
								uploadFinish.addClass('hidden');
								videoForm.addClass('hidden');
								uploadSuccess.removeClass('hidden');
								uploadSuccess.one('#videoCover').setContent('<img  src="' + videoData.imagepath + '" width="120" height="90" alt="' + videoData.title.replace(/"|'/g, '') + '">');
								window.onbeforeunload=null;
								
								videoCallbacked && videoCallbacked(data);
							}
						}
					}
				});
			}
			//秒算时间
			function timeConver(scd) {
				var h = 0,
				m = 0,
				s = 0,
				resultString;
				if (scd >= 3600) {
					h = Math.floor(scd / 3600);
					if (scd - h * 3600 > 0) {
						m = Math.floor((scd - h * 3600) / 60);
						if (scd - h * 3600 - m * 60 > 0) {
							s = scd - h * 3600 - m * 60;
						}
					};
					resultString = h + '\u5c0f\u65f6' + m + '\u5206' + s + '\u79d2';
				} else if (scd >= 60) {
					m = Math.floor(scd / 60);
					if (scd - m * 60 > 0) {
						s = scd - m * 60;
					};
					resultString = m + '\u5206' + s + '\u79d2';
				} else {
					s = scd;
					resultString = s + '\u79d2';
				};
				return resultString;
			}
			//截字
			function cutString(str,num){
				var strReg = /[^x00-xff]/g,
				strLen = str.replace(strReg, 'aa').length,
				newStr,
				fullWidthNum=num/2;
				if (strLen > num) {
					for (i = fullWidthNum; i < strLen; i++) {
						newStr = str.substr(0, i).replace(strReg, "aa");
						if (newStr.length >= num) {
							return str.substr(0, i);
						}
					};
				}else{
					return str;
				}
			}
			
			//选择文件
			uploader.after("fileselect", function (event) {
				var suffix;
				file = event.fileList[0];
				fileName=file.get('name').replace(/<|>/g, '');
				suffix=fileName.substring(fileName.lastIndexOf('.'));
				videoData.title = cutString(fileName.replace(suffix,''),60);
				fileName=videoData.title+suffix;
				fileSize = file.get('size');
				selectFileBtn.setStyle('z-index', -1);
				selectFile.addClass('hidden');
				uploading.removeClass('hidden');
				//videoForm.removeClass('hidden');
				Y.all('.fileUploading').each(function (node) {
					node.setContent(fileName);
				});
				Y.one('#inputTitle').set('value', videoData.title);
				uploader.uploadAll();
				unloadEvent=window.onbeforeunload = function (e) {
					e = e || window.event;
					e.returnValue = '\u89c6\u9891\u4e0a\u4f20\u64cd\u4f5c\u5c1a\u672a\u5b8c\u6210\uff0c\u60a8\u7684\u64cd\u4f5c\u4f1a\u5bfc\u81f4\u89c6\u9891\u4e0a\u4f20\u88ab\u53d6\u6d88\uff0c\u662f\u5426\u786e\u5b9a\u5173\u95ed\u7a97\u53e3\uff1f';
					return '\u89c6\u9891\u4e0a\u4f20\u64cd\u4f5c\u5c1a\u672a\u5b8c\u6210\uff0c\u60a8\u7684\u64cd\u4f5c\u4f1a\u5bfc\u81f4\u89c6\u9891\u4e0a\u4f20\u88ab\u53d6\u6d88\uff0c\u662f\u5426\u786e\u5b9a\u5173\u95ed\u7a97\u53e3\uff1f';
				}
			});
			//上传进度
			uploader.on("uploadprogress", function (event) {
				//uploadProgess.one('span').setContent(event.percentLoaded + '%');
				uploadProgess.one(".bar").setStyle("width", event.percentLoaded + "%");
				if (!timer) {
					timer = Y.later(1000, event, function () {
							var rate = (event.bytesLoaded - bytesLoaded) / 1000, //速度：byte/1000=kb
							secondsRemain = Math.floor((event.bytesTotal - bytesLoaded) / 1000 / rate); //剩余秒数：kb/rate=s取整
							//uploadRate.setContent(rate.toFixed(2) + 'KB/s');
							bytesLoaded = event.bytesLoaded;
							//timeRemaining.setContent(timeConver(secondsRemain));
							timer = undefined;
						});
				}
				if (event.percentLoaded == 100) {
					//timeRemaining.setContent('0秒');
					timer.cancel();
				}
			});
			//上传结束
			uploader.on("uploadcomplete", function (event) {
				var msgData=Y.JSON.parse(event.data);
				if (msgData.state == 'success') {
					videoData.rvideoid=msgData.vid;
					videoData.imagepath=msgData.snapshot[2]||msgData.snapshot[1]||msgData.snapshot[0]||'';
					videoData.filepath=msgData.filepath;
					videoData.soureip=msgData.soureip;
					videoData.playlength=msgData.playlength;
					videoData.filename=msgData.filename;
					isUploadComplete = true;
					if (hasFilledIn) {
						sendvideoForm();
					} else {
						uploading.addClass('hidden');
						uploadFinish.removeClass('hidden');
					}
					videoInfoForm.one(".v-upload-form-submit")._node.click();
				} else {
					Y.on('click', function (e) {
						e.preventDefault();
						window.onbeforeunload=null;
						window.location.reload();
					}, '.errorUploadY');
					mask.setStyle('display', 'block');
					errorUploadOl.centered();
					errorUploadOl.show();
				}
			});
			uploader.on('uploaderror',function(e){
				Y.log(e);
			});
			//取消上传
			Y.one('#cancelUpload').on('click', function (e) {
				e.preventDefault();
				var closeEvent = Y.on('click', function (e) {
						e.preventDefault();
						cancelUploadOl.hide();
						mask.setStyle('display', 'none');
						closeEvent.detach();
					}, '.cancelUploadN'),
				confirmEvent = Y.on('click', function (e) {
						e.preventDefault();
						window.onbeforeunload=null;
						window.location.reload();
					}, '#cancelUploadY');
				mask.setStyle('display', 'block');
				cancelUploadOl.centered();
				cancelUploadOl.show();
			});
			//提交信息
			videoInfoForm.on('submit', function (e) {
				e.preventDefault();
				var title = inputTitle.get('value'),
				description = inputDescription.get('value'),
				tag = inputTag.get('value');
				hasFilledIn = true;
				if (title) {
					videoData.title = title.replace(/<|>/g, '');
				}
				if (description) {
					videoData.description = description.replace(/<|>/g, '');
				}
				if (tag && tag != '\u586b\u5199\u8fd9\u4e2a\u89c6\u9891\u7684\u5173\u952e\u8bcd\uff0c\u4f7f\u4f60\u7684\u89c6\u9891\u66f4\u5bb9\u6613\u88ab\u522b\u4eba\u627e\u5230') {
					videoData.tag = tag.replace(/，/g, ',').replace(/<|>/g, '');
				}
				if (!isUploadComplete) {
					videoForm.addClass('hidden');
					videoInfo.removeClass('hidden');
					videoInfo.one('#titleInfo').setContent(videoData.title);
					videoInfo.one('#descriptionInfo').setContent(videoData.description);
					videoInfo.one('#tagInfo').setContent(videoData.tag);
					videoInfo.one('#typeInfo').setContent(videoType);
				} else {
					sendvideoForm();
				}
			});
			//继续上传
			Y.one('#uploadBtn').on('click', function (e) {
				e.preventDefault();
				window.location.reload();
			});
			//修改视频信息
			Y.one('#modifyVideoInfo').on('click', function () {
				hasFilledIn = false;
				videoInfo.addClass('hidden');
				videoForm.one('#cancelModify').removeClass('hidden');
				videoForm.removeClass('hidden');
			});
			//取消修改
			Y.one('#cancelModify').on('click', function (e) {
				e.preventDefault();
				hasFilledIn = true;
				videoForm.addClass('hidden');
				videoInfo.removeClass('hidden');
				this.addClass('hidden');
			});
			/*表单开始*/
			//关闭成功提示
			Y.one('#closeTip').on('click', function () {
				this.ancestor().addClass('hidden');
			});
			//标题
			inputTitle.on('keyup', function () {
				var valueStr=this.get('value'),
				cutValueStr=cutString(valueStr,60);
				if(valueStr!=cutValueStr){
					this.set('value',cutValueStr);
				}
			});
			//简介
			inputDescription.on('focus', function () {
				Y.one('#descriptionTips').setStyle('visibility', 'visible');
			});
			inputDescription.on('blur', function () {
				Y.one('#descriptionTips').setStyle('visibility', 'hidden');
			});
			inputDescription.on('keyup', function () {
				var str = this.get('value'),
				strReg = /[^x00-xff]/g,
				strLen = str.replace(strReg, 'aa').length,
				newStr;
				if (strLen > 500) {
					for (i = 250; i < strLen; i++) {
						newStr = str.substr(0, i).replace(strReg, "aa");
						if (newStr.length >= 500) {
							this.set('value', str.substr(0, i));
							break;
						}
					};
					strLen = 500;
				}
				wordCount.setContent(Math.floor((500 - strLen) / 2));
			});
			//标签
			inputTag.on('focus', function () {
				if (this.get('value') == '\u586b\u5199\u8fd9\u4e2a\u89c6\u9891\u7684\u5173\u952e\u8bcd\uff0c\u4f7f\u4f60\u7684\u89c6\u9891\u66f4\u5bb9\u6613\u88ab\u522b\u4eba\u627e\u5230') {
					Y.one('#tagTips').setStyle('visibility', 'visible');
					this.removeClass('gray');
					this.set('value', '');
				}
			});
			inputTag.on('blur', function () {
				if (this.get('value') == '') {
					Y.one('#tagTips').setStyle('visibility', 'hidden');
					this.addClass('gray');
					this.set('value', '\u586b\u5199\u8fd9\u4e2a\u89c6\u9891\u7684\u5173\u952e\u8bcd\uff0c\u4f7f\u4f60\u7684\u89c6\u9891\u66f4\u5bb9\u6613\u88ab\u522b\u4eba\u627e\u5230');
				}
			});
			inputTag.on('keyup', function () {
				var valueStr=this.get('value'),
				cutValueStr=cutString(valueStr,60);
				if(valueStr!=cutValueStr){
					this.set('value',cutValueStr);
				}
			});
			//类型
			Y.on('click', function () {
				videoData.type = this.get('value');
				videoType = this.next().getContent();
			}, '#inputType input');
			/*表单结束*/
			Y.on('domready', function () {
				var cancelAlert = Y.one('#cancelAlert'),
				errorAlert = Y.one('#errorAlert');
				cancelUploadOl = new Y.Overlay({
						srcNode : cancelAlert,
						visible : false,
						zIndex : 10000,
						render : true
					});
				errorUploadOl = new Y.Overlay({
						srcNode : errorAlert,
						visible : false,
						zIndex : 10000,
						render : true
					});
				cancelAlert.removeClass('hidden');
				errorAlert.removeClass('hidden');
			});
			inputTag.set('value', '\u586b\u5199\u8fd9\u4e2a\u89c6\u9891\u7684\u5173\u952e\u8bcd\uff0c\u4f7f\u4f60\u7684\u89c6\u9891\u66f4\u5bb9\u6613\u88ab\u522b\u4eba\u627e\u5230');
			inputDescription.set('value', '');
		}
	} else {
		mask.setStyle('display', 'block');
		loginOl.centered();
		loginOl.show();
		Y.on('click', function () {
			if (Y.UA.ie) {
				if (history.length == 0) {
					window.location.href = "http://v.163.com";
				} else {
					window.history.back();
				}
			} else {
				if (history.length == 1) {
					window.location.href = "http://v.163.com";
				} else {
					window.history.back();
				}
			}
		}, '.v-login-close');
	}
});
