<?php
require_once "conn.php";

// 這裡把處理 tag 的部分都放在一起，原本想說是不是可以包裝成一個 class 可是不太熟就作罷...

// SQL 好像不能在 function 中使用外部宣告的 function，所以之前寫過的 SQLquery 要再重新寫一次... 不知道有沒有更好的方法？

function add_new_tag($name) {
    global $conn;
    // 這裡是改成 prepare statment 的小抄 XD
    // $sql    = "INSERT INTO Lauviah_board_tags(name) VALUES ('$_POST[new_tag]')";
    $sql  = "INSERT INTO Lauviah_board_tags(name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST["new_tag"]);
    $result = $stmt->execute();
    if (empty($result)) {
        $result_arr = array("result" => $stmt->get_result(), "errno" => $stmt->errno, "error" => $stmt->error);
        return $result_arr;

    } else {
        $sql = "SELECT * FROM Lauviah_board_tags WHERE id = LAST_INSERT_ID()";
        return  SQLquery_param_stmt($sql, null, null)["result"]->fetch_assoc();
    }
}

function set_tag_to_comment($comment_id, $tag_id) {
    global $conn;
    // $sql  = "INSERT INTO Lauviah_board_tags_to_comments(tag_id, comment_id) VALUES ($tag_id, $comment_id)";
    $sql  = "INSERT INTO Lauviah_board_tags_to_comments(tag_id, comment_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $tag_id, $comment_id);

    $result = $stmt->execute();
    if (empty($result) && $stmt->errno !== 1062) {
        $result_arr = array("result" => $stmt->get_result(), "errno" => $stmt->errno, "error" => $stmt->error);
        return $result_arr;

    } else {
        // $sql = "SELECT * FROM Lauviah_board_tags_to_comments WHERE tag_id = $tag_id AND comment_id = $comment_id ";
        $sql  = "SELECT * FROM Lauviah_board_tags_to_comments WHERE tag_id = ? AND comment_id = ? ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $tag_id, $comment_id);
        $result = $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

}

function remove_tag_from_comment($comment_id, $tag_id) {
    global $conn;
    // $sql = "DELETE FROM Lauviah_board_tags_to_comments WHERE tag_id = $tag_id AND comment_id =  $comment_id";
    $sql = "DELETE FROM Lauviah_board_tags_to_comments WHERE tag_id = ? AND comment_id =  ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $tag_id, $comment_id);
    
    $result = $stmt->execute();
    if (empty($result)) {
        $result_arr = array("result" => $stmt->get_result(), "errno" => $stmt->errno, "error" => $stmt->error);
        return $result_arr;

    } else {
        return true;
    }}
?>

