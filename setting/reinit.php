<!DOCTYPE HTML>
<html>
<head>
	<title> Reinitilization of the WebCivilazation</title>
	<link rel="stylesheet" type="text/css" href="../main.css">
</head>
<body>
<?php
	#This is a file to reinitilze the whole application
	/*
	It will
	1. Drop all the table
	2. Generate all the tables (Accroding to the db_design)
	*/
	require_once("../lib/db.php");
	require_once("../lib/sql.php");
	if(mysqli_connect_errno())
	{
		echo "<p>Failed to connect to MySQL server: ".mysqli_connect_error()."</p>";
		show_db_php();
	}

//CLEANING PART
	$SQL_FIND_STARTED_GAME = "SELECT game_id FROM Game WHERE game_started = 1";
	if($result = mysqli_query($db,$SQL_FIND_STARTED_GAME))
	{
		while($row = mysqli_fetch_row($result))
		{
			$SQL_DROP_playerlist = "DROP TABLE game_{$row[0]}_playerlist";
			$SQL_DROP_armylist = "DROP TABLE game_{$row[0]}_armylist";
			$SQL_DROP_slotlist = "DROP TABLE game_{$row[0]}_slotlist";
			$SQL_DROP_actionlist = "DROP TABLE game_{$row[0]}_resultlist";
			$SQL_DROP_occupationrecord = "DROP TABLE game_{$row[0]}_occupationrecord";
			
			if(!mysqli_query($db,$SQL_DROP_occupationrecord))
			{
				$sql_error = mysqli_error($db);
				echo "<p>$SQL_DROP_actionlist Error: $sql_error</p>";
			}
			if(!mysqli_query($db,$SQL_DROP_actionlist))
			{
				$sql_error = mysqli_error($db);
				echo "<p>$SQL_DROP_actionlist Error: $sql_error</p>";
			}
			if(!mysqli_query($db,$SQL_DROP_slotlist))
			{
				$sql_error = mysqli_error($db);
				echo "<p>$SQL_DROP_slotlist Error: $sql_error</p>";
			}
			if(!mysqli_query($db,$SQL_DROP_armylist))
			{
				$sql_error = mysqli_error($db);
				echo "<p>$SQL_DROP_armylist Error: $sql_error</p>";
			}
			if(!mysqli_query($db,$SQL_DROP_playerlist))
			{
				$sql_error = mysqli_error($db);
				echo "<p>$SQL_DROP_playerlist Error: $sql_error</p>";
			}
		}
	}
	else
	{
		$sql_error = mysqli_error($db);
		echo "<p>SELECTING STARTED GAME Error: $sql_error</p>";
		exit;
	}
	db_drop_table($db,$SQL_DROP_Game,"Game");
	db_drop_table($db,$SQL_DROP_Cookie,"Cookie");
	db_drop_table($db,$SQL_DROP_User,"User");


//CREATING PART
	db_create_table($db,$SQL_CREATE_User,"User");
	db_create_table($db,$SQL_CREATE_Cookie,"Cookie");
	db_create_table($db,$SQL_CREATE_Game,"Game");
	db_create_table($db,$SQL_CREATE_ARMYTYPE,"Armytype");
	db_create_table($db,$SQL_CREATE_SLOTTYPE,"Slottype");

	$SQL_INSERT_ADMIN = "INSERT INTO User VALUES (0,'admin','admin')";
	mysqli_query($db,$SQL_INSERT_ADMIN);
	
	mysqli_close($db);

?>
</body>
</html>
