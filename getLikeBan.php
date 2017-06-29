<?php
	session_start();
	require "admin.php";
	header('Content-Type: application/json');
	
	$preferences = getLikeBan($_SESSION['username']);
	echo json_encode($preferences);
?>