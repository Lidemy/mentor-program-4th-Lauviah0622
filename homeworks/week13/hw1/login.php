<?php
session_start();
require_once "utils.php";

if (is_admin()) {
    redirect('index.php');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require_once "modules/head.html"; ?>
</head>
<body>
    <div class="wrapper">
        <?php require_once "modules/header.php";
        $menu_left = <<<EPD
        <a href="index.php"><li>主畫面</li></a>
        <a href="list.php"><li>文章列表</li></a>
EPD;
        render_header($menu_left, null);
        ?>        
        <main class="main">
            <?php require_once "modules/background.php" ?>
            <div class="login_wrapper">
                <div class="login">
                    <h2>Login</h2>
                    <form action="handle_login.php" method="POST">
                        <div class="input__wrapper">
                            <div class="input__label">USERNAME</div>
                            <input class="input__field" type="text" name="username" />
                        </div>
                        
                        <div class="input__wrapper">
                            <div class="input__label">PASSWORD</div>
                            <input class="input__field" type="password" name="password" />
                        </div>
                        <input type='submit' value="登入" />
                    </form>
                </div>
            </div>

        </main>
        <?php require_once "modules/footer.html"?>
    </div>
</body>
</html>