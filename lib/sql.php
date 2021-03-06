<?php

//--------------------------------SQL STATEMENT TO INITILIZE THE SYSTEM ------------------------------//
//--------------------------------SQL STATEMENT TO INITILIZE THE SYSTEM ------------------------------//
//--------------------------------SQL STATEMENT TO INITILIZE THE SYSTEM ------------------------------//
//--------------------------------SQL STATEMENT TO INITILIZE THE SYSTEM ------------------------------//
	$SQL_DROP_User = "DROP TABLE User";
	$SQL_DROP_Cookie = "DROP TABLE Cookie";
	$SQL_DROP_Game = "DROP TABLE Game";
	
	$SQL_CREATE_User = <<<SQL_STATEMENT
	CREATE TABLE User
	(
		user_id INT PRIMARY KEY,
		username CHAR(32),
		password CHAR(32)
	)
SQL_STATEMENT;

	$SQL_CREATE_Cookie = <<<SQL_STATEMENT
	CREATE TABLE Cookie
	(
		cookie CHAR(32) PRIMARY KEY,
		user_id INT,
		FOREIGN KEY (user_id) REFERENCES User(user_id)
	)
SQL_STATEMENT;

	$SQL_CREATE_Game = <<<SQL_STATEMENT
	CREATE TABLE Game
	(game_id INT PRIMARY KEY,
	P1 INT, P2 INT, p3 INT,
	game_started INT,
	FOREIGN KEY(P1) REFERENCES User(user_id),
	FOREIGN KEY(P2) REFERENCES User(user_id),
	FOREIGN KEY(P3) REFERENCES User(user_id))
SQL_STATEMENT;

	$SQL_CREATE_ARMYTYPE = <<<SQL_STATEMENT
	CREATE TABLE Armytype
	(
		type_id INT PRIMARY KEY,
		name CHAR(32),
		MAX_HP INT,
		MAX_AP INT,
		ATTACK INT
	)
SQL_STATEMENT;

	$SQL_CREATE_SLOTTYPE = <<<SQL_STATEMENT
	CREATE TABLE Slottype
	(
		type_id INT PRIMARY KEY,
		gold_production INT,
		wood_production INT
	)
SQL_STATEMENT;

//--------------AUTO GENERATION OF SQL STATEMENT OF INITIZLIZATION OF A GAME---------------//
//--------------AUTO GENERATION OF SQL STATEMENT OF INITIZLIZATION OF A GAME---------------//
//--------------AUTO GENERATION OF SQL STATEMENT OF INITIZLIZATION OF A GAME---------------//
//--------------AUTO GENERATION OF SQL STATEMENT OF INITIZLIZATION OF A GAME---------------//
	function sql_create_playerlist($game_id)
	{
		$SQL_CREATE_PLAYERLIST = <<<SQL_STATEMENT
		CREATE TABLE game_{$game_id}_playerlist
		(
			player_id INT PRIMARY KEY,
			player_name CHAR(32),
			player_gold INT,
			player_wood INT,
			player_status INT,
			player_turn INT,
			FOREIGN KEY(player_id) REFERENCES User(user_id)
		)
SQL_STATEMENT;
		return $SQL_CREATE_PLAYERLIST;
	}

	function sql_create_armylist($game_id)
	{
		$SQL_CREATE_ARMYLIST = <<<SQL_STATEMENT
		CREATE TABLE game_{$game_id}_armylist
		(
			army_id INT PRIMARY KEY,
			army_type INT,
			owner_id INT,
			army_status char(6),
			army_hp INT,
			FOREIGN KEY(owner_id) REFERENCES game_{$game_id}_playerlist(player_id)
		)
SQL_STATEMENT;
		return $SQL_CREATE_ARMYLIST;
	}


	function sql_create_slotlist($game_id)
	{
		$SQL_CREATE_SLOTLIST = <<<SQL_STATEMENT
		CREATE TABLE game_{$game_id}_slotlist
		(
			slot_row INT,
			slot_col INT,
			slot_owner INT,
			slot_type INT,
			slot_army INT,
			PRIMARY KEY(slot_row,slot_col),
			FOREIGN KEY(slot_owner) REFERENCES game_{$game_id}_playerlist(player_id),
			FOREIGN KEY(slot_army) REFERENCES game_{$game_id}_armylist(army_id)
		)
SQL_STATEMENT;
		return $SQL_CREATE_SLOTLIST;
	}
	function sql_create_actionlist($game_id)
	{
		$SQL_CREATE_SLOTLIST = <<<SQL_STATEMENT
		CREATE TABLE game_{$game_id}_resultlist
		(
			result_id INT,
			action_type CHAR(16),
			player_id INT,
			army1_id INT,
			army2_id INT,
			from_x INT,
			from_y INT,
			to_x INT,
			to_y INT,
			army1_prev_hp INT,
			army1_remaining_hp INT,
			army2_prev_hp INT,
			army2_remaining_hp INT,
			army_type INT,
			PRIMARY KEY(result_id),
			FOREIGN KEY(player_id) REFERENCES game_{$game_id}_playerlist(player_id)
		)
SQL_STATEMENT;
		return $SQL_CREATE_SLOTLIST;
	}

function sql_create_occupationrecord($game_id)
{
	$SQL_CREATE_OCCUPATIONRECORD = <<<SQL_STATEMENT
	CREATE TABLE game_{$game_id}_occupationrecord
	(
		id INT NOT NULL AUTO_INCREMENT,
		slot_col INT,
		slot_row INT,
		prev_owner INT,
		curr_owner INT,
		PRIMARY KEY(id),
		FOREIGN KEY(prev_owner) REFERENCES game_{$game_id}_playerlist(player_id),
		FOREIGN KEY(curr_owner) REFERENCES game_{$game_id}_playerlist(player_id)
	)
SQL_STATEMENT;
	return $SQL_CREATE_OCCUPATIONRECORD;
}
?>
