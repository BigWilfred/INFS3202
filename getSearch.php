<?php
	session_start();
	require "admin.php";
	header('Content-Type: application/json');
	
	$search = getSearch();
	echo json_encode($search);


?>