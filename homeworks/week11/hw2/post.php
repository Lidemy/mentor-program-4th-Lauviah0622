<?php
session_start();
require_once "utils.php";

if (empty($_GET['id'])) {
    redirect('index.php');
}

$id = $_GET['id'];

$sql_post = "SELECT * FROM Lauviah_blog_posts WHERE id = ?";
$result_post = new sql_query($sql_post, "i", array($id));
$row = $result_post->result->fetch_assoc();
$title = $row['title'];
$content = $row['content'];
$created_at = $row['created_at'];

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once "modules/head.html" ?>
</head>
<body>
    <div class="wrapper">
        <?php require_once "modules/header.php";
            $menu_left = <<<EPD
            <a href="index.php"><li>主畫面</li></a>
            <a href="list.php"><li>文章列表</li></a>
EPD;
        
        
            if (is_admin()) {
            $menu_right = <<<EOD
            <a href="admin.php"><li>後臺管理</li></a>
            <a href="handle_logout.php"><li>登出</li></a>
EOD;
            } else {
            $menu_right = <<<EOD
            <a href="login.php"><li>登入</li></a>
EOD;

        }
        render_header($menu_left, $menu_right);
        ?>
        <main class="main">
            <div class="main__bg"></div>
            <div class="title">
                <h1>存放技術之地</h1>
                <h3>歡迎來到我的部落格</h3>
            </div>
            <div class="posts">
                <?php require_once "modules/article.php";
                 render_article ($id, $title, $content, $created_at, is_admin())
                ?>
                
            </div>
        </main>
        <?php require_once "modules/footer.html"?>
    </div>
</body>
</html>