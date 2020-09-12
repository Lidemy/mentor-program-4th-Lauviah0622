<?php
session_start();
require_once "utils.php";

if (empty($_GET['id']) || !is_admin()) {
    redirect("admin.php");
}

$sql_edit = "SELECT title, content FROM Lauviah_blog_posts WHERE id = ?";
$result_edit = new sql_query($sql_edit, 'i', array($_GET['id']));
$row = $result_edit->result->fetch_assoc();
$title = $row['title'];
$content = $row['content'];
// print_r($result_edit);

?>

<!DOCTYPE html>
<html lang="en">
<?php require_once "modules/head.html";?>
<script src="https://cdn.ckeditor.com/ckeditor5/21.0.0/classic/ckeditor.js"></script>
<body>
    <?php require_once "modules/header.php";
        $menu_left = <<<EPD
        <a href="index.php"><li>主畫面</li></a>
        <a href="list.php"><li>文章列表</li></a>
EPD;
        $menu_right = <<<EOD
        <a href="admin.php"><li>後臺管理</li></a>
        <a href="handle_logout.php"><li>登出</li></a>
EOD;
    render_header($menu_left, $menu_right);
    ?>
    <div class="wrapper">
        <?php require_once "modules/header.php"; ?>
        <main class="main">
        <?php require_once "modules/background.php" ?>
            <div class="posts">
               <form action="handle_edit.php" method="POST" class="edit__form">
                   <input type="hidden" name="id" value="<?php echo $_GET["id"]?>">
                   <div>
                        <h4>標題：</h4>                   
                        <input type="text" name="title" value="<?php echo $title?>">
                   </div>
                   <div>
                        <h4>內文：</h4>                   
                        <textarea name="content" id="editor"><?php echo $content?></textarea>
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