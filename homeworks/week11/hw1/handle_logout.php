<?php
    require_once "utils.php";
    session_start();

    
    session_destroy();
    locate_to('index.php');
?>