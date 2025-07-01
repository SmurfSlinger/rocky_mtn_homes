<?php
$page_title = "Inventory";
require_once('../private/includes/initialize.php');

$logged_in = isset($_SESSION['admin_id']);
if ($logged_in) {
  $page_title = "Inventory -- Staff Area";
  require_once('../private/includes/staff_header.php');
} else {
  require_once('../private/includes/header.php');
}

$homes = Home::find_all();

function safe_image_path($path) {
  $path = trim($path);
  $project_root = $_SERVER['DOCUMENT_ROOT'] . '/rocky_mtn_homes/public';
  $full_path = $project_root . '/' . ltrim($path, '/');
  if (empty($path) || !file_exists($full_path)) {
    return '/rocky_mtn_homes/public/images/placeholder.png';
  }
  return '/rocky_mtn_homes/public/' . ltrim($path, '/');
}
?>

<main class="bg-[#FDF6EC] min-h-screen py-12">
  <div class="max-w-7xl mx-auto px-6">
    <h1 class="text-4xl font-serif text-[#5C4033] mb-10 text-center">Available Homes</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <?php foreach ($homes as $home): ?>
        <div class="bg-[#FAF4E6] border border-[#D2B48C] rounded-xl shadow-md overflow-hidden relative transition hover:shadow-xl">
          <a href="<?php echo url_for('/details.php?id=' . u($home->id)); ?>" class="block group">
            <img src="<?php echo h('/software_dev/rocky_mtn_homes/public/' . ltrim($home->get_image_path(), '/')); ?>" alt="Home Image" class="w-full h-48 object-cover rounded-t">
            <div class="p-4 text-[#5C4033]">
              <h2 class="text-xl font-semibold mb-2 group-hover:text-[#8B2C2C]"><?php echo h($home->get_title()); ?></h2>
              <p class="mb-2 text-sm text-[#4b3621]"><?php echo h($home->get_description()); ?></p>
              <p class="mb-1 font-medium"><?php echo h($home->get_square_footage()); ?> sq ft</p>
              <p class="text-sm"><?php echo implode(' x ', $home->get_dimensions()) . ' ft'; ?></p>
            </div>
          </a>

          <?php if (isset($_SESSION['admin_id'])): ?>
            <a href="<?php echo url_for('/staff/homes/images.php?home_id=' . u($home->id)); ?>" 
               class="absolute top-2 right-2 px-3 py-1 bg-[#8B2C2C] text-white rounded hover:bg-[#A94438] text-sm z-10">
              Manage Images
            </a>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</main>

<?php
if ($logged_in) {
  require_once('../private/includes/staff_footer.php');
} else {
  require_once('../private/includes/footer.php');
}
?>
