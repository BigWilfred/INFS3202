var apiArray = [];
var readArray = [];
var advancedApiArray =[];

var apiKey = 'd4195dc48695656a97ee40e868e0ee66';
var setPosterUrl = 'https://image.tmdb.org/t/p/w342'
var setLargePosterUrl = 'https://image.tmdb.org/t/p/w500';
var imgUrl = [];
var idArray = [];
var allMovies =[];
var titleArray = [];

var url ='';
var resultsLength =1;
var resultsLimit = 1;
var singleCounter = 0;
var pageCounter = 1;
var posInMovieObject =0;
var sortId ='';

var youtubeUrl = 'https://www.youtube.com/embed/'
var youtube ='';

var likeArray = [];
var banArray = [];

$('#action').click(function(){
	buttonAdd("Action", 28, '#action');
});
$('#adventure').click(function(){
	buttonAdd("Adventure",12, '#adventure');
});
$('#animation').click(function(){
	buttonAdd("Animation", 16, '#animation');
});
$('#comedy').click(function(){
	buttonAdd("Comedy", 35, '#comedy');
});
$('#crime').click(function(){
	buttonAdd("Crime", 80, '#crime');
});
$('#documentary').click(function(){
	buttonAdd("Documentary", 99, '#documentary');
});
$('#drama').click(function(){
	buttonAdd("Drama", 18, '#drama');
});
$('#family').click(function(){
	buttonAdd("Family", 10751, '#family');
});
$('#fantasy').click(function(){
	buttonAdd("Fantasy", 14, '#fantasy');
});
$('#history').click(function(){
	buttonAdd("History", 36, '#history');
});
$('#horror').click(function(){
	buttonAdd("Horror", 27, '#horror');
});
$('#music').click(function(){
	buttonAdd("Music", 10402, '#music');
});
$('#mystery').click(function(){
	buttonAdd("Mystery", 9648, '#mystery');
});
$('#romance').click(function(){
	buttonAdd("Romance", 10749, '#romance');
});
$('#scifi').click(function(){
	buttonAdd("Science Fiction", 878, '#scifi');
});
$('#tv').click(function(){
	buttonAdd("Tv Movie", 10770, '#tv');
});
$('#thriller').click(function(){
	buttonAdd("Thriller", 10749, '#thriller');
});
$('#war').click(function(){
	buttonAdd("War", 10752, '#war');
});
$('#western').click(function(){
	buttonAdd("Western", 37, '#western');
});
$('#clear').click(function(){
	clearSearchBox();
});

$(document).ready(function(){
	
	getSearch();
	getUserSettings();
	setOpenHeight();
	setMobile();
});

$('#openButton').click(function(){
	clearAdvanced();
	getSearch();
	$('#search').slideToggle("slow");
});
$('#goLikeBan').colorbox({iframe:'true',height:'90%', width:'98%'});
$('.box').click(function(){
	//newArray = readArray.slice(0);
	$('#output').html('');
	$('#output').html(makeReadable(readArray));
});

$('#searchButton').click(function(){
	//user to sent to search to DB and to access MovieAPI
	
	//$('#userMessage').replaceWith(' ');
	advancedApiArray =[];
	advancedApi("primary_release_date");
	advancedApi("with_runtime");
	advancedApi("vote_average");
	
	searchApi();
	$('#search').slideToggle("slow");
	//must have at least one movie selected ->
	//join used for later split = %%
	if(apiArray.length > 0){
		console.log(advancedApiArray);
		var genreApi = apiArray.join('%%');
		var advApi = advancedApiArray.join("$$");
		
		var forDbApi = '';
		

		forDbApi = genreApi + "^^" + advApi;
		
		console.log(forDbApi);
		$.post('saveSearch.php',{Display:makeReadable(readArray),Api:forDbApi});
		
		clearSearchBox();
	}
	//else would just search for all moveies within api without saving to db

});


