<?php
#$DATA_DIR is the abosolute path storing the permanent data, which is not accessible by HTTP request
#$RUNTIME_DATA_DIR is the abosolute path for the runtime root repository, a symbolic link should be created here for access to the permanent data
#$MYSQL_HOST is the IP address of the MYSQL SERVER
#$MYSQL_PORT is the port of the MYSQL SERVER
#$MYSQL_PWD is the password of the MYSQL SERVER
#$MYSQL_USR is the username of the MYSQL SERVER

$army_hp = array(5,3,3);
$army_attack = array(3,4,1);
$army_gold_cost = array(20,25,15);
$army_wood_cost = array(20,15,25);
$APP_NAME = $_ENV["OPENSHIFT_APP_NAME"];

	$DATA_DIR = getenv('OPENSHIFT_DATA_DIR');
	$RUNTIME_DATA_DIR = getenv('OPENSHIFT_REPO_DIR');
	$MYSQL_HOST = getenv("OPENSHIFT_MYSQL_DB_HOST");
	$MYSQL_PORT = getenv("OPENSHIFT_MYSQL_DB_PORT");
	$MYSQL_PWD = getenv("OPENSHIFT_MYSQL_DB_PASSWORD");
	$MYSQL_USR = getenv("OPENSHIFT_MYSQL_DB_USERNAME");
#$db is the connection to the mysql server
	$db = mysqli_connect("$MYSQL_HOST:$MYSQL_PORT",$MYSQL_USR,$MYSQL_PWD,$APP_NAME);
	function show_db_php()
	{
		global $DATA_DIR, $RUNTIME_DATA_DIR, $MYSQL_HOST, $MYSQL_PORT, $MYSQL_USR, $MYSQL_PWD;
		echo "<p>DATA_DIR: |$DATA_DIR|</p>";
		echo "<p>RUNTIME_DATA_DIR: |$RUNTIME_DATA_DIR|</p>";
		echo "<p>MYSQL_HOST: |$MYSQL_HOST|</p>";
		echo "<p>MYSQL_PORT: |$MYSQL_PORT|</p>";
		echo "<p>MYSQL_USR: |$MYSQL_USR|</p>";
		echo "<P>MYSQL_PWD: |$MYSQL_PWD|</p>";
	}

	function check_cookie($con)
	{
		$USER_COOKIE = $_COOKIE["USER_COOKIE"];
		$SQL_COOKIE_QUERY = "SELECT * FROM Cookie WHERE `cookie` = '$USER_COOKIE'";
		if($result = mysqli_query($con,$SQL_COOKIE_QUERY))
		{
			if(mysqli_num_rows($result))
			{
				return true;
			}
			else
			{
				 return false;
			}
		}
	}

	function db_create_table($con,$sql,$table_name)
	{
		if(mysqli_query($con,$sql))
		{
			echo "<p>Create table $table_name successfully</p>"; 
		}
		else
		{
			echo "<p>Error creating table $table_name: ".mysqli_error($con)."</p>";
		}
	}

	function db_drop_table($con,$sql,$table_name)
	{
		if(mysqli_query($con,$sql))
		{
			echo "<p>Drop table $table_name successfully</p>";
		}
		else
		{
			echo "<p>Error dropping table $table_name: ".mysqli_error($con)."</p>";
		}
	}

function delete_game($con,$game_id)
{
	$SQL_DROP_playerlist = "DROP TABLE game_{$game_id}_playerlist";
	$SQL_DROP_armylist = "DROP TABLE game_{$game_id}_armylist";
	$SQL_DROP_slotlist = "DROP TABLE game_{$game_id}_slotlist";
	$SQL_DROP_actionlist = "DROP TABLE game_{$game_id}_resultlist";
	$SQL_DROP_occupationrecord = "DROP TABLE game_{$game_id}_occupationrecord";
	$SQL_DELETE_GAME = "DELETE FROM Game WHERE game_id = $game_id";
	if(!mysqli_query($con,$SQL_DROP_occupationrecord))
	{
		$sql_error = mysqli_error($con);
		echo "\"occupationrecordError\":\"$sql_error\",";
	}
	if(!mysqli_query($con,$SQL_DROP_actionlist))
	{
		$sql_error = mysqli_error($con);
		echo "\"actionlistError\":\"$sql_error\",";
	}
	if(!mysqli_query($con,$SQL_DROP_slotlist))
	{
		$sql_error = mysqli_error($con);
		echo "\"slotlistError\":\"$sql_error\",";
	}
	if(!mysqli_query($con,$SQL_DROP_armylist))
	{
		$sql_error = mysqli_error($con);
		echo "\"armylistError\": $sql_error\",";
	}
	if(!mysqli_query($con,$SQL_DROP_playerlist))
	{
		$sql_error = mysqli_error($con);
		echo "\"playerlistError\":\"$sql_error\",";
	}
	if(!mysqli_query($con,$SQL_DELETE_GAME))
	{
		$sql_error = mysqli_error($con);
		echo "\"deletegame\":\"$sql_error\",";
	}
}

?>
