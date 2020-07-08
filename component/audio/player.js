NE.player = function(config,song){
	var box = config.player;	//player area
	var musicPlayer = null; //music player object
	var total = 0;
	var current = 0;
	var autoplay = !!config.autoplay;	//auto play
	var play = true;		//play status

	var btn = config.play;
	var prog = config.progress;
	var sliderbar = config.sliderbar;
	var timer = config["time"];
	var cover = config.cover;

	createMusicPlayer(box, song.url);

	function createMusicPlayer(){
		cover.src = song.cover;
		var fver = NE.swf.version();
		if(fver){
			flashPlayer();
		}else{
			audioPlayer();
		}

		var t = setInterval(function(){
			if(musicPlayer && musicPlayer.load){
				events();
				clearInterval(t);
			}
		},30);
	}

	function events(){
		onReady();
		play.onclick = function(){
			onPlay(this);
		}
		onProgress();

	}

	function onReady(){
		musicPlayer.load(song.url);
		if(autoplay){
			alert(musicPlayer.play)
			musicPlayer.play();
		}
	}

	function onPlay(target){
		target.className = "ne_player_play ne_player_stop";
		target.onclick = function(){
			if(play){
				play = false;
				musicPlayer.pauseSong();	
				target.className = "ne_player_play";
			}else{
				play = true;
				musicPlayer.playSong();
				target.className = 'ne_player_play ne_player_stop';
			}
		}
	}

	function onProgress(target){
		target.onclick = function(event){
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
				total = mp.getTotalTimes()/1000;
				targets["time"].innerHTML = timeFormat(total);
			},300);
			var t = setInterval(function(){
				total = mp.getTotalTimes();
				cur = mp.getPosition();
				prog.style.width = Math.floor(100*cur/total) + "%";
			},1000);				
		}
	}

	function audioPlayer(){
		musicPlayer = document.createElement("audio");
		box.appendChild(musicPlayer);

		musicPlayer.load = function(url){
			musicPlayer.src = url;
		}
	}
	
	function flashPlayer(){
		var targetId = "ne_player" + new Date().getTime();
			targetId = targetId.replace("_", "");
		var flashWrap = document.createElement("div");
			flashWrap.id = targetId;
		box.appendChild(flashWrap);

		var playerUrl = "player.swf?onReady=onReady&onPlaying=onPlaying&onLoadComplete=onLoadComplete&onLoadError=onerror&onPlayComplete=onended";
		var width = 1, height = 1;

		var so = new SWFObject(playerUrl, targetId, width, height, "9.0.0", "#FFF");
		so.addParam("allowScriptAccess", "always");
		so.addParam("allowNetworking", "all");
		so.addParam("wmode", "transparent");
		so.addParam("wmode", "window");
		so.write(targetId);
		
		musicPlayer = NE.swf.get(targetId);

		musicPlayer.play = musicPlayer.playSong;
		musicPlayer.stop = musicPlayer.pauseSong;
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
}