function buttonAdd(Genre, Code, Id){
	
	if($.inArray(Genre, readArray) < 0 ){
		readArray.push(Genre);
		apiArray.push(Code);
		$(Id).css('background-color','#343838');
		$(Id).css('color','#00DFFC');
	}
	//is it exists and is clicked->remove the sucka
	else{
		apiArray.splice($.inArray(Code, apiArray), 1)
		readArray.splice($.inArray(Genre, readArray), 1);
		$(Id).css('background-color','#005F6B');
		$(Id).css('color','#e6e7e8');
	}
	//console.log(readArray); //makes alphabetical
	//console.log(apiArray.join('%20')) //gets it ready for API call
}
function makeReadable(theArray){
	builder = '';
	lastItem = '';
	newArray = theArray.slice(0);
	newArray = newArray.sort();
	
	if(theArray.length >=3){
		lastItem = newArray.pop();
		builder = newArray.join(', ') + " or " + lastItem + "";
		return builder;
	}
	
	builder = newArray.join(' or a ');
	return builder;
}
$('#homeImage').click(function(){
	window.location.href = "search.php";
})
$(document).on('click','.previousSearch', function(){
	$('#userMessage').text('');
	apiArray  ='';
	advancedApiArray =[]
	$('#search').slideToggle("slow");
	//each movie code is seperated by %%
	var newApiArray = [];
	var dbApi = $(this).attr('id');
	newApiArray = dbApi.split('^^');
	console.log(newApiArray);
	//has advanced
	if(newApiArray.length >1){
		apiArray = newApiArray[0].split('%%');
		advancedApiArray = newApiArray[1].split('$$');
	}
	else{
		apiArray = dbApi.split('%%');
	}

	searchApi();
})
//gets recent searches
function getSearch(){
	$('#recentSearchDisplay div').remove();
	
	var getter = new XMLHttpRequest();
	getter.onreadystatechange = function(){
		if (this.readyState==4 && this.status==200) {
			
			recentSearch = JSON.parse(getter.response);
			//six added
			for (i=0; i < 6; i++){
				if(recentSearch[i].Display != ''){
					$('#recentSearchDisplay').append('<div class="previousSearch" id="'+recentSearch[i].Api+'">'+recentSearch[i].Display+'</div>');
				}
				
			}
		}
	};
	getter.open("GET","getSearch.php", true);
	getter.send();
}
function clearSearchBox(){
	$('#output').html('');
	
	$("#grid .box").css('background-color','#005F6B');
	$("#grid .box").css('color','#e6e7e8');
	
	$("#clear").css('background-color','#e6e7e8');
	$("#clear").css('color','#343838');
	readArray =[];
	apiArray = [];	
}
function getImageUrl(index, item){
	var poster = '';
	var id='';
	var title = '';
	var backdrop = '';
	
	
	id = item.id;
	poster = item.poster_path;
	title = item.title;
	var checkId = id.toString();
	//console.log($.inArray(poster, banArray));
	//if movie is banned -> dont add it
	
	if($.inArray(checkId, banArray) == -1){
		imgUrl.push(poster);
		idArray.push(id); 
		titleArray.push(title);
		allMovies.push(item);
	}
	else{
		resultsLength = resultsLength -1;
		console.log("BANNED" + id);
	}
	
	
	
}
function searchApi(){
	
	
	url = '';
	var genres = apiArray.join('%7C');
	var advanced = advancedApiArray.join("");
	
	imgUrl = [];
	getSort();
	
	singleCounter = 0;
	url ='https://api.themoviedb.org/3/discover/movie?api_key='+apiKey+'&language=en-US&sort_by='+ sortId +'.desc&certification=US&include_adult=false&include_video=false&vote_count.gte=2&with_genres=' + genres +'&with_original_language=en'+ advanced +'&page=';
	
	console.log(url);
	$.getJSON(url+pageCounter, function(data){ 
		console.log(data);
		console.log(data.total_results);
		resultsLimit = data.total_results;
		if(resultsLimit == 0){
			console.log("No movies returned");
			$('.poster').attr('src','images/card.png');
			return;
		}
		resultsLength = data.results.length;
		$.each(data.results, getImageUrl);
		
		for(i=0; i < 5; i++){ //instead of 11 I should have a discoverable
			//set the initial pictures so not all stveve
			if(singleCounter !=  resultsLimit){
				var quickId=imgUrl[singleCounter-1];
				$('.poster:nth-child('+i+')').attr('src',setPosterUrl+imgUrl[singleCounter-1]);
				$('.poster:nth-child('+i+')').attr('id',imgUrl[singleCounter-1]);
				$('.poster:nth-child('+i+')').attr('alt',titleArray[singleCounter-1]);
				if($.inArray(idArray[i].toString(),likeArray) != -1){
					console.log("FOUND LIKE  --" + idArray[i]);
				}
				
				singleCounter++;
				posInMovieObject++;
			}
			else{
				$('#userMessage').html('No more movies left, please search again');
				$('.poster:nth-child('+i+')').attr('src','images/card.png');
			}
		}
	})
}
$('.poster').on('click',function(){

	if(singleCounter < resultsLength && url != ''){
		
		//accounts for when a movie doesnt have an image
		if(imgUrl[singleCounter]){
			$(this).attr('src',setPosterUrl+imgUrl[singleCounter]);
			$(this).attr('id',imgUrl[singleCounter]); //will be used to search through movieObject to get id to make API call!!
			$(this).attr('alt',titleArray[singleCounter]);
			//$(this).velocity("reverse")
		}
		else{
			//$(this).attr('src','images/card.png');
			
		}
		
		
		singleCounter++;
		posInMovieObject++;
			
	}
})
$(document).on('click',function(){

	if (posInMovieObject == resultsLimit){
		console.log("No more results. Please do another search >> Starting original cycle");
		$('#userMessage').html("<div id='message'>No more results. Please do another search</div>");
		//$('#search').slideDown('slow');
		$('.poster').attr('src','images/card.png');
		
	}
	
	if(singleCounter  == resultsLength && url != ''){ 
		pageCounter++;
		 //listner 
		//url = 'https://api.themoviedb.org/3/discover/movie?api_key='+apiKey+'&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page='+pageCounter;
		$.getJSON(url+pageCounter, function(data){ 
			
			
			imgUrl =[];
			resultsLength = data.results.length;		
			$.each(data.results, getImageUrl);
			singleCounter =0;
			console.log('New JSON done');
			console.log(allMovies); //not deleting any of the movies :)
			
			
		});
	}
});
$('.poster').contextmenu(function(e){
	e.preventDefault();
	
	var displayMovie =[];
	var searchUrl = $(this).attr('id'); //gets the term to search through movieObject for
	
	for( i=0; i < allMovies.length; i++){
		if(searchUrl == allMovies[i].poster_path){
			displayMovie = allMovies[i];
		}
	}
	console.log(displayMovie);
	var trailerId = displayMovie.id;
	var title = displayMovie.original_title;
	var overview = displayMovie.overview;
	var released = reverseString(displayMovie.release_date);
	var rating = displayMovie.vote_average;
	var background = setPosterUrl+ displayMovie.backdrop_path;
	var poster = setLargePosterUrl + displayMovie.poster_path;
	var voteCount = displayMovie.vote_count;
	
	getTrailer(trailerId);
	//youtube = getTrailer(trailerId);
	//console.log(trailerId);
	
	//$('#cboxOverlay').css("background-image","url("+background+")");
	//$('#cboxOverlay').css("background-color","red");

	/* $('#title').replaceWith("<p id='title'>" + title + "</p>");
	$('#overview').replaceWith("<p id='overview'>" + overview + "</p>");
	$('#release').replaceWith("<p id='release'> Release Date: " + released + "</p>");
	$('#rating').replaceWith("<p id='rating'> User Rating: " + rating + "</p>"); */
	
	//$.colorbox();
	//could i just load a page into colorbox?
	$.colorbox({html:"<img id='largeMoviePoster' src='"+poster+"'><div id='movieInformation'><p id='title'>"+ title + "</p><p id='overview'>" + overview + "</p><p id='release'> Release Date: " + released + "</p><p id='rating'> User Rating: " + rating + "</p></div><div  class='clear'></div><div id='likeBanContainer'><div id='like' class='"+trailerId+"'><img src='images/like.png  '/></div><div id='ban' class='"+trailerId+"'><img src='images/ban.png'/></div></div><div id='trailerButtonCointainer'><p class='trailerButton' id='firstTrailer'>Open Trailer<p><img src='images/openArrow.png' class='trailerButton'></div></p></p>"
	, opacity:0.9 ,
	width: "90%" ,
	height:"95%"
	});
	//if movie is contained in likeArray
	if($.inArray(trailerId.toString(), likeArray) > -1){
		$('#ban').remove();
		$('#like').remove();
	}
});
function getTrailer(id){
	var movieUrl = 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + apiKey + '&language=en-US';
	var extraAdd = '';
	var fullYoutube = '';
	$.getJSON(movieUrl, function(data){
		
		
		
		if(data.results[0]){
			extraAdd = data.results[0].key;
			fullYoutube = youtubeUrl + extraAdd ;
			console.log(fullYoutube);
		
			youtube = fullYoutube;
		
		

			$('.trailerButton').append('<div id="trailerContainer"><iframe id="trailer" allowFullScreen="allowFullScreen" src="' + youtube + ' ">TRAILER</iframe><div class="trailerButton"></div></div>');
		
		}
		else{
			$('#trailerButtonCointainer').remove();
		}
		
		 //trying to return out of this statement is not working. because getJSON is asycronis therefore will only return value once done
		 //could have the visibility of trailer button appear once getJSON finishes!!
		
	});
}
$(document).on('click','#like',function(){
	var idAdd = $(this).attr('class');
	$.post('saveLike.php',{Movie:idAdd,Code:1});
	likeArray.push(idAdd);
	$('#ban').remove();
	$(this).append('<img src="images/tick.png" alt="success" class="tick">');
	$("."+idAdd).removeAttr('id');
	
})
$(document).on('click','#ban',function(){
	$(this).parent().slideUp();
	var id = $(this).attr('class');
	banArray.push(id);
	$.post('saveLike.php',{Movie:id,Code:0});
	
	
})
//http://stackoverflow.com/questions/9162933/make-iframe-height-dynamic-based-on-content-inside-jquery-javascript

