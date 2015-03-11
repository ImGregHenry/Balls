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
	
	if(isset($_POST['level']) && !empty($_POST['level'])) 
	{
		$level = $_POST['level'];
	}
	else
	{
		return array("FAIL", "No level found.");
	}
	
	try {
		$query = "INSERT INTO BallsHighScore (Username, HighScore, Level, DateCreated) "
			. "VALUES (:username, :score, :level, NOW())";
		
		$conn = new PDO("mysql:host=$mysql_host;dbname=$mysql_database", $mysql_user, $mysql_password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$stmt = $conn->prepare($query);
		$stmt->bindParam(':username', $username, PDO::PARAM_STR, 20);
		$stmt->bindParam(':score', $score, PDO::PARAM_INT);
		$stmt->bindParam(':level', $level, PDO::PARAM_INT);
		
		$stmt->execute();
	}
	catch(PDOException $e)
	{
		echo "ERROR: $e";
	}
	
	
	echo json_encode($array);

?>