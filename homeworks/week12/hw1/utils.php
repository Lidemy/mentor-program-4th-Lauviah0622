<?php
function is_exist(...$args) {
    foreach ($args as $arg) {
        if (empty($arg)) {
            print_r(empty($arg));
            return false;
        }
    }
    return true;
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

class api_response {
    public $ok;
    public $content;

    function __construct ($ok, $content) {
        $this->ok = $ok;
        $this->content = $content;
    }

    function send_JSON () {
        $res = json_encode($this);
        echo $res;
    }
}

?>