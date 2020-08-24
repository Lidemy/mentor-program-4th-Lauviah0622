<?php
    session_start();
    require_once "utils.php";
    
    if (empty($_GET['id'])) {
        locate_to('index.php');
    }
    $id = $_GET['id'];
    
    $sql = "UPDATE Lauviah_board_comments SET is_deleted = 1 WHERE id = $id";
    $result = SQLquery_param_stmt($sql, null, null);

    if (empty($result["result"])) {
        print_r($result);
        die("SQL query error");
    }
    // print_r($result);
    locate_to("index.php");

?>