$(document).on('click','.trailerButton' ,function() {
	console.log("trailer CLICK");
	var slideDir = $('#trailerContainer').is(':visible') ? 'slideUp' : 'slideDown';
  $('#trailerContainer').velocity(slideDir);
  $('#trailerContainer').velocity("scroll", {container: $("#cboxLoadedContent")});

});
$("#logout").on("click",function(){
	$.post('logout.php',function(){
		window.location.href = 'login.php';
	});
});

function getUserSettings(){
	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function(){
		if (this.readyState==4 && this.status==200) {
			checkLikeBanCode(JSON.parse(xml.response));
			
		}
	};
	xml.open("GET","getLikeBan.php", true);
	xml.send();
}
function checkLikeBanCode(dbArray){
	for(i=0; i< dbArray.length; i++){
		if(dbArray[i].Code == 0){ //0=ban
			banArray.push(dbArray[i].Movie);
		}
		else{ //code can only be 0 or 1 -> dont need another if
			likeArray.push(dbArray[i].Movie);
		}
	}

}
$('#recentButton').click(function(){
	console.log("WORK");
	$('#recentSearchDisplay').toggle('slide');
})
//Id has to be API field
function advancedApi(Id){
	var Id2 = "#"+Id;
	//if input is not empty
	if($(Id2+" input:text").val() != ""){
		var advancedContruct = '';
		var drop = $(Id2+" select").val();
		var input = $(Id2+" input").val();
		
		advancedContruct = "&"+Id+drop+'='+input;
		
		advancedApiArray.push(advancedContruct);
		//push to advancedApiArray??
		//console.log(advancedContruct);
	}
}
$('#advancedButton').on('click',function(){
	$('#advancedOptions').toggle('slide');
})

