<?php
    session_start();
    require_once "conn.php";
    require "utils.php";

    $username = $_POST["username"];
    $password = $_POST["password"];

    // 已經登入了
    if ($_SESSION["id"]) {
        locate_to('index.php');
    }

    // 0. 有東西沒填
    if (!is_All_Exist($username, $password)) {
        locate_to("login.php?error=0");
    }

    $sql = "SELECT password, id FROM Lauviah_board_users WHERE username = ?";

    $user_data = SQLquery_param_stmt($sql, 's', array($username))['result']->fetch_assoc();

    // 帳號密碼錯誤
    if (!password_verify($password, $user_data['password'])) {
        locate_to('login.php?error=1');    
    }
    
    // 存入 session
    // print_r($result);
    $_SESSION['id'] = $user_data['id'];
    
    
    locate_to('index.php');    

?>