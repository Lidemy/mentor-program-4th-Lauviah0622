<?php
    session_start();
    require_once "utils.php";

    $nickname = $_POST['nickname'];
    $id = $_SESSION['id'];
    if (!is_All_Exist($nickname, $id)) {
        locate_to('index.php');
    }
    
    $sql = "UPDATE Lauviah_board_users SET nickname = ?  WHERE id = ?";
    echo $sql;
    $result = SQLquery_param_stmt($sql, "si", array($nickname, $id));
    
    locate_to('index.php');
    // $username = 
    



?>