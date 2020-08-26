<?php
require_once "utils.php";
session_start();

$id = NULL;
$user = NULL;
$status = NULL;
if (!empty($_SESSION["id"])) {
    $id = $_SESSION["id"];

    $user = new User($id);
} else {
    $user = new User(null);
}



$edit = NULL;
if (!empty($_GET['edit'])) {
    $edit = $_GET['edit'];
}
// print_r($userdata);

$LIMIT = 10;
$page = 1;
if (!empty($_GET["page"])) {
    $page = $_GET["page"];
}

$result_page_count = SQLquery_param_stmt("SELECT count(id) as count FROM Lauviah_board_comments WHERE is_deleted = 0 ", null, null);

$total_comments_count = $result_page_count['result']->fetch_assoc()['count'];

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
        <div class="comments__wrapper">
            <h1 class="main__title">Comments</h1>
            <div>
                <?php if (empty($id)) { ?>
                <a href="login.php">
                    <div class="btn log log--login">
                        登入
                    </div>
                </a>
                <a href="register.php">
                    <div class="btn log">
                        註冊
                    </div>
                </a>
                <?php } else { ?>

                <a href="handle_logout.php">
                    <div class="btn log log--logout">
                        登出
                    </div>
                </a>
                <?php } ?>

                <a href="users.php">
                    <div class="btn log l">
                        看看大家
                    </div>
                </a>
            </div>
        </div>
        <?php if (!empty($user->id)) {?>
        <form method="POST" action="handle_update_nickname.php" class="update-nickname">
            <input type="text" name="nickname" class="deco_bd">
            <input type="submit" class="btn" value="更改名稱">
        </form>
        <?php } ?>
        <form method="POST" action="handle_add_post.php" class="form">
            <div class="form__nickname">
                歡迎光臨～<?php echo empty($id) ? "登入後才可以留言喔" : trans_HTML_valid($user->nickname); ?>
            </div>
            <p class="form__error error">
                <?php if ( !empty($_GET["error"])) {
                    $err_msg = array('沒有輸入留言喔', '重複的 tag！!', 'tag 裡面有怪怪的東西，只能輸入英數底線喔，把你的內容 Bang 不見作為懲罰！', '你沒有權限');
                    $err_no = +$_GET["error"] - 1;
                    echo $err_msg[$err_no];

                 } ?>
            </p>
            <?php if (!empty($user->auth->add_comment)) {?>
            <p class="form__content-msg">有甚麼話想說的：</p>
            <textarea name="content" id="" cols="30" rows="10" class="content form__content deco_bd"
                placeholder="輸入你的內容："></textarea>
            <div class="form__tags">
                <?php 
                    $str_tags = "SELECT * FROM Lauviah_board_tags ORDER BY id ASC";
                    $result =  SQLquery_param_stmt($str_tags, null, null);
                    while($row_tags = $result['result']->fetch_assoc()) {
                ?>
                <span>
                    <label for="tag-<?php echo $row_tags['id'] ?>"><?php echo trans_HTML_valid($row_tags['name']) ?></label>
                    <input type="checkbox" name="tags[]" id="tag-<?php echo $row_tags['id'] ?>" value="<?php echo $row_tags['id'] ?>">
                </span>
                <?php } ?>
                <br/>
                <span>
                    new tag: 
                    <input type="text" name="new_tag">
                </span>
            </div>
            <input type="submit" value="送出" class="btn form__submit">
            
            <?php }?>
        </form>

        <hr class="split-line">
        <section class="comments">
            <?php 
            $comment_sql = "SELECT u.id as user_id, c.id as id, c.content, c.created_at as time, u.nickname as nickname FROM Lauviah_board_comments as c LEFT JOIN Lauviah_board_users as u ON c.user_id = u.id WHERE c.is_deleted = 0  ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
            $offset = ($page - 1) * $LIMIT;
            $result =  SQLquery_param_stmt($comment_sql, "ii", array(+$LIMIT, $offset));
            while($row = $result["result"]->fetch_assoc()) {
            ?>
            <div class='comment'>
                <div class='comment__avatar'></div>
                <div class='comment__info'>
                    <h4>
                        <span class='comment__username'><?php echo trans_HTML_valid($row['nickname'])?>
                        </span>
                        <span class='comment__time'><?php echo $row['time']?>
                        </span>
                        
                        <?php if (!empty($user->auth->delete_comment) && $user->auth->delete_comment === "all") {?>
                        <a href="handle_delete_post.php?id=<?php echo $row['id']?>">
                            <span class='comment__delete'>刪除 </span>
                        </a>
                            
                        <?php } else if (!empty($user->auth->delete_comment) && $user->auth->delete_comment === "self") {
                            if ($row["user_id"] == $user->id) {
                        ?>

                        <a href="handle_delete_post.php?id=<?php echo $row['id']?>">
                            <span class='comment__delete'>刪除 </span>
                        </a>
                            

                        <?php 
                            }
                        } 
                        ?>
                        
                        <?php if (!empty($user->auth->edit_comment) && $user->auth->edit_comment === "all") {?>

                            <?php if ($edit != $row['id']) {?>
                            <a href="index.php?edit=<?php echo $row['id']?>">
                                <span class='comment__edit'>編輯 </span>
                            </a>
                                <?php } else { ?>
                            <a href="index.php">
                                <span class='comment__edit'>取消編輯 </span>
                            </a>
                                <?php } ?>
                        <?php } else if (!empty($user->auth->edit_comment) && $user->auth->edit_comment === "self") {
                            if ($row["user_id"] == $user->id) {   
                        ?>
                            <?php 
                            if ($edit != $row['id']) {?>
                            <a href="index.php?edit=<?php echo $row['id']?>">
                                <span class='comment__edit'>編輯 </span>
                            </a>
                                <?php } else { ?>
                            <a href="index.php">
                                <span class='comment__edit'>取消編輯 </span>
                            </a>
                            <?php } ?>


                        <?php }
                        } ?>
                    </h4>
                    <?php if (!empty($user->auth->edit_comment) && $edit == $row['id']) {?>
                    <form method="POST" action="handle_edit_post.php">
                        <input type="hidden" name="id" value="<?php echo $row['id'] ?>">
                        <textarea class='comment__content' name="content"><?php echo $row['content'] ?></textarea>
                        
                        <div>
                        <?php 
                        $str_tags = "SELECT t.id as tag_id, t.name as tag_name, t_c.comment_id  FROM Lauviah_board_tags as t LEFT JOIN Lauviah_board_tags_to_comments AS t_c  ON t.id =  t_c.tag_id AND t_c.comment_id = ? ORDER BY tag_id ASC";
                        // echo $str_tags;
                        $result_all_tags =  SQLquery_param_stmt($str_tags, 'i', array($row["id"]));
                        while($row_tags = $result_all_tags['result']->fetch_assoc()) {
                        $check = empty($row_tags['comment_id']) ? NULL : "checked";
                        ?>
                            <span>
                                <label for="tag-<?php echo $row_tags['tag_id'] ?>"><?php echo trans_HTML_valid($row_tags['tag_name']) ?></label>
                                <input type="checkbox" name="tags[]" id="tag-<?php echo $row_tags['tag_id'] ?>" value="<?php echo $row_tags['tag_id'] ?> " <?php echo $check ?>>
                            </span>
                        <?php } ?>
                        </div>
                        <input type="submit" value="送出" class="btn comment__editsubmit">
                    </form>
                    <?php } else {?>
                    
                    <p class='comment__content content'><?php echo trans_HTML_valid($row['content']);?></p>
                    <div class="comment__tags">
                        <?php 
                            $sql = "SELECT * FROM Lauviah_board_tags_to_comments as t_c LEFT JOIN Lauviah_board_tags as t ON t_c.tag_id = t.id WHERE t_c.comment_id = ?";
                            $tags_result =  SQLquery_param_stmt($sql, 'i', array($row['id']));
                            while($row = $tags_result['result']->fetch_assoc()) {
                                ?>
                        <span class="tag"><?php echo trans_HTML_valid($row['name']); ?></span>
                        <?php
                            } 
                            ?>
                    </div>
                    <?php }?>

                </div>
            </div>
            <?php
            }
            ?>

        </section>
        <section class="page">
            <?php if ($page != 1) { ?>

            <a href="index.php?page=<?php echo $page - 1 ?>" class="page__pre">&lt;</a>
            <?php }?>

            <?php
            $total_pages_count = ceil($total_comments_count / $LIMIT);
            for ($i = 1; $i <= $total_pages_count; $i++) {
                $class = "page_inicator";
                if ($i == $page) {
                    $class .= " current";
                }
            ?>
            <a href="index.php?page=<?php echo $i?>" 
            class="<?php echo $class?>">
                <?php echo $i?>
            </a>
            <?php
            }
            ?>
            <?php if ($page != $total_pages_count) { ?>

            <a href="index.php?page=<?php echo $page + 1 ?>" class="page__next">&gt;</a>

            <?php } ?>
        </section>

    </main>

</body>

</html>