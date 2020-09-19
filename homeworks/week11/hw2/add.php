<?php
session_start();
require_once "utils.php";

if (!is_admin()) {
    redirect("admin.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<?php require_once "modules/head.html";?>
<script src="https://cdn.ckeditor.com/ckeditor5/21.0.0/classic/ckeditor.js"></script>
<body>
    <div class="wrapper">
    <?php require_once "modules/header.php"; 
            $menu_left = <<<EPD
            <a href="index.php"><li>主畫面</li></a>
            <a href="list.php"><li>文章列表</li></a>
EPD;
            $right_list = <<<EOD
<a href="admin.php"><li>後台管理</li></a>
<a href="handle_logout.php"><li>登出</li></a>
EOD;
            render_header($menu_left, $right_list);
            ?>
        <main class="main">
        <?php require_once "modules/background.php" ?>
            <div class="posts">
               <form action="handle_add.php" method="POST" class="edit__form">
                   <div>
                        <h4>標題：</h4>                   
                        <input type="text" name="title" value="">
                   </div>
                   <div>
                        <h4>內文：</h4>                   
                        <textarea name="content" id="editor"></textarea>
                   </div>
                   <input type="submit" value="提交"/>
               </form>
               
            </div>
        </main>
        <?php require_once "modules/footer.html";
        ?>
    </div>
    <script src="js/edit.js"></script>
</body>
</html>