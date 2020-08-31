<?php
require_once "utils.php";

session_start();

if (empty($_SESSION["id"])) {
    $user = new User(null);
} 
$id = $_SESSION["id"];
$user = new User($id);

$sql_users = "SELECT u.id, u.nickname, u.username, s.name as status_name, s.can_set_status FROM Lauviah_board_users as u NATURAL LEFT JOIN Lauviah_board_status as s ORDER BY u.id";
$result_users = new SQLquery($sql_users, null, null);


$sql_status_can_set = "SELECT status_id, name FROM Lauviah_board_status WHERE can_set_status < ?";
$result_status_can_set = new SQLquery($sql_status_can_set, "i", array($user->auth->set_status));
$statuses = array();

while($row_status = $result_status_can_set->result->fetch_assoc()) {
    $statuses[$row_status['status_id']] = $row_status['name'];
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
    <main class="board ">
        <a href="index.php"><div class="btn users__back">回到留言板</div></a>
        <?php
        if ($user->status === "super_admin") {
        ?>
            <a href="status.php"><div class="btn users__back">身分設定</div></a>
        <?php
        }
        ?>

        <section class="users">
            <?php
            while($row = $result_users->result->fetch_assoc()) {
            ?>
            <div class='user'>
                <div class='user__avatar'></div>
                <div class='user__info'>
                    <div>
                        <span class='user__status'><?php echo $row["status_name"]?></span>
                        <?php
                        if ($user->auth->set_status > $row['can_set_status']) {
                        ?>
                            <form method="post" action="handle_set_status.php" class="user__setting">
                                <input type="hidden" name="user_id" value="<?php echo $row["id"]?>">
                                <select id="status" name="status">
                                <?php
                                foreach ($statuses as $id => $name) {
                                    $checked = $name == $row["status_name"] ? "selected" : "";
                                    echo "<option value='$id' $checked>$name</option>";
                                }
                                ?>
                                </select>
                                <input type="submit" value="change status">
                            </form>
                        <?php
                        }
                        ?>
                    </div>
                    <div>
                        <span class='user__nickname'><?php echo $row["nickname"]?></span>
                        <span class='user__username'>@ <?php echo $row["username"]?></span>
                    </div>
                </div>
            </div>

            <?php
            }
            ?>
        </section>

    </main>
    <script src="./users.js"></script>
</body>

</html>