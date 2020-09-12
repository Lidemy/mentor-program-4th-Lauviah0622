<?php
function render_article ($id, $title, $content, $created_at, $is_admin = null) {
$admin_btn = '';

$title = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
if (!empty($is_admin)) {

$admin_btn = <<<EOD
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
<div class="post">
    <h3 class="post__title">
        <span>
           $title
        </span>
        <div>
            $admin_btn
        </div>
    </h3>
    <div class="post__info">
        <span class="time">$created_at</span>
        <span class="category">歷史公告</span>
    </div>
    <div class="post__content">
        $content
    </div> 
</div>
EOD;

echo $template;
}

?>