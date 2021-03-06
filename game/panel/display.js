/*
		<div id="new_line"><br/></div>
        <div id="hexagon_begin_odd"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon_last"></div>

        <div id="new_line"><br/></div>   
        <div id="hexagon_begin_even"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon"></div>
        <div id="hexagon_last"></div>
*/

/***********************************/
/**********event handelers**********/
/***********************************/
function mousedown_1(e) //handel the right click on slot
{
	e.preventDefault();
	e.stopPropagation();

	var target = e.target;
	if(target.getAttribute('class') != 'hexagon')
	{
		target = e.target.parentNode;
	}

	switch(e.which)
	{
		case 1:
			console.log('left mousedown 1');
			clean_small_map_dot(); //in small_map.js
			small_map_dot(e); //in small_map.js
			display_hexagon_info(e);
			break;
		case 2:
			console.log('middle mousedown 1');
			break;
		case 3:
			console.log('right mousedown 1');

			if(target.getAttribute('usage') == 'no') //not for use
			{
				return false;
			}

			//check whether this slot belongs to the user
			var right_click_able = check_slot_right_click_able(e); //in /game/game_logic_client/check_functions.js
			if(!right_click_able)
			{
				break;
			}

			//add eventListener
			target.addEventListener('mouseup', mouseup_1, false);
			latest_slot = target;
			console.log(latest_slot.getAttribute('x'), latest_slot.getAttribute('y'));
			remove_manual();
			break;
		default:
			console.log('no such mousedown id 1');
			break;
	}
}

function mousedown_2(e) //handel the left click on selecting army type
{
	e.stopPropagation();
	e.preventDefault();

	var target = e.target;
	if(target.getAttribute('class') != 'manual')
	{
		target = e.target.parentNode;
	}

	switch(e.which)
	{
		case 1:
			console.log('left mousedown 2');
			target.addEventListener('mouseup', mouseup_2, false);
			break;
		case 2:
			console.log('middle mousedown 2');
			break;
		case 3:
			console.log('right mousedown 2');
			break;
		default:
			console.log('no such mousedown id 2');
			break;
	}
}

function mousedown_3(e) //handel the left click on selecting function (attack/defance/move)
{
	e.stopPropagation();
	e.preventDefault();

	var target = e.target;
	if(target.getAttribute('class') != 'manual')
	{
		target = e.target.parentNode;
	}

	switch(e.which)
	{
		case 1:
			console.log('left mousedown 3');
			target.addEventListener('mouseup', mouseup_3, false);
			break;
		case 2:
			console.log('middle mousedown 3');
			break;
		case 3:
			console.log('right mousedown 3');
			break;
		default:
			console.log('no such mousedown id 3');
			break;
	}
}

function mousemove_1(e) //useless
{
	e.stopPropagation();
	e.preventDefault();

	switch(e.which)
	{
		case 1:
			console.log('left mousemove 1');
			break;
		case 2:
			console.log('middle mousemove 1');
			break;
		case 3:
			console.log('right mousemove 1');
			break;
		default:
			console.log('no such mousemove id 1');
			break;
	}
}

function mouseup_1(e) //w.r.t function mouse_down_1(e)
{
	e.stopPropagation();
	e.preventDefault();

	switch(e.which)
	{
		case 1:
			console.log('left mouseup 1');
			break;
		case 2:
			console.log('middle mouseup 1');
			break;
		case 3:
			console.log('right mouseup 1');
			display_army_type(e);
			break;
		default:
			console.log('no such mouseup id 1');
			break;
	}
}

function mouseup_2(e)  //w.r.t function mouse_down_2(e)
{
	e.stopPropagation();
	e.preventDefault();

	switch(e.which)
	{
		case 1:
			console.log('left mouseup 2');
			select_army_type(e);
			break;
		case 2:
			console.log('middle mouseup 2');
			break;
		case 3:
			console.log('right mouseup 2');
			break;
		default:
			console.log('no such mouseup id 2');
			break;
	}
}

function mouseup_3(e)  //w.r.t function mouse_down_3(e)
{
	e.stopPropagation();
	e.preventDefault();

	switch(e.which)
	{
		case 1:
			console.log('left mouseup 3');
			select_manual(e);
			break;
		case 2:
			console.log('middle mouseup 3');
			break;
		case 3:
			console.log('right mouseup 3');
			break;
		default:
			console.log('no such mouseup id 3');
			break;
	}
}

