<?php
session_start();
require_once "utils.php";

if (!is_admin()) {
    redirect('index.php');
}

// 處理沒有 title，在前端處理

$title = $_POST['title'];
$content = $_POST['content'];


$sql_add_post = "INSERT INTO Lauviah_blog_posts (title, content) VALUES (?, ?)";
$result_add_post = new sql_query($sql_add_post, "ss", array($title, $content));

redirect('admin.php');
?>