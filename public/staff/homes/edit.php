<?php
require_once('../../../private/includes/initialize.php');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}

$id = $_GET['id'] ?? '0';
$home = Home::find_by_id($id);
/** @var \Home $home */

if (!$home) {
  redirect_to(url_for('/staff/homes/index.php'));
}

$errors = [];



if (is_post_request()) {
  // Trim inputs to remove extra whitespace
  $args = array_map('trim', $_POST);

  // Set checkbox values explicitly to 0 or 1
  $args['has_washer_dryer_hookups'] = isset($_POST['has_washer_dryer_hookups']) ? 1 : 0;
  $args['has_ac'] = isset($_POST['has_ac']) ? 1 : 0;
  $args['has_furnace'] = isset($_POST['has_furnace']) ? 1 : 0;
  $args['includes_appliances'] = isset($_POST['includes_appliances']) ? 1 : 0;

  // Remove image_path from $args so it won't overwrite image path on the object
  unset($args['image_path']);

  // Merge the non-image POST data first
  $home->merge_attributes($args);

  // Handle image upload
  // Merge the non-image POST data first
$home->merge_attributes($args);

// Handle image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
$upload_dir = 'images/homes/';
$upload_full_dir = rtrim(PUBLIC_PATH, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . rtrim($upload_dir, DIRECTORY_SEPARATOR);

if (!is_dir($upload_full_dir)) {
  mkdir($upload_full_dir, 0755, true);
}

$filename = uniqid() . '_' . basename($_FILES['image']['name']);
$target_path = $upload_full_dir . DIRECTORY_SEPARATOR . $filename;

error_log("Trying to move uploaded file to: " . $target_path);

if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
  $home->set_image_path($upload_dir . $filename);  // note no leading slash here; consistent with your DB paths
} else {
  $errors[] = "Image upload failed.";
}

}

// Validate and save (skip is_dirty check to ensure image path saves)
if (!$home->validate()) {
  $errors = array_merge($errors, $home->errors);
} else {
    error_log("Saving home with image path: " . $home->get_image_path());


  $result = $home->save();
  if ($result === true) {
    redirect_to(url_for('/staff/homes/show.php?id=' . $home->id));
  } else {
    $errors[] = "Failed to save changes.";
    error_log("Save failed. Errors: " . implode(', ', $home->errors));
  }
}

}

require_once(SHARED_PATH . '/staff_header.php');
?>

<main class="max-w-4xl mx-auto mt-16 bg-white shadow-xl rounded-xl p-10 border border-gray-200">
  <h1 class="text-4xl font-extrabold text-blue-700 mb-8 text-center">Edit Home Listing</h1>

  <?php if (!empty($errors)): ?>
    <div class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
      <ul class="list-disc pl-5">
        <?php foreach ($errors as $error): ?>
          <li><?php echo h($error); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <form action="<?php echo url_for('/staff/homes/edit.php?id=' . h(u($id))); ?>" method="post" enctype="multipart/form-data" class="space-y-6">

    <a href="<?php echo url_for('/staff/homes/index.php'); ?>" class="inline-block text-sm text-blue-600 hover:underline">&laquo; Back to Homes</a>

    <!-- Title -->
    <div>
      <label class="block text-sm font-semibold mb-1">Title</label>
      <input type="text" name="title" value="<?php echo h($home->get_title()); ?>" class="w-full p-3 border rounded-md" required>
    </div>

    <!-- Price -->
    <div>
      <label class="block text-sm font-semibold mb-1">Price ($)</label>
      <input type="number" name="price" value="<?php echo h($home->get_price()); ?>" min="0" step="0.01" class="w-full p-3 border rounded-md" required>
    </div>

    <!-- Square Footage & Dimensions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold mb-1">Square Footage</label>
        <input type="number" name="square_footage" value="<?php echo h($home->get_square_footage()); ?>" class="w-full p-3 border rounded-md" min="0" required>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1">Dimensions (L x W x H in ft)</label>
        <div class="flex gap-2">
          <input type="number" name="length_ft" value="<?php echo h($home->get_length_ft()); ?>" class="w-1/3 p-3 border rounded-md" placeholder="Length" min="0" required>
          <input type="number" name="width_ft" value="<?php echo h($home->get_width_ft()); ?>" class="w-1/3 p-3 border rounded-md" placeholder="Width" min="0" required>
          <input type="number" name="height_ft" value="<?php echo h($home->get_height_ft()); ?>" class="w-1/3 p-3 border rounded-md" placeholder="Height" min="0" required>
        </div>
      </div>
    </div>

    <!-- Bedrooms and Bathrooms -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold mb-1">Bedrooms</label>
        <input type="number" name="bedrooms" value="<?php echo h($home->get_bedrooms()); ?>" class="w-full p-3 border rounded-md" min="0" required>
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">Bathrooms</label>
        <input type="number" name="bathrooms" value="<?php echo h($home->get_bathrooms()); ?>" class="w-full p-3 border rounded-md" min="0" step="0.5" required>
      </div>
    </div>

    <!-- Checkboxes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="inline-flex items-center">
        <input type="checkbox" name="has_washer_dryer_hookups" <?php if ($home->get_has_washer_dryer_hookups()) echo 'checked'; ?> class="mr-2">
        Washer/Dryer Hookups
      </label>
      <label class="inline-flex items-center">
        <input type="checkbox" name="has_ac" <?php if ($home->get_has_ac()) echo 'checked'; ?> class="mr-2">
        Air Conditioning
      </label>
      <label class="inline-flex items-center">
        <input type="checkbox" name="has_furnace" <?php if ($home->get_has_furnace()) echo 'checked'; ?> class="mr-2">
        Furnace
      </label>
      <label class="inline-flex items-center">
        <input type="checkbox" name="includes_appliances" <?php if ($home->get_includes_appliances()) echo 'checked'; ?> class="mr-2">
        Includes Appliances
      </label>
    </div>

    <!-- Flooring Type -->
    <div>
      <label class="block text-sm font-semibold mb-1">Flooring Type</label>
      <input type="text" name="flooring_type" value="<?php echo h($home->get_flooring_type()); ?>" class="w-full p-3 border rounded-md" required>
    </div>

    <!-- Year Built -->
    <div>
      <label class="block text-sm font-semibold mb-1">Year Built</label>
      <input type="number" name="year_built" value="<?php echo h($home->get_year_built()); ?>" min="1800" max="<?php echo date('Y'); ?>" class="w-full p-3 border rounded-md" required>
    </div>

    <!-- Extras -->
    <div>
      <label class="block text-sm font-semibold mb-1">Extras / Comments</label>
      <textarea name="extras" rows="2" class="w-full p-3 border rounded-md"><?php echo h($home->get_extras()); ?></textarea>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-semibold mb-1">Description</label>
      <textarea name="description" rows="3" class="w-full p-3 border rounded-md" required><?php echo h($home->get_description()); ?></textarea>
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-semibold mb-1">Status</label>
      <select name="status" class="w-full p-3 border rounded-md" required>
        <option value="">Select status</option>
        <option value="available" <?php if ($home->get_status() === 'available') echo 'selected'; ?>>Available</option>
        <option value="sold" <?php if ($home->get_status() === 'sold') echo 'selected'; ?>>Sold</option>
      </select>
    </div>

    <!-- Cover Photo -->
    <div>
      <label class="block text-sm font-semibold mb-1">Replace Cover Photo</label>
      <input type="file" name="image" class="w-full p-3 border rounded-md">
    </div>

    <!-- CSRF & Submit -->
    <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">
    <div class="text-right">
      <input type="submit" value="Update Home" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
    </div>
  </form>
</main>


<?php require_once(SHARED_PATH . '/staff_footer.php'); ?>
