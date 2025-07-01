<?php
require_once('../../../private/includes/initialize.php');
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}
$page_title = "Images -- Staff Area";

$home_id = $_GET['home_id'] ?? '';
$home = Home::find_by_id($home_id);
/** @var \Home $home */

if (!$home) {
  redirect_to(url_for('/staff/homes/index.php'));
}

$images = HomeImage::find_by_home_id($home->id);

$page_title = "Images for " . $home->get_title();

require_once(SHARED_PATH . '/staff_header.php');
?>

<main class="p-6 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Images for <?php echo h($home->get_title()); ?></h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
    <?php if ($images): ?>
      <?php foreach ($images as $image): ?>
  <div class="relative">
    <img src="<?php echo h('/software_dev/rocky_mtn_homes/public/' . ltrim($image->image_path, '/')); ?>" alt="Home Image" class="w-full h-48 object-cover rounded shadow">

    <form action="<?php echo url_for('/staff/homes/images_delete.php?id=' . u($image->id) . '&home_id=' . u($home->id)); ?>" method="post" onsubmit="return confirm('Are you sure you want to delete this image?');" class="absolute top-2 right-2">
        <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">

      <button type="submit" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
    </form>

    <a href="<?php echo url_for('/staff/homes/images_edit.php?id=' . u($image->id) . '&home_id=' . u($home->id)); ?>" class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Edit</a>
  </div>
<?php endforeach; ?>

    <?php else: ?>
      <p>No images uploaded yet.</p>
    <?php endif; ?>
  </div>

  <a href="<?php echo url_for('/staff/homes/images_new.php?home_id=' . u($home->id)); ?>" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload New Image</a>
  <p class="mt-4"><a href="<?php echo url_for('inventory.php'); ?>" class="text-blue-600 hover:underline">&laquo; Back to Inventory</a></p>
</main>

<?php
require_once(SHARED_PATH . '/staff_footer.php');
?>
