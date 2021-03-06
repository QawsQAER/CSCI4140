/*
	This file is for  functions that help implements the main functionality
*/

var current_player;
var last_result_index = 0;
var not_init = 1;
var isSetTimeout;
var timeout;
var time = 120;
var game_over = 0;

function Init()
{
	//send request to get the initilization data
	Init_get_init_data();
	display_init(slot_list);
	init_small_map();
	update_turn_div();
	query_timer = setInterval(query_turn,3000);
	document.getElementById("surrender").addEventListener("onclick","surrender_clicked_handler",false);
	not_init = 0;
}

function Init_get_init_data()
{
	//This function will send request to get the initilization data
	var xhr = new XMLHttpRequest();
	xhr.open("POST","./net/init.php",false);
	xhr.send();
	//console.log(xhr.responseText);
	var response = JSON.parse(xhr.responseText);
	console.log(response.p1);
	console.log(response.p2);
	console.log(response.p3);
	var p1 = new player(response.p1.user_id,response.p1.username,response.p1.gold,response.p1.wood,response.p1["status"],response.p1["turn"]);
	var p2 = new player(response.p2.user_id,response.p2.username,response.p2.gold,response.p2.wood,response.p2["status"],response.p2["turn"]);
	var p3 = new player(response.p3.user_id,response.p3.username,response.p3.gold,response.p3.wood,response.p3["status"],response.p3["turn"]);
	player_list = [p1,p2,p3];
	for(var count = 0;count < player_list.length;count++)
	{
		if(player_list[count].pid == $.cookie("CURRENT_USER"))
			current_player = player_list[count];
	}
	current_player.show_info();
	init_army_list(response.army);
	//console.log("Things done for armys");
	
	init_slot_list(response.slots);

	//console.log("Things done for slots");

	parseRemoteResultList(response["result"]);
	result_list.sort(compare_result_id);
	
	if(IsMyTurn())
	{
		alert("Hey ! It's your turn !");
	}
}

//This function returns true or false 
function IsMyTurn()
{
	if(current_player["pturn"] == "1")
	{
		if(isSetTimeout){}
		else
		{
			time = 120;
			timeout = setInterval(time_up, 1000);
			isSetTimeout = true;
		}
		return true;
	}
	else 
	{
		if(isSetTimeout)
		{
			clearInterval(timeout);
			isSetTimeout = false;
		}
		else{}
		var time_div = document.getElementById("time");
		time_div.innerHTML = "Not your turn.";
		return false;
	}
}

function query_turn()
{
	//If it is current player's turn, then do not query the server
	//console.log(time++);
	if(IsMyTurn())
	{
		return ;
	}
	if(!display_init_done)
		return ;
	//If it is not current player's turn, send query to the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST","/game/game_logic_server/query_turn.php",true);
	xhr.setRequestHeader("MAX_RESULT_ID",getMAXResultId());
	xhr.setRequestHeader("MAX_OCCUPATIONRECORD_ID",last_occupationrecord_id);
	xhr.send();
	xhr.onreadystatechange = function()
	{
		if(xhr.status == 200 && xhr.readyState == 4)
		{
			console.log("query_turn() :" + xhr.responseText);
			var response;
			try
			{
				response = JSON.parse(xhr.responseText);
			}
			catch(error)
			{
				console.log("query_turn() :JSON parse error" + error);
				return ;
			}

			//parseRemoteResultList() is implemented in /game/game_logic_server/Result_list.js
			parseRemoteResultList(response["latest_result_list"]);
			//last_result_index = result_list.length;
			
			//parseSlotOwnerChange() is implemented here 
			parseSlotOwnerChange(response["occupation_record"]);
			setActivePlayer(response["active_player"]);
			
			//this function will reset the attack to default value, called in order to cancel the defend effect in the previous round
			reset_army_attack(response["active_player"]);	
			update_turn_div();
			if(IsMyTurn() && !game_over)
			{
				window.current_player.gold = response["player_gold"];
				window.current_player.wood = response["player_wood"];
				current_player.show_info();
				reinit_not_dead_army();
				alert("Hey ! It's your turn !");
			}
		}
	}
}

var query_timer;
var last_occupationrecord_id = 0;

function parseSlotOwnerChange(record)
{
	for(var count = 0;count < record.length;count++)
	{
		getSlotByXY(record[count]["slot_col"],record[count]["slot_row"]).owner = record[count]["curr_owner"];
		console.log("calling update_hexagon_owner() with x," + record[count]["slot_col"] +  " y " + record[count]["slot_row"] + " owner " + record[count]["curr_owner"]);
		update_hexagon_owner(record[count]["slot_col"],record[count]["slot_row"],record[count]["curr_owner"]);
		if(count + 1 == record.length)
		last_occupationrecord_id = record[record.length - 1]["id"];
	}
	
}

function time_up()
{
	var time_div = document.getElementById("time");
	if(time == 16){
		document.getElementById("count15").play();
	}
	if(time == 1)
	{
		time_div.innerHTML = 'Time is up!';
		nextround_clicked_handler();
	}
	time_div.innerHTML = "Time remaining: " + time + "s";
	time = time - 1;
}

function generate_quit_button()
{
	alert("You have lost the game, you may quit game by clicking the button on the info board");
	var quit_button = document.getElementById("quit_game");
	quit_button.style.display = "inline-block";
}
function quit_game()
{
	alert("quiting the game");
	var xhr = new XMLHttpRequest();
	xhr.open("POST","/game/game_logic_server/quit_game.php",false);
	xhr.send();
	alert(xhr.responseText);
	window.location.href = "/room.php";
}