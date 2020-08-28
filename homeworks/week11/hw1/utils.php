<?php
require_once "conn.php";

function is_All_Exist(...$args) {
    // $args = func_get_args();
    foreach ($args as $arg) {
        if (empty($arg)) {
            return false;
        }
    }
    return true;
}

function locate_to($url) {
    header("Location: $url");
    exit();
}

// 如果後面兩個參數是 null 就不使用 Parameterized Query, 有參數就使用
// 後面的 array 依次放入替代的參數



function SQLquery_param_stmt($sql, $type_str, $param_arr) {
    global $conn;
    if (is_null($param_arr) || is_null($type_str)) {
        $result = $conn->query($sql);
        if (empty($result)) {
            $result_arr = array("result" => $result, "errno" => $conn->errno, "error" => $conn->error);
            return $result_arr;
        }

        $result_arr = array("result" => $result);
        return $result_arr;
    } else {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($type_str, ...$param_arr);
        $result = $stmt->execute();
        if (empty($result)) {
            $result_arr = array("result" => $stmt->get_result(), "errno" => $stmt->errno, "error" => $stmt->error);
            return $result_arr;
        }

        $result_arr = array("result" => $stmt->get_result(), "stmt" => $stmt);
        return $result_arr;
    }
}

function getUserDataWithId($id) {
    global $conn;
    $sql    = "SELECT * FROM Lauviah_board_users WHERE id = $id";
    $result = $conn->query($sql);
    return $result->fetch_assoc();
}

// 防止 XSS
function trans_HTML_valid($str) {
    return htmlspecialchars($str, ENT_QUOTES);
}


// 其實是跟上面一樣的東西，不過改成用 class 寫，好像比較適合？可以解決說不能calling 外部 function 的問題。
class SQLquery {
    public $result;
    public $errno;
    public $error;
    public $stmt;

    function __construct($sql, $type_str, $param_arr) {
        global $conn;
        if (is_null($param_arr) || is_null($type_str)) {
            $result = $conn->query($sql);
            if (empty($result)) {
                $this->errno = $conn->errno;
                $this->error = $conn->error;
            }
            $this->result = $result;
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($type_str, ...$param_arr);
            echo "    ";
            print_r($stmt);
            echo "    ";
            $result = $stmt->execute();
            if (empty($result)) {
                $this->result = $stmt->get_result();
                $this->errno =  $stmt->errno;
                $this->error = $stmt->error;
            }
            $this->result = $stmt->get_result();
            $this->stmt = $stmt;
        }
    }
}


// 不知道為什麼要用的 class... 一直在想說把不同權限的資料存在哪裡會比較好，原本想說存在 data base，不過後來覺得有點麻煩，所以就直接寫在這裡然後再塞進 user，好像也不錯。

$all_status = array("super_admin", "admin", "member", "baned_member");

class Auth {
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

// 原本是用判斷 SQL 抓來的資料，可是很多部分都要用，就決定統合起來建立一個 User 了。
class User {
    public $auth;
    public $status = "client";
    public $id = null;
    public $nickname = "訪客";
    public $username = null;
    // global SQLquery_param_stmt;


    function __construct ($id) {
        if (empty($id)) {
            $this->status = new Auth(null);
            return;
        }
        $sql = "SELECT * FROM Lauviah_board_users NATURAL LEFT JOIN Lauviah_board_status WHERE id = ?";
        $query = new SQLquery($sql, "i", array($id));
        $row = $query->result->fetch_assoc();
        $this->status = $row['status'];
        $this->auth = new Auth($row["can_add_comment"], $row["can_edit_comment"], $row["can_delete_comment"], $row["can_set_status"]);
        $this->id = $row['id'];
        $this->nickname = $row["nickname"];
        $this->username = $row["username"];
    }


}

function get_user () {
    session_start();
    // 確認有沒有登入
    $id = $_SESSION["id"];
    if (empty($id)) {
        locate_to("login.php?error=0");
    }


    // 拿用戶資料
    return new User($id);
}


?>