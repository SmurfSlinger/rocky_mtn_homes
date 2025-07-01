<?php
require_once('../../../private/includes/initialize.php');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}
$page_title = "Show Home -- Staff Area";
$id = $_GET['id'] ?? '0';
$home = Home::find_by_id($id);
/** @var \Home $home */
if (!$home) {
    redirect_to(url_for('/staff/homes/index.php'));
}
?>

<?php include(SHARED_PATH . '/staff_header.php'); ?>

<div class="container mx-auto p-6">

  <h1 class="text-2xl font-bold mb-4"><?php echo h($home->get_title()); ?></h1>

  <div class="mb-4">
    <img src="<?php echo url_for('/images/homes/' . h($home->get_image_path())); ?>" alt="<?php echo h($home->get_title()); ?>" class="max-w-full h-auto rounded" />
  </div>

  <dl class="grid grid-cols-2 gap-4 mb-6">
    <dt class="font-semibold">Price:</dt>
    <dd>$<?php echo h(number_format($home->get_price(), 2)); ?></dd>

    <dt class="font-semibold">Dimensions:</dt>
    <dd><?php echo h(implode(' x ', $home->get_dimensions())); ?></dd>

    <dt class="font-semibold">Bedrooms:</dt>
    <dd><?php echo h($home->get_bedrooms()); ?></dd>

    <dt class="font-semibold">Bathrooms:</dt>
    <dd><?php echo h($home->get_bathrooms()); ?></dd>

    <dt class="font-semibold">Features:</dt>
    <dd>
    <ul class="list-disc list-inside">
        <?php foreach ($home->get_features_list() as $feature): ?>
        <li><?php echo h($feature); ?></li>
        <?php endforeach; ?>
    </ul>
    </dd>

    <dt class="font-semibold">Status:</dt>
    <dd><?php echo h($home->get_status()); ?></dd>
  </dl>

  <div class="flex space-x-4">
    <a href="<?php echo url_for('/staff/homes/edit.php?id=' . h(u($home->id))); ?>" class="btn btn-primary">Edit</a>
    <a href="<?php echo url_for('/staff/homes/index.php'); ?>" class="btn btn-secondary">Back to List</a>
  </div>

</div>

<?php include(SHARED_PATH . '/staff_footer.php'); ?>
