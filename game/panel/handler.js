//This file contains handlers for clicking Attack, move, and defend 
//[HINT] variable 'latest_slot' points to the DOM that is the grand-parent of all these actions
var current_usr_id = $.cookie("CURRENT_USER");
if(current_usr_id)
	console.log("CURRENT_USER is " + current_usr_id);

function show_range(x, y, action)
{
	remove_manual(); //in display.js
	var slot_div = document.getElementsByClassName('hexagon');

	var i = parseInt(y) * line_num + parseInt(x);//line_nume: global variable in small_map.js
	var user_id = parseInt(getCookie('CURRENT_USER')); //in game/game_logic_client/check_functions.js
	//console.log('i: ' + i);
	if(parseInt(slot_list[i].type_id) != 0) //not invalid  slot
	{
		var slot = getSlotByXY(x,y);
		//console.log(slot_list[i]);
		if(action == 'move' && slot_list[i].army_id == "")
		{
			//console.log(slot_list[i].army_id);
			slot_div[i].addEventListener('mousedown', valid_move_action, false);
			slot_div[i].setAttribute('function', 'range');
		}
		else if(action == 'attack' && slot_list[i].army_id != "" && parseInt(getArmyById(slot_list[i].army_id).owner) != user_id)
		{
			slot_div[i].addEventListener('mousedown', valid_attack_action, false);
			slot_div[i].setAttribute('function', 'range');
		}
		else
		{
			slot_div[i].addEventListener('mousedown', invalid_action, false);
			slot_div[i].setAttribute('function', 'norange');
		}
		//all the change color thing are done in display.css
	}
}

function clear_range(action)
{
	var slot_div = document.getElementsByClassName('hexagon');
	console.log(slot_num);
	console.log(slot_div.length);
	for(var i = 0; i < slot_num; i++) //slot_num: global variable in small_map.js
	{
		if(slot_div[i].getAttribute('function') == 'range')
		{
			slot_div[i].removeEventListener('mousedown', valid_move_action, false);
			slot_div[i].removeEventListener('mousedown', valid_attack_action, false);
			if(action == 'move')
			{
				slot_div[i].removeEventListener('mousedown', valid_move_action, false);
			}
			else if(action == 'attack')
			{
				slot_div[i].removeEventListener('mousedown', valid_attack_action, false);
			}
		}
		else if(slot_div[i].getAttribute('function') == 'norange')
		{
			slot_div[i].removeEventListener('mousedown', invalid_action, false);
		}
		slot_div[i].setAttribute('function', 'none');
		slot_div[i].removeEventListener('mousedown', invalid_action, false);
	}
	remove_manual();
}

function attack_clicked_handler()
{
	/*
	1. show the attack range
	2. attach attack event listener (valid_attack_action() to the div) 3
	3. attach cancel event handler 
	*/
	var x = parseInt(latest_slot.getAttribute('x'));
	var y = parseInt(latest_slot.getAttribute('y'));
	var slot = getSlotByXY(x, y);
	var army = getArmyById(slot.army_id);
	if(y%2 == 1)
	{
		show_range(x, y-1, 'attack');
		show_range(x+1, y-1, 'attack');
		show_range(x-1, y, 'attack');
		show_range(x+1, y, 'attack');
		show_range(x, y+1, 'attack');
		show_range(x+1, y+1, 'attack');
		if(army.typename == 'archer')
		{
			if( y > 1)
			{
				show_range(x-1, y-2, 'attack');
				show_range(x, y-2, 'attack');
				show_range(x+1, y-2, 'attack');
			}
			if(y < 20)
			{
				show_range(x-1, y+2, 'attack');
				show_range(x, y+2, 'attack');
				show_range(x+1, y+2, 'attack');
			}
			if(x > 1)
			{
				show_range(x-2, y, 'attack');
			}
			if(x < 20)
			{
				show_range(x+2, y-1, 'attack');
				show_range(x+2, y, 'attack');
				show_range(x+2, y+1, 'attack');
			}
			show_range(x-1, y-1, 'attack');
			show_range(x-1, y+1, 'attack');
		}
	}
	else
	{
		show_range(x-1, y-1, 'attack');
		show_range(x, y-1, 'attack');
		show_range(x-1, y, 'attack');
		show_range(x+1, y, 'attack');
		show_range(x-1, y+1, 'attack');
		show_range(x, y+1, 'attack');
		if(army.typename == 'archer')
		{
			if(y > 1)
			{
				show_range(x-1, y-2, 'attack');
				show_range(x, y-2, 'attack');
				show_range(x+1, y-2, 'attack');
			}
			if(y < 20)
			{
				show_range(x-1, y+2, 'attack');
				show_range(x, y+2, 'attack');
				show_range(x+1, y+2, 'attack');
			}
			if(x > 1)
			{
				show_range(x-2, y-1, 'attack');
				show_range(x-2, y, 'attack');
				show_range(x-2, y+1, 'attack');
			}
			if(x < 20)
			{
				show_range(x+2, y, 'attack');
			}
			show_range(x+1, y-1, 'attack');
			show_range(x+1, y+1, 'attack');
		}
	}
	latest_slot.addEventListener('mousedown', invalid_action, false);
}

