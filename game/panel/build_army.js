function build_clicked_handler()
{
    /*
    1.show build list
    2.wait for player's choice
    3.check whether the player can build this kind of army (cost, position)
    4.show the build result
    5.add the result to the result list 
    */
    var audio = document.getElementById("clickButton");
    audio.play();
    if(IsMyTurn()){
    	var buildArmy = document.getElementById('buildArmy');
	//alert(buildArmy);
	buildArmy.style.display= "inline-block";
	buildArmy.style.zIndex= "200";
    }
    else
    {
    	alert("You cannot build a new Army when it's not your turn");
	return ;
    }


    /*buildArmy.innerHTML = """"""*/
}
function build_clicked_Exit()
{
	var audio = document.getElementById("clickButton");
    	audio.play();
	var buildArmy = document.getElementById('buildArmy');
    	buildArmy.style.display= "none";
}

function build_army(armyType)
{
	switch(armyType)
	{
		case 1:
			if(window.current_player.gold < 20 || current_player.wood < 20){
				alert("You do not have enough Gold or Wood to build a sword army");
			}
			else if(window.getSlotByXY(window.current_player.capital_x,window.current_player.capital_y).army_id != ""){
				alert("You can not build army here! Please make sure there is no army in the current slot");
			}
			else{
				window.current_player.gold = window.current_player.gold - 20;
				window.current_player.wood = window.current_player.wood - 20;
				var armyId = (window.army_list.length).toString();
				var newArmy = new Army(armyId,armyType,window.current_player.pid);
				newArmy.army_status = 'ready';
				var audio = document.getElementById("armyBirth");
				audio.play();
				window.army_list.push(newArmy);
				var tmp = new action("build",armyId,null,null,null,null,armyType);
				tmp.get_result();
				window.current_player.show_info();
			}
			
			break;
		case 2:
			if(window.current_player.gold < 25 || current_player.wood < 15){
				alert("You do not have enough Gold or Wood to build a sword army");
			}
			else if(window.getSlotByXY(window.current_player.capital_x,window.current_player.capital_y).army_id != ""){
				alert("You can not build army here! Please make sure there is no army in the current slot");
			}
			else{
				window.current_player.gold = window.current_player.gold - 25;
				window.current_player.wood = window.current_player.wood - 15;
				var armyId = (window.army_list.length).toString();
				var newArmy = new Army(armyId,armyType,window.current_player.pid);
				newArmy.army_status = 'ready';
				var audio = document.getElementById("armyBirth");
				audio.play();
				window.army_list.push(newArmy);
				var tmp = new action("build",armyId,null,null,null,null,armyType);
				tmp.get_result();
				window.current_player.show_info();
			}
			break;
		case 3:
			if(window.current_player.gold < 15 || current_player.wood < 25){
				alert("You do not have enough Gold or Wood to build a sword army");
			}
			else if(window.getSlotByXY(window.current_player.capital_x,window.current_player.capital_y).army_id != ""){
				alert("You can not build army here! Please make sure there is no army in the current slot");
			}
			else{
				window.current_player.gold = window.current_player.gold - 15;
				window.current_player.wood = window.current_player.wood - 25;
				var armyId = (window.army_list.length).toString();
				var newArmy = new Army(armyId,armyType,window.current_player.pid);
				newArmy.army_status = 'ready';
				var audio = document.getElementById("armyBirth");
				audio.play();
				window.army_list.push(newArmy);
				var tmp = new action("build",armyId,null,null,null,null,armyType);
				tmp.get_result();
				window.current_player.show_info();
			}
			break;
		default:
			break;
	}
	
}