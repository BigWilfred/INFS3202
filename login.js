var likeArray = [];
var banArray = [];

//for login page to auth user
$('#logForm').submit(function(e){
	e.preventDefault();

	$.post('loginUser.php', $('#logForm').serialize(), function(r){
		console.log(r);
		if(r == 1){
			window.location.href = 'search.php'; //would go to main page!!!
			
			//could make this a function within main JS file. Only if im going to use more than 1 file
		
		}
		
		//below handles validation of form
		else if (r == 90){//no user in DB
			$('#logForm input:first-of-type').addClass('error');
			
		}
		else if (r == 99){//password doesnt match
			$('#logForm input:nth-of-type(2)').addClass('error');
			$('#logForm input:first-of-type').removeClass('error');
			$('#logForm #name').remove();
			
			
		}
	});
});

$('#subSignup').click(function(e){
	e.preventDefault();
	//need to do form validation here so that the user doesnt create user with nothing!
	console.log($('#createForm input:nth-of-type(1)').val());
	checkEmpty(1);
	checkEmpty(2);
	checkEmpty(3);
	checkEmpty(4);
	passwordsMatch();
	
	if(checkEmpty(1) && checkEmpty(2) && checkEmpty(3) && checkEmpty(4) && passwordsMatch()){
		$.post('createUser.php', $('#createForm').serialize(), function(r){
			console.log(r);
			if(r ==1){
				window.location.href = 'login.php';
			}
			if(r == 50){
				//user already exists
				$('body').append("User already exists. Please use new name");
			}
		});
	}
});
$('#goToCreate').click(function(e){
	e.preventDefault();
	window.location.href = 'createUser.html';
});
$('#back').click(function(e){
	e.preventDefault();
	window.location.href = 'login.php';
});

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
	console.log(likeArray);
}
function checkEmpty(ofType){
	if($('#createForm input:nth-of-type('+ofType+')').val() == ''){
		$('#createForm input:nth-of-type('+ofType+')').addClass('error');
		$('#createForm input:nth-of-type('+ofType+')').append('<div>WRK</div>');
		return false;
	}
	else{
		$('#createForm input:nth-of-type('+ofType+')').removeClass('error');
		return true;
	}
}
function passwordsMatch(){
	if ($('#createForm input:nth-of-type(3)').val() == $('#createForm input:nth-of-type(4)').val()){
		return true;
	}
	else{
		$('body').append("Passwords must match");
		return false;
	}
}