function valid_attack_action(e)
{
	/*
	1. compute the result of the attack
	2. show the result
	3. record the result in result list
	4. clear the attack range
	*/
	e = e || window.event;
	//console.log(e.target);
	var target = e.target;
	while(target.className != 'hexagon')
	{
		target = target.parentNode;
	}
	console.log(target);
	var from_x = latest_slot.getAttribute('x');
	var from_y = latest_slot.getAttribute('y');
	var to_x = target.getAttribute('x');
	var to_y = target.getAttribute('y');
	var slot = getSlotByXY(from_x, from_y);
	var army = getArmyById(slot.army_id);
	console.log('attack from (' + from_x+ ', ' + from_y + ') to (' + to_x+ ', ' + to_y + ')');
	var user_action = new action('attack', army.army_id, from_x, from_y, to_x, to_y, army.type_id);
	user_action.get_result();
	var audio = document.getElementById("attackAudio");
	audio.play();
	//console.log(army);
	//army.status = "";
	update_result_list_div();
	clear_range('attack');
}

function move_clicked_handler()
{
	/*
	1. show the move range
	2. attach move event listener (valid_move_action() to the div) 
	*/
	//console.log(latest_slot);
	//console.log(latest_slot.getAttribute('x'));
	//console.log(latest_slot.getAttribute('y'));
	var x = parseInt(latest_slot.getAttribute('x'));
	var y = parseInt(latest_slot.getAttribute('y'));
	var slot = getSlotByXY(x, y);
	var army = getArmyById(slot.army_id);
	//console.log(army);
	if(y%2 == 1)
	{
		show_range(x, y-1, 'move');
		show_range(x+1, y-1, 'move');
		show_range(x-1, y, 'move');
		show_range(x+1, y, 'move');
		show_range(x, y+1, 'move');
		show_range(x+1, y+1, 'move');
		if(army.ap == 2)
		{
			if( y > 1)
			{
				show_range(x-1, y-2, 'move');
				show_range(x, y-2, 'move');
				show_range(x+1, y-2, 'move');
			}
			if(y < 20)
			{
				show_range(x-1, y+2, 'move');
				show_range(x, y+2, 'move');
				show_range(x+1, y+2, 'move');
			}
			if(x > 1)
			{
				show_range(x-2, y, 'move');
			}
			if(x < 20)
			{
				show_range(x+2, y-1, 'move');
				show_range(x+2, y, 'move');
				show_range(x+2, y+1, 'move');
			}
			show_range(x-1, y-1, 'move');
			show_range(x-1, y+1, 'move');
		}
	}
	else
	{
		show_range(x-1, y-1, 'move');
		show_range(x, y-1, 'move');
		show_range(x-1, y, 'move');
		show_range(x+1, y, 'move');
		show_range(x-1, y+1, 'move');
		show_range(x, y+1, 'move');
		if(army.ap == 2)
		{
			if(y > 1)
			{
				show_range(x-1, y-2, 'move');
				show_range(x, y-2, 'move');
				show_range(x+1, y-2, 'move');
			}
			if(y < 20)
			{
				show_range(x-1, y+2, 'move');
				show_range(x, y+2, 'move');
				show_range(x+1, y+2, 'move');
			}
			if(x > 1)
			{
				show_range(x-2, y-1, 'move');
				show_range(x-2, y, 'move');
				show_range(x-2, y+1, 'move');
			}
			if(x < 20)
			{
				show_range(x+2, y, 'move');
			}
			show_range(x+1, y-1, 'move');
			show_range(x+1, y+1, 'move');
		}
	}
	latest_slot.addEventListener('mousedown', invalid_action, false);
}

