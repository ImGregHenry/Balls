
$(document).ready(function() {

	// Handle submission of high scores
	$("#btnSubmitHighScore").click(function() {
		
		if($("#isSubmitted").val() !== "false")
		{
			$("#txtSubmitHighScoreMessage").text("Your highscore has already been submitted.");
			return;
		}
		 
		var score = $("#hiddenHighScore").text();
		var user = $("#txtSubmitUser").val();
		var level = $("#hiddenLevel").text();
		var args = "username=" + user + "&score=" + score + "&level=" + level;
		
		//TODO: set max username size
		// Make sure a username has been entered
		if($("#txtSubmitUser").val() == '')
		{
			$("#txtSubmitHighScoreMessage").text("You must enter a username to submit.");
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
				
				$("#txtSubmitHighScoreMessage").text("Highscore has been submitted!");
				return;
			}
			//TODO: handle errors for all ajax requests
		});
	});
	
	
	
	// Click off the high score screen to remove
	$('#overlay').click(function () {
		$("#overlay").hide();
		$("#viewHighScoresPopup").hide();
		$("#submitHighScorePopup").hide();
    });
	
	/////////////////////
	// USED FOR DEBUGGING
	/////////////////////
    $('#btnOpenSubmitHighScore').click(function () {
		$("#overlay").show();
		$("#submitHighScorePopup").show();
    });
	
	$('#btnSubmitHighScoreClose').click(function () {
		$("#overlay").hide();
		$("#submitHighScorePopup").hide();
    });
	
	// View high score loading
	$("#btnViewHighScores").click(function() {
		$("#overlay").show();
		$("#viewHighScoresPopup").show();
		
		loadHighScores();
	});
});


function loadHighScores()
{
	args = '';
	$.ajax({
		url: 'db/gethighscores.php',
		data: args,
		type: 'post',
		success: function (data)
		{
			var data2 = $.parseJSON(data);
			
			// remove previous rows for fresh data
			$("#tblHighScore").find("tr:gt(0)").remove();
			   
			//TODO: handle processing of table better.
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
}