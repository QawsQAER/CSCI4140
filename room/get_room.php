<?php
	#This file will reply with the correct data about the current existing room
	#it should return data in JSON format
	#EXAMPLE
	/*
		{
			"status":"success";
			"game":[{"Game_id":"1","P1":"0","P2":"1","P3":"NULL"},
					{"Game_id":"2","P1":"4","P2":"5","P3":"NULL"},
					{"Game_id":"3","P1":"9","P2":"2","P3":"NULL"},
					{"Game_id":"4","P1":"12","P2":"3","P3":"NULL"}]
		}
	*/
	
	require_once("../lib/db.php");
	$response = "";
	if(check_cookie($db))
	{
		//If the cookie exists
		$SQL_ROOM_INFO = "SELECT * FROM Game";
		$result = mysqli_query($db, $SQL_ROOM_INFO);
		$response['status'] = 'success';
		$game = array();
		while($temp = mysqli_fetch_row($result))
		{
			$parsedRow = "";
			$parsedRow['Game_id'] = $temp[0];
			$parsedRow['P1'] = $temp[1];
			$parsedRow['P2'] = $temp[2];
			$parsedRow['P3'] = $temp[3];
			$row = json_encode($parsedRow);
			array_push($game,  $row);
		}
		//echo json_encode($current_room_info);
		$response['game'] = $game;
		$response = str_replace("\\", "", $response);
		$response = str_replace("\"{", "{", $response);
		$response = str_replace("}\"", "}", $response);
		$response = str_replace("null", "\"null\"", $response);

		$SQL_INSPECT_GAMES = "SELECT * FROM Game ORDER BY game_id ASC";
		$result = mysqli_query($db,$SQL_INSPECT_GAMES);
		$SQL_INSPECT_USERS = "SELECT username FROM User ORDER BY user_id ASC";
		$result2 = mysqli_query($db,$SQL_INSPECT_USERS);
		$usernames = mysqli_fetch_all($result2);
		$roomDiv = "";
		while($row = mysqli_fetch_row($result))
		{
			$num = $row[0];
			$p1 = $row[1]; $p1Name = "";
			$p2 = $row[2]; $p2Name = "";
			$p3 = $row[3]; $p3Name = "";
			if($p1)
			{
				$p1Name = $usernames[$p1][0];
			}
	  
			if($p2)
			{
				$p2Name = $usernames[$p2][0];
			}
	                  
			if($p3)
			{
				$p3Name = $usernames[$p3][0];
			}
			
			$roomDiv = $roomDiv . "<div class='roomBtn' id=$num onclick=room_onclick()><div class='numDiv' id='room$num'>Room $num ! Click  and Enter this room ! !</div><div class='gameInfo' id='room$numInfo' P1='$p1' P2='$p2' P3='$p3'><br/>Player1 : $p1Name<br/>Player2 : $p2Name<br/>Player3 : $p3Name<br/></div></div>";
			if($num % 3 == 0)
			{
				$roomDiv = $roomDiv  . "<br><br>";
			}
			else
			{
				$roomDiv = $roomDiv  . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			
			//echo $roomDiv;
		}
		$response['roomDiv'] = $roomDiv;

		$user_name = $_COOKIE['CURRENT_USERNAME'];
		$user_id = $_SERVER['HTTP_USERID'];
		$SQL_CHECK_ROOM = "SELECT Game_id, game_started  FROM Game WHERE P1 = '$user_id' OR P2 = '$user_id' OR P3 = '$user_id'";
		$result = mysqli_query($db, $SQL_CHECK_ROOM);
		if(mysqli_num_rows($result) == 0)
		{
			$response['userDiv'] = "Current Player : $user_name<br/> <p id='line1'>Now you are not in any room.</p><p id='line2'>You can create a new room or join an existed room.</p>"; 
		}
		else if(mysqli_num_rows($result) == 1)
		{
			$temp = mysqli_fetch_row($result);
			$room_num = $temp[0];
			$response['userDiv'] = "Current Player : $user_name<br/> Now you are in Room $room_num<button type='button' id='quit' onclick='quit_room()'>Quit Current Room</button>"; 
			$response['temp'] = $temp;
			if($temp[1] == 1)
			{
				setcookie("IN_GAME",$room_num,null,"/");
				$response['started'] = 'yes';
			}
			else
			{
				$response['started'] = 'no';
			}
		}
		else
		{
			$response['status'] = 'failed';
		}
	}
	else
	{
		$response['status'] = 'failed';
	}
	$response = json_encode($response);
	echo $response;
?>