function end_slidein(e)  //handel the animation
{
	var target = e.target;
	if(target.getAttribute('class') != 'manual' && target.getAttribute('class') != 'hexagon')
	{
		target = e.target.parentNode;
	}

	target.removeEventListener('mouseover', end_slidein, false);
	target.setAttribute('type', 'none');
}

function no_contextmenu(e) //no default right click when event on the map
{
	e.preventDefault();
	e.stopPropagation();
}

function window_resize(e) //handel window resize
{
	resize();
}
/***********************************/

/***********************************/
/*********display functions*********/
/***********************************/
function set_function_attribute_1(hexagon, function_type)
{
	//must add the attribute 'function' befor change the class name, other with hexagon[i] will be the next hexagon
	var army_name;
	if(function_type == 'type_A')
	{
		name = 'Sword';
	}
	else if(function_type == 'type_B')
	{
		name = 'Cavalry';
	}
	else if(function_type == 'type_C')
	{
		name = 'Archer';
	}
	else if(function_type == 'cancel')
	{
		name = 'Cancel';
	}
	hexagon.setAttribute('function', function_type);
	hexagon.firstChild.innerHTML = name;
	hexagon.lastChild.style.display = 'none';
	hexagon.setAttribute('type', 'slidein');
	hexagon.style.opacity = '1.0';
	hexagon.removeEventListener('mousedown', mousedown_1, false);
	hexagon.removeEventListener('mouseup', mouseup_1, false);
	hexagon.addEventListener('mousedown', mousedown_2, false);
	hexagon.addEventListener('mouseover', end_slidein, false);
	hexagon.setAttribute('class', 'manual');
}

function set_function_attribute_2(hexagon, function_type)
{
	var army_name;
	if(function_type == 'attack')
	{
		name = 'Attack';
	}
	else if(function_type == 'move')
	{
		name = 'Move';
	}
	else if(function_type == 'defence')
	{
		name = 'Defend';
	}
	else if(function_type == 'back')
	{
		name = 'Back';
	}
	//must add the attribute 'function' befor change the class name, other with hexagon[i] will be the next hexagon
	hexagon.setAttribute('function', function_type);
	hexagon.firstChild.innerHTML = name;
	hexagon.lastChild.style.display = 'none';
	hexagon.setAttribute('type', 'slidein');
	hexagon.style.opacity = '1.0';
	hexagon.removeEventListener('mousedown', mousedown_1, false);
	hexagon.removeEventListener('mouseup', mouseup_1, false);
	hexagon.addEventListener('mousedown', mousedown_3, false);
	hexagon.addEventListener('mouseover', end_slidein, false);
	hexagon.setAttribute('class', 'manual');
}

function display_army_type(e)
{
	var target = e.target;
	if(target.getAttribute('class') != 'hexagon')
	{
		target = e.target.parentNode;
	}

	var pos_x = target.getAttribute('x');
	var pos_y = target.getAttribute('y');

	var slot_army_type = target.getAttribute('army_type');

	var hexagon = document.getElementsByClassName('hexagon');

	if(pos_y % 2 == 0)//odd
	{
		for(var i = 0; i < hexagon.length; i++)
		{
			if(hexagon[i].getAttribute('x') == parseInt(pos_x) - 1 && hexagon[i].getAttribute('y') == parseInt(pos_y) - 1 && slot_army_type == 'type_A')
			{
				//must add the attribute 'function' befor change the class name, other with hexagon[i] will be the next hexagon
				set_function_attribute_1(hexagon[i], 'type_A');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == parseInt(pos_x) - 1 && hexagon[i].getAttribute('y') == pos_y && slot_army_type == 'type_B')
			{
				set_function_attribute_1(hexagon[i], 'type_B');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == parseInt(pos_x) - 1 && hexagon[i].getAttribute('y') == parseInt(pos_y) + 1  && slot_army_type == 'type_C')
			{
				set_function_attribute_1(hexagon[i], 'type_C');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == pos_y)
			{
				set_function_attribute_1(hexagon[i], 'cancel');
				i--;
			}
		}
	}
	else //even
	{
		for(var i = 0; i < hexagon.length; i++)
		{
			if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == parseInt(pos_y) - 1 && slot_army_type == 'type_A')
			{
				set_function_attribute_1(hexagon[i], 'type_A');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == parseInt(pos_x) - 1 && hexagon[i].getAttribute('y') == pos_y && slot_army_type == 'type_B')
			{
				set_function_attribute_1(hexagon[i], 'type_B');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == parseInt(pos_y) + 1 && slot_army_type == 'type_C')
			{
				set_function_attribute_1(hexagon[i], 'type_C');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == pos_y)
			{
				set_function_attribute_1(hexagon[i], 'cancel');
				i--;
			}
		}
	}

	//TODO add event listener
	console.log(pos_x, pos_y);
}

