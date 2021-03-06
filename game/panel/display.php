<!DOCTYPE html>
<html>
<head>
    <title>WebCivilization</title>
    <link rel="stylesheet" type="text/css" href="./display.css"/>
    <link rel="stylesheet" type="text/css" href="./info.css"/>
    <link rel="stylesheet" type="text/css" href="./small_map.css"/>
    <script type="text/javascript" src="./display.js"></script>
    <script type="text/javascript" src="./small_map.js"></script>
    <script type="text/javascript" src="../game_logic_client/check_functions.js"></script>
    <?php
        #Check Cookie here
        #if cookie exist, redirect the page
        #else ask the user to login
        $cookie = $_COOKIE['USER_COOKIE'];
        require_once("../../lib/db.php");
        if(!check_cookie($db))
        {
            #redirect to login.php
            echo "<script type=\"text/javascript\">location.href=\"../../login/login.php\"</script>";
        }
    ?>
</head>

<body>
<div id="info">
    <div id="gold">Gold:</div>
    <div id="lumber">Lumber:</div>
    <div id="hexagon_info"></div>
</div>

<div id="small_map">
</div>

<div id="display">
    <div id="box">
    </div>
</div>
</body>
</html>