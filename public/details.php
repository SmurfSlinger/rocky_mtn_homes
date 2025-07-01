<?php
require_once('../private/includes/initialize.php');

$id = $_GET['id'] ?? '';
if (!$id || !ctype_digit($id) || (int)$id <= 0) {
  redirect_to(url_for('/inventory.php'));
}

$home = Home::find_by_id($id);
/** @var \Home $home */
if (!$home) {
  redirect_to(url_for('/inventory.php'));
}

$images = HomeImage::find_by_home_id($id);
$combined_images = array_merge([(object)['image_path' => $home->get_image_path()]], $images ?: []);

$page_title = $home->get_title();
$logged_in = isset($_SESSION['admin_id']);
require_once($logged_in ? '../private/includes/staff_header.php' : '../private/includes/header.php');
?>

<main class="bg-[#FDF6EC] min-h-screen py-12 px-6">
  <div class="max-w-5xl mx-auto bg-[#FAF4E6] border border-[#D2B48C] shadow-lg rounded-xl p-8">
    <h1 class="text-4xl font-bold text-[#5C4033] mb-6 tracking-tight"><?php echo h($home->get_title()); ?></h1>

    <p class="mb-6">
      <a href="<?php echo url_for('/inventory.php'); ?>" class="text-[#8B2C2C] hover:underline text-sm">&laquo; Back to Inventory</a>
    </p>

    <h2 class="text-2xl font-semibold text-[#5C4033] mb-4">Gallery</h2>

    <?php if ($combined_images && count($combined_images) > 0): ?>
      <div class="relative max-w-3xl mx-auto mb-10 overflow-hidden rounded-lg shadow">
        <div id="sliderWrapper" class="flex transition-transform duration-500 ease-in-out w-full">
          <?php foreach ($combined_images as $img): ?>
            <img src="<?php echo h(WWW_ROOT . '/' . ltrim($img->image_path, '/')); ?>"
                 class="w-full flex-shrink-0 object-cover h-96"
                 alt="Gallery Image">
          <?php endforeach; ?>
        </div>

        <!-- Navigation Buttons -->
        <button id="prevBtn" aria-label="Previous image"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#5C4033] hover:text-[#8B2C2C] border border-gray-300 rounded-full p-3 shadow-md backdrop-blur-md z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button id="nextBtn" aria-label="Next image"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#5C4033] hover:text-[#8B2C2C] border border-gray-300 rounded-full p-3 shadow-md backdrop-blur-md z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    <?php else: ?>
      <p class="text-[#4b3621]">No images available.</p>
    <?php endif; ?>

    <p class="mb-8 text-base text-[#4b3621] leading-relaxed">
      <?php echo h($home->get_description()); ?>
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[#4b3621] text-sm mb-10">
      <p><strong>Square Footage:</strong> <?php echo h($home->get_square_footage()); ?> sq ft</p>
      <p><strong>Dimensions:</strong> <?php echo implode(' x ', $home->get_dimensions()) . ' ft'; ?></p>
      <p><strong>Bedrooms:</strong> <?php echo h($home->get_bedrooms()); ?></p>
      <p><strong>Bathrooms:</strong> <?php echo h($home->get_bathrooms()); ?></p>
      <p><strong>Washer/Dryer Hookups:</strong> <?php echo $home->get_has_washer_dryer_hookups() ? 'Yes' : 'No'; ?></p>
      <p><strong>Air Conditioning:</strong> <?php echo $home->get_has_ac() ? 'Yes' : 'No'; ?></p>
      <p><strong>Furnace:</strong> <?php echo $home->get_has_furnace() ? 'Yes' : 'No'; ?></p>
      <p><strong>Includes Appliances:</strong> <?php echo $home->get_includes_appliances() ? 'Yes' : 'No'; ?></p>
      <p><strong>Flooring Type:</strong> <?php echo h($home->get_flooring_type()); ?></p>
      <p><strong>Year Built:</strong> <?php echo h($home->get_year_built()); ?></p>
      <p><strong>Extras:</strong> <?php echo h($home->get_extras()); ?></p>
      <p><strong>Status:</strong> <?php echo h(ucfirst($home->get_status())); ?></p>
    </div>
  </div>
</main>

<script>
(() => {
  const imagePaths = <?php echo json_encode(array_map(fn($img) => WWW_ROOT . '/' . ltrim($img->image_path, '/'), $combined_images)); ?>;
  if (imagePaths.length === 0) return;

  const sliderWrapper = document.getElementById('sliderWrapper');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const images = [...imagePaths];
  const total = images.length;

  sliderWrapper.innerHTML = `
    <img src="${images[total - 1]}" class="w-full flex-shrink-0 object-cover h-96" />
    ${images.map(src => `<img src="${src}" class="w-full flex-shrink-0 object-cover h-96" />`).join('')}
    <img src="${images[0]}" class="w-full flex-shrink-0 object-cover h-96" />
  `;

  const slides = sliderWrapper.querySelectorAll("img");
  let currentIndex = 1;
  sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

  function moveTo(index) {
    sliderWrapper.style.transition = 'transform 0.4s ease-in-out';
    sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
  }

  function handleTransitionEnd() {
    sliderWrapper.style.transition = 'none';
    if (currentIndex === 0) {
      currentIndex = total;
      sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else if (currentIndex === total + 1) {
      currentIndex = 1;
      sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }

  sliderWrapper.addEventListener('transitionend', handleTransitionEnd);

  nextBtn.addEventListener('click', () => {
    if (currentIndex <= total) moveTo(currentIndex + 1);
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex >= 1) moveTo(currentIndex - 1);
  });
})();
</script>

<?php
require_once($logged_in ? '../private/includes/staff_footer.php' : '../private/includes/footer.php');
?>
