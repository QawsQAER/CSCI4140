<?php
	//This file will handle the turn result submiitted by the player
	$APP_ROOT = $_ENV["OPENSHIFT_REPO_DIR"];
	require_once($APP_ROOT."lib/db.php");
	require_once("lib.php");
	$user_id = $_COOKIE["CURRENT_USER"];
	$game_id = $_COOKIE["IN_GAME"];
	

	if(!check_cookie($db))
	{
		echo "{\"status\":\"error\",";
		echo "\"error_detail\":\"no_valid_cookie\"}";
		exit;
	}

	if(!IsMyTurn($db,$user_id,$game_id))
	{
		echo "{\"status\":\"error\",";
		echo "\"error_detail\":\"not_your_turn\"}";
		exit;
	}

	/*Handling surrender*/
	if($_SERVER["HTTP_TYPE"] == "SURRENDER")
	{
		
		$max_result_id = $_SERVER["HTTP_MAX_RESULT_ID"];
		
		echo "{";

		//insert the surrender action into the result list
		$new_result_id = (int) $max_result_id + 1;
		$SQL_UPDATE_SURRENDER = "INSERT INTO game_{$game_id}_resultlist (result_id,action_type,player_id) VALUES ($new_result_id,'gg',$user_id)";
		if(!mysqli_query($db,$SQL_UPDATE_SURRENDER))
		{
			$sql_error = mysqli_error($db);
			echo "\"surrender_sql_error\":\"$sql_error\"";
		}

		nextTurn($db,$game_id);

		//officially set the player's status to losing the game
		$SQL_UPDATE_SURRENDER = "UPDATE game_{$game_id}_playerlist SET player_status = 2 WHERE player_id = $user_id";
		if(!mysqli_query($db,$SQL_UPDATE_SURRENDER))
		{
			$sql_error = mysqli_error($db);
			echo "\"status\":\"error\"";
			echo ",\"sql_error\":\"$sql_error\"";
		}
		else
		{
			echo "\"status\":\"success\"";
			echo ",\"result\":\"surrender\"";
		}
		
		
		if(game_is_over($db,$game_id))
		{
			$SQL_SELECT_WINNER = "SELECT player_id FROM game_{$game_id}_playerlist WHERE player_status = 0";
			if(!mysqli_query($db,$SQL_SELECT_WINNER))
			{
				$sql_error = mysqli_error($db);
				echo ",\"SQL_SELECT_WINNER_USED\":\"$SQL_SELECT_WINNER\"";
				echo ",\"sql_result\":\"$sql_error\"";
			}
			else
				$result = mysqli_query($db,$SQL_SELECT_WINNER);
			$row_num = mysqli_num_rows($result_id);
			echo ",\"row_num\":\"$row_num\"";
			$row = mysqli_fetch_row($result);
			echo ",\"row[0]\":\"$row[0]\"";
			$new_result_id = $new_result_id + 1;
			$SQL_INSERT_WIN_RESULT = "INSERT INTO game_{$game_id}_resultlist (result_id,action_type,player_id) VALUES ($new_result_id,'win',$row[0])";
			if(!mysqli_query($db,$SQL_INSERT_WIN_RESULT));
			{
				$sql_error = mysqli_error($db);
				echo ",\"SQL_STATEMENT_USED\":\"$SQL_INSERT_WIN_RESULT\"";
				echo ",\"sql_result\":\"$sql_error\"";
			}
		}

		echo "}";
		exit;
	}

	if($_SERVER["HTTP_TYPE"] == "RESULT_LIST")
	{
		$entityBody = file_get_contents('php://input');
		$request = json_decode($entityBody,TRUE);
		$result_list = $request['result_list'];
		//handling every single result
		foreach ($result_list as $result) 
		{
			/*
			for every single result,
			1. store it into game_{$game_id}_resultlist TABLE,
			2. Modify the accordingly value in the database
			*/
			$SQL_INSERT_STATEMENT = SQL_generate_insert_result($result,$game_id);
			//echo $SQL_INSERT_STATEMENT."\n";
			if(!mysqli_query($db,$SQL_INSERT_STATEMENT))
			echo "\n".mysqli_error($db)."\n";

			if($result["action_type"] == "attack")
			{
				$attacker_id = $result["attacker_id"];
				$defender_id = $result["defender_id"];
				$from_x = $result["from_x"];
				$from_y = $result["from_y"];
				$to_x = $result["to_x"];
				$to_y = $result["to_y"];
				//if the attacker dead, make it disappear on the map, and mark its status on armylist
				$SQL_ATTACKER_DISAPPEAR = "UPDATE game_{$game_id}_slotlist SET slot_army = NULL WHERE slot_col = $from_x AND slot_row = $from_y";
				if($result["attacker_remaining_hp"] == 0)
				{	
					mysqli_query($db,$SQL_ATTACKER_DISAPPEAR);
					$SQL_ATTACKER_DEAD = "UPDATE gane_{$game_id}_armylist SET army_status = 'dead' WHERE army_id = $attacker_id";
					mysqli_query($db,$SQL_ATTACKER_DEAD);
				}
				//if the defender is dead, make it disappear on the map, and mark its status on armylist
				if($result["defender_remaining_hp"] == 0)
				{
					$SQL_DEFENDER_DEAD = "UPDATE game_{$game_id}_slotlist SET slot_army = NULL WHERE slot_col = $to_x AND slot_row = $to_y";
					mysqli_query($db,$SQL_DEFENDER_DEAD);
					$SQL_DEFENDER_DEAD = "UPDATE game_{$game_id}_armylist SET army_status = 'dead' WHERE army_id = $defender_id";
					mysqli_query($db,$SQL_DEFENDER_DEAD);
					//but if the attacker is not dead
					if($result["attacker_remaining_hp"] > 0)
					{
						//disappear from the attacking slot
						mysqli_query($db,$SQL_ATTACKER_DISAPPEAR);
						$SQL_ATTACKER_MOVE_TO = "UPDATE game_{$game_id}_slotlist SET slot_army = $attacker_id WHERE slot_col = $to_x AND slot_row = $to_y";
						//move to the attacked slot
						if(!mysqli_query($db,$SQL_ATTACKER_MOVE_TO))
						{
							$sql_error = mysqli_error($db);
							echo ",\"attack_new_owner_error!\":\"$sql_error\"";
							echo ",\"attacker_move_to\":\"$SQL_ATTACKER_MOVE_TO\"";
						}
					}
				}
				//update the hp in the table
				$attacker_hp = $result["attacker_remaining_hp"];
				$defender_hp = $result["defender_remaining_hp"];
				$SQL_UPDATE_ATTACKER_HP = "UPDATE game_{$game_id}_armylist SET army_hp = $attacker_hp WHERE army_id = $attacker_id";
				$SQL_UPDATE_DEFENDER_HP = "UPDATE game_{$game_id}_armylist SET army_hp = $defender_hp WHERE army_id = $defender_id";
				mysqli_query($db,$SQL_UPDATE_ATTACKER_HP);
				mysqli_query($db,$SQL_UPDATE_DEFENDER_HP);
			}
			else if($result["action_type"] == "move")
			{
				//echo "\n"."editing move for database"."\n";
				$army_id = $result["army_id"];
				$from_x = $result["from_x"];
				$from_y = $result["from_y"];
				$to_x = $result["to_x"];
				$to_y = $result["to_y"];

				$SQL_REMOVE_ARMY_OF_SLOT = "UPDATE game_{$game_id}_slotlist SET slot_army = NULL WHERE slot_col = $from_x AND slot_row = $from_y";
				$SQL_ADD_ARMY_OF_SLOT = "UPDATE game_{$game_id}_slotlist SET slot_army = $army_id WHERE slot_col = $to_x AND slot_row = $to_y";
				//echo "\"sql_statement\":\"$SQL_REMOVE_ARMY_OF_SLOT\"";
				//echo "\"sql_statement\":\"$SQL_ADD_ARMY_OF_SLOT\"";
				if(!mysqli_query($db,$SQL_REMOVE_ARMY_OF_SLOT))
					echo "\n".mysqli_error();
				
				if(!mysqli_query($db,$SQL_ADD_ARMY_OF_SLOT))
					echo "\n".mysqli_error();
			}
			else if($result["action_type"] == "build")
			{
				$army_id = $result["army_id"];
				$army_type = $result["army_type"];
				$from_x = $result["from_x"];
				$from_y = $result["from_y"];

				$value = intval($army_type) - 1;
				$gold_cost = $army_gold_cost[$value];
				$wood_cost = $army_wood_cost[$value];
				$hp = $army_hp[$value];

				$SQL_ADD_NEW_ARMY = "INSERT INTO game_{$game_id}_armylist VALUES($army_id,$army_type,$user_id,'ready',$hp)";
				$SQL_ADD_TO_SLOT = "UPDATE game_{$game_id}_slotlist SET slot_army = $army_id WHERE slot_col = $from_x AND slot_row = $from_y";
				
				//army_type ranges from (1..3)
				//the index ranges from (0..2)


				$SQL_REDUCE_RESOURCE = "UPDATE game_{$game_id}_playerlist SET player_gold = player_gold - $gold_cost, player_wood = player_wood - $wood_cost WHERE player_id = $user_id";
				mysqli_query($db,$SQL_ADD_NEW_ARMY);
				mysqli_query($db,$SQL_ADD_TO_SLOT);
				if(!mysqli_query($db,$SQL_REDUCE_RESOURCE))
				{
					$var_dump_gold = var_dump($army_gold_cost);
					$var_dump_wood = var_dump($army_wood_cost);
					echo ",\"intval()\":\"$value\"";
					echo ",\"gold_cost\":\"$gold_cost\"";
					echo ",\"wood_cost\":\"$wood_cost\"";
					echo ",\"var_dump_gold\":\"$var_dump_gold\"";
					echo ",\"var_dump_wood\":\"$var_dump_wood\"";
					echo ",\"sql_reduce_resource\":\"$SQL_REDUCE_RESOURCE\"";
					echo ",\"sql_reduce_resource_error\""."\"".mysqli_error()."\"";
				}
			}
			else if($result["action_type"] == "surrender")
			{

			}
			else
			{
				echo "\"error1\":\"invalid action_type\"";
			}
		}
		nextTurn($db,$game_id);

		//check if the game is ended
		if(game_is_over($db,$game_id))
		{
			//if so, get the winner's player id
			$SQL_SELECT_WINNER = "SELECT player_id FROM game_{$game_id}_playerlist WHERE player_status != 2";
			$result = mysqli_query($db,$SQL_SELECT_WINNER);
			$row = mysqli_fetch_row($result);
			//get the maximum result id
			$SQL_QUERY_MAX_RESULT_ID = "SELECT MAX(result_id) FROM game_{$game_id}_resultlist";
			$tmp_result = mysqli_query($db,$SQL_QUERY_MAX_RESULT_ID);
			$tmp_row = mysqli_fetch_row($tmp_result);
			$new_result_id = (int) $tmp_row[0] + 1;

			//insert the win result into the result list
			$SQL_INSERT_WIN_RESULT = "INSERT INTO game_{$game_id}_resultlist (result_id,action_type,player_id) VALUES ($new_result_id,'win',$row[0])";
			mysqli_query($db,$SQL_INSERT_WIN_RESULT);
		}
	}
?>
