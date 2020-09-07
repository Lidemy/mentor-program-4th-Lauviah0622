<?php
session_start();
require_once "utils.php";

$sql_posts = "SELECT * FROM Lauviah_blog_posts ORDER BY created_at DESC";
$result_posts = new sql_query($sql_posts, null, null);

$is_admin = is_admin();

echo $is_admin;


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once "modules/head.html"?>
</head>
<body>
    <div class="wrapper">
        <?php require_once "modules/header.php";

            $menu_left = <<<EPD
            <a href="index.php"><li>主畫面</li></a>
EPD;

if ($is_admin) {
$menu_right = <<<EOD
<a href="admin.php"><li>後臺管理</li></a>
<a href="handle_logout.php"><li>登出</li></a>
EOD;
} else {
$menu_right = <<<EOD
<a href="login.php"><li>登入</li></a>
EOD;
}

render_header($menu_left ,$menu_right);
        ?>        

        <main class="main">
        <?php require_once "modules/background.php" ?>
            <div class="posts">
                <?php require_once "modules/list_item.php";
                while($row = $result_posts->result->fetch_assoc()) {
                    list_item ($row['id'], $row['title'], $row['created_at'], $is_admin);
                }
                // render_preview()
                ?>

            </div>
        </main>
        <?php require_once "modules/footer.html";
        ?>
    </div>
</body>
</html>