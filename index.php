<?php 

	include "sqlite.php";

	function compareFeeds($a, $b){
		return $a['pubDate'] == $b['pubDate']? 0 :
			$a['pubDate'] > $b['pubDate']? 1 : -1;
	}

	$sqlite = new SQLiteClass;
	$sqlite->connect();
	// $sqlite->clearAll()
	// $sqlite->insertRSS("http://rss","FEED","feed.png");
	if(isset($_POST['name']) &&
		isset($_POST['url']) &&
		isset($_POST['icon'])){
		$sqlite->insertRSS($_POST['url'],$_POST['name'],$_POST['icon']);
	}
	$feedsPDO = $sqlite->getAll();
	$feeds = array();
	foreach ($feedsPDO as $feedPDO) {
		$feed = array();
		$feed['id'] = $feedPDO['id'];
		$feed['name'] = $feedPDO['name'];
		$feed['icon'] = $feedPDO['icon'];
		$feed['url'] = $feedPDO['url'];
		$feeds[$feed['id']] = $feed;
	}
	usort($feeds, 'compareFeeds');
	//print_r($feeds);
 ?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>TchiRSS</title>
	<meta content="True" name="HandheldFriendly">
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
	<meta name="viewport" content="width=device-width">
	<link rel="shortcut icon" href="img/favicon.ico">
	<link rel="stylesheet" href="style.css">
	<link rel="stylesheet" href="loader.css">
	<link href='http://fonts.googleapis.com/css?family=Inder' rel='stylesheet' type='text/css'>
</head>
<body>
	<div class="container">
		<div class="form">
			<div class="logo">
				<img src="img/logo.png" alt="">
			</div>
			<div id="action-title" class="h2">Add feed</div>
			<div>
				<form action="index.php" method="post">
					<div class="label">Name</div>
					<div class="input">
						<input name="name" type="text">
					</div>
					<div class="label">URL</div>
					<div class="label note">E.g.: http://www.starkana.com/rss/Shingeki_no_Kyojin</div>
					<div class="input">
						<input name="url" type="text">
					</div>
					<div class="label">Icon</div>
					<div class="input">
						<input name="icon" type="text">
					</div>
					<input class="btn" type="submit" value="Create">
				</form>
			</div>
		</div>
		<div class="feeds">
			<script id="feeds-template" type="text/x-handlebars-template">
				{{#each this}}
					<div class="feed" id="{{id}}" data-id="{{id}}">
						<div class="icon">
							<img src="{{icon}}" alt="">
						</div>
						<div class="details">
							<div class="links">
								<div class="btn edit" data-id="{{id}}"></div>
								<div class="btn delete" data-id="{{id}}"></div>
								<div class="btn rss"></div>
							</div>
							<div class="name">{{name}}</div>
							<div class="lastime">
								<span><span class="lasttime">Last release: </span><a href="{{lastLink}}">{{lastUpdate}}</a></span>
							</div>
						</div>
					</div>
				{{/each}}
			</script>
		</div>
	</div>
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-1.0.0.js"></script>
	<script type="text/javascript" src="script.js"></script>
</body>
</html>
