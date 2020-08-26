<?php
require_once "utils.php";
session_start();

$id     = NULL;
$user   = NULL;
$status = NULL;
if (!empty($_SESSION["id"])) {
    $id = $_SESSION["id"];

    $user = new User($id);
} else {
    $user = new User(null);
}

$edit = NULL;
// print_r($userdata);

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
    <main class="board ">
        <a href="index.php"><div class="btn users__back">回到留言板</div></a>
        <section class="users">
            <?php
$sql          = "SELECT id, username, nickname, status FROM Lauviah_board_users";
$result_users = new SQLquery($sql, null, null);

while ($row = $result_users->result->fetch_assoc()) {; // print_r($row); ?>

            <div class='user'>
                <div class='user__avatar'></div>
                <div class='user__info'>
                    <div>
                        <span class='user__status'><?php echo trans_HTML_valid($row['status']); ?></span>
                        <?php
                        if ($user->auth->set_status && $row['status'] !== "super_admin") {
                        ?>  
                        <form method="post" action="handle_set_status.php" class="user__setting">
                            <input type="hidden" name="user_id" value="<?php echo $row['id']?>">
                            <select id="status" name="status">
                                <!-- ....痾....看到這邊就在想是不是要把 status 放到 database 了... 先 hardcode 在 utils 好了...-->
                                <?php foreach ($all_status as $status) {
                                    // 不能設定成超級管理員
                                    if ($status === "super_admin") {
                                        continue;
                                    }
                                    $select = "";
                                    if ($status === $row['status']) {
                                        $select = "selected";
                                    }
                                    echo "<option value='$status' $select>$status</option>";
                                
                                } ?>
                            </select>
                            <input type="submit" value="change status">
                        </form>
                        <?php
                        }
                        ?>
                    </div>
                    <div>
                        <span class='user__nickname'><?php echo trans_HTML_valid($row['nickname']); ?></span>
                        <span class='user__username'>@ <?php echo trans_HTML_valid($row['username']); ?></span>
                    </div>
                </div>
            </div>
            <?php } ?>

        </section>

    </main>

</body>

</html>