//validation of advanced
$('#primary_release_date').focusout(function(){
	var input = $("#primary_release_date input").val();
	
	if(!($.isNumeric(input) && input.length == 4 || input == '')){
		$("#primary_release_date .errorMessage").remove();
		$("#primary_release_date input").addClass('error');
		$("#primary_release_date").append('<div class="errorMessage">Must be in the form YYYY</div>');
	}
	else{
		$("#primary_release_date input").removeClass('error');
		$("#primary_release_date .errorMessage").remove();
	}
});
$('#with_runtime').focusout(function(){
	var input = $("#with_runtime input").val();
	
	if(!($.isNumeric(input) && input.length <= 3 || input == '')){
		$("#with_runtime .errorMessage").remove();
		$("#with_runtime input").addClass('error');
		$("#with_runtime").append('<div class="errorMessage">Must be a number. For example 2.5</div>');
	}
	else{
		$("#with_runtime input").removeClass('error');
		$("#with_runtime .errorMessage").remove();
	}
});
$('#vote_average').focusout(function(){
	var input = $("#vote_average input").val();
	
	if(!($.isNumeric(input) && input.length == 1 || input =='')){
		$("#vote_average .errorMessage").remove();
		$("#vote_average input").addClass('error');
		$("#vote_average").append('<div class="errorMessage">Must be a single digit number</div>');
	}
	else{
		$("#vote_average input").removeClass('error');
		$("#vote_average .errorMessage").remove();
	}
});

