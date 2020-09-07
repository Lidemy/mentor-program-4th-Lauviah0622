<?php
session_start();
require_once "utils.php";


if (!is_admin() || empty($_GET['id'])) {
    redirect("index.php");
}
$id = $_GET['id'];
$sql_delete = "DELETE FROM Lauviah_blog_posts WHERE id = ?";
$result = new sql_query($sql_delete, 'i', array($id));


redirect("admin.php");


?>