<?php
require_once('../private/includes/initialize.php');

$id = $_GET['id'] ?? '';
if (!$id) {
  redirect_to(url_for('/inventory.php'));
}
if (!ctype_digit($id) || (int)$id <= 0) {
  redirect_to(url_for('/inventory.php')); // or show 404
}

// Find the home by id
$home = Home::find_by_id($id);
/** @var \Home $home */
if (!$home) {
  redirect_to(url_for('/inventory.php'));
}

// Find images for this home
$images = HomeImage::find_by_home_id($id);

// Combine cover photo and gallery images into one array for slideshow
$combined_images = array_merge(
  [ (object)['image_path' => $home->get_image_path()] ],
  $images ?: []
);

$page_title = $home->get_title();

$logged_in = isset($_SESSION['admin_id']);
if ($logged_in) {
  require_once('../private/includes/staff_header.php');
} else {
  require_once('../private/includes/header.php');
}

?>

<main class="p-6 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-4"><?php echo h($home->get_title()); ?></h1>

  <p class="mb-4">
    <a href="<?php echo url_for('/inventory.php'); ?>" class="text-blue-600 hover:underline">&laquo; Back to Inventory</a>
  </p>
  <h2 class="text-2xl font-semibold mb-4">Gallery</h2>

  <?php if ($combined_images && count($combined_images) > 0): ?>
    <div class="relative max-w-3xl mx-auto mb-6">
      <img id="slideImage" 
           src="<?php echo h(WWW_ROOT . '/' . ltrim($combined_images[0]->image_path, '/')); ?>" 
           alt="Gallery Image" 
           class="w-full h-96 object-cover rounded mb-4">

      <?php if (count($combined_images) > 1): ?>
        <button id="prevBtn" aria-label="Previous image" class="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2 z-10">
          &#8592;
        </button>

        <button id="nextBtn" aria-label="Next image" class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2 z-10">
          &#8594;
        </button>
      <?php endif; ?>
    </div>
  <?php else: ?>
    <p>No images available.</p>
  <?php endif; ?>

  <p class="mb-4"><?php echo h($home->get_description()); ?></p>

  <div class="mb-6">
    <strong>Square Footage:</strong> <?php echo h($home->get_square_footage()); ?> sq ft<br>
    <strong>Dimensions:</strong> <?php echo implode(' x ', $home->get_dimensions()) . ' ft'; ?><br>
    <strong>Bedrooms:</strong> <?php echo h($home->get_bedrooms()); ?><br>
    <strong>Bathrooms:</strong> <?php echo h($home->get_bathrooms()); ?><br>
    <strong>Washer/Dryer Hookups:</strong> <?php echo $home->get_has_washer_dryer_hookups() ? 'Yes' : 'No'; ?><br>
    <strong>Air Conditioning:</strong> <?php echo $home->get_has_ac() ? 'Yes' : 'No'; ?><br>
    <strong>Furnace:</strong> <?php echo $home->get_has_furnace() ? 'Yes' : 'No'; ?><br>
    <strong>Includes Appliances:</strong> <?php echo $home->get_includes_appliances() ? 'Yes' : 'No'; ?><br>
    <strong>Flooring Type:</strong> <?php echo h($home->get_flooring_type()); ?><br>
    <strong>Year Built:</strong> <?php echo h($home->get_year_built()); ?><br>
    <strong>Extras:</strong> <?php echo h($home->get_extras()); ?><br>
    <strong>Status:</strong> <?php echo h(ucfirst($home->get_status())); ?><br>
  </div>

</main>

<script>
  (() => {
    const images = <?php echo json_encode(array_map(fn($img) => WWW_ROOT . '/' . ltrim($img->image_path, '/'), $combined_images)); ?>;

    if (images.length === 0) return;

    let currentIndex = 0;
    const slideImage = document.getElementById('slideImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (images.length > 1) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        slideImage.src = images[currentIndex];
      });

      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        slideImage.src = images[currentIndex];
      });
    }
  })();
</script>

<?php
if ($logged_in) {
  require_once('../private/includes/staff_footer.php');
} else {
  require_once('../private/includes/footer.php');
}
?>
