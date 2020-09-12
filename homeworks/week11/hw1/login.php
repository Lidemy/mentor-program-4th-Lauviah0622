<?php
 session_start();
 require_once "utils.php";
 if (!empty($_SESSION["id"])) {
    locate_to('index.php');
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header class="warning">
        Warning: 此為測試用留言板，請勿使用您常用與真實的帳號密碼，以免資料外洩！！！
    </header>
    <main class="board board--login">
        <form method="POST" action="handle_login.php" class="login">

            <div class="login__nickname">
                帳號：
                <input type="text" name="username" class="deco_bd input">
            </div>
            <div class="login__password">
                密碼：
                <input type="password" name="password" class="deco_bd input">
            </div>
            <p class="error">
            <?php 
            if (!empty($_GET["error"])) {
                $err_msg = array("請填入帳號、密碼喔", 
                "帳號或密碼錯誤喔喔喔", 
              );
                
                echo $err_msg[$_GET["error"]];
            }
                ?>
            </p>
            <input type="submit" value="送出" class="btn login__submit">
            <a href="register.php" class="lint">還沒有帳號？點我註冊</a>
            <a href="index.php" class="lint">返回留言板</a>
        </form>
    </main>

</body>

</html>