function select_army_type(e)
{
	var target = e.target;
	if(target.getAttribute('class') != 'manual')
	{
		target = e.target.parentNode;
	}

	var x = target.getAttribute('x');
	var y = target.getAttribute('y');

	target.removeEventListener('mousedown', mousedown_2, false);
	target.removeEventListener('mouseup', mouseup_2, false);

	var target_function = target.getAttribute('function');

	if(target_function == 'type_A')
	{
		//alert('A');
		remove_manual();

		if(parseInt(target.getAttribute('y')) % 2 == 1) //odd
		{
			x = parseInt(x) + 1;
		}
		y = parseInt(y) + 1;
		
		display_manual(x, y, 'type_A');
	}
	else if(target_function == 'type_B')
	{
		//alert('B');
		remove_manual();

		x = parseInt(x) + 1;

		display_manual(x, y, 'type_B');
	}
	else if(target_function == 'type_C')
	{
		//alert('C');
		remove_manual();
		if(parseInt(target.getAttribute('y')) % 2 == 1) //odd
		{
			x = parseInt(x) + 1;
		}
		y = parseInt(y) - 1;

		display_manual(x, y, 'type_C');
	}
	else if(target_function == 'cancel')
	{
		//alert('Cancel');
		remove_manual();
	}
	else
	{
		remove_manual();
		console.log('error in function game/panel/display.js->select_army_type(e)');
	}
}

function display_manual(x, y, type)
{
	//var pos_x = e.target.getAttribute('x');
	//var pos_y = e.target.getAttribute('y');

	var pos_x = x;
	var pos_y = y;

	var hexagon = document.getElementsByClassName('hexagon');

	if(pos_y % 2 == 0)//odd
	{
		for(var i = 0; i < hexagon.length; i++)
		{
			if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == parseInt(pos_y) - 1)
			{
				set_function_attribute_2(hexagon[i], 'attack');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == parseInt(pos_x) + 1 && hexagon[i].getAttribute('y') == pos_y)
			{
				set_function_attribute_2(hexagon[i], 'move');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == parseInt(pos_y) + 1)
			{
				set_function_attribute_2(hexagon[i], 'defence');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == pos_y)
			{
				set_function_attribute_2(hexagon[i], 'back');
				i--;
			}
		}
	}
	else //even
	{
		for(var i = 0; i < hexagon.length; i++)
		{
			if(hexagon[i].getAttribute('x') == parseInt(pos_x) + 1 && hexagon[i].getAttribute('y') == parseInt(pos_y) - 1)
			{
				set_function_attribute_2(hexagon[i], 'attack');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == parseInt(pos_x) + 1 && hexagon[i].getAttribute('y') == pos_y)
			{
				set_function_attribute_2(hexagon[i], 'move');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == parseInt(pos_x) + 1 && hexagon[i].getAttribute('y') == parseInt(pos_y) + 1)
			{
				set_function_attribute_2(hexagon[i], 'defence');
				i--;
			}
			else if(hexagon[i].getAttribute('x') == pos_x && hexagon[i].getAttribute('y') == pos_y)
			{
				set_function_attribute_2(hexagon[i], 'back');
				i--;
			}
		}
	}

	army_type = type; 
	console.log(pos_x, pos_y, type);
}

