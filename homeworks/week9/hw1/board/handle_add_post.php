<?php
session_start();
require_once "utils.php";
require_once "handle_tags.php";

// print_r($_POST);

// 有 new tag
$new_tag     = NULL;
$last_tag_id = NULL;
if (!empty($_POST['new_tag'])) {
    $has_invalid_cha = preg_match('~[^\w_]+~', $_POST['new_tag']);
    if ($has_invalid_cha) {
        locate_to("index.php?error=3");
    }

    $new_tag = add_new_tag($_POST['new_tag']);
    if (isset($new_tag["error"])) {
        locate_to('index.php?error=2');
    }
    $last_tag_id = $new_tag['id'];
}

// exit();
$content = $_POST['content'];

$id = $_SESSION["id"];
if (!is_All_Exist($content, $id)) {
    locate_to("index.php?error=0");
}
// $sql    = "INSERT INTO Lauviah_board_comments(user_id, content) VALUES ($id, '$content')";
$sql    = "INSERT INTO Lauviah_board_comments(user_id, content) VALUES (?, ?)";
echo $sql;
// exit();
$result = SQLquery_param_stmt($sql, "is", array($id, $content));
if (isset($result["errno"])) {
    print_r($result);
    die("SQL query error");
}

$sql             = "SELECT * FROM Lauviah_board_comments WHERE id = LAST_INSERT_ID()";
$last_comment_id = SQLquery_param_stmt($sql, null, null)["result"]->fetch_assoc()['id'];

// 加上 tag
if (!empty($_POST['tags'])) {
    $tags = $_POST['tags'];

    foreach ($tags as $tag_id) {
        $result_addtags = set_tag_to_comment($last_comment_id, $tag_id);
        if (isset($result_addtags["error"])) {
            print_r($result_addtags);
            die("SQL query error");
        }
    }
}
// 如果有 new tag，加上最後一個 tag
if (!empty($last_tag_id)) {
    $result_addtags = set_tag_to_comment($last_comment_id, $last_tag_id);
        if (isset($result_addtags["error"])) {
            print_r($result_addtags);
            die("SQL query error");
        }
}

locate_to("index.php"); 
?>