<?php
require_once "conn.php";


header('Content-type:application/json;charset=utf-8');


$method = $method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {

    if (empty($_POST['json'])) {
        
        $res = array('ok' => false, 'content' => 'missing json data');
        $res_json = json_encode($res);
        echo $res_json;
        exit();
    }
    $json = $_POST['json'];
    $sql = "INSERT INTO Lauviah_todo(json) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $json);
    $stmt->execute();
    
    // print_r($stmt->insert_id);
    $res = array('ok' => true, 'insert_id' => $stmt->insert_id);
    $res_json = json_encode($res);
    echo $res_json;
    exit();

}

if ($method === "GET") {
    // 沒有 id 直接 return false
    if (empty($_GET['id'])) {
        
        $res = array('ok' => false, 'content' => 'missing id');
        $res_json = json_encode($res);
        echo $res_json;
        exit();
    }

    $id = $_GET['id'];
    $sql_get_data = "SELECT * FROM lauviah.Lauviah_todo WHERE id = ?";

    $stmt = $conn->prepare($sql_get_data);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();


    // print_r($result);
    if ($result->num_rows <= 0) {
            $res = array('ok' => false, 'content' => "no data");
            $res_json = json_encode($res);
        
            echo $res_json;
            exit();
        }
        
    $res = array('ok' => true, 'content' => $result->fetch_assoc());
    $res_json = json_encode($res);
    echo $res_json;
    exit();

}




?>