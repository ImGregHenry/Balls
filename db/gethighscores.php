<?php 

	$mysql_host = "mysql9.000webhost.com";
	//$mysql_host = "localhost";
	$mysql_database = "a8597555_scores";
	$mysql_user = "a8597555_superg";
	$mysql_password = "Password1";
	$mysql_tableName = "BallsHighScore";
	
	try{
		$query = "SELECT UserName, HighScore, Level,  DATE_FORMAT(DateCreated, '%b %e, %Y') AS DateCreated FROM BallsHighScore ORDER BY HighScore DESC LIMIT 10";

		
		$conn = new PDO("mysql:host=$mysql_host;dbname=$mysql_database", $mysql_user, $mysql_password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$stmt = $conn->prepare($query);
		
		$stmt->setFetchMode(PDO::FETCH_ASSOC); 
		$stmt->execute();

		$arrayResult = $stmt->fetchAll();
		
		echo json_encode($arrayResult);
	}
	catch(PDOException $e)
	{
		echo "ERROR: $e";
	}
	
	$conn = null;
?>