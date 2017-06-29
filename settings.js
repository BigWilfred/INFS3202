var banArray =[];
var likeArray =[];

var banMovies =[];
var likeMovies =[];

var movieApi = "https://api.themoviedb.org/3/movie/";
var apiKey = 'd4195dc48695656a97ee40e868e0ee66';
var setPosterUrl = 'https://image.tmdb.org/t/p/w500'

//$('.example5').colorbox();
$( "#tabs" ).tabs();
$(document).ready(function(){
	getUserSettings();
	console.log("WIDTH "+$(document).width());
	console.log("Height "+$(document).height());
	console.log($(document).width()/$(document).height());
	if($(document).width()/$(document).height() < 1){
		console.log("+++++");
		$('body').append
		('<style id="mobileSettings">.settingsFixture{width: 100%;}body{font-size:24pts;}</style>');
	}
	else{
		console.log("------");
		$('#mobileSettings').remove();
		
	}
	
})
$(document).on('click','.remove',function(){
	//first delete from db!
	var code = 0;
	movie = $(this).parent().parent().attr('id');
	codeCheck = $(this).parent().parent().parent().attr('id');
	if(codeCheck == 'tab1'){
		code = 1;
	}
	if(codeCheck == 'tab2'){
		code = 0;
	}
	console.log(movie + "    " + code);
	$.post('removeLikeBan.php',{MovieTitle: movie,Code: code});
	$(this).parent().parent().toggle('left',function(){
		$(this).remove();
	});
	
})

function getUserSettings(){
	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function(){
		if (this.readyState==4 && this.status==200) {
			checkLikeBanCode(JSON.parse(xml.response));
			banMovies = getMovieInformation(banArray, "#tab2");
			likeMovies = getMovieInformation(likeArray, "#tab1");
			console.log(banMovies);
			
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
	console.log(banArray);
	setupBan();
	setupLike();
}
function getMovieInformation(forArray, selectorId){
	//i hav no idea why this works on 2...
	//when i added h1 to tab1 it had to be increase
	//something to do with whats before the settingsCont
	var positionCounter = 2 ;
	var toArray = [];
	for(i=0; i < forArray.length; i++){
		
		
		var url = movieApi + forArray[i] + '?api_key=' + apiKey + '&language=en-US';
		$.getJSON(url, function(data){
			
			toArray.push(data);
			$(selectorId+' .settingsFixture:nth-child('+positionCounter+')').html("<img src='"+setPosterUrl+data.poster_path+"' class='poster2'/><div><div class='settingsTitle'>"+data.original_title+"</div><p> "+data.overview+"</p><div class='remove'><img src='images/remove.png' alt='remove'/></div></div>");
			positionCounter++;
		});
	}
	return toArray;
	
}
$(document).on('click','#testButton',function(){
	console.log("TEST");
	console.log(banMovies);
})
function setupBan(){
	for(i=0;i<banArray.length;i++){
		$("#tab2").append("<div id='"+banArray[i]+"' class='settingsFixture'></div>");
	}
}
function setupLike(){
	for(i=0;i<likeArray.length;i++){
		$("#tab1").append("<div id='"+likeArray[i]+"'class='settingsFixture'></div>");
	}
}
$(window).ready(function(){
	//settingsMobile();
})
$(window).resize(function(){
	//settingsMobile();
})
/* function settingsMobile(){
	var height2 = $(window).height();
	var width2 = $(window).width();
	console.log(width2/height2);
	if(width2/height2 <1){
		$('.settingsFixture').css('width','100%');
		console.log(")))))))))))))))");
	}
	else{
		$('.settingsFixture').css('width','45%');
	}
} */

//https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>