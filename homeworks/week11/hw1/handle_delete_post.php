<?php
    // session_start();
    require_once "utils.php";
    
    if (empty($_GET['id'])) {
        locate_to('index.php');
    }
    $comment_id = $_GET['id'];

    $user = get_user();

    // 拿用戶資料
    // print_r($user);

    // exit();
    // 確認有沒有權限
    if (empty($user->auth->delete_comment)) {
        locate_to('index.php?error=4');
        
    } else if ($user->auth->delete_comment === "self") {
        $sql_get_comment_userID = "SELECT user_id FROM Lauviah_board_comments WHERE id = $comment_id";
        echo "123123";
        $result = SQLquery_param_stmt($sql_get_comment_userID, null, null);
        $comment_user_id = $result["result"]->fetch_assoc()["user_id"];

        // 如果是 self 而且不是自己的文章
        if ($comment_user_id != $user->id) {
            locate_to('index.php?error=4');
        }
    } 
    

    
    $sql = "UPDATE Lauviah_board_comments SET is_deleted = 1 WHERE id = $comment_id";
    $result = SQLquery_param_stmt($sql, null, null);

    if (empty($result["result"])) {
        print_r($result);
        die("SQL query error");
    }
    // print_r($result);
    locate_to("index.php");

?>