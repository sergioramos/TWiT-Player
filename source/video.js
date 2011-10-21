enyo.kind({
	name: "avis.video", 
	kind: enyo.VFlexBox,
	published: {
		episodeName: ""
	},
	components: [
		{kind: "Header", className: "enyo-toolbar-light", components: [
			{kind: "HFlexBox", pack: "start", width: "46px", components: [
				{kind: "GrabButton"}
			]},
			{kind: "HFlexBox", pack: "center", flex: 1, components: [
				{name: "episodeTitle"}
			]},
			{kind: "HFlexBox", pack: "end", width: "187px", components: [
				{kind: "RadioGroup", name: "format", onChange: "initVideo", components: [
					{components: [
						{kind: "Image", name: "hdButton", src: "images/hd_down.png"}
					]},
					{components: [
						{kind: "Image", name: "sdButton", src: "images/sd.png"}
					]},
					{components: [
						{kind: "Image", name: "audioButton", src: "images/audio.png"}
					]}
				]}
			]}
		]},
		{name: "videoContainer", kind: enyo.VFlexBox, pack: "center", height: "100%", align: "center", flex: 1, components: [
			{kind: "Video", showControls: false},
			{kind: "SpinnerLarge"},
			{Kind: "Control", name: "videoMessage", content: "", showing: false}
		]},
		{kind: "videoControls", onPlay: "play", onPause: "pause", onChangeCurrentTime: "changeCurrentTime"}
	],
	create: function() {
		this.inherited(arguments);
		this.video = [];
	},
	setListeners: function(inSender) {
		var thisToPass = this;
				
		this.$.video.node.addEventListener('loadedmetadata', function(e) {
			var thisObj = thisToPass;
			var videoNode = thisObj.$.video.node;
			
			thisObj.$.video.play();
			thisObj.$.spinnerLarge.hide();
			thisObj.$.video.show();
			thisObj.$.videoControls.setPlaying(true);
			thisObj.$.videoControls.setDisabled(false);
			thisObj.$.videoControls.setDuration(videoNode.duration);
		}, false);
		
		this.$.video.node.addEventListener('timeupdate', function(e) {
			var thisObj = thisToPass;
			var videoNode = thisObj.$.video.node;
			
			thisObj.$.videoControls.updateCurrentTimePosition(videoNode.currentTime);
		}, false);
		
		this.$.video.node.addEventListener('progress', function(e) {
			var thisObj = thisToPass;
			var videoNode = thisObj.$.video.node;
			
			var buf = videoNode.buffered;
			var numRanges = buf.length;
			if (buf.length == 1) {
				var buffered = buf.end(0);
				thisObj.$.videoControls.updateBufferedPosition(buffered);
			} else {thisObj.$.videoControls.updateBufferedPosition(buf.end(buf.length - 1));}		
		}, false);
		
		this.$.video.node.addEventListener('error', function(e) {
			var thisObj = thisToPass;
			
			// thisObj.$.videoMessage.setContent("Source not available. Try the SD resolution");
			// 			thisObj.$.videoMessage.show();
			// 			thisObj.$.spinnerLarge.hide();
		}, false);
	},
	setVideo: function(video) {
		this.video[0] = video;
	},
	setAudio: function(audio) {
		this.video[1] = audio;
	},
	enlarge: function() {
	},
	initVideo: function() {
		var value = this.$.format.getValue();
		this.$.episodeTitle.setContent(this.episodeName);
		if(!(this.episodeName === "")) {
			this.$.videoControls.setDisabled(true);
			this.$.spinnerLarge.show();
			this.$.video.hide();
		}
		
		
		switch(value) {
			case 0:
				this.$.audioButton.setSrc("images/audio.png");
				this.$.sdButton.setSrc("images/sd.png");
				this.$.hdButton.setSrc("images/hd_down.png");
				if(!(this.episodeName === "")){this.$.video.setSrc(this.video[0].replace("640x368_500", "864x480_500"));}
				break;
			case 1:
				this.$.audioButton.setSrc("images/audio.png");
				this.$.sdButton.setSrc("images/sd_down.png");
				this.$.hdButton.setSrc("images/hd.png");
				if(!(this.episodeName === "")){this.$.video.setSrc(this.video[0].replace("640x368_500", "640x368_256"));}
				break;
			case 2:
				this.$.audioButton.setSrc("images/audio_down.png");
				this.$.sdButton.setSrc("images/sd.png");
				this.$.hdButton.setSrc("images/hd.png");
				if(!(this.episodeName === "")){this.$.video.setSrc(this.video[1]);}
				break;
		}
		
		enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': true});
		this.resizeVideo();
	},
	resizeVideo: function() {
		try {
			this.$.video.node.width = this.$.videoContainer.getBounds().width;
			this.$.video.node.height = ((this.$.videoContainer.getBounds().width*480)/864);
		} catch (e) {}
	},
	play: function(inSender, loging) {
		this.$.video.play();
		if(loging) {this.$.videoControls.setPlaying(true);}
		enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': true});
	},
	pause: function(inSender, loging) {
		this.$.video.pause();
		if(loging) {this.$.videoControls.setPlaying(false);}
		enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': false});
	},
	changeCurrentTime: function(inSender, inTime) {
		this.$.video.node.currentTime = inTime;
	}
});