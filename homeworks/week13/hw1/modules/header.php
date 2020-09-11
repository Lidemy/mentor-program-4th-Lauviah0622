<?php
function render_header($items_left, $items_right) {
$header_html = <<< EOD
    <header class="header">
        <nav class="header__left">
            <a href="index.php">
                <div class="header__logo">
                    Who's Blog
                </div>
            </a>
            <ul class="header__page-menu menu">
                $items_left
                <!-- <a href="#"><li>分類專區</li></a> -->
                <!-- <a href="#"><li>關於我</li></a> -->
            </ul>
        </nav>
        <div class="header__right">
            <ul class="header__log-menu menu">
                $items_right        
            </ul>
        </div>
    </header>
EOD;

    // <a href="admin.php"><li>管理後臺</li></a>
    // <a href="handle_logout.php"><li>登出</li></a>
    // <a href="login.php"><li>登入</li></a>
echo $header_html;
}
?>