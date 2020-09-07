<?php
function list_item ($id, $title, $created_at, $is_admin) {

$title = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
$admin_btn = "";

if ($is_admin) {
    $admin_btn = <<<EOD
    <span class="time">$created_at</span>
    <a href="edit.php?id=$id">
        <span class="post__btn">
            編輯
        </span>
    </a>
    <a href="handle_delete.php?id=$id">
        <span class="post__btn">
            刪除
        </span>
    </a>
EOD;
}


$template = <<<EOD
<div class="post post--editable">
    <h3 class="post__title ">
        <div>
            <a href="post.php?id=$id">
                <span>
                    $title
                </span>
            </a>
        </div>
        <div>
            $admin_btn
        </div>
    </h3>
</div>
EOD;

echo $template;
}
?>

