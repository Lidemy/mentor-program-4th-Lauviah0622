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
?>