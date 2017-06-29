<?php
	session_start();
	require "admin.php";
	
	$correctCode = (int) $_POST['Code'];
	
	add_likeban($_SESSION['username'], $_POST['Movie'], $correctCode);
?>