<?php


function connect_db(){
	$db = new PDO("mysql:host=localhost;dbname=login", 'willy', '');
	//mysql:host=localhost;dbname=test;port=3306;charset=utf8
	//connnects to login DB
	if(!$db){
		die("Connection Failed");
	}
	else{
		
	}
	return $db;
	
}

/**
 * Encrypts a password into a strong hash
 * Logic taken from https://alias.io/2010/01/store-passwords-safely-with-php-and-mysql/
 * @param $password string The password to encrypt
 * @param $cost int The cost of the encryption, higher cost is more processing time but stronger hash
 * @return string A hash of the password
 */
function encrypt_password($password, $cost = 10)
{
    // Create a random salt
    $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');

    // Prefix information about the hash so PHP knows how to verify it later.
    // "$2a$" Means we're using the Blowfish algorithm. The following two digits are the cost parameter.
    $salt = sprintf("$2a$%02d$", $cost) . $salt;
    return crypt($password, $salt);
}

/**
 * Checks a hash with a password from the database
 * @param $password string The password to check
 * @param $hash string The password from the database
 * @return bool true if matching, false if not
 */
function check_password($password, $hash)
{
    return hash_equals($hash, crypt($password, $hash));
}

//takes supplied movie title and adds it to the likeban DB with code
function add_likeban($username, $movietitle, $code){
	$db = connect_db();
	
	//sql statement to insert supplied values into likeban db
	$banSql = $db->prepare("INSERT INTO likeban(Username, Movie, Code) VALUES ( ?, ?, ?)");
	
	$banSql -> execute(array($username, $movietitle, $code));
	return true;
}
//remove like or ban
function remove_likeban($username, $movietitle, $code){
	$db = connect_db();
	
	$removeSql = $db -> prepare("DELETE FROM likeban WHERE Username=? AND  Movie =? AND Code = ?");
	
	$removeSql -> execute(array($username, $movietitle, $code));
	return true;
}

function checkUser($username = null, $password = null){ //why does it have to equal null initially
	//should add session tokens in!
	
	$db = connect_db();
//	echo $username;
	$sql = $db->prepare("SELECT Username, Password FROM users WHERE Username = ?");
	$sql -> execute(array($username));
	
	$user = $sql -> fetch(PDO::FETCH_NUM);

	if($user != false){
		
		if($user[1] == crypt($password, $user[1])){
			//this is the point that the user has been authed
			//need to get Like and Ban JSON object
			
			$_SESSION['auth'] = true;
			$_SESSION['username'] = $username;
			setcookie("usernameVal",$username, time() + (86400 * 30)); //86400 sec in a day
			return 1;
			//var_dump ($likeban);
			
		}
		else{
			//insead of having echo message, should return a error number so that JS can show validation
			return 99;
			//return false;
		}
	}
	
	echo 90;
	
	
}

function createUser($name, $username, $password, $samePassword){
	$db = connect_db(); //connects to my sql DB
	
	
	$newPassword = encrypt_password($password);
	
    $query = $db->prepare("SELECT count(*) FROM users WHERE Username = ?");
    $query->execute(array($username)); //stops SQL injection
    $count = $query->fetch(PDO::FETCH_NUM);
    $user_count = $count[0];


    if ($user_count < 1) {

		//should first check to see if passwords match!
		if($password == $samePassword){
			$query = $db->prepare("INSERT INTO users (Name, Username, Password) VALUES (?, ?, ?)");
			$query->execute(array($name, $username, $newPassword)); //bloody varchar limmit... get rekd
			return 1;
		}
		else{
			//could do this client side!
			echo "Passwords must match";
		}
        
    }
	else{
		return 50;
	}
}

function getLikeBan($username){
	$db = connect_db();
	$userSettings = $db -> prepare("SELECT Movie, Code FROM likeban WHERE Username = ?");
	$userSettings -> execute (array($username));
	
	//fetchAll finds all rows!
	$likeban = $userSettings -> fetchAll(PDO::FETCH_ASSOC);
	
	return $likeban;
}

//should i get the users searches OR just the 5 most recent?
function getSearch(){
	$db = connect_db();
	$recentSearch = $db -> prepare("SELECT Display, Api FROM search ORDER BY Date DESC LIMIT 10");
	$recentSearch -> execute();
	$search = $recentSearch -> fetchAll(PDO::FETCH_ASSOC);
	return $search;
	
}
function saveSearch($username, $display, $api){
	$db =connect_db();
	$newSearch = $db -> prepare("INSERT INTO search(Username, Display, Api) VALUES (?,?,?)");
	//should i put an issest here to make sure SESSION isset
	$newSearch -> execute(array($username, $display, $api));
	
}
function logout_user(){
    try {
        session_destroy();
    } catch (Exception $e) {
        return false;
    }
    return true;
}


?>