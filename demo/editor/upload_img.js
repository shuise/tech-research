(function(){
	document.domain="163.com";
	UM.registerUI('myupload', function( name ){
	
	    //该方法里的this指向编辑器实例
	    var me = this,
	        //实例化一个UMEDITOR提供的按钮对象
	        $button = $.eduibutton({
	            //按钮icon的名字， 在这里会生成一个“edui-icon-save”的className的icon box，
	            //用户可以重写该className的background样式来更改icon的图标
	            //覆盖示例见btn.css
	            'icon': 'myupload',
	            'title': me.options.lang === "zh-cn" ? "图片上传" : "upload img",
	            'click': function(){
	                //在这里处理按钮的点击事件
	                //点击之后执行save命令
	                me.execCommand( name );
	            }
	        });
	
	    //返回该按钮对象后， 该按钮将会被附加到工具栏上
	    return $button;
	
	});
	//注册一个名为“myupload”的插件
	UM.plugins['myupload'] = function () {
	    UM.commands[ 'myupload' ] = {
	        execCommand: function (cmdName) {
	        	var me = this;
				var tpl=['<div class="edui-modal editor_dialog_upload" id="editor_dialog_upload_img" tabindex="-1" style="width: 400px; z-index: 1001; margin-left: -200px; display: block;">',
							'<div class="edui-modal-header">',
							'<div class="edui-close img_close"></div>',
							'<h3 class="edui-title">图片上传</h3>',
						 '</div>',
						 '<div class="edui-modal-body">',
						 	'<div class="img_display"></div>',
						 	'<span class="label_til">图片上传:</span>',
						 	'<div class="label_cnt">',
						 		'<button type="button" class="upload_img_btn edui-btn">上传</button>',
						 		'<p class="help_tips">上传图片大小应在2M以内,格式：jpg、png、bmp等</p>',
							'</div>',		
						  '</div>',
						  '<div class="edui-modal-footer"><div class="edui-modal-tip"></div><div class="edui-btn edui-btn-primary img_ok" data-ok="modal">确认</div><div class="edui-btn img_close">取消</div></div>',
						'</div>',
						'<div class="edui-modal-backdrop" style="z-index: 1000;"></div>'].join('');
				var dialog = $("<div></div>");
				dialog.html(tpl);
				$("body").append(dialog);
				var close = dialog.find(".img_close");
				var ok = dialog.find(".img_ok");
				var imgUploadBtn =  dialog.find(".upload_img_btn");
				var imgDisplay = dialog.find(".img_display");
				var imgsrc = null;
				NE.uploadImg(imgUploadBtn[0],function(data){
					if(data&&data.ourl){
						imgsrc = data.ourl; 
						var img = new Image();
						img.src = data.ourl;
						img.onload = function(){
							img.setAttribute("img_width",img.width);
							img.setAttribute("img_height",img.height);
							imgDisplay.html("");
							imgDisplay.append(img);
						};						
					}else{
						alert("上传失败！");
					}			
				});				
				close.click(function(){
					dialog.remove();
				});
				ok.click(function(){
					if(imgsrc){
						if(imgDisplay.find("img").attr("img_width")>500){
							imgDisplay.find("img").css('width',500);
						}
						var html = imgDisplay.html();
						me.execCommand('insertHtml', html, true);
					}
					dialog.remove();
				});
	        },
	        queryCommandState: function (cmdName) {
	            return 0;
	        },
	        notNeedUndo: 1
	    };
	
	};		
})();

