function musicPlayer(obj,data,texts,temp){
	if(!obj){
		alert('obj不存在');
		return false;
	}
	if(data.constructor !== Array && data.length == 0){
		alert('数据有误');
		return false;
	}
	var textsPadding = {
		title : '请稍等…',
		volume : '音量控制:',
		muted : '静音',
		prew : '上首',
		next : '下首',
		play : '播放',
		stop : '暂停',
		circle : '循环',
		single : '单曲',
		add : '添加歌曲',
		clear : '清空',
		};		
	var tempPadding = {
		main : ['<section class="mp_audio">{audio}</section>',
				'<section class="mp_panel">',
				'	<div class="mp_title">{title}</div>',
				'	<div class="mp_pbar"><div class="mp_prog"></div></div>',
				'	<div class="mp_time">00:00/00:00</div>',
				'	<div>',
				'		<span class="mp_volume">',
				'			<strong>{volume}</strong><span class="mp_volume_slide">{vol_slide}</span>',
				'		</span>',
				'		<span class="mp_muted">{muted}</span>',
				'		<br style="clear:both" />',
				'	</div>',
				'	<section class="mp_btns">',
				'		<span class="mp_prew">{prew}</span>',
				'		<span class="mp_play">{stop}</span>',
				'		<span class="mp_next">{next}</span>	',
				'		<span class="mp_circle mp_now">{circle}</span>	',
				'		<span class="mp_single">{single}</span>',
				'		<span class="mp_add">{add}</span>',
				'		<span class="mp_clear">{clear}</span>',
				'	</section>',
				'</section>',
				'<div class="mp_list"><ul>{list}</ul><div>'].join(""),
		list : '<li><a href="{url}" class="mp_item">{singer}  -- {name}</a><a href="javascript:void(0)" class="mp_del">X</a></li>'				
		}				
	var texts = texts || {};
		texts = HE.copy(texts,textsPadding);
	var temp = temp || {};	
		temp = HE.copy(temp,tempPadding);
	this.obj = obj;
	this.temp = temp;	
	this.data = data;
	this.texts = texts;
	this.player = [].join('');
	this.index = 0;
	this.len = data.length;
	this.mode = 'circle';
}
musicPlayer.prototype.createUI = function(){
	var obj = this.obj;
	var temp = this.temp;
	var data = this.data;
	var texts = this.texts;
		texts.audio = '<audio></audio>';
		texts.vol_slide = '<em style="width:100%"></em>';
		
		if(this.geter('audio')){
			texts.list = this.geter('audio');
			this.len = this.geter('len')/1;
		}else{
			texts.list = HE.substitute(temp.list,data);
		}	
		obj.innerHTML = HE.substitute(temp.main,texts);
		HE.addClass(obj,'music_player');	
	
	this.index = 0;
	HE.array.forEach(data,function(item,index){
		if (item.play && item.play == 1){
			this.index = index;
		}
	});	
}
musicPlayer.prototype.getObjs = function(){
	var obj = this.obj;
	return {
		play : HE.$('span.mp_play',obj)[0],
		prew : HE.$('span.mp_prew',obj)[0],
		next : HE.$('span.mp_next',obj)[0],
		single : HE.$('span.mp_single',obj)[0],
		circle : HE.$('span.mp_circle',obj)[0],
		add : HE.$('span.mp_add',obj)[0],
		clear : HE.$('span.mp_clear',obj)[0],
		
		title : HE.$('div.mp_title',obj)[0],
		prog : HE.$('div.mp_prog',obj)[0],
		time : HE.$('div.mp_time',obj)[0],
		volume : HE.$('span.mp_volume_slide',obj)[0],
		muted : HE.$('span.mp_muted',obj)[0],
		
		audio : HE.$('section.mp_audio audio',obj)[0],
		list : HE.$('div.mp_list ul',obj)[0],
		items : HE.$('div.mp_list li a.mp_item',obj),
		dels : HE.$('div.mp_list li a.mp_del',obj)
	}	
}
musicPlayer.prototype.oprator = function(){
	var _this = this;
	var objs = _this.getObjs();
	var player = objs.audio;
	var len = this.len;
	var list = objs.list;
	var items = objs.items;
	var dels = objs.dels;
	_this.playNow(_this.index);
	addevent(player,'ended',function(){
		_this.playNext();
	});
	addevent(player,'timeupdate',function(){
		_this.progBar();
	});
	objs.prog.onclick = function(event){
		_this.progSlide(this,event,player);
	}
	objs.next.onclick = function(){
		_this.playNext();
	}
	objs.prew.onclick = function(){
		_this.playPrew();
	}
	objs.play.onclick = function(){
		_this.trans(this,player);
	}
	objs.single.onclick = function(){
		_this.modeTrans(this,'single');
	}
	objs.circle.onclick = function(){
		_this.modeTrans(this,'circle');
	}	
	objs.muted.onclick = function(){
		_this.muted(this,player);
	}
	objs.volume.onclick = function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var tags = target.tagName.toLowerCase();
		if(target == this || tags == 'em'){
			_this.volumSlide(this,event,player); 
		}
	}	
	objs.add.onclick = function(){
		_this.add(this); 
	}	
	objs.clear.onclick = function(){
		_this.clear(list); 
	}
	player.onerror = function(){
		_this.playNext();
	}	
	HE.array.forEach(items,function(item,index){
		item.onclick = function(){
			_this.playNow(index);
			_this.index = index;
			return false;
		}
	});
	HE.array.forEach(dels,function(item,index){
		item.onclick = function(){
			_this.remove(list,items,index);
			return false;
		}
	});	
}
musicPlayer.prototype.playNow = function(index){
	var objs = this.getObjs();
	var player = objs.audio;
	var items = objs.items;
	if(!items[index]){return false;}
	var title = items[index].innerHTML;
	document.title = title; 
	objs.title.innerHTML = title;
	
	HE.array.forEach(items,function(item){
		HE.removeClass(item,'now');
	});
	HE.addClass(items[index],'now');
	this.index = index;
	
	player.src = items[index].href;
	player.title = title;
	player.load();
	player.autoplay = 'true';
}
musicPlayer.prototype.playNext = function(){
	var index = this.index;
	if(this.mode == 'circle'){
		index = (this.index + 1)%this.len;
		this.index = index;
	}
	this.playNow(index);
}
musicPlayer.prototype.playPrew = function(){
	if(this.mode == 'circle'){
		if(this.index == 0){this.index = this.len;}
		this.index -= 1;
	}	
	this.playNow(this.index);
}	
musicPlayer.prototype.trans = function(obj,player){
	if (player.autoplay) {
		player.pause();
		player.autoplay = false;
		obj.innerHTML = this.texts.play;
	}else{
		player.play();
		player.autoplay = true;
		obj.innerHTML = this.texts.stop;
	}	
}
musicPlayer.prototype.modeTrans = function(obj,mode){
	var objs = this.getObjs();
	this.mode = mode;		
	HE.removeClass(objs.single,'now');
	HE.removeClass(objs.circle,'now');
	HE.addClass(obj,'now');
}
musicPlayer.prototype.volumSlide = function(obj,event,player){
	var v =  getOffsetX(obj,event);
	var w = parseInt(obj.clientWidth);
	player.volume = v;
	HE.$('em',obj)[0].style.width = v*w + "px";
}
musicPlayer.prototype.muted = function(obj,player){
	if (player.muted){
		player.muted = false;
		HE.removeClass(obj,'gray');			
	}else{
		player.muted = true;
		HE.addClass(obj,'gray');
	}
}	
musicPlayer.prototype.progBar = function(){
	var objs = this.getObjs();
	var player = objs.audio;
	var time = objs.time;
	var prog = objs.prog;
	var progBar = prog.parentNode;
	if(HE.$('em',progBar).length == 0){
		var id = HE.guid();
		var	em = HE.objMock(id,progBar,'em');
			em.style.width = '1px';
	}
	var prog_grade = HE.$('em',progBar)[0];	
	if(timeFormat(player.duration)<=0){return false;}

	var width = parseInt(progBar.clientWidth);
		time.innerHTML = ['<em>',timeFormat(player.currentTime),'</em>/',timeFormat(player.duration)].join("");
		prog_grade.style.width = width * player.currentTime/player.duration + "px";
}
musicPlayer.prototype.progSlide = function(obj,event,player){
	var v1 =  getOffsetX(obj,event);
	player.currentTime = player.duration*v1;	
}
musicPlayer.prototype.volumBar = function(v){
	MusicPlayer.Obj.volume = v;
	var w = parseInt(MusicPlayer.Btns._soud.clientWidth);
	MusicPlayer.Btns._soud.getElementsByTagName("em")[0].style.width = w*v + "px";
}
musicPlayer.prototype.add = function(btn){
	var _this = this;
	var list = _this.getObjs().list;
	var html = ['<div class="mp_add_pop">',
				'<h2>添加歌曲</h2>',
				'<div style="padding:30px 15px;">',
				'	<p>网络文件： <input type="text" class="text" value="http://www.kf-cn.com/cn/miimg/sound.mp3" />',
				'	<input type="submit" class="submit" vluae="添加" /></p>',
				'	本地文件： <input type="file" class="file" multiple="true" /> ',
				'	<a href="javascript:void(0)" class="mp_pop_close">X</a>',
				'</div></div>'].join('');
	var pop1 = new popOut(html,{top:100,mask:true});
	pop1.init();
	var pop = pop1.popBox;
	var btn = HE.$('a',pop)[0];
	var sub = HE.$('input.submit',pop)[0];
	sub.onclick = function(){
		var obj = HE.$('input.text',pop)[0];
		if (isURL(obj.value)){
			var url = obj.value;
			var singer = url.substring(url.lastIndexOf('/')+1).split('.')[0];
			addSong(url,singer);
		}else{
			alert('格式有误');
		}
	}
	var file = HE.$('input.file',pop)[0];
	btn.onclick = function(){
		pop1.popClose();
	}
	file.onchange = function(myFiles){
		myFiles = myFiles.srcElement.files;
		for (var i = 0, f; f = myFiles[i]; i++) {
			var imageReader = new FileReader();
			imageReader.onload = (function(aFile) {
				return function(e) {
					var singer = aFile.fileName.split('.')[0];
					var url = getURL(aFile);
					addSong(url,singer);
				};
			})(f);
			imageReader.readAsDataURL(f);
		}
	}
	function addSong(url,singer,name){
		var name = name || '';
		_this.len += 1;
		list.innerHTML += HE.substitute(_this.temp.list,{url:url,singer:singer,name:name});
		//_this.playNow(_this.len-1);
		_this.saver(list.innerHTML,_this.len);
		_this.getObjs();
		_this.oprator();
	}
	function getURL(f){
		var url;
		if(window.createObjectURL){
		  url = window.createObjectURL(f)
		}else if(window.createBlobURL){
		  url = window.createBlobURL(f)
		}else if(window.URL && window.URL.createObjectURL){
		  url = window.URL.createObjectURL(f)
		}else if(window.webkitURL && window.webkitURL.createObjectURL){
		  url = window.webkitURL.createObjectURL(f)
		}	
		return url;
	}
}
musicPlayer.prototype.saver = function(html,len){
	localStorage.setItem("audio",html);
	localStorage.setItem("len",len);
}
musicPlayer.prototype.geter = function(prop){
	return localStorage.getItem(prop) || '';
}
musicPlayer.prototype.remove = function(list,items,index){
	if(this.index >= index){
		this.index -= 1;
	}
	var obj = items[index].parentNode;
	obj.parentNode.removeChild(obj);
	this.getObjs();
	this.oprator();
	this.len -= 1;
	this.saver(list.innerHTML,this.len);
	
}
musicPlayer.prototype.clear = function(obj){
	obj.innerHTML = '';
	this.saver('',0);
}
musicPlayer.prototype.init = function(){
	this.createUI();
	this.oprator();
}



function isURL(value) {
	return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}
function insertAfter(newElement,targetElement) {   
	var parent = targetElement.parentNode;   
	if (parent.lastChild == targetElement) {   
		parent.appendChild(newElement);   
	} else {   
		parent.insertBefore(newElement,targetElement.nextSibling);   
	}
}
function getOffsetX(obj,event){
	var event = event || window.event;
	var w1 = event.offsetX;
	var w = parseInt(obj.clientWidth);
	return (w1/w);
}
function timeFormat(time){
	var time = time || 0;
	var m1 = Math.floor(time/60)+"";
	if (m1.length<2){m1 = "0" + m1;}
	var m2 =  Math.floor(time - m1*60)+"";
	if (m2.length<2){m2 = "0" + m2;}
	var time = m1 + ":" + m2;
	return time;
}
function addevent(obj,clickEvt,func){
	if (obj.attachEvent){
		obj.attachEvent('on' + clickEvt,func);
	}else{	
		obj.addEventListener(clickEvt,func,false); 
	}	
}

