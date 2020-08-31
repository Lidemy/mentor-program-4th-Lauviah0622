<?php
    require_once "utils.php";

    $user = get_user();
    
    if (empty($user->auth->set_status)) {
        locate_to('users.php');
    }
    
    if (!is_All_Exist($_POST['user_id'], $_POST['status'])) {
        locate_to('users.php');
    }
    $status_id = $_POST['user_id'];
    
    $target_status = new SQLquery("SELECT can_set_status FROM Lauviah_board_status", null, null);
    $target_status = $target_status->result->fetch_assoc()['can_set_status'];
    print_r($target_status);
    if (!$user->auth->set_status > $target_status) {
        locate_to('users.php');
    }

    $sql = "UPDATE Lauviah_board_users SET status_id = ? WHERE id = ?";
    $result = new SQLquery($sql, "ii", array($_POST['status'], $_POST['user_id']));

    echo "<br>";
    echo "<br>";
    print_r($result);

    locate_to('users.php');




?>