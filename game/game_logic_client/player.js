//This javascript file contains Object-oriented defintion of every obejcts in the game

/*
	1. Player
*/

function getActivePlayerId()
{
	for(var count = 0; count < window.player_list.length;count++)
	{
		if(window.player_list[count].pturn == "1")
		{
			return window.player_list[count].pid;
		}
	}
}

function setActivePlayer(pid)
{
	for(var count = 0; count < window.player_list.length;count++)
	{
		if(window.player_list[count].pid == pid)
			window.player_list[count].pturn = "1";
		else
			window.player_list[count].pturn = "0";
	}
}

function getPlayerByID(pid)
{
	//console.log("getPlayerByID: to get player with pid: " + pid);
	for(var count = 0; count < window.player_list.length;count++)
	{
		if(window.player_list[count].pid == pid)
		{
			//console.log("getPlayerByID: " + window.player_list[count]);
			return window.player_list[count];
		}
	}
	console.log("player with pid " + pid + " not found");
	return null;
}
function player(player_id, playername,gold,wood,status,turn)
{
	this.pid = player_id;
	this.pname = playername;
	this.gold = gold;
	this.wood = wood;
	this.capital_x = null;
	this.capital_y = null;
	this.pstatus = status;
	this.pturn = turn;
}

player.prototype.show_info = function()
{

	var username_div = document.getElementById("username");
	var gold_div = document.getElementById("gold");
	var lumber_div = document.getElementById("lumber");

	username_div.innerHTML = "Player: " + this.pname;
	gold_div.innerHTML = "Gold: " + this.gold;
	lumber_div.innerHTML = "Lumber: " + this.wood;
}
