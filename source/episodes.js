enyo.kind({
	name: "episodesList", 
	kind: enyo.VFlexBox,
	events: {
		onSelect: ""
	},
	published: {
		titles: [],
		showName: "",
		playingShow: -1,
		selectedShow: -1
	},
	components: [
		{kind: "Header", className: "enyo-toolbar-light", pack: "center", align: "center", components: [
			{kind: "HFlexBox", pack: "start", width: "46px", components: [
				{kind: "GrabButton"}
			]},
			{kind: "HFlexBox", pack: "center", flex: 1, components: [
				{name: "showName"}
			]}
		]},
		{kind: enyo.VirtualList, name: "list", onSetupRow: "setupEpisode", flex: 1, components: [
			{kind: "Item", layoutKind: "HFlexLayout", onclick: "episodeSelected",components: [
				{name: "title", className: "episodeTitle", pack: "center", flex: 1}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	playingShowChanged: function() {
		this.log(this.playingShow);
		this.$.list.refresh();
	},
	selectedShowChanged: function() {
		this.log(this.selectedShow);
	},
	setupEpisode: function(inSender, inRow) {
		if (this.titles[inRow]) {
			this.$.title.setContent(this.titles[inRow]);
			if(inRow === 0) {this.$.item.applyStyle("border-top", "none");}
			if(inRow === (this.titles.length -1)) {this.$.item.applyStyle("border-bottom", "none");}
			if((this.selectedShow === this.playingShow) && inSender.isSelected(inRow)) {
				this.$.item.applyStyle("background", "-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(218, 235, 251, 0.398438)), to(rgba(197, 224, 249, 0.398438)))");
			} else {this.$.item.applyStyle("background", "none");}
			return true;
		}
	},
	titlesChanged: function() {
		this.$.showName.setContent(this.showName);
		this.$.list.refresh();
	},
	episodeSelected: function(inSender, inEvent) {
		this.$.list.select(inEvent.rowIndex);
		this.doSelect(inEvent.rowIndex);
	}
});