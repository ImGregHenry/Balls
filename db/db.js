
$(document).ready(function(){

	// Handle submission of high scores
	$("#btnSubmitHighScore").click(function() {
		  
		 if($("#isSubmitted").val() !== "false")
		 {
			$("#lblSubmitResult").text("Your highscore has already been submitted.");
			return;
		 }
		 
		var score = $("#txtSubmitScore").val();
		var user = $("#txtSubmitUser").val();
		var args = "username=" + user + "&score=" + score;
		
		// Make sure a username has been entered
		if($("#txtSubmitUser").val() == '')
		{
			$("#lblSubmitResult").text("You must enter a username to submit.");
			return;
		}
		
		$.ajax({
			url: 'db/submithighscore.php',
			data: args,
			type: 'post',
			success: function (data)
			{
				$("#isSubmitted").val("true");
				$("#lblSubmitResult").text("Highscore has been submitted!");
				return;
			}
			//TODO: handle errors for all ajax requests
		});
	});
	
	// View high score loading
	$("#btnViewHighScores").click(function() {
		$("#overlay").show();
		$("#viewHighScoresPopup").show();
		 
		//var score = $("#txtSubmitScore").val();
		//var user = $("#txtSubmitUser").val();
		args = '';
		$.ajax({
			url: 'db/gethighscores.php',
			data: args,
			type: 'post',
			success: function (data)
			{
				alert(data);
				//$('tblHighScore').append(data);
				return;
			}
		});
	});
	
    $('#btnOpenSubmitHighScore').click(function () {
		$("#overlay").show();
		$("#submitHighScorePopup").show();
    });
	
	$('#btnSubmitHighScoreClose').click(function () {
		$("#overlay").hide();
		$("#submitHighScorePopup").hide();
    });
	
	// Click off the high score screen to remove
	$('#overlay').click(function () {
		$("#overlay").hide();
		$("#submitHighScorePopup").hide();
    });
});
