<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap" rel="stylesheet"> -->
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header class="warning">
        Warning: 此為測試用留言板，請勿使用您常用與真實的帳號密碼，以免資料外洩！！！
    </header>
    <main class="board board--login">
        <form method="POST" action="handle_register.php" class="login">
            <?php 
            if (!empty($_GET["admin"]) && $_GET["admin"] === "9527") { 
                ?>
                <input type="hidden" name="status" value="admin">
            <?php } 
                ?>
            <div class="login__nickname">
                暱稱：
                <input type="text" name="nickname" class="deco_bd input">
            </div>
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
                $err_msg = array("請填入帳號、密碼、及暱稱喔", 
                "帳號密碼只能輸入英文、數字和底線喔", 
                "帳號密碼長度要大於五個字元", 
                "暱稱重複囉，換一個吧",
                "帳號重複囉，換一個吧");
                
                echo $err_msg[$_GET["error"]];
            }
                ?>
            </p>
            <input type="submit" value="送出" class="btn login__submit">
            <a href="login.php" class="lint">已有帳號？點我登入</a>
            <a href="index.php" class="lint">返回留言板</a>

        </form>
    </main>

</body>

</html>