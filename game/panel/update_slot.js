//var result_list; global variable
//var line_num = 22; global variable in small_map.js
function update_slot_list_own(hexagon, army_id)
{
	var pos_x = hexagon.getAttribute('x');
	var pos_y = hexagon.getAttribute('y');
	var slot = getSlotByXY(pos_x, pos_y) //function in game/game_logic_client->slot.js
	slot.army_id = army_id;
}

function update_slot_list_others()
{

}

function get_hexagon(x, y)
{
	var hexagon = document.getElementsByClassName('hexagon');
	var hexagon_div = hexagon[parseInt(y) * line_num + parseInt(x)];
	return hexagon_div;
}

function set_army_type(hexagon, type, army_id)
{
	hexagon.setAttribute('army_type', type); //army_type: global variable in game.html
	var src = '';
	var user_color = '';

	if(type == 'type_A')
	{
		src = '../../images/sword.png';
	}
	else if(type == 'type_B')
	{
		src = '../../images/cavalry.png';
	}
	else if(type == 'type_C')
	{
		src = '../../images/archer.png';
	}	

	var user_id = getArmyById(parseInt(army_id)).owner;
	if(hexagon.getAttribute('slot_type') != 'capital_slot')
	{
		if(user_id == user_1)
		{
			user_color = user_1_color;
		}
		else if(user_id == user_2)
		{
			user_color = user_2_color;
		}
		else if(user_id == user_3)
		{
			user_color = user_3_color;
		}
	}

	hexagon.lastChild.setAttribute('src', src);
	hexagon.lastChild.style.background = user_color;
}

function clear_army_type(hexagon, type)
{
	hexagon.setAttribute('army_type', type);
	hexagon.lastChild.setAttribute('src', '');
	hexagon.lastChild.style.background = '';
}

function update_attack(from_x, from_y, to_x, to_y, army_id)
{

}

function update_move(from_x, from_y, to_x, to_y, army_id)
{
	var hexagon_from = get_hexagon(from_x, from_y);
	var hexagon_to = get_hexagon(to_x, to_y);
	var army_id_from = '';
	var army_id_to = army_id;

	clear_army_type(hexagon_from, 'none');
	set_army_type(hexagon_to, army_type, army_id);
	update_slot_list_own(hexagon_from, army_id_from);
	update_slot_list_own(hexagon_to, army_id_to);
}

function update_defend(from_x, from_y, to_x, to_y, army_id)
{

}

function update_build(from_x, from_y, to_x, to_y, army_id)
{
	var hexagon_to = get_hexagon(to_x, to_y);
	var army_id_to = army_id;
	var type = getArmyById(army_id_to).type_id;
	if(type == 1)//sword
	{
		type = 'type_A';
	}
	else if(type == 2)//calvery
	{
		type = 'type_B';
	}
	else if(type == 3)//archer
	{
		type = 'type_C';
	}

	set_army_type(hexagon_to, type, army_id);
	update_slot_list_own(hexagon_to, army_id_to)
}

function update_slot_own() //update the slot movement
{
	var result = result_list[result_list.length - 1];
	
	if(result)//not none
	{
		if(result.action_type == 'attack')
		{
			update_attack(result.from_x, result.from_y, result.to_x, result.to_y, army_id);
		}
		else if(result.action_type == 'move')
		{
			update_move(result.from_x, result.from_y, result.to_x, result.to_y, result.army_id);
		}
		else if(result.action_type == 'defend')
		{
			update_defend(result.from_x, result.from_y, result.to_x, result.to_y, army_id);
		}
		else if(result.action_type == 'build')
		{
			update_build(result.from_x, result.from_y, window.current_player.capital_x, window.current_player.capital_y, result.army_id);
		}
	}
}

function update_slot_others()
{

}