function select_manual(e)
{
	var target = e.target;
	if(target.getAttribute('class') != 'manual')
	{
		target = e.target.parentNode;
	}

	target.removeEventListener('mousedown', mousedown_3, false);
	target.removeEventListener('mouseup', mouseup_3, false);

	var target_function = target.getAttribute('function');

	if(target_function == 'attack')
	{
		//alert(army_type + ': Attack');
		remove_manual();
		attack_clicked_handler();
	}
	else if(target_function == 'move')
	{
		//alert(army_type + ': Move');
		remove_manual();
		move_clicked_handler();
	}
	else if(target_function == 'defence')
	{
		//alert(army_type + ': Defence');
		remove_manual();
		defend_clicked_handler();
	}
	else if(target_function == 'back')
	{
		remove_manual();
		display_army_type(e);
	}
	else
	{
		remove_manual();
		console.log('error in function game/panel/display.js->select_manual(e)');
	}
}

function remove_manual()
{
	var manual = document.getElementsByClassName('manual');
	while(manual[0])
	{
		if(manual[0].getAttribute('slot_type') == 'unused_slot')
		{
			manual[0].style.opacity = '0.0';
		}
		manual[0].setAttribute('function', 'none');
		manual[0].firstChild.innerHTML = '';
		manual[0].lastChild.style.display = 'inline';
		manual[0].removeEventListener('mousedown', mousedown_1, false);
		manual[0].removeEventListener('mousedown', mousedown_2, false);
		manual[0].removeEventListener('mousedown', mousedown_3, false);
		manual[0].removeEventListener('mouseup', mouseup_1, false);
		manual[0].removeEventListener('mouseup', mouseup_2, false);
		manual[0].removeEventListener('mouseup', mouseup_3, false);
		if(manual[0].getAttribute('slot_type') != 'unused_slot')
		{
			manual[0].addEventListener('mousedown', mousedown_1, false);
		}
		manual[0].setAttribute('class', 'hexagon');
	}
}

function display_hexagon_info(e)
{
	var target = e.target;
	if(target.getAttribute('class') != 'hexagon' && target.getAttribute('class') != 'manual')
	{
		target = e.target.parentNode;
	}

	var pos_x = target.getAttribute('x');
	var pos_y = target.getAttribute('y');
	var slot_type = target.getAttribute('slot_type');
	var army_type = target.getAttribute('army_type');

	//var player = getPlayerByID(parseInt(slot_list[parseInt(y) * line_num + parseInt(x)].owner)); //slot_list and line_num are global variable
	//var owner = player.pname;

	var hexagon_info = document.getElementById('hexagon_info');
	hexagon_info.innerHTML = '';
	var new_p_1 = document.createElement('p');
	var new_p_2 = document.createElement('p');
	var new_img_slot_type = document.createElement('img');
	new_img_slot_type.setAttribute('id', 'new_img_slot_type');
	var new_img_army_type = document.createElement('img');

	//new_p_1.innerHTML = 'Owner: ' + owner + '<br/>';
	new_p_1.innerHTML = 'x: ' + pos_x + '; y: ' + pos_y + '<br/>';
	if(slot_type == 'normal_slot')
	{
		new_p_1.innerHTML = new_p_1.innerHTML + 'Slot Type: Normal Slot <br/>';
		new_img_slot_type.setAttribute('src', '../../images/normal.png');
	}
	else if(slot_type == 'gold_slot')
	{
		new_p_1.innerHTML = new_p_1.innerHTML + 'Slot Type: Gold Slot <br/>';
		new_img_slot_type.setAttribute('src', '../../images/gold.png');
	}
	else if(slot_type == 'wood_slot')
	{
		new_p_1.innerHTML = new_p_1.innerHTML + 'Slot Type: Lumber Slot <br/>';
		new_img_slot_type.setAttribute('src', '../../images/lumber.png');
	}
	else if(slot_type == 'capital_slot')
	{
		new_p_1.innerHTML = new_p_1.innerHTML + 'Slot Type: Capital Slot <br/>';
		new_img_slot_type.setAttribute('src', '../../images/capital.png');
	}

	hexagon_info.appendChild(new_p_1);
	hexagon_info.appendChild(new_img_slot_type);

	if(army_type == 'none')
	{
	}
	else
	{
		new_img_army_type.setAttribute('id', 'new_img_army_type');
		var army_id = getSlotByXY(pos_x, pos_y).army_id;
		var max_hp = getArmyById(army_id).max_hp;
		var hp = getArmyById(army_id).hp;
		var attack = getArmyById(army_id).attack;
		var owner = getArmyById(army_id).owner;

		if(army_type == 'type_A')
		{
			new_p_2.innerHTML = new_p_2.innerHTML + 'Army Type: Sword<br/>';
			new_img_army_type.setAttribute('src', '../../images/sword.png');
		}
		else if(army_type == 'type_B')
		{
			new_p_2.innerHTML = new_p_2.innerHTML + 'Army Type: Cavalry<br/>';
			new_img_army_type.setAttribute('src', '../../images/cavalry.png');
		}
		else if (army_type == 'type_C')
		{
			new_p_2.innerHTML = new_p_2.innerHTML + 'Army Type: Archer<br/>';
			new_img_army_type.setAttribute('src', '../../images/archer.png');
		}
		new_p_2.innerHTML = new_p_2.innerHTML + 'Attack : ' + attack + '<br>';
		if(window.current_player.pid == owner){
			new_p_2.innerHTML = new_p_2.innerHTML + 'HP : ' + hp + '/' + max_hp + '<br/>';
		}
		else{
			new_p_2.innerHTML = new_p_2.innerHTML + 'HP : ?/' + max_hp + '<br/>';
		}
	}

	hexagon_info.appendChild(new_p_2);
	hexagon_info.appendChild(new_img_army_type);
}
/***********************************/

function resize()
{
	document.getElementById('display').style.width = parseInt(window.innerWidth) - 20 + 'px';
	document.getElementById('display').style.height = parseInt(window.innerHeight) - 20 + 'px';
	document.getElementById('help').style.left = (parseInt(window.innerWidth) - 300) / 2 + 'px';
	document.getElementById('help').style.top = (parseInt(window.innerHeight) - 200) / 2 + 'px';
	document.getElementById('result_list_div').style.height = (parseInt(window.innerHeight) - 20) + 'px';
}

var user_1_color = 'purple';
var user_2_color = 'green';
var user_3_color = 'blue';
function addBoxes(list)
{
	//20 x 20 map//
	var hexagon_num = 484;
	var new_line_num = 22; //the top/left/bottom/right are useless

	var new_line = Array();
	for(var i = 0; i < new_line_num; i++)
	{
		new_line[i] = document.createElement('div');
		new_line[i].setAttribute('id', 'new_line');
		var br = document.createElement('br');
		new_line[i].appendChild(br);
	}

	var user_id = getCookie('CURRENT_USER'); //in game/game_logic_client/check_functions.js

	var hexagon = Array();
	for(var i = 0; i < hexagon_num; i++)
	{
		hexagon[i] = document.createElement('div');
		hexagon[i].setAttribute('class', 'hexagon');
		hexagon[i].setAttribute('function', 'none');
		hexagon[i].setAttribute('type', 'none');
		hexagon[i].setAttribute('army_type', 'none');
		hexagon[i].setAttribute('user', 'none');
		var x = i % new_line_num;
		var y = parseInt(i / new_line_num);
		hexagon[i].setAttribute('x', x);
		hexagon[i].setAttribute('y', y);

		var img = document.createElement('img'); //store the img
		img.setAttribute('class', 'army');
		img.setAttribute('user', 'none');
		img.setAttribute('animation', 'off');
		var p = document.createElement('p');
		p.setAttribute('class', 'description');

		if(x == 0) //start hexagon
		{
			if(y % 2 == 0) //odd begin hexagon
			{
				hexagon[i].setAttribute('id', 'hexagon_begin_odd');
			}
			else //even begin hexagon
			{
				hexagon[i].setAttribute('id', 'hexagon_begin_even');
			}
		}
		else if (x == new_line_num - 1) //end hexagon of one row
		{
			hexagon[i].setAttribute('id', 'hexagon_last');
		}
		else //normal hexagon
		{
			hexagon[i].setAttribute('id', 'hexagon_normal');
		}

		hexagon[i].addEventListener('mousedown', mousedown_1, false);

		if(list[i].owner == user_1)
		{
			hexagon[i].setAttribute('user', 'user_1');
			if(list[i].type_id != 1)
			{
				hexagon[i].style.background = user_1_color;
			}
		}
		else if(list[i].owner == user_2)
		{
			hexagon[i].setAttribute('user', 'user_2');
			if(list[i].type_id != 1)
			{
				hexagon[i].style.background = user_2_color;
			}	
		}
		else if(list[i].owner == user_3)
		{
			hexagon[i].setAttribute('user', 'user_3');
			if(list[i].type_id != 1)
			{
				hexagon[i].style.background = user_3_color;
			}
		}

		switch(parseInt(list[i].type_id))
		{
			case 0: //unused
			hexagon[i].setAttribute('slot_type', 'unused_slot');
			hexagon[i].removeEventListener('mousedown', mousedown_1, false);
			break;

			case 1: //normal slot
			hexagon[i].setAttribute('slot_type', 'normal_slot');
			break;

			case 2: //gold slot
			hexagon[i].setAttribute('slot_type', 'gold_slot');
			hexagon[i].setAttribute('user', 'user');
			break;

			case 3: //wood slot
			hexagon[i].setAttribute('slot_type', 'wood_slot');
			hexagon[i].setAttribute('user', 'user');
			break;

			case 4: //capital
			hexagon[i].setAttribute('slot_type', 'capital_slot');
			hexagon[i].setAttribute('user', 'user');
			break;

			default:
			break;
		}

		if(list[i].army_id)
		{
			if(IsMyTurn() && getArmyById(parseInt(list[i].army_id)).army_status == 'ready' && getArmyById(parseInt(list[i].army_id)).owner == current_player.pid)
			{
				img.setAttribute('animation', 'on');
			}

			if(getArmyById(list[i].army_id).owner == user_1)
			{
				img.setAttribute('user', 'user_1');
			}
			else if(getArmyById(list[i].army_id).owner == user_2)
			{
				img.setAttribute('user', 'user_2');
			}
			else if(getArmyById(list[i].army_id).owner == user_3)
			{
				img.setAttribute('user', 'user_3');
			}

			switch(parseInt(army_list[parseInt(list[i].army_id)].type_id))
			{
				case 1: //
				hexagon[i].setAttribute('army_type', 'type_A');
				img.setAttribute('src', '../../images/sword.png');
				break;

				case 2: //
				hexagon[i].setAttribute('army_type', 'type_B');
				img.setAttribute('src', '../../images/cavalry.png');
				break;

				case 3: //
				hexagon[i].setAttribute('army_type', 'type_C');
				img.setAttribute('src', '../../images/archer.png');
				break;

				default:
				hexagon[i].setAttribute('army_type', 'none');
				break;
			}
		}

		hexagon[i].appendChild(p); //frst DOM child

		if(list[i].owner == user_id && list[i].type_id == 4)//capital slot
		{
			var anchor = document.createElement('div');
			anchor.setAttribute('id', 'anchor');
			hexagon[i].appendChild(anchor); //second DOM child
		}

		hexagon[i].appendChild(img); // last DOM child
	}

	if(user_id == user_1)
	{
		document.getElementById('username').style.background = user_1_color;
	}
	else if(user_id == user_2)
	{
		document.getElementById('username').style.background = user_2_color;
	}
	else if(user_id == user_3)
	{
		document.getElementById('username').style.background = user_3_color;
	}

	var box = document.getElementById('box');
	box.addEventListener('contextmenu', no_contextmenu, false);

	for(var i = 0; i < new_line_num; i++)
	{
		box.appendChild(new_line[i]);

		for(var j = 0; j < new_line_num; j++)
		{
			box.appendChild(hexagon[new_line_num * i + j]);
		}
	}
}

function go_to_home()
{
	var audio = document.getElementById("goHome");
	audio.play();
	document.getElementById('anchor').scrollIntoView();
}

var display_init_done = 0;
function display_init(list)
{
	document.getElementById('info').style.display = 'none';
	document.getElementById('result_list_div').style.display = 'none';
	document.getElementById('help').style.display = 'block';
	user_1 = player_list[0].pid;
	user_2 = player_list[1].pid;
	user_3 = player_list[2].pid;
	init_help(); //in key_handler.js
	addBoxes(list);
	resize();
	window.addEventListener('resize', window_resize, false);
	window.addEventListener('keydown', key_down, false);
	display_init_done = 1;
}
