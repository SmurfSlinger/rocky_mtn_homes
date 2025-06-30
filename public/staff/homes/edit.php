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

<main class="p-6">
  <h1 class="text-2xl font-bold mb-4">Edit Home</h1>

  <?php if (!empty($errors)): ?>
    <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <ul class="list-disc list-inside">
        <?php foreach ($errors as $error): ?>
          <li><?php echo h($error); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <form action="<?php echo url_for('/staff/homes/edit.php?id=' . h(u($id))); ?>" method="post" enctype="multipart/form-data">

    <!-- Title -->
    <label for="title" class="block font-semibold">Title</label>
    <input type="text" name="title" value="<?php echo h($home->get_title()); ?>" class="w-full p-2 mb-4 border rounded" required>

    <!-- Price -->
    <label for="price" class="block font-semibold">Price</label>
    <input type="number" name="price" value="<?php echo h($home->get_price()); ?>" class="w-full p-2 mb-4 border rounded" min="0" step="0.01" required>

    <!-- Square Footage -->
    <label for="square_footage" class="block font-semibold">Square Footage</label>
    <input type="number" name="square_footage" value="<?php echo h($home->get_square_footage()); ?>" class="w-full p-2 mb-4 border rounded" min="0" required>

    <!-- Dimensions -->
    <label class="block font-semibold">Dimensions (ft)</label>
    <div class="flex gap-2 mb-4">
      <input type="number" name="length_ft" value="<?php echo h($home->get_length_ft()); ?>" class="p-2 border rounded w-1/3" placeholder="Length" min="0" required>
      <input type="number" name="width_ft" value="<?php echo h($home->get_width_ft()); ?>" class="p-2 border rounded w-1/3" placeholder="Width" min="0" required>
      <input type="number" name="height_ft" value="<?php echo h($home->get_height_ft()); ?>" class="p-2 border rounded w-1/3" placeholder="Height" min="0" required>
    </div>

    <!-- Bedrooms -->
    <label for="bedrooms" class="block font-semibold">Bedrooms</label>
    <input type="number" name="bedrooms" value="<?php echo h($home->get_bedrooms()); ?>" min="0" class="w-full p-2 mb-4 border rounded" required placeholder="Number of bedrooms" />

    <!-- Bathrooms -->
    <label for="bathrooms" class="block font-semibold">Bathrooms</label>
    <input type="number" name="bathrooms" value="<?php echo h($home->get_bathrooms()); ?>" min="0" step="0.5" class="w-full p-2 mb-4 border rounded" required placeholder="Number of bathrooms" />

    <!-- Washer/Dryer Hookups -->
    <label class="block mb-2">
      <input type="checkbox" name="has_washer_dryer_hookups" <?php if ($home->get_has_washer_dryer_hookups()) echo 'checked'; ?> />
      Washer/Dryer Hookups
    </label>

    <!-- Air Conditioning -->
    <label class="block mb-2">
      <input type="checkbox" name="has_ac" <?php if ($home->get_has_ac()) echo 'checked'; ?> />
      Air Conditioning
    </label>

    <!-- Furnace -->
    <label class="block mb-2">
      <input type="checkbox" name="has_furnace" <?php if ($home->get_has_furnace()) echo 'checked'; ?> />
      Furnace
    </label>

    <!-- Includes Appliances -->
    <label class="block mb-4">
      <input type="checkbox" name="includes_appliances" <?php if ($home->get_includes_appliances()) echo 'checked'; ?> />
      Includes Appliances
    </label>

    <!-- Flooring Type -->
    <label for="flooring_type" class="block font-semibold">Flooring Type</label>
    <input type="text" name="flooring_type" value="<?php echo h($home->get_flooring_type()); ?>" class="w-full p-2 mb-4 border rounded" required placeholder="Flooring type" />

    <!-- Year Built -->
    <label for="year_built" class="block font-semibold">Year Built</label>
    <input type="number" name="year_built" value="<?php echo h($home->get_year_built()); ?>" min="1800" max="<?php echo date('Y'); ?>" class="w-full p-2 mb-4 border rounded" required placeholder="Year built" />

    <!-- Extras / Comments -->
    <label for="extras" class="block font-semibold">Extras / Comments</label>
    <textarea name="extras" rows="3" class="w-full p-2 mb-4 border rounded" placeholder="Additional features or comments"><?php echo h($home->get_extras()); ?></textarea>

    <!-- Description -->
    <label for="description" class="block font-semibold">Description</label>
    <textarea name="description" rows="3" class="w-full p-2 mb-4 border rounded" required placeholder="Describe the home"><?php echo h($home->get_description()); ?></textarea>

    <!-- Status -->
    <label for="status" class="block font-semibold">Status</label>
    <select name="status" class="w-full p-2 mb-6 border rounded" required>
      <option value="">Select status</option>
      <option value="available" <?php if ($home->get_status() === 'available') echo 'selected'; ?>>Available</option>
      <option value="sold" <?php if ($home->get_status() === 'sold') echo 'selected'; ?>>Sold</option>
    </select>

    <!-- Image -->
    <label for="image" class="block font-semibold">Replace Cover Photo</label>
    <input type="file" name="image" class="w-full p-2 mb-4 border rounded" />

    <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">


    <!-- Submit -->
    <input type="submit" value="Update Home" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" />
  </form>
</main>

<?php require_once(SHARED_PATH . '/staff_footer.php'); ?>
