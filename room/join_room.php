<?php
	/*
	This file will handle the user's request to join an existing room
	If the user is the last one to join the game, the game shall start 
	immediately.
	And the game database should get initilzed here.

	Example:
		slots table for game_id = 1
		"CREATE TABLE slots_1...."
		"CREATE TABLE players_1...."
	*/
	require_once("../lib/db.php");
	$response = "";
	if(check_cookie($db))
	{
		//If the cookie exists
		$user_id = $_SERVER['HTTP_USERID'];
		$room_id = $_SERVER['HTTP_ROOMID'];
		
		$SQL_CHECK_ROOM = "SELECT * FROM Game WHERE Game_id = '$room_id'";
		$result = mysqli_query($db, $SQL_CHECK_ROOM);
		if(mysqli_num_rows($result) == 0)
		{
			$response['status'] = 'failed';
			$response['error'] = 'room not exist';
		}
		
		$SQL_CHECK_FULL = "SELECT P1, P2, P3 FROM Game WHERE Game_id = '$room_id'";
		$result = mysqli_query($db, $SQL_CHECK_FULL);
		$seat = mysqli_fetch_row($result);
		if($seat[0] && $seat[1] && $seat[2])
		{
			$response['status'] = 'failed';
			$response['error'] = 'room full';
		}
		
		$SQL_CHECK_USER = "SELECT * FROM Game WHERE P1 = '$user_id' OR P2 = '$user_id' OR P3 = '$user_id'";
		$result = mysqli_query($db, $SQL_CHECK_USER);
		if(mysqli_num_rows($result) != 0)
		{
			$response['status'] = 'failed';
			$response['error'] = 'user not available';
		}
		
		if($response['status'] == "")
		{
			$start_game = 0;
			$response['status'] = 'success';
			$SQL_ROOM_INFO = "SELECT P1, P2, P3 FROM Game WHERE Game_id = '$room_id'";
			$result = mysqli_query($db, $SQL_ROOM_INFO);
			$seat = mysqli_fetch_row($result);
			$SQL_JOIN_ROOM = "";
			if($seat[0] == null)
			{
				$SQL_JOIN_ROOM = "UPDATE Game SET P1 = '$user_id' WHERE Game_id = '$room_id'";
			}
			else if($seat[1] == null)
			{
				$SQL_JOIN_ROOM = "UPDATE Game SET P2 = '$user_id' WHERE Game_id = '$room_id'";
			}
			else if($seat[2] == null)
			{
				$SQL_JOIN_ROOM = "UPDATE Game SET P3 = '$user_id' WHERE Game_id = '$room_id'";
				//If the current user is the last one to join, the game, the game shall start
				$start_game = 1;
			}
			mysqli_query($db, $SQL_JOIN_ROOM);
			if($start_game)
			{
				start_game_on_server($room_id,$db,$response);
			}
		}
	}
	else
	{
		$response['status'] = 'failed';
	}
	$response = json_encode($response);
	echo $response;


	//This function will initilize the game database
	/*
	!!Naming Example!!

	game_1_playerlist
	1. Game_id Player list
	| player_id (REFERENCE User.user_id)| player_name (REFERENCE User.username) | player_gold | player_lumber |
	
	game_1_slotlist
	2. Slot list
	| slot_id | slot_owner | N | NW | NE | W | E | SW | SE | S |
	
	game_1_armylist
	3. Army list
	| army_id | owner | army_type |
	
	*/
	function start_game_on_server($game_id,$con,&$response)
	{
		create_new_game_table($game_id,$con,$response);
		initilze_new_game_database($game_id,$con,$response);
	}

	function create_new_game_table($game_id,$con,&$response)
	{
		//Make the game start in TABLE Game
		$SQL_START_GAME = "UPDATE Game SET game_started = 1 WHERE `game_id` = $game_id ";
		if(!mysqli_query($con,$SQL_START_GAME))
		{
			$sql_error = mysqli_error($con);
		}
		//
		require_once("../lib/sql.php");
		
		$SQL_CREATE_PLAYERLIST = sql_create_playerlist($game_id);
		$SQL_CREATE_ARMYLIST = sql_create_armylist($game_id);
		$SQL_CREATE_SLOTLIST = sql_create_slotlist($game_id);
		
		if(!mysqli_query($con,$SQL_CREATE_PLAYERLIST))
		{
			$response["sql_playerlist_error"] = mysqli_error($con);
		}
		if(!mysqli_query($con,$SQL_CREATE_ARMYLIST))
		{
			$response["sql_armylist_error"] = mysqli_error($con);
		}
		if(!mysqli_query($con,$SQL_CREATE_SLOTLIST))
		{
			$response["sql_slotlist_error"] = mysqli_error($con);
		}
	}

	function initilze_new_game_database($game_id,$con,&$response)
	{

	}
?>