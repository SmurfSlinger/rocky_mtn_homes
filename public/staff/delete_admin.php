<?php
require_once('../../private/includes/initialize.php');

if (!isset($_SESSION['admin_id'])) {
  redirect_to(url_for('/staff/login.php'));
}

$id = $_GET['id'] ?? '';
$admin = Admin::find_by_id($id);
/** @var \Admin $home */
if (!$admin) {
  redirect_to(url_for('/staff/index.php'));
}

$errors = [];

if (is_post_request()) {
  // Check CSRF token
  if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
    $errors[] = "Invalid CSRF token.";
  } else {
    $result = $admin->delete();
    if ($result === true) {
      $_SESSION['message'] = "Admin deleted successfully.";
      redirect_to(url_for('/staff/view_admins.php'));
    } else {
      $errors[] = "Failed to delete admin.";
    }
  }
}

$page_title = "Delete Admin User";
require_once('../../private/includes/staff_header.php');
?>

<main class="p-6 max-w-md mx-auto">
  <h1 class="text-2xl font-bold mb-6">Delete Admin User</h1>

  <?php if (!empty($errors)): ?>
    <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <ul>
        <?php foreach ($errors as $error): ?>
          <li><?php echo h($error); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php else: ?>
    <p>Are you sure you want to delete admin <strong><?php echo h($admin->full_name()); ?></strong>?</p>
    <form method="post" action="<?php echo url_for('/staff/delete_admin.php?id=' . u($admin->id)); ?>">

      <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">
      <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes, Delete Admin</button>
      <a href="<?php echo url_for('/staff/view_admins.php'); ?>" class="ml-4 text-gray-700 hover:underline">Cancel</a>
    </form>
  <?php endif; ?>
</main>

<?php require_once('../../private/includes/staff_footer.php'); ?>