function valid_move_action(e)
{
	/*
	1. compute the result of the movement
	2. show the result
	3. record the result in result list
	*/
	var audio = document.getElementById("clickButton");
	audio.play();
	e = e || window.event;
	//console.log(e.target);
	var target = e.target;
	while(target.className != 'hexagon')
	{
		target = target.parentNode;
	}
	var from_x = latest_slot.getAttribute('x');
	var from_y = latest_slot.getAttribute('y');
	var to_x = target.getAttribute('x');
	var to_y = target.getAttribute('y');
	var slot = getSlotByXY(from_x, from_y);
	var army = getArmyById(slot.army_id);
	console.log('move from (' + from_x+ ', ' + from_y + ') to (' + to_x+ ', ' + to_y + ')');

	var user_action = new action('move', army.army_id, from_x, from_y, to_x, to_y, army.type_id);
	user_action.get_result();
	update_result_list_div();
	clear_range('move');
}

function invalid_action()
{	
	var audio = document.getElementById("clickSurrender");
	audio.play();
	console.log('Invalid action');
	clear_range('whatever');
}
function defend_clicked_handler()
{

	var from_x = latest_slot.getAttribute('x');
	var from_y = latest_slot.getAttribute('y');
	var slot = getSlotByXY(from_x, from_y);
	//console.log(slot);
	//console.log('id: ' + parseInt(slot.army_id));
	//console.log('parsed id: ' + (slot.army_id));
	var army = getArmyById(slot.army_id);
	var user_action = new action('defend', army.army_id, from_x, from_y, null, null, army.type_id);
	console.log('defend at (' + from_x+ ', ' + from_y + ')');
	user_action.get_result();
	update_result_list_div();
}


function surrender_clicked_handler()
{
	//This function handle the click event on the surrender button
	/*
	if(!IsMyTurn())
	{
		console.log("Is not your turn");	
		return;
	}
	*/

	var audio = document.getElementById("clickSurrender");
	audio.play();
	if(!IsMyTurn())
	{
		alert("You cannot surrender when it's not your turn");
		return ;
	}

	var choice = confirm("Are you sure to surrender?");
	
	if(choice)
	{
		document.getElementById("count15").pause();
		document.getElementById("count15").currentTime = 0;
		var xhr = new XMLHttpRequest();
		xhr.open("POST","/game/game_logic_server/submit_result.php",false);
		xhr.setRequestHeader("TYPE","SURRENDER");
		xhr.setRequestHeader("MAX_RESULT_ID",getMAXResultId());
		xhr.send();
		console.log("The server replies: " + xhr.responseText);

		disable_all_army();
		current_player.pturn = "0";
	}
	else
	{
		return ;
	}
}

function nextround_clicked_handler()
{
	/*
	This function handle the click event on the next round button
	*/
	document.getElementById("count15").pause();
	document.getElementById("count15").currentTime = 0;
	var audio = document.getElementById("clickNextround");
	audio.play();
	if(IsMyTurn())
	{
		remove_manual();
		clear_range('attack');
		clear_range('move');
		console.log("nextround_clicked_handler: sending the result list to the server");
		send_result_list_to_server();
	}
	else
	{
		alert("It's not your turn, don't click me!");
	}
}
