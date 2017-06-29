<?php
	session_start();
	require "admin.php";
	//header('Content-Type: application/json');
	
	$user = $_POST['user'];
	$pword = $_POST['password'];
	
	$auth = checkUser($user, $pword);
	
	echo $auth;

	
?>