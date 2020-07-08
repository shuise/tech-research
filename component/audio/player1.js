NE.player = function(targets,song){
	// "play" : NE.$(".ne_player_play",box)[0],
	// "progress" : NE.$(".ne_player_progress",box)[0],
	// "time" : NE.$(".ne_player_time",box)[0],
	// "autoplay" : true

	var player = null;
	var total = 0;
	var current = 0;
	var autoplay = !!targets.autoplay;

	targets.cover.src = song.cover;

	createPlayer(targets.player, song.url);



	function createPlayer(target,url){
		var fver = NE.swf.version();
		var total = 0,cur = 0;
		if(fver){
			flashPlayer();
		}else{
			audioPlayer();
		}
	}

	function audioPlayer(){
		var mplayer = document.createElement("audio");
		targets.player.appendChild(mplayer);
		mplayer.src = song.url;
		mplayer.play();
	}
	
	function flashPlayer(){
		var targetId = "ne_player" + new Date().getTime();
			targetId = targetId.replace("_", "");
		var box = document.createElement("div");
			box.id = targetId;
		targets.player.appendChild(box);

		var playerUrl = "player.swf?onReady=onReady&onPlaying=onPlaying&onLoadComplete=onLoadComplete&onLoadError=onerror&onPlayComplete=onended";

		var width = 1, height = 1;

		var so = new SWFObject(playerUrl, targetId, width, height, "9.0.0", "#FFF");
		so.addParam("allowScriptAccess", "always");
		so.addParam("allowNetworking", "all");
		so.addParam("wmode", "transparent");
		so.addParam("wmode", "window");
		so.write(targetId);
		
		var mp = NE.swf.get(targetId);
		var t = setInterval(function(){
			NE.trace(0);
			if(mp && mp.load){
				NE.trace(1);
				mp.load(song.url, true);
				onProgress(mp);
				clearInterval(t);
			}
		},30);

		var play = true;
		targets.play.className = "ne_player_play ne_player_stop";
		targets.play.onclick = function(){
			if(play){
				play = false;
				mp.pauseSong();	
				targets.play.className = "ne_player_play";
			}else{
				play = true;
				mp.playSong();
				targets.play.className = 'ne_player_play ne_player_stop';
			}
		}

		var prog = NE.$("em",targets.progress)[0];
		targets.progress.onclick = function(event){
			var event = event || window.event;
			var w1 = event.offsetX;
			var w = parseInt(this.clientWidth);
			var pt = (w1/w);
			var cur = total*pt;

			mp.playSong(cur);
			prog.style.width = Math.floor(100*cur/total) + "%";
		}
		function onProgress(mp){
			var tt = setTimeout(function(){
				total = mp.getTotalTimes();
				targets["time"].innerHTML = '00:00'+ '/' + timeFormat(total/1000);
			},300);
			var t = setInterval(function(){
				total = mp.getTotalTimes();
				cur = mp.getPosition();
				targets["time"].innerHTML = timeFormat(cur/1000) + '/' +timeFormat(total/1000);
				prog.style.width = Math.floor(100*cur/total) + "%";
			},1000);				
		}

		function onReady(){
			alert("onReady")
		}

	
		// player.playSong();
		// player.pauseSong();
	}
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