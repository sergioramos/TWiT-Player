enyo.kind({
	name: "showsList", 
	kind: enyo.VFlexBox,
	events: {
		onSelect: ""
	},
	published: {
		favicons: []
	},
	components: [
		{name: "showsList", flex: 1, kind: enyo.VirtualList, onSetupRow: "setupShow", className: "showsListContainer", components: [
			{kind: "Item", className: "showItem", layoutKind: "HFlexLayout", pack: "center", align: "center", components: [
				{kind: "Image", width: "50px", height: "50px", name: "favicon", pack: "center", flex: 1, onclick: "showSelected"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	setupShow: function(inSender, inRow) {
		if (this.favicons[inRow]) {
			this.$.favicon.setSrc(this.favicons[inRow]);
			this.$.favicon.applyStyle("background-color", inSender.isSelected(inRow) ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.3)");
			return true;
		}
	},
	faviconsChanged: function() {
		this.$.showsList.refresh();
		this.$.showsList.render();
	},
	showSelected: function(inSender, inEvent) {
		this.$.showsList.select(inEvent.rowIndex);
		this.doSelect(inEvent.rowIndex);
	}
});