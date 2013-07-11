var feeds;

$(document).ready(function() {
	console.log("DOM is ready");
	getFeeds();
});

function updateFeeds(){
	feedNum = feeds.length;
	$.each(feeds, function(feed){
		$.ajax({
			url: "getfeeds.php?feed=" + feeds[feed]['id'],
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
				if (feedNum == 0) {
					sortFeeds();
					$.each(feeds, function(f){
						putFeed(f);
					});
				}
			}
		});
	});

/*	feeds.sort(function(a,b){
		at = a['timeSince'];
		bt = b['timeSince'];
		return at<bt?-1:at>bt?1:0;
	});*/

/*	$.each(feeds, function(feed){

	});*/
}

function sortFeeds(){
	feeds.sort(function(a,b){
		at = a['timeSince'];
		bt = b['timeSince'];
		return at<bt?-1:at>bt?1:0;
	});
}

function putFeed(feed){
	id = feeds[feed]['id'];
	$(".feeds").append("<div class='feed' id='" + id + "'/>");

	$(".feed#"+id).append("<div class='icon'/>");
	$(".feed#"+id).append("<div class='details'/>");
	$(".feed#"+id+" .details").append("<div class='links'/>");
	$(".feed#"+id+" .details").append("<div class='name'/>");
	$(".feed#"+id+" .details").append("<div class='lastime'/>");
	$(".feed#"+id+" .lastime").append("<span/>");

	$(".feed#"+id+" .icon").append("<img src='"+feeds[feed]['icon']+"' alt='' />");
	$(".feed#"+id+" .name").append(feeds[feed]['name']);
	$(".feed#"+id+" .lastime > span").append(
		"<span class='lasttime'>Last release: </span>"
		+ "<a href='"+feeds[feed]['lastLink']+"'>"+timeAgo(feeds[feed]['timeSince'])+"</a>"
	);
	$(".feed#"+id+" .links").append('<div class="btn edit"></div>');
	$(".feed#"+id+" .links").append('<div class="btn delete"></div>');
	$(".feed#"+id+" .links").append('<div class="btn rss"></div>');

}

function timeAgo(num){
	switch(num){
		case 0:
			return "Today";
		case 1:
			return "Yesterday";
		default:
			return num + " days ago"
	}
}

function getFeeds(){
	$.ajax({
		url: "getfeeds.php",
		dataType: "json"
	}).done( function(result){
		feeds = result;
		updateFeeds();
	});
}