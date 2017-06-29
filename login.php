<?php
	session_start();
	$usernameVal ='';

	if(isset($_COOKIE["usernameVal"])){
		$usernameVal = $_COOKIE["usernameVal"];
	}
	if(isset($_SESSION['username']) && $_SESSION['auth'] == true){
		//if user has already been set -> go to main page
		//should i make sure that the like/ban arrays are set?

		
		header("location: search.php");
	}


?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Flick Pick</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
		<link rel='stylesheet' type='text/css' href='style.css'/>
	</head>
	<body>
		
		<div class='login'>
		<img src='images/logoMid.png' alt='Large Flick Pick login'/>
			<div class='padFront'>
				<h1> Log In </h1>
				<form id='logForm'>
					Username <input type='text' name='user' 
					value= '<?php echo $usernameVal; ?>'
					><br>
					Password <input type='password' name='password'/><br>
					<button id='goToCreate' type="button">Sign Up </button>
					<input type='submit' value='Login'/>
				</form>
			</div>
		</div>
		
		<script src="login.js" type="application/javascript"></script>
	</body>
</html>