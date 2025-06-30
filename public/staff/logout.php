<?php
require_once('../../private/includes/initialize.php');
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}

$_SESSION = [];
session_destroy();

redirect_to(url_for('/staff/login.php'));
?>
