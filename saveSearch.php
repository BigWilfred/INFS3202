<?php
	session_start();
	require "admin.php";
	saveSearch($_SESSION['username'],$_POST['Display'],$_POST['Api']);
?>