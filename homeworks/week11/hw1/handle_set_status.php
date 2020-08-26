<?php
    require_once "utils.php";

    $user = get_user();
    
    if (empty($user->auth->set_status)) {
        locate_to('users.php');
    }
    
    if (!is_All_Exist($_POST['user_id'], $_POST['status'])) {
        locate_to('users.php');
    }
    if (!in_array($_POST['status'], $all_status)) {
        locate_to('users.php');
    }

    $sql = "UPDATE Lauviah_board_users SET status = ? WHERE id = ?";
    $result = new SQLquery($sql, "si", array($_POST['status'], $_POST['user_id']));

    echo "<br>";
    echo "<br>";
    print_r($result);

    locate_to('users.php');




?>