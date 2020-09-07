<?php
require_once "utils.php";
session_start();

session_destroy();
redirect('index.php');

?>