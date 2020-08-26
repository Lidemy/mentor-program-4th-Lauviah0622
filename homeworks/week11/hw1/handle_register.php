<?php
session_start();

require_once "utils.php";

$username = $_POST["username"];
$password = $_POST["password"];
$nickname = $_POST["nickname"];
$status = "member";
if (!empty($_POST["status"])) {
    $status = $_POST["status"];
}

// 1. 有東西沒填
if (!is_All_Exist($username, $password, $nickname)) {

    locate_to("register.php?error=0");
}

// 2. 帳號及密碼只能輸入英文 數字 及 底線
$string = $username . $password;
$has_invalid_cha = preg_match('~[^\w_]+~', $string);
if ($has_invalid_cha) {
    locate_to("register.php?error=1");  
}

// 3. 帳號密碼長度至少要大於 5
if (strlen($username) < 5 || strlen($password) < 5) {
    locate_to("register.php?error=2");  
} 
$password = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO Lauviah_board_users(username, password, nickname, status) VALUES (?, ?, ?, ?)";


echo $sql;
$result = SQLquery_param_stmt($sql, 'ssss', array($username, $password, $nickname, $status));


echo "<br/>"."result: " ."<br/>";
// print_r($result);

// 4. 輸入到相同暱稱
if (!empty($result["errno"])) {
    if ($result["errno"] === 1062 && strpos($result["error"], "nickname")) {
        locate_to("register.php?error=3");
    }
    
    // 5. 輸入相同帳號
    if ($result["errno"] === 1062 && strpos($result["error"], "username")) {
        locate_to("register.php?error=4");
    }
}


// 登入帳號，存入 session
$sql = "SELECT id FROM Lauviah_board_users as u WHERE id = (SELECT max(id) FROM Lauviah_board_users)";
$result_user_id =  SQLquery_param_stmt($sql, null, null);
// print_r($result_user_id);
$_SESSION['id'] = $result_user_id['result']->fetch_assoc()['id'];

// 轉到 index 頁面
locate_to("index.php");


?>