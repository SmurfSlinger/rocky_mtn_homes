<?php
require_once('../../../private/includes/initialize.php');


if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}



$id = $_GET['id'] ?? '0';
$home = Home::find_by_id($id);
/** @var \Home $home */
if(!$home) {
    redirect_to(url_for('/staff/homes/index.php'));
}

if(is_post_request()) {
    // Perform delete
    $result = $home->delete();
    redirect_to(url_for('/staff/homes/index.php'));
}

?>

<?php include(SHARED_PATH . '/staff_header.php'); ?>

<h1>Delete Home</h1>
<p>Are you sure you want to delete this home?</p>

<p><strong>Title:</strong> <?php echo h($home->get_title()); ?></p>
<p><strong>Price:</strong> $<?php echo h($home->get_price()); ?></p>

<form action="<?php echo url_for('/staff/homes/delete.php?id=' . h(u($home->id))); ?>" method="post">
    <input type="submit" value="Delete Home" />
    <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">

    <a href="<?php echo url_for('staff/homes/index.php'); ?>">Cancel</a>
</form>

<?php include(SHARED_PATH . '/staff_footer.php'); ?>
