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
		$rss = new SimpleXMLElement($feed['url'], null, true);
		$lastUpdate = $rss->xpath('channel/item')[0];
		$feed['title'] = $lastUpdate->title;
		$feed['link'] = $lastUpdate->link;
		$feed['pubDate'] = $newDate = floor((time() - strtotime($lastUpdate->pubDate)) / 86400);
		$feeds[$feed['id']] = $feed;
	}
	usort($feeds, 'compareFeeds');

 ?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>TchiRSS</title>
	<meta content="True" name="HandheldFriendly">
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
	<meta name="viewport" content="width=device-width">
	<link rel="stylesheet" href="style.css">
	<link href='http://fonts.googleapis.com/css?family=Schoolbell' rel='stylesheet' type='text/css'>
</head>
<body>
	<div class="container">
		<div class="form">
			<div class="logo">
				<img src="img/logo.png" alt="">
			</div>
			<div class="h2">Add feed</div>
			<div>
				<form action="index.php" method="post">
					<div class="label">Name</div>
					<div class="input"><input name="name" type="text"></div>
					<div class="label">URL</div>
					<div class="label note">E.g.: http://www.starkana.com/rss/Shingeki_no_Kyojin</div>
					<div class="input"><input name="url" type="text"></div>
					<div class="label">Icon</div>
					<div class="input"><input name="icon" type="text"></div>
					<input type="submit" value="Create">
				</form>
			</div>
		</div>
		<div class="feeds">
			<?php foreach ($feeds as $feed){ ?>
				<div class="feed">
					<div class="icon"><img src="<?php echo $feed['icon']; ?>" alt=""></div>
					<div class="details">
						<div class="name">
							<a href="<?php echo $feed['url'] ?>"><?php echo $feed['name'] ?></a>
						</div>
						<div class="lasttime"><a href="<?php echo $feed['link'] ?>">Last realease</a>: 
							<?php
								echo $feed['pubDate'] < 1 ? "Today!" :
									 $feed['pubDate']== 1 ? "Yesterday" : $feed['pubDate'] . " days ago";
							?>
						</div>
					</div>
				</div>
			<?php } ?>
		</div>
	</div>
</body>
</html>
