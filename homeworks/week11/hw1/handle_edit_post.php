<?php
require_once "utils.php";
require_once "handle_tags.php";
// print_r($_POST);

// exit();

$user = get_user();
$comment_id = $_POST['id'];
if (empty($_POST['content'])) {
    locate_to('index.php?edit=' . $_POST['id']);
}
$content = $_POST['content'];


// 確認有沒有權限
if (empty($user->auth->edit_comment)) {
    locate_to('index.php?error=4');
    
} else if ($user->auth->edit_comment === "self") {
    $sql_get_comment_userID = "SELECT user_id FROM Lauviah_board_comments WHERE id = $comment_id";
    $result = SQLquery_param_stmt($sql_get_comment_userID, null, null);
    $comment_user_id = $result["result"]->fetch_assoc()["user_id"];

    // 如果是 self 而且不是自己的文章
    if ($comment_user_id != $user->id) {
        locate_to('index.php?error=4');
    }
} 

// $sql = "UPDATE Lauviah_board_comments SET content = '$content' WHERE id = $comment_id";
$sql = "UPDATE Lauviah_board_comments SET content = ? WHERE id = ?";
$result = SQLquery_param_stmt($sql, 'si', array($content, $comment_id));
if (isset($result["errno"])) {
    print_r($result);
    die("SQL query error");
}

echo "<br>";
// 更新標籤

if (!empty($_POST['tags'])) {
    $tags_selected = $_POST['tags'];
    $sql_tags      = "SELECT * FROM Lauviah_board_tags";
    $result_tags   =  SQLquery_param_stmt($sql_tags, null, null);
    
    print_r($tags_selected);
    
    while ($row = $result_tags['result']->fetch_assoc()) {
        if (in_array(+$row['id'], $tags_selected)) {
            $result_set = set_tag_to_comment($id, $row['id']);
            print_r($result_set);
            echo "<br/>";
        } else {
            $result_rem = remove_tag_from_comment($id, $row['id']);
            print_r($result_rem);
            echo "<br/>";
        }
    }
}

// print_r($result);
// locate_to("index.php");

?>