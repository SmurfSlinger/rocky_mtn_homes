<?php
require_once('../../../private/includes/initialize.php');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}



if (!is_post_request()) {
  redirect_to(url_for('/staff/homes/new.php'));
}

$page_title = "Create Home -- Staff Area";

$args = [];
$args['title'] = $_POST['title'] ?? '';
$args['price'] = $_POST['price'] ?? '';
$args['square_footage'] = $_POST['square_footage'] ?? '';

$dimensions = $_POST['dimensions'] ?? '';
list($length, $width, $height) = explode('x', $dimensions) + [null, null, null];

$args['length_ft'] = $length;
$args['width_ft'] = $width;
$args['height_ft'] = $height;

$args['bedrooms'] = $_POST['bedrooms'] ?? '';
$args['bathrooms'] = $_POST['bathrooms'] ?? '';
$args['has_washer_dryer_hookups'] = isset($_POST['has_washer_dryer_hookups']) ? 1 : 0;
$args['has_ac'] = isset($_POST['has_ac']) ? 1 : 0;
$args['has_furnace'] = isset($_POST['has_furnace']) ? 1 : 0;
$args['includes_appliances'] = isset($_POST['includes_appliances']) ? 1 : 0;
$args['flooring_type'] = $_POST['flooring_type'] ?? '';
$args['year_built'] = $_POST['year_built'] ?? '';
$args['extras'] = $_POST['extras'] ?? '';
$args['description'] = $_POST['description'] ?? '';
$args['status'] = $_POST['status'] ?? '';

// Handle image upload (same as before)
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = '/images/homes/';
    $filename = uniqid() . '_' . basename($_FILES['image']['name']);
    $target_path = dirname(PROJECT_PATH) . '/public' . $upload_dir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
        // Remove leading slash when saving path
        $args['image_path'] = ltrim($upload_dir . $filename, '/');
    } else {
        $args['image_path'] = '';
    }
} else {
    $args['image_path'] = '';
}


$home = new Home($args);
$result = $home->save();
if ($result === true) {
    redirect_to(url_for('/staff/homes/index.php'));
} else {
        $_SESSION['errors'] = $home->errors;
    redirect_to(url_for('/staff/homes/new.php'));
}




?>