function clearAdvanced(){
	$('#advancedOptions input').removeClass('error');
	$('#advancedOptions input').val('');
	$('#advancedOptions').css('display','none');
}

//deals with hitting enter in advanced search
$('#advancedOptions').keydown(function(e){
	//enter has been pressed within advanced options
	if(e.keyCode == 13){
		$('#searchButton').trigger('click');
	}
})
function setOpenHeight(){
	var navHeight = $('#topNav').outerHeight()*1.1;
	$('#openButton').css('padding-top',navHeight);
	$('#search h1').css('padding-top',navHeight);
	setDropPosition();
}

$('.sorter').on('click',function(){

	var checkCurrent = $(this).attr('class').split(" ");
	console.log($.inArray('active', checkCurrent));
	//if clicked on is already active
	if($.inArray('active', checkCurrent)  > -1){
		$('#sort div').removeClass('active');
		$('#popularity').addClass('active');
	}
	else{
		$('#sort div').removeClass('active');
		$(this).addClass('active');
	}
	
})
function getSort(){
	sortId ='';
	sortId = $('#sort .active').attr('id');
}
$(window).resize(function(){
	
	//setMobile();
});
function setMobile(){
	
	var height = $(window).height();
	var width = $(window).width();
	console.log(width);
	//mobile phone size
	if(width/height < 1){
		$('body').css('font-size','20pt');
		$('#topNav').css('height','10%');
		$("#settingsButton").css('height','100%');
		$("#settingsButton").css('width','auto');
		$('#openButton').css('padding-top','20%');
		$('#homeImage').css('height','100%');
		$('#homeImage').css('width','auto');
		
		$('#grid').css('width','100%');
		$('#grid').css('grid-template-columns', 'repeat(2, 1fr)');
		$('.poster').css('width','40%');
		$('body').prepend('<style id="mobileLarge">#largeMoviePoster{width: 60%; float:none; display: block; margin: 0 auto}</style>');
		
	}
	else{
		$('body').css('font-size','12pt');
		$('#topNav').css('height','');
		
		$('#grid').css('width','60%');
		$('#grid').css('grid-template-columns', 'repeat(5, 1fr)');
		$('.poster').css('width','20%');
		$('#mobileLarge').remove();
	}
}
$('#settingsButton').mouseover(function(){
	setDropPosition();
	$('.dropdown-content').css('display','block');
})
$('#settingsButton').click(function(){
	$('.dropdown-content').toggle();
})
$('#search, #addPosters').mouseover(function(){
	if($('.dropdown-content').css('display') == 'block'){
		$('.dropdown-content').css('display','none');
	}
	
})
function setDropPosition(){
	var navHeight = $('#topNav').outerHeight()*1.01;
	$('.dropdown-content').css('margin-top',navHeight);
}

function reverseString(str) {
    var newString = str.split("-");
	
	//personal code!
	if(newString[1].charAt(0) == '0'){
		newString[1]=newString[1].slice(1);
	}
	if(newString[2].charAt(0) == '0'){
		newString[2]=newString[2].slice(1);
	}
	
	
	newString = newString.reverse();
	newString = newString.join('-');
	return newString;
}
