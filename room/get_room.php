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
	if(check_cookie($db))
	{
		//If the cookie exists
		$browser_room_info = $_SERVER['HTTP_ROOM_INFO'];
		$SQL_ROOM_INFO = "SELECT * FROM Game";
		$result = mysqli_query($db, $SQL_ROOM_INFO);
		$current_room_info = "";
		while($temp = mysqli_fetch_row($result))
		{
			$parsedRow = "";
			$parsedRow['Game_id'] = $temp[0];
			$parsedRow['P1'] = $temp[1];
			$parsedRow['P2'] = $temp[2];
			$parsedRow['P3'] = $temp[3];
			$current_room_info += json_encode($temp);
			echo  json_encode($parsedRow) . " ";
		}
		//echo json_encode($current_room_info); 
	}
	else
	{
		echo "{\"status\":\"failed\",";
	}
?>