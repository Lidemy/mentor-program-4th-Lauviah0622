<?php
session_start();
require_once "utils.php";

$username = empty($_POST['username']) ? NULL : $_POST['username'];
$password = empty($_POST['password']) ? NULL : $_POST['password'];

if ($username !== "admin" || $password !== "admin") {
    redirect("login.php");
}

echo $username;
echo $password;

$_SESSION['status'] = 'admin';
redirect("index.php");

?>