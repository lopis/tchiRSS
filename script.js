
var tchiRSS = {
	init: function ( config ) {
		this.config = config;
		this.feeds;
		
		this.setupTemplates();
		this.attachHandlers();
		this.getFeeds();

	},

	attachHandlers: function () {
		this.config.feedsContainer.on('click', '.delete', tchiRSS.deleteFeed);
		this.config.feedsContainer.on('click', '.edit', tchiRSS.editFeed);
	},

	setupTemplates: function() {
		this.config.template = Handlebars.compile( this.config.template );
	},

	attachFeedTemplate: function( ) {
		this.config.feedsContainer.empty()
					.append( this.config.template( this.feeds ) );
	},
	
	updateFeeds: function (feeds) {
		var self = this;
		self.feeds = feeds;
		self.feedNum = self.feeds.length;
		$.each(self.feeds, self.getFeedTime);
	},

	getFeedTime: function (feed) {
		var self = tchiRSS;
		$.ajax({
			url: self.config.feedsSRC,
			data: { feed: self.feeds[feed]['id'] },
			success: function(result){
				// Get the time
				xmlDoc = $.parseXML(result),
				xml = $(xmlDoc);
				self.feeds[feed]['lastLink'] = xml.find( "item:first-of-type > link" ).text();
				pubDate = xml.find( "item:first-of-type > pubDate" ).text();
				lastRelease = new Date(pubDate);
				timeNow = new Date();
				timeSince = Math.round((timeNow.getTime() - lastRelease.getTime())/86400000);
				self.feeds[feed]['timeSince'] = timeSince;
				self.feeds[feed]['lastUpdate'] = timeAgo(timeSince);

				// And humanize it
				str = timeAgo(timeSince);
				
				// Sort and attach when it's the last feed
				self.feedNum--;
				if (self.feedNum === 0) {
					self.sortFeeds();
					self.attachFeedTemplate();
				}
			}
		});
	},

	sortFeeds: function () {
		this.feeds.sort(function(a,b){
			at = a['timeSince'];
			bt = b['timeSince'];
			return at<bt?-1:at>bt?1:0;
		});
	},

	putFeed: function (feed) {
		console.log(this.feeds[feed]);
		id = this.feeds[feed]['id'];
		$(".feeds").append("<div class='feed' id='" + id + "' data-id='" + id + "'/>");

		$(".feed#" + id).append("<div class='icon'/>");
		$(".feed#" + id).append("<div class='details'/>");
		$(".feed#" + id + " .details").append("<div class='links'/>");
		$(".feed#" + id + " .details").append("<div class='name'/>");
		$(".feed#" + id + " .details").append("<div class='lastime'/>");
		$(".feed#" + id + " .lastime").append("<span/>");

		$(".feed#" + id + " .icon").append("<img src='" + this.feeds[feed]['icon'] + "' alt='' />");
		$(".feed#" + id + " .name").append(this.feeds[feed]['name']);
		$(".feed#" + id + " .lastime > span").append(
			"<span class='lasttime'>Last release: </span>"  +
			"<a href='" + this.feeds[feed]['lastLink'] + "'>" + timeAgo(this.feeds[feed]['timeSince']) + "</a>"
		);
		$(".feed#" + id + " .links").append('<div class="btn edit" data-id="' + id + '"></div>');
		$(".feed#" + id + " .links").append('<div class="btn delete" data-id="' + id + '"></div>');
		$(".feed#" + id + " .links").append('<div class="btn rss"></div>');
	},

	getFeeds: function () {
		var self = this;
		$.ajax({
			type: 'POST',
			url: self.config.feedsSRC,
			dataType: 'json'
		}).done( function(result){
			self.updateFeeds(result);
		});
	},

	/**
	 * Event handler to remove a feed.
	 * Calls the deleteFeed.php to remove the feed.
	 */
	deleteFeed: function (evt) {
		var proceed = confirm("Are you sure?");
		if(!proceed) return;

		var id = evt.target.getAttribute('data-id'),
			self = tchiRSS;

		$.ajax({
			type: 'POST',
			url: 'deleteFeed.php',
			data: {id : id},
			dataType: 'json'
		}).done( function(result){
			if(result.success === 1) {
				self.removeFeedDOM(id);
				//clearFeeds();
				//getFeeds();
			} else {
				console.log('Could not remove feed.');
			}
		});
	},

	editFeed: function (evt) {
		var id = evt.target.getAttribute('data-id'),
			self = tchiRSS,
			feed = $('.feed#' + id),
			actionTitle = $('#action-title'),
			submitButton = $('.btn[value=Create]'),
			feedName = feed.find('.name').text();
		

		actionTitle.text('Edit feed ' + feedName);
		submitButton.val('Edit');
		//$('form input[name=name]').val(feed.data('id'));
		$('form input[name=name]').val(feedName);
	},

	/**
	 * Removes all feeds from the DOM
	 */
	clearFeedsDOM: function () {
		$('.feeds').html('');
	},

	/**
	 * Removes a feed from the DOM
	 */
	removeFeedDOM: function (id) {
		$('#' + id + '.feed').remove();
	}

};


function timeAgo(num){
	switch(num){
		case 0:
			return "Today";
		case 1:
			return "Yesterday";
		default:
			return num + " days ago";
	}
}


tchiRSS.init( {
	feedsContainer : $('.feeds'),
	feedsSRC: 'getfeeds.php',
	template: $('#feeds-template').html(),

});