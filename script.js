//var feeds;

var tchiRSS = {
	init: function ( config ) {
		this.config = config;
		this.feeds;
		
		this.attachHandlers();
		this.getFeeds();
	},

	attachHandlers: function () {
		this.config.feedsContainer.on('click', '.delete', tchiRSS.deleteFeed);
		this.config.feedsContainer.on('click', '.edit', tchiRSS.editFeed);
	},
	
	updateFeeds: function () {
		var self = this,
			feeds = self.feeds;

		feedNum = feeds.length;
		$.each(feeds, function(feed){
			$.ajax({
				url: self.config.feedsSRC,
				data: { feed: feeds[feed]['id'] },
				success: function(result){
					xmlDoc = $.parseXML(result),
					xml = $( xmlDoc ),
					feeds[feed]['lastLink'] = xml.find( "item:first-of-type > link" ).text();
					pubDate = xml.find( "item:first-of-type > pubDate" ).text();
					lastRelease = new Date(pubDate);
					timeNow = new Date();
					timeSince = Math.round((timeNow.getTime() - lastRelease.getTime())/86400000);
					feeds[feed]['timeSince'] = timeSince;
					str = timeAgo(timeSince);
					//$("#"+feeds[feed]['id']+" > .details > .lasttime > span").text(str);
					//putFeed(feed);
					feedNum--;
					if (feedNum === 0) {
						self.sortFeeds();
						$.each(feeds, function(f){
							self.putFeed(f);
						});
					}
				}
			});
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
			self.feeds = result;
			self.updateFeeds();
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
	feedsSRC: 'getfeeds.php'
});