<?php
	session_start();
	if(!isset($_SESSION['username'])){
		header("location: login.php");
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Flick Pick</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
		<script src="colorbox-master/jquery.colorbox-min.js"></script>
		<link rel="stylesheet" href="colorbox-master/colorbox.css"/>
		
		
		
		<link rel='stylesheet' type='text/css' href='style.css'/>
		<script src="velocity-master/velocity.js"></script>
		<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet"> 
	</head>
	<body>
		<div id='topNav'>
			<img src='images/logoTop.png' alt='home' id='homeImage'/>
			<img src='images/settings.png' alt='To Settings' id ='settingsButton'/>
			<div class="dropdown">
				<div class="dropdown-content">
					<a href='settings.php' id='goLikeBan'> Like/Ban </a>
					<a id='logout'>Logout</a>
					
				</div>
			</div> 
			
			<div id='userMessage'>Out of  Movies, need new search</div>

		</div>
		<div>
			<div id='search'>
				
				
				<h1>Search</h1> 
				<div id='grid'>
					<div class='box' id='action'>Action</div>
					<div class='box' id='adventure'>Adventure</div>
					<div class='box' id='animation'>Animation</div>
					<div class='box' id='comedy'>Comedy</div>
					<div class='box' id='crime'>Crime</div>
					<div class='box' id='documentary'>Documentary</div>
					<div class='box' id='drama'>Drama</div>
					<div class='box' id='family'>Family</div>
					<div class='box' id='fantasy'>Fantasy</div>
					<div class='box' id='history'>History</div>
					<div class='box' id='horror'>Horror</div>
					<div class='box' id='music'>Music</div>
					<div class='box' id='mystery'>Mystery</div>
					<div class='box' id='romance'>Romance</div>
					<div class='box' id='scifi'>Sci-Fi</div>
					<div class='box' id='tv'>TV Movie</div>
					<div class='box' id='thriller'>Thriller</div>
					<div class='box' id='war'>War</div>
					<div class='box' id='western'>Western</div>
					<div class='box' id='clear'>Clear</div>
				</div>
				<div id="advancedButton">Advanced Options</div>
				<div id='advancedOptions'>
					<div id='primary_release_date'>
						Made <br>
						<select name='release'>
							<option value='.gte'>After</option>
							<option value='.lte'>Before</option>
						</select>
						<input type='text'>
					</div>
					
					<div id='with_runtime'>
						Runtime (hours) <br>
						<select name='runtime'>
							<option value='.lte'>Less</option>
							<option value='.gte'>Longer</option>
						</select>
						than <input type='text'>
					</div>
					<div id='vote_average'>
						Vote <br>
						<select name='runtime'>
							<option value='.gte'>Above</option>
							<option value='.lte'>Below</option>
						</select>
						<input type='text'>
					</div>
					
					<div id='sort'>
						<h3>Sort By</h3>
						<div class='box sorter active' id='popularity'>Popularity</div>
						<div class='box sorter' id='release_date'>Recent</div>
						<div class='box sorter' id='revenue'>Revenue</div>
						<div class='box sorter' id='vote_average'>Rating</div>
						<div class='box sorter' id='vote_count'>Total Votes</div>
					</div>
					
				</div>
				<div id='searchButton'><img src='images/searchLogo.png' alt='Search Button'/></div>
				<div id='recentSearch'>
					<div id='recentSearchDisplay'>
						<h3> Recent</h3>
					</div>
				</div>
			</div>
			<div class='clear'></div>
		<div id='openButton'><img src='images/openArrow.png'</div>
		</div>
		
		<!-- <div id = 'recentSearches'>
			<div class='recent'>FIRST</div>
			<div class='recent'>SECOND</div>
			<div class='recent'>THIRD</div>
			<div class='recent'>4th</div>
			<div class='recent'>ff</div>
		</div> -->
		
		<p id='instructions'> Select on a poster to remove it. Right click to get movie information.</p>
		<div id='addPosters'>
			<img src='images/card.png' class='poster'/>
			<img src='images/card.png' class='poster'/>
			<img src='images/card.png' class='poster'/>
			<img src='images/card.png' class='poster'/>
			
			
		</div>

	</body>
	<script src="search.js" type="application/javascript"></script>
</html>