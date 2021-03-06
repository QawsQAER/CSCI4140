var current_usr_id = $.cookie("CURRENT_USER");
var current_usrname = $.cookie("CURRENT_USERNAME");


//in_room is a flag to denote whether the current user is already inside a game/room
var in_room = 0;

if(current_usr_id)
	console.log("CURRENT_USER is " + current_usr_id);
setInterval(room_get_list,3000);

function room_get_list()
{
	//This function is to send request to room/get_room.php
	//Then get the existing room data from the server and dynamically render the page
	var xhr = new XMLHttpRequest();
	xhr.open("POST","room/get_room.php",true);
	xhr.setRequestHeader("USERID",current_usr_id);
;	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4)
		{
			if(xhr.status != 200)
			{
				console.log("Error code = " + new String(xhr.status));
				return false;
			}
			var room_info = xhr.responseText;
			//console.log(room_info);
			var obj = JSON.parse(room_info);
			var status = obj.status;
			var roomDiv = obj.roomDiv;
			var userDiv = obj.userDiv;
			//console.log(obj);
			if(status == "failed")
			{
				document.location.href = '../login/login.php';
				return false;
			}
			var browser_games = document.getElementsByClassName("roomBtn");
			var server_games = obj.game;
			//console.log(JSON.parse(server_games));
			//console.log(isUpade(browser_games,server_games));
			if(isUpade(browser_games,server_games))
			{
				document.getElementById("roomNum").innerHTML = roomDiv;
				document.getElementById("userInfo").innerHTML = userDiv;
				//console.log("Updating the roomNum div");
				return false;
			}
			if(obj.started == 'yes')
			{
				document.getElementById("gameStart").play();
				alert('Your game has started!');
				document.location.href = '../game/game.html';
				return false;
			}
		}
	};
	return false;
}

function isUpade(browser_games, server_games)
{
	//console.log(browser_games.length);
	//console.log(server_games.length);
	if(browser_games.length != server_games.length)
	{
		return true;
	}
	else
	{
		for (var i = 0; i < browser_games.length; i++) 
		{
			//console.log(browser_games[i].id);
			//console.log(server_games[i].Game_id);
			//console.log(JSON.parse(server_games[i]).Game_id);
			var server_game = JSON.parse(server_games[i]);
			if(browser_games[i].id != server_game.Game_id)
			{
				return true;
			}
			else
			{
				//console.log(browser_games[i]);
				var browser = browser_games[i].childNodes[1];
				var server = server_game;
				//console.log(browser);
				//console.log(browser_games[i].childNodes[0]);
				//console.log(browser_games[i].childNodes[1]);
				//console.log(browser_games[i].childNodes[2]);
				//console.log(server);
				//console.log(browser.getAttribute('p1'));
				//console.log(server.P1);
				if(browser.getAttribute('p1') != server.P1 && !(browser.getAttribute('p1') == "" && server.P1 == null))
				{
					return true;
				}
				//console.log(browser.getAttribute('p2'));
				//console.log(server.P2);
				if(browser.getAttribute('p2') != server.P2 && !(browser.getAttribute('p2') == "" && server.P2 == null))
				{
					return true;
				}
				//console.log(browser.getAttribute('p3') == "");
				//console.log(server.P3 == null);
				if(browser.getAttribute('p3') != server.P3 && !(browser.getAttribute('p3') == "" && server.P3 == null))
				{
					return true;
				}
			}
		}
	}
	return false;
}
function room_onclick(e)
{	
	//Pop out a confirmation window 
	e = e || window.event;
	var target = e.target;
	//console.log(target);
	var audio = document.getElementById("clickButton");
            audio.play();
	while(target.className != "roomBtn")
	{
		target = target.parentNode;
	}
	var isJoin = confirm("Do you want to join this room?");
	if(isJoin == true)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("POST","room/join_room.php",true);
		xhr.setRequestHeader("USERID",current_usr_id);
		//console.log(target);
		xhr.setRequestHeader("ROOMID",target.id);
		xhr.send();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4)
			{
				if(xhr.status != 200)
				{
					console.log("Error code = " + new String(xhr.status));
					return false;
				}
				var response = xhr.responseText;
				var obj = JSON.parse(response);
				console.log(obj);
				var status = obj.status;
				if(status == 'success')
				{
					if(obj.started == 'yes')
					{
						alert("Your game is on!");
					}
				}
				else
				{
					alert(obj.error);
				}
			}
		};
		return false;
	}
	else
	{
		return false;
	}
}

function room_create()
{
	var audio = document.getElementById("clickButton");
            audio.play();
	var xhr = new XMLHttpRequest();
	//this is a synchornous request
	xhr.open("POST","room/create_room.php",false);
	xhr.setRequestHeader("USERID",current_usr_id);
	xhr.send();
	console.log(xhr.responseText);
	response = JSON.parse(xhr.responseText);
	if(response.status == "success")
	{
		alert("You've created a room");
		in_room = 1;
		$("#newRoom").hide();
		render_room_information(response)
	}
	else
	{
		alert(response.error);
	}
}

function quit_room()
{
	//This function will let the user quit the room he entered
	var audio = document.getElementById("clickButton");
            audio.play();
	console.log('quit room clicked');
	var xhr = new XMLHttpRequest();
	//this is a synchornous request
	xhr.open("POST","room/quit_room.php",true);
	xhr.setRequestHeader("USERID",current_usr_id);
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4)
		{
			if(xhr.status != 200)
			{
				console.log("Error code = " + new String(xhr.status));
				return false;
			}
			console.log(xhr.responseText);
			var obj = JSON.parse(xhr.responseText);
			if(obj.status == 'success')
			{
				$("#newRoom").show();
			}
			//var status = obj.status;
			//var roomDiv = obj.roomDiv;
			//var userDiv = obj.userDiv;
			
		}
	};
}
function render_user_information()
{
	//This function will show the user information on the right hand side
}

function render_room_information(response)
{
	//This function will show the room information on the right hand side

}
function logout()
{
	var audio = document.getElementById("clickQuit");
            audio.play();
            var as = confirm("Are you sure to log out?");
            if(as == true){
            	var xhr = new XMLHttpRequest();
		//this is a synchornous request
		xhr.open("POST","login/logout.php",false);
		xhr.send();
		console.log(xhr.responseText);
		response = JSON.parse(xhr.responseText);
		if(response.status == "success")
		{
			console.log("Logout Success, going to redirect");
			window.location = "login/login.php";
		}
            }
}

function start_game()
{
	
}