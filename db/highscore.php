<?php 

	//$mysql_host = "mysql9.000webhost.com";
	$mysql_host = "localhost";
	$mysql_database = "a8597555_scores";
	$mysql_user = "a8597555_superg";
	$mysql_password = "Password1";
	$mysql_tableName = "BallsHighScore";
	
	if(isset($_POST['username']) && !empty($_POST['username'])) 
	{
		$username = $_POST['username'];
	}
	else
	{
		return array("FAIL", "No username found.");
	}
  
	if(isset($_POST['score']) && !empty($_POST['score'])) 
	{
		$score = $_POST['score'];
	}
	else
	{
		return array("FAIL", "No score found.");
	}
	
	$con = mysql_connect($mysql_host, $mysql_user, $mysql_password);
	$dbs = mysql_select_db($mysql_database, $con);
	
	$query = "INSERT INTO BallsHighScore (Username, HighScore, Level, DateCreated) "
		. "VALUES ('" . $username . "', " . $score . ", 5, NOW())";
	
	$result = mysql_query($query);
	//	$array = mysql_fetch_row($result);    

	$array = array($result, $query);
	echo json_encode($array);

?>