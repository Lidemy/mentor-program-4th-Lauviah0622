<?php
session_start();
require_once "utils.php";

$is_admin = is_admin();

if (!$is_admin) {
    redirect('index.php');
}
$status = empty($_SESSION['status']) ? NULL : $_SESSION['status'];

$sql_posts = 'SELECT id, title, created_at FROM Lauviah_blog_posts ORDER BY created_at DESC';

$result_posts = new sql_query($sql_posts, null, null);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once "modules/head.html" ?>

</head>
<body>
    <div class="wrapper">
        <!-- 把同樣的部份抽出來的時候，模板大致相同，可是裡面東西如果不一樣要怎麼處理？ -->
            <?php require_once "modules/header.php"; 
            $menu_left = <<<EPD
            <a href="index.php"><li>主畫面</li></a>
EPD;
            $menu_right = <<<EOD
<a href="add.php"><li>新增文章</li></a>
<a href="handle_logout.php"><li>登出</li></a>
EOD;
            render_header($menu_left, $menu_right);
            ?>

        <main class="main">
            <?php require_once "modules/background.php" ?>
            <div class="posts">
                <?php require_once "modules/list_item.php"; 
                while($row = $result_posts->result->fetch_assoc()) {
                    list_item ($row['id'], $row['title'], $row['created_at'], $is_admin);
                }
                
                ?>
            </div>
        </main>
        <?php require_once "modules/footer.html";?>
    </div>
</body>
</html>