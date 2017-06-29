<?php
	session_start();
	require "admin.php";
		
	$created = createUser($_POST['name'], $_POST['username'], $_POST['pword1'], $_POST['pword2']);
	
	echo $created;
	
?>