/*window.onload = function() {
  document.getElementById("btnOpenSubmit").onclick = function(){
      alert("SUCCESS");
    */
$(document).ready(function(){

	$("#btnSubmitScore").click(function() {
		  
		 if($("#isSubmitted").val() !== "false")
		 {
			$("#lblSubmitResult").text("Your highscore has already been submitted.");
			return;
		 }
		 
		var score = $("#txtSubmitScore").val();
		var user = $("#txtSubmitUser").val();
		var args = "username=" + user + "&score=" + score;
		
		if($("#txtSubmitUser").val() == '')
		{
			$("#lblSubmitResult").text("You must enter a username to submit.");
			return;
		}
		
		$.ajax({
			url: 'db/submithighscore.php',                  //the script to call to get data          
			data: args,
			type: 'post',
			success: function (data)          //on receive of reply
			{
				$("#isSubmitted").val("true");
				$("#lblSubmitResult").text("Highscore has been submitted!");
				return;
			}
			//TODO: handle errors
		});
	});
	
    $('#btnOpenSubmit').click(function () {
		$("#overlay").show();
		$("#submitPopup").show();
    });
	
	$('#btnClose').click(function () {
		$("#overlay").hide();
		$("#submitPopup").hide();
    });
	
	// Click off the high score screen to remove
	$('#overlay').click(function () {
		$("#overlay").hide();
		$("#submitPopup").hide();
    });
});
