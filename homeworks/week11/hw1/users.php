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
echo "<br>";
echo "<br>";
echo "<br>";
print_r($user->auth);
echo "<br>";

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
        <section class="settings">
        <?php if ($user->status === "super_admin") {
            $sql = "SELECT * FROM Lauviah_board_status";
            $result_status = new SQLquery($sql, null, null);
            while ($row = $result_status->result->fetch_assoc()) {
                if ($row["name"] === "super_admin") {
                    continue;
                }
                // print_r($row);
            ?>
            <div class="setting">
                <p><?php echo $row['name'] ?></p>
                <form>
                    <input type="hidden" name="id" value="<?php echo $row["id"] ?>">
                    <div data-default="<?php echo $row["can_add_comment"]?>">
                        <span>新增留言</span>
                        否<input type="radio" name="can_add_comment" id="" value="0" >
                        可<input type="radio" name="can_add_comment" id="" value="1">
                    </div>
                    <div data-default="<?php echo $row["can_edit_comment"]?>">
                        <span>編輯留言</span>
                        無<input type="radio" name="can_edit_comment" id="" value="no">
                        自己<input type="radio" name="can_edit_comment" id="" value="self">
                        所有人<input type="radio" name="can_edit_comment" id="" value="all">
                    </div>
                    <div data-default="<?php echo $row["can_delete_comment"]?>">
                        <span>刪除留言</span>
                        無<input type="radio" name="can_delete_comment" id="" value="no">
                        自己<input type="radio" name="can_delete_comment" id="" value="self">
                        所有人<input type="radio" name="can_delete_comment" id="" value="all">
                    </div>
                    <div data-default="<?php echo $row["can_set_status"]?>">
                        <span>設定權限</span>
                        無<input type="radio" name="can_set_status" id="" value="no">
                        管理員以下<input type="radio" name="can_set_status" id="" value="admin">
                    </div>
                    <input type="submit" value="OK">
                </form>
                <a href=""><p>刪除</p></a>
            </div>

        <?php
            }
        } 
        ?>
        </section>
        <section class="add_status">
            <h3>新增權限</h3>
            <form>
                <input type="text" name="name">
                <div data-default="<?php echo $row["can_add_comment"]?>">
                    <span>新增留言</span>
                    否<input type="radio" name="can_add_comment" id="" value="0" >
                    可<input type="radio" name="can_add_comment" id="" value="1">
                </div>
                <div data-default="<?php echo $row["can_edit_comment"]?>">
                    <span>編輯留言</span>
                    無<input type="radio" name="can_edit_comment" id="" value="no">
                    自己<input type="radio" name="can_edit_comment" id="" value="self">
                    所有人<input type="radio" name="can_edit_comment" id="" value="all">
                </div>
                <div data-default="<?php echo $row["can_delete_comment"]?>">
                    <span>刪除留言</span>
                    無<input type="radio" name="can_delete_comment" id="" value="no">
                    自己<input type="radio" name="can_delete_comment" id="" value="self">
                    所有人<input type="radio" name="can_delete_comment" id="" value="all">
                </div>
                <div data-default="<?php echo $row["can_set_status"]?>">
                    <span>設定權限</span>
                    無<input type="radio" name="can_set_status" id="" value="no">
                    管理員以下<input type="radio" name="can_set_status" id="" value="admin">
                </div>
                <input type="submit" value="OK">
            </form>
        </section>
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
    <script src="./users.js"></script>
</body>

</html>