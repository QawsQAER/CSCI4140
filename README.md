================================================================================

This is a course project of CSCI4140 Open Source Software, a course taught
by Dr Wong, Department of Computer Science and Engineering,
Faculty of Engineering, The Chinese University of HONG KONG
2013-2014 Spring
NOTE: THIS IS JUST A COURSE PROJECT, AND NO BENEFITS WOULD BE EARNED FROM THIS PROJECT (EXCEPT THE MARKS WE GOT :) )
Web Civlization is a web game that imitate the very famouse Civilization Series.

================================================================================

/game/net/ is the directory holding implementation of the network connection

/game/panel/ is the directory holding implementation of the interaction between user and the panel, and the graphical initilization and interaction

/game/game_logic_server/ is the directory holding implementation of the JSON message handling, parsing database data into JSON data, logic computation (does anyone lose the game, does anyone conquer a slot), data storage on the server side

/game/game_logic_client/ is the directory holding the implementtaion of the message forwarding, parsing JSON data into javascript object, and simple damage calculations

/login/ is the directory holding implementation of the login functionality

/room/ is the directory holding implementation of the room-related functionality

/setting/ is the directory holding the setting information of tha WebCivilzation

================================================================================

This can be deployed on the openshift site, using php and MySQL
Note that all the passwords are stored as plaintext and (CHAR(32) in database), for the basic setting you may refer to setting/reinit.php ..
