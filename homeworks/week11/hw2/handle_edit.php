<?php
session_start();
require_once "utils.php";

if (!is_admin() || empty($_POST['id'])) {
    redirect('index.php');
}

// 處理沒有 title，在前端處理

$id = $_POST['id'];
$title = $_POST['title'];
$content = $_POST['content'];

$sql_edit_post = "UPDATE Lauviah_blog_posts SET title = ?, content = ? WHERE id = ?";
$result_edit_post = new sql_query($sql_edit_post, "ssi", array($title, $content, $id));

redirect('admin.php');




?>