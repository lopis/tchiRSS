<?php
	include "sqlite.php";
	$sqlite = new SQLiteClass;
	$sqlite->connect();

	$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
			strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	// Accept only POST requests
	if( isset( $_POST['id'] ) ) {
		$result = $sqlite->deleteFeed( $_POST['id'] );

		// If request is ajax don't send redirect
		if ( $isAjax ) {
			echo json_encode(array('success' => $result));
		} else { // else send back to index
			header('Location: index.php');
		}
	} else {
		if ( $isAjax ) {
			echo json_encode(array('success' => -1));
			// I'm AJAX!
		} else { // else send back to index
			header('Location: index.php');
		}
	}

