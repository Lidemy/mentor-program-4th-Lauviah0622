<?php
require_once "utils.php";

// print_r($_SERVER["REQUEST_METHOD"]);
$method = $_SERVER["REQUEST_METHOD"];


$user = get_user();

class API_Response {
    public $ok;
    public $content;

    function __construct ($ok, $content) {
        $this->ok = $ok;
        $this->content = $content;
    }

    function toJSON () {
        return json_encode($this);
    }

}

header('Content-type:application/json;charset=utf-8');


if ($method === "GET") {
    if (empty($_GET)) {
        $sql = "SELECT * FROM Lauviah_board_status";
        $result = new SQLquery($sql, null, null);
        $arr = array();
        while($row = $result->result->fetch_assoc()) {
            array_push($arr, $row);
        }
        $res = new API_Response(true, $arr);
        echo $res->toJSON();
        exit();
        
        
      }
      
    $id = $_GET['id'];
    $sql = "SELECT * FROM Lauviah_board_status WHERE status_id = ?";
    $result = new SQLquery($sql, "i", array($id));
    $res = new API_Response(true, $arr);  
    echo $res->toJSON();


}
if ($method === "PATCH") {
    parse_str(file_get_contents('php://input'), $_PATCH);
    // print_r($_PATCH);
    $update_querys = array();
    $props_type = "";
    $update_values = array();
    foreach($_PATCH as $prop => $value) {
        if ($prop === "id") {
            continue;
        }
        $str = "$prop = ?";
        array_push($update_querys, $str);
        array_push($update_values, $value);
        if ($prop === "can_add_comment") {
            $props_type .= "i";
        } else {
            $props_type .= "s";
        }
    }
    array_push($update_values, $_PATCH['id']);
    
    // echo $props_type . 'i';
    $props_type .= "i";
    $update_query_str = implode(", ", $update_querys);
    $sql = "UPDATE Lauviah_board_status SET $update_query_str WHERE status_id = ?";
    // echo $sql;
    // echo $props_type;
    // print_r($update_values);
    // exit();
    $result = new SQLquery($sql,  $props_type, $update_values);
    // print_r($result);
    $res = new API_Response(true, ["affected_rows" => $result->stmt->affected_rows]);
    echo $res->toJSON();



}
if ($method === "DELETE") {
    if (empty($_REQUEST["id"])) {
        $res = new API_Response(false, "no select id");
        echo $res->toJSON();
        exit();
    }
    $id = $_REQUEST["id"];
    $sql = "DELETE FROM Lauviah_board_status WHERE status_id = ?";
    $result = new SQLquery($sql, "i", array($id));
    $res = new API_Response(true, ["affected_rows" => $result->stmt->affected_rows]);
    
    echo $res->toJSON();

}
if ($method === "POST") {
    print_r(file_get_contents('php://input'));
    print_r($_POST);
    if (empty($_POST["name"])) {
        $res = new API_Response(false, "no name");
        echo $res->toJSON();
        exit();
    }

    $name = $_POST["name"];
    print_r($_POST);
    $can_add_comment = empty($_POST["can_add_comment"]) ? false : $_POST["can_add_comment"]; 
    $can_edit_comment = empty($_POST["can_edit_comment"]) ? "no" : $_POST["can_edit_comment"];
    $can_delete_comment = empty($_POST["can_delete_comment"]) ? "no" : $_POST["can_delete_comment"];;
    $can_set_status = empty($_POST["can_set_status"]) ? "no" : $_POST["can_set_status"];
    

    echo "can_add_comment : " . $can_add_comment . "     ";
    echo "can_edit_comment : " . $can_edit_comment . "     ";
    echo "can_delete_comment : " . $can_delete_comment . "     ";
    echo "can_set_status : " . $can_set_status . "     ";
    

    $sql = "INSERT INTO Lauviah_board_status(name, can_add_comment, can_edit_comment, can_delete_comment, can_set_status)  VALUES (?, ?, ?, ?, ?)";
    $result = new SQLquery($sql, "sisss", array($name, $can_add_comment, $can_edit_comment, $can_delete_comment, $can_set_status));
    print_r($result);
    if ($result->stmt->affected_rows < 0 && $result->stmt->errno === 1062) {
      $res = new API_Response(false, "duplicate name");  
      echo $res->toJSON();
      exit();
    }
    $arr = array("id" => $result->stmt->insert_id);
    $res = new API_Response(true, $arr);  
    echo $res->toJSON();
  
}

?>