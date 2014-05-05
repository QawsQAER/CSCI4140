//20 x 20 map//
var slot_num = 484;
var line_num = 22; //the top/left/bottom/right are useless

function update_small_map() //update according to the global variable slot_list
{
	var slot = document.getElementsByClassName('slot');
	
	for(var i = 0; i < slot.length; i++)
	{
		if(parseInt(slot_list[i].owner) == parseInt(user_1))
		{
			slot[i].style.backgroundColor = user_1_color;
		}
		else if(parseInt(slot_list[i].owner) == parseInt(user_2))
		{
			slot[i].style.backgroundColor = user_2_color;
		}
		else if(parseInt(slot_list[i].owner) == parseInt(user_3))
		{
			slot[i].style.backgroundColor = user_3_color;
		}
	}
}

function small_map_dot(e)
{
	var pos_x = e.target.getAttribute('x');
	var pos_y = e.target.getAttribute('y');

	var slot = document.getElementsByClassName('slot');
	for(var i = 0; i < slot_num; i++)
	{
		if(slot[i].getAttribute('x') == pos_x && slot[i].getAttribute('y') == pos_y)
		{
			slot[i].style.backgroundColor = 'red';
		}
	}
}

function f_switch(j, type_id)
{
	var slot = document.getElementsByClassName('slot');
	var i = parseInt(j);

	switch(parseInt(type_id))
	{
		case 0: //unused
		break;

		case 1: //normal slot
		slot[i].style.backgroundColor = 'gray';
		break;

		case 2: //gold slot
		slot[i].style.backgroundColor = 'rgb(254,215,40)';
		break;

		case 3: //wood slot
		slot[i].style.backgroundColor = 'rgb(125,103,7)';
		break;

		case 4: //capital
		slot[i].style.border = '1px solid white';
		slot[i].width = '11px';
		slot[i].height = '11px';
		if(parseInt(slot_list[i].owner) == parseInt(user_1))
		{
			slot[i].style.backgroundColor = user_1_color;
		}
		else if(parseInt(slot_list[i].owner) == parseInt(user_2))
		{
			slot[i].style.backgroundColor = user_2_color;
		}
		else if(parseInt(slot_list[i].owner) == parseInt(user_3))
		{
			slot[i].style.backgroundColor = user_3_color;
		}
		break;

		default:
		break;
	}
}

function clean_small_map_dot()
{
	var slot = document.getElementsByClassName('slot');
	for(var i = 0; i < slot_num; i++)
	{
		if(slot[i].style.backgroundColor == 'red')
		{
			f_switch(i, slot_list[i].type_id);
		}
	}
}

function init_small_map()
{
	var slot = Array();
	for(var i = 0; i < slot_num; i++)
	{
		slot[i] = document.createElement('div');
		slot[i].setAttribute('class', 'slot');
		var x = i % line_num;
		var y = parseInt(i / line_num);
		slot[i].setAttribute('x', x);
		slot[i].setAttribute('y', y);

		if(x == 0 || x == line_num - 1 || y == 0 || y == line_num - 1) //row start slot
		{
			slot[i].style.opacity = '0.0';
		}

		f_switch(i, slot_list[i].type_id);
	}

	var small_map = document.getElementById('small_map');
	small_map.addEventListener('contextmenu', no_contextmenu, false);

	for(var i = 0; i < line_num; i++)
	{
		for(var j = 0; j < line_num; j++)
		{
			small_map.appendChild(slot[line_num * i + j]);
		}
	}
}
