enyo.kind({
	name: "avis.rss",
	kind: "Component",
	events: {
		onSuccess: "",
		onMetadata: "",
		onIncrement: "",
		onLog: ""
	},
	components: [
		{name: "shows", url: "data/shows.json", kind: "WebService", onSuccess: "showsSuccess", onFailure: "queryFailure"},
		{name: "video", kind: "WebService", onSuccess: "videoSuccess", onFailure: "queryFailure"},
		{name: "audio", kind: "WebService", onSuccess: "audioSuccess", onFailure: "queryFailure"}
	],
	create: function() {
		this.inherited(arguments);
		this.shows = [];
		this.detected = 0;
		this.content_length = 0;
		this.maximum = 0;
	},
	getShows: function() {
		this.$.shows.call();
	},
	showsSuccess: function(inSender, inResponse, inRequest) {

		this.shows = inResponse;

		this.maximum = this.shows.length*2;
		this.doMetadata(this.maximum);

		for(var i=0; i<this.shows.length; i++) {

			this.$.video.setUrl(inResponse[i].video_url);
			this.$.video.call();

			this.$.audio.setUrl(inResponse[i].audio_url);
			this.$.audio.call();
		}
	},
	queryFailure: function(inSender, inRequest) {
		this.detected++;
		this.verifyState();
	},
	videoSuccess: function(inSender, inResponse, inRequest) {
		var xml = XMLObjectifier.textToXML(inResponse);
		inResponse = XMLObjectifier.xmlToJSON(xml);
		try {inResponse = inResponse.channel[0].item;} catch (e) {this.detected++;}

		try {
			this.identifyShow(inResponse, "video");
		} catch (err) {
			this.verifyState();
		}
	},
	audioSuccess: function(inSender, inResponse, inRequest) {
		var xml = XMLObjectifier.textToXML(inResponse);
		inResponse = XMLObjectifier.xmlToJSON(xml);
		try {inResponse = inResponse.channel[0].item;} catch (e) {this.detected++;}

		try {
			this.identifyShow(inResponse, "audio");
		} catch (err) {
			this.verifyState();
		}
	},
	verifyState: function() {
		this.doIncrement(this.detected);

		if(this.detected === this.maximum) {
			this.doSuccess(this.shows);
		}
	},
	identifyShow: function(show, format) {

		var recognized = false;
	  	var epNum = show[0].title[0].Text.match(/[\d\.]+/g);
		var splited = show[0].title[0].Text.split(epNum[0]);
		var nomeDoPrograma = splited[0].slice(0, -1);

		for(var i = 0; i < this.shows.length; i++) {
			if(this.shows[i].title === nomeDoPrograma) {

				switch(format) {
					case "video":
						this.shows[i].video = show;
						recognized = true;
						this.detected++;
						break;
					case "audio":
						this.shows[i].audio = show;
						recognized = true;
						this.detected++;
						break;
				}
				break;
			}
		}

		if(!recognized) {this.detected++;}
		this.verifyState();
	}
});