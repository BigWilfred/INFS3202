<?php
	session_start();
	require "admin.php";
	//header('Content-Type: application/json');
	
	$intCode = (int)$_POST['Code'];
	//should be $_SESSION!!
	remove_likeban("admin", $_POST['MovieTitle'], $intCode);
?>