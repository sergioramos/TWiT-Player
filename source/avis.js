enyo.kind({
	name: "avis",
	kind: enyo.VFlexBox,
	published: {
		shows: []
	},
	components: [
		{kind: "Pane", transitionKind: "enyo.transitions.Fade", onSelectView: "mainViewSelected", flex: 1,  components: [
			{kind: "HFlexBox", flex: 1, pack: "center", align: "center", components: [
				{kind: "Control", className: "loadingString", content: "Loading:"},
				{kind: "ProgressButton", name: "progress", className: "progressBar", flex: 1, cancelable: false}
			]},
			{kind: "SlidingPane", name: "app", flex: 1, components: [
				{width: "80px", kind: "SlidingView", components: [
					{kind: "showsList", onSelect: "showSelected", flex: 1}
				]},
				{width: "25%", kind: "SlidingView", name: "episodesView", components: [
					{kind: "episodesList", onSelect: "episodeSelected", flex: 1}
				]},
				{name: "content", kind: "SlidingView", onResize: "resizeVideo", flex: 1, components: [
					{kind: "avis.video", flex: 1}
				]}
			]}
		]},
		{kind: "avis.rss", name: "rss", onSuccess: "gotShows", onMetadata: "setProgressData", onIncrement: "setProgressPos"},
		{kind: "AppMenu", }
	],
	create: function() {
		this.inherited(arguments);
		this.selectedShowRow;
	},
	rendered: function() {
		this.inherited(arguments);
		this.$.rss.getShows();
	},
	onWindowDeactivated: function() {
		enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': false});
	},
	unloadHandler: function() {
		enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': false});
		this.destroy();
	},
	setProgressData: function(inSender, inMax) {
		this.$.progress.setMaximum(inMax);
	},
	setProgressPos: function(inSender, inPos) {
		this.$.progress.setPosition(inPos);
	},
	gotShows: function(inSender, inResult) {
		var favicons = [];

		for(var i=0; i<inResult.length; i++) {
			favicons.push(inResult[i].favicon);
		}

		this.$.showsList.setFavicons(favicons);
		this.$.pane.selectViewByIndex(1);
		this.setShows(inResult);
	},
	mainViewSelected: function(inSender, inEvent) {
		setTimeout(function(thisObj) {
		    if (thisObj.$.video.$.video.hasNode()){
		        thisObj.$.video.setListeners();
		    }
		}, 0, this);
	},
	showSelected: function(inSender, inRow) {
		this.$.episodesList.setSelectedShow(inRow);
		var titles = [];
		for(var i=0; i<this.shows[inRow].video.length; i++) {
			titles.push(this.shows[inRow].video[i].title[0].Text.replace(this.shows[inRow].title+ " ", ""));
		}

		this.$.episodesList.setShowName(this.shows[inRow].name);
		this.$.episodesList.setTitles(titles);
		this.selectedShowRow = inRow;
	},
	episodeSelected: function(inSender, inRow) {
		this.$.episodesList.setPlayingShow(this.selectedShowRow);
		this.$.video.setEpisodeName(this.shows[this.selectedShowRow].video[inRow].title[0].Text);
		//this.$.
		try {this.$.video.setVideo(this.shows[this.selectedShowRow].video[inRow].enclosure[0].url);} catch (e) {this.$.video.setVideo("");}
		try {this.$.video.setAudio(this.shows[this.selectedShowRow].audio[inRow].enclosure[0].url);} catch (e) {this.$.video.setAudio("");}
		this.$.video.initVideo();
	},
	resizeVideo: function() {
		this.$.video.resizeVideo();
	}
});