<?php 

	//$mysql_host = "mysql9.000webhost.com";
	$mysql_host = "localhost";
	$mysql_database = "a8597555_scores";
	$mysql_user = "a8597555_superg";
	$mysql_password = "Password1";
	$mysql_tableName = "BallsHighScore";
	
	/*if(isset($_POST['username']) && !empty($_POST['username'])) 
	{
		$username = $_POST['username'];
	}
  
	if(isset($_POST['score']) && !empty($_POST['score'])) 
	{
		$score = $_POST['score'];
	}*/
	
	$con = mysql_connect($mysql_host, $mysql_user, $mysql_password);
	$dbs = mysql_select_db($mysql_database, $con);
	
	$query = "SELECT UserName, HighScore, Level, DateCreated FROM BallsHighScore ORDER BY HighScore DESC;";
	
	$result = mysql_query($query);
	//$array = mysql_fetch_array($result);    

	
	while($res=mysql_fetch_assoc($result, MYSQL_ASSOC))
	{
		$resultTableRows .= '<tr><td>' . $res['User'] . '</td><td>' . $res['HighScore']. '</td><td> ' . $res['Level'] . '</td><td>' . $res['DateCreated'] . '</td></tr>';
	}
	
	
	echo $resultTableRows;
	//echo json_encode($array);

?>