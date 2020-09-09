<?php
require_once "conn.php";
require_once "utils.php";

header('Content-type:application/json;charset=utf-8');
header('Access-Control-Allow-Origin: *');
$method = $_SERVER["REQUEST_METHOD"];

// 如果沒有內容？

if ($method === "POST") {
    if (empty($_POST['content']) || empty($_POST['nickname']) || empty($_POST['site_key'])) {
        $res_no_data = new api_response(false, "missing data");
        $res_no_data->send_JSON();
        exit();
    }
    
    $content = $_POST['content']; 
    $nickname = $_POST['nickname']; 
    $site_key = $_POST['site_key'];
    
    
    // get 資料
    $sql_add = "INSERT INTO Lauviah_bulletin_posts(site_key, content, nickname) VALUES (?, ?, ?)";
    $result_add = new sql_query($sql_add, "sss", array($content, $nickname, $site_key));
    
    if ($result_add->is_error) {
        $res_query_err = new api_response(false, "database error");
        $res_query_err->send_JSON();
        exit();
    }
    
    $res_success = new api_response(true, array("insertId" => $result_add->stmt->insert_id));
    
    $res_success->send_JSON();
}

if ($method === "GET") {
    if (empty($_GET['site_key'])) {
        $res_no_data = new api_response(false, "missing data");
        $res_no_data->send_JSON();
        exit();
    }

    if (!empty($_GET["id"])) {
        $id = $_GET["id"];
        $sql_get_by_id  = "SELECT id, nickname, content, created_at FROM Lauviah_bulletin_posts WHERE id = ?";
        $result_get_by_id = new sql_query($sql_get_by_id, "i", array($id));
        $res = new api_response(true, array("posts" => $result_get_by_id->result->fetch_assoc()));
        $res->send_JSON();
        exit();

    }

    $site_key = $_GET['site_key'];
    if (!empty($_GET["limit"])) {

        $limit = $_GET["limit"];
        $offset = empty($_GET["offset"]) ? 0 : $_GET["offset"];
    
        $sql_get = "SELECT id, nickname, content, created_at FROM Lauviah_bulletin_posts WHERE site_key = ? ORDER BY id DESC LIMIT ? OFFSET ? ";

        $sql_count = "SELECT count(id) as count FROM Lauviah_bulletin_posts WHERE site_key = ?";
        $result_get = new sql_query($sql_get, "sii", array($site_key, $limit, $offset));
        $result_count = new sql_query($sql_count, "s", array($site_key));

        $res_content = array();
        $posts_count = $result_count->result->fetch_assoc()['count'];
        while($row = $result_get->result->fetch_assoc()) {
            array_push($res_content, $row);
        }

        $res = new api_response(true, array("posts" => $res_content,
        "rest" => $posts_count - $offset - count($res_content)
        ));
        $res->send_JSON();
        exit();
    }   
    
    // get 資料
    $sql_get = "SELECT id, nickname, content, created_at FROM Lauviah_bulletin_posts WHERE site_key = ? ORDER BY id DESC";
    $result_get = new sql_query($sql_get, "s", array($site_key));
    
    if ($result_get->is_error) {
        $res_query_err = new api_response(false, "database error");
        $res_query_err->send_JSON();
        exit();
    }
    $res_content = array();

    while($row = $result_get->result->fetch_assoc()) {
        array_push($res_content, $row);
    }
    
    $res_success = new api_response(true, $res_content);
    $res_success->send_JSON();
    exit();
}

?>