
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
		var level = 7;
		var args = "username=" + user + "&score=" + score + "&level=" + level;
		
		//TODO: set max username size
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
				// Set submitted flag
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
			//datatype: 'json',
			type: 'post',
			success: function (data)
			{
				var data2 = $.parseJSON(data);
				
				$.each(data2, function(i, item) {
						var str = '';
						if(i === 0)
							str += "<tbody>";
						
						var str = "<tr class=";
						if (i % 2 == 0)
							str += "\"alt\"";
						
						var rank = i+1;
						
						str += "><td>" + rank + "</td>";
						str += "<td>" + item['UserName'] + "</td>";
						str += "<td>" + item['HighScore'] + "</td>";
						str += "<td>" + item['Level'] + "</td>";
						str += "<td>" + item['DateCreated'] + "</td></tr>";
						
						if(i===9)
							str += "</tbody>";
						
						$("#tblHighScore").append(str);
				});
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
		$("#viewHighScoresPopup").hide();
		$("#submitHighScorePopup").hide();
    });
});
