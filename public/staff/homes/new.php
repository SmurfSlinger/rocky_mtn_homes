<?php

require_once('../../../private/includes/initialize.php');
require_once('../../../private/includes/staff_header.php');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}
?>


<?php


if(is_post_request())
{


if(isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
  $tmp_name = $_FILES['image']['tmp_name'];
  $filename = basename($_FILES['image']['name']);
  $target_dir = PUBLIC_PATH . '/images/uploads/';
  $target_path = $target_dir . $filename;

  if(move_uploaded_file($tmp_name, $target_path)) {
    $image_path = 'images/uploads/' . $filename;
  }
}


}


?>




<main class="p-6">
  <h1 class="text-2xl font-bold mb-4">Add New Home</h1>

 <form method="POST" action="create.php" enctype="multipart/form-data" class="space-y-4">

  <label>
    Title:
    <input type="text" name="title" class="w-full p-2 border rounded" required placeholder="Enter home title">
  </label>

  <label>
    Price:
    <input type="number" name="price" step="0.01" min="0" class="w-full p-2 border rounded" required placeholder="0.00">
  </label>

  <label>
    Square Footage:
    <input type="number" name="square_footage" min="0" class="w-full p-2 border rounded" required placeholder="Square footage">
  </label>

  <label>
  Dimensions (L x W x H):
  <input type="text" name="dimensions" placeholder="e.g., 14x60x9" class="w-full p-2 border rounded" required pattern="\d+x\d+x\d+" title="Format: LengthxWidthxHeight, e.g. 14x60x9">
</label>



  <label>
    Bedrooms:
    <input type="number" name="bedrooms" min="0" class="w-full p-2 border rounded" required placeholder="Number of bedrooms">
  </label>

  <label>
    Bathrooms:
    <input type="number" name="bathrooms" min="0" step="0.5" class="w-full p-2 border rounded" required placeholder="Number of bathrooms">
  </label>


  <label>
    Flooring Type:
    <input type="text" name="flooring_type" class="w-full p-2 border rounded" required placeholder="Flooring type">
  </label>

  <label>
    Year Built:
    <input type="number" name="year_built" min="1800" max="<?php echo date('Y'); ?>" class="w-full p-2 border rounded" required placeholder="Year built">
  </label>

  <label>
    Extras / Comments:
    <textarea name="extras" rows="3" class="w-full p-2 border rounded"></textarea>
  </label>

  <label>
    Description:
    <textarea name="description" rows="3" class="w-full p-2 border rounded" required placeholder="Describe the home"></textarea>
  </label>

  <label>
    Home Image:
    <input type="file" name="image" accept="image/*" class="w-full p-2 border rounded bg-white" required>
  </label>

  <label>
    Status:
    <select name="status" class="w-full p-2 border rounded" required>
      <option value="">Select status</option>
      <option value="available">Available</option>
      <option value="sold">Sold</option>
    </select>
  </label>

  <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">


  <button type="submit" class="bg-amber-700 text-white px-4 py-2 rounded">Add Home</button>

</form>

</main>