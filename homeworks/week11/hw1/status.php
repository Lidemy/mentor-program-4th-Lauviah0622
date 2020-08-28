<?php
require_once "utils.php";

print_r($_SERVER["REQUEST_METHOD"]);
$method = $_SERVER["REQUEST_METHOD"];

class status {
    public $add_comment = false;
    public $edit_comment = false;
    public $delete_comment = false;
    public $set_status = false;

    function __construct ($add_cmt, $edit_cmt, $delete_cmt, $set_status) {
       $this->add_comment = $add_cmt;
       $this->edit_comment = $edit_cmt;
       $this->delete_comment = $delete_cmt;
       $this->set_status = $set_status;
    }
}

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
    $res = new API_Response(true, $result->stmt->affected_rows);
    
    echo $res->toJSON();

}
if ($method === "POST") {
    if (empty($_POST["name"])) {
        $res = new API_Response(false, "no name");
        echo $res->toJSON();
        exit();
    }

    $name = $_POST["name"];
    print_r($_POST);
    $can_add_comment = empty($_POST["can_add_comment"]) ? false : $_POST["can_add_comment"]; 
    $can_edit_comment = empty($_POST["can_edit_comment"]) || ? "no" : $_POST["can_edit_comment"];;
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