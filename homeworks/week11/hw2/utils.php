<?php
require_once "conn.php";

function redirect($url) {
    header("Location: $url");
    exit();
}

function is_admin () {
    if (!empty($_SESSION['status']) && $_SESSION['status'] === 'admin') {
        return true;
    } else {
        return false;
    }
}

function use_template ($template, $inputs) {
    if (is_array($inputs)) {
        $inputs.extract();
    }
    echo $contents;
}

class sql_query {
    public $result;

    function __construct($sql, $type_str, $param_arr) {
        global $conn;
        if (is_null($param_arr) || is_null($type_str)) {
            $result = $conn->query($sql);
            if (empty($result)) {
                $this->errno = $conn->errno;
                $this->error = $conn->error;
                $this->is_error = true;
            }
            $this->is_error = false;
            $this->result = $result;
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($type_str, ...$param_arr);
            $result = $stmt->execute();
            if (empty($result)) {
                $this->result = $stmt->get_result();
                $this->errno =  $stmt->errno;
                $this->error = $stmt->error;
                $this->is_error = true;
            }
            $this->result = $stmt->get_result();
            $this->stmt = $stmt;
            $this->is_error = false;

        }
    }
}

?>