<?php
require_once('../../../private/includes/initialize.php');
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}

$id = $_GET['id'] ?? '';
$home_id = $_GET['home_id'] ?? '';

if (!is_post_request() || !$id) {
  redirect_to(url_for('/staff/homes/images.php?home_id=' . u($home_id)));
}

$image = HomeImage::find_by_id($id);
if (!$image) {
  redirect_to(url_for('/staff/homes/images.php?home_id=' . u($home_id)));
}

// Delete image file from server
$file_path = rtrim(PUBLIC_PATH, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $image->image_path;
if (file_exists($file_path)) {
  unlink($file_path);
}

// Delete DB record
$image->delete();

redirect_to(url_for('/staff/homes/images.php?home_id=' . u($home_id)));
