<?php
require_once('../../../private/includes/initialize.php');
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}

$home_id = $_GET['home_id'] ?? '';
$home = Home::find_by_id($home_id);
/** @var \Home $home */

if (!$home) {
  redirect_to(url_for('/staff/homes/index.php'));
}

$errors = [];

if (is_post_request()) {
  if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $errors[] = "Please select a valid image to upload.";
  } else {
    $upload_dir = 'images/homes/';
    $filename = uniqid() . '_' . basename($_FILES['image']['name']);
    $target_path = rtrim(PUBLIC_PATH, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $upload_dir . $filename;

    if (!is_dir(PUBLIC_PATH . DIRECTORY_SEPARATOR . $upload_dir)) {
      mkdir(PUBLIC_PATH . DIRECTORY_SEPARATOR . $upload_dir, 0755, true);
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
      $image = new HomeImage([
        'home_id' => $home->id,
        'image_path' => $upload_dir . $filename
      ]);
      $result = $image->save();

      if ($result === true) {
        redirect_to(url_for('/staff/homes/images.php?home_id=' . $home->id));
      } else {
        $errors = $image->errors;
      }
    } else {
      $errors[] = "Failed to move uploaded file.";
    }
  }
}

$page_title = "Upload Image for " . $home->get_title();
require_once(SHARED_PATH . '/staff_header.php');
?>

<main class="p-6 max-w-md mx-auto">
  <h1 class="text-2xl font-bold mb-6">Upload Image for <?php echo h($home->get_title()); ?></h1>

  <?php if(!empty($errors)): ?>
    <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <ul class="list-disc list-inside">
        <?php foreach ($errors as $error): ?>
          <li><?php echo h($error); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <form action="<?php echo url_for('/staff/homes/images_new.php?home_id=' . u($home->id)); ?>" method="post" enctype="multipart/form-data">
    <label for="image" class="block font-semibold mb-2">Select Image</label>
    <input type="file" name="image" accept="image/*" class="w-full p-2 mb-4 border rounded" required>
    <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">

    <input type="submit" value="Upload Image" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  </form>

  <p class="mt-4"><a href="<?php echo url_for('/staff/homes/images.php?home_id=' . u($home->id)); ?>" class="text-blue-600 hover:underline">&laquo; Back to Images</a></p>
</main>

<?php
require_once(SHARED_PATH . '/staff_footer.php');
?>
