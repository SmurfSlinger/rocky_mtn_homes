<?php

$page_title = "Inventory";
require_once('../private/includes/initialize.php');

$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
require_once('../private/includes/staff_header.php');
}
else
{
  require_once('../private/includes/header.php');
}


$homes = Home::find_all();

/**
 * Return a safe image URL:
 * - Returns placeholder if file not found or empty
 * - Otherwise returns proper web path starting with '/'
 */
function safe_image_path($path) {
  $path = trim($path);

    $project_root = $_SERVER['DOCUMENT_ROOT'] . '/rocky_mtn_homes/public';
    $full_path = $project_root . '/' . ltrim($path, '/');
    
    if (empty($path) || !file_exists($full_path)) {
        return '/rocky_mtn_homes/public/images/placeholder.png'; // placeholder if missing
    }
    
    // Return URL starting with the project public root plus the relative path
    return '/rocky_mtn_homes/public/' . ltrim($path, '/');
}


?>

<main>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <?php foreach($homes as $home): ?>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border relative">
    <!-- Make whole card clickable -->
    <a href="<?php echo url_for('/details.php?id=' . u($home->id)); ?>" class="block group">
      <img src="<?php echo h('/software_dev/rocky_mtn_homes/public/' . ltrim($home->get_image_path(), '/')); ?>" alt="Home Image" class="w-full h-48 object-cover rounded-t">

      <div class="p-4">
        <h2 class="text-xl font-semibold mb-2 group-hover:text-blue-600"><?php echo h($home->get_title()); ?></h2>
        <p class="mb-2"><?php echo h($home->get_description()); ?></p>
        <p class="mb-4"><?php echo h($home->get_square_footage()); ?> sq ft</p>
        <p><?php echo implode(' x ', $home->get_dimensions()) . ' ft'; ?></p>
      </div>
    </a>

    <?php if (isset($_SESSION['admin_id'])): ?>
      <!-- Manage Images button (not inside <a>) -->
      <a href="<?php echo url_for('/staff/homes/images.php?home_id=' . u($home->id)); ?>" 
         class="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm z-10">
        Manage Images
      </a>
    <?php endif; ?>
  </div>
<?php endforeach; ?>



  </div>
</main>
<?php
$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
require_once('../private/includes/staff_footer.php');
}
else
{
  require_once('../private/includes/footer.php');
}
?>
