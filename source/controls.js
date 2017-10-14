enyo.kind({
	name: "videoControls",
	kind: enyo.VFlexBox,
	events: {
		onPlay: "",
		onPause: "",
		onChangeCurrentTime: "",
		onFullScreen: ""
	},
	published: {
		playing: false,
		disabled: true,
		duration: 0
	},
	components: [
		{kind: "Header", className: "playerControl", width: "100%", height: "82px", components: [
			{kind: "HFlexBox", components: [
				{name: "btnPlay", kind: "Button", className: "play disabled", disabled: true, label: " ", onclick: "playpause"},
				{kind: "Image", name: "loading", showing: false, src: "images/spinner-large.png", width: "56px", height: "56px"}
			]},
			{kind: "HFlexBox", className: "progress", flex: 1, pack: "center", align: "center", components: [
				{name: "currentTime", width: "48px", kind: "Control", className: "currentTime", content: "--:--:--"},
				{name: "slider", kind: "ProgressSlider", onChange: "positionChanged", onChanging: "positionChanging", tapPosition: true, lockBar: true, flex:1},
				{name: "duration", width: "48px", kind: "Control", className: "duration", content: "--:--:--"}
			]}
			//{name: "btnFullscreen", kind: "Control", className: "toggleMode fullscreen off", onclick: this.doFullScreen()}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	playpause: function(inSender, inEvent) {
		switch(this.playing) {
			case false:
				this.doPlay(true);
				this.playing = true;
				break;
			case true:
				this.doPause(true);
				this.playing = false;
				break;
		}
	},
	disabledChanged: function(inSender, inEvent) {
		switch(this.disabled) {
			case false:
				this.$.btnPlay.setDisabled(false);
				this.$.btnPlay.removeClass("disabled");
				break;
			case true:
				this.$.btnPlay.setDisabled(true);
				this.$.btnPlay.addClass("disabled");
				this.updateCurrentTimePosition(0);
				this.updateBufferedPosition(0);
				this.$.currentTime.setContent("--:--:--");
				this.$.duration.setContent("--:--:--");
				break;
		}
	},
	playingChanged: function(inSender, inEvent) {
		if(this.playing) {
			this.$.btnPlay.removeClass("play");
			this.$.btnPlay.addClass("pause");
		} else {
			this.$.btnPlay.addClass("play");
			this.$.btnPlay.removeClass("pause");
		}
	},
	durationChanged: function() {
		this.$.btnPlay.setDisabled(false);
		this.$.duration.setContent(this.secondsToTime(this.duration));
		this.$.currentTime.setContent("00:00:00");
	},
	positionChanged: function(inSender, inPos) {
		this.$.slider.setPositionImmediate(inPos);
		var time = inPos/(100/this.duration);
		this.doChangeCurrentTime(time);
		if(this.playing) {
			this.doPlay(true);
		}
	},
	positionChanging: function(inSender, inPos) {
		this.doPause(false);
		var time = inPos/(100/this.duration);
		this.doChangeCurrentTime(time);
	},
	updateCurrentTimePosition: function(currentTime) {
		var time = (currentTime*100)/this.duration;
		this.$.slider.setPositionImmediate(time);
		this.$.currentTime.setContent(this.secondsToTime(currentTime));
	},
	updateBufferedPosition: function(buffered) {
		var time = (buffered*100)/this.duration;
		this.$.slider.setAltBarPosition(time);
	},
	secondsToTime: function(secs) {
		var hours = Math.floor(secs / (60 * 60));
	    var divisor_for_minutes = secs % (60 * 60);
	    var minutes = Math.floor(divisor_for_minutes / 60);
	    var divisor_for_seconds = divisor_for_minutes % 60;
	    var seconds = Math.ceil(divisor_for_seconds);
		var time = this.pad(hours, 2) + ":" + this.pad(minutes, 2) + ":" + this.pad(seconds, 2);
		return time;
	},
	pad: function(number, length) {
		var str = '' + number;
	    while (str.length < length) {
		str = '0' + str;
		}
	    return str;
	}
});