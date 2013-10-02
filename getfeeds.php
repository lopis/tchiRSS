<?php 

	include "sqlite.php";
	
	$sqlite = new SQLiteClass;
	$sqlite->connect();

	if(isset($_GET['feed'])){
		$url = $sqlite->getURL($_GET['feed']);
		$xml = simplexml_load_file($url);
		print_r($xml->asXML());
	} else {
		$feedsPDO = $sqlite->getAll();
		$feeds = array();
		foreach ($feedsPDO as $feedPDO) {
			array_push($feeds, $feedPDO);
		}
		echo json_encode($feeds);		
	}

 ?>