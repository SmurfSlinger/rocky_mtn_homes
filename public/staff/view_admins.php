<?php
require_once('../../private/includes/initialize.php');

if (!isset($_SESSION['admin_id'])) {
  redirect_to(url_for('/staff/login.php'));
}

$page_title = "Manage Admins -- Staff Area";
require_once('../../private/includes/staff_header.php');

$admins = Admin::find_all();
 if (isset($_SESSION['message'])): ?>
  <div class="p-4 mb-4 bg-green-100 border border-green-400 text-green-700 rounded">
    <?php 
      echo h($_SESSION['message']); 
      unset($_SESSION['message']); // Clear message after showing
    ?>
  </div>
<?php endif; ?>



<main class="p-6 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Manage Admin Users</h1>

  <table class="w-full border-collapse border border-gray-300">
    <thead>
      <tr class="bg-gray-200">
        <th class="border border-gray-300 p-2 text-left">ID</th>
        <th class="border border-gray-300 p-2 text-left">Name</th>
        <th class="border border-gray-300 p-2 text-left">Email</th>
        <th class="border border-gray-300 p-2 text-left">Username</th>
        <th class="border border-gray-300 p-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($admins as $admin): ?>
        <tr>
          <td class="border border-gray-300 p-2"><?php echo h($admin->id); ?></td>
          <td class="border border-gray-300 p-2"><?php echo h($admin->full_name()); ?></td>
          <td class="border border-gray-300 p-2"><?php echo h($admin->email); ?></td>
          <td class="border border-gray-300 p-2"><?php echo h($admin->username); ?></td>
          <td class="border border-gray-300 p-2">
            <a href="<?php echo url_for('/staff/edit_admin.php?id=' . u($admin->id)); ?>" class="text-blue-600 hover:underline">Edit</a>
            <a href="<?php echo url_for('/staff/delete_admin.php?id=' . u($admin->id)); ?>" class="text-red-600 hover:underline">Delete</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>

  <p class="mt-6">
    <a href="<?php echo url_for('/staff/create_admin.php'); ?>" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create New Admin</a>
  </p>
</main>

<?php require_once('../../private/includes/staff_footer.php'); ?>
