<?php
$page_title = "Staff Area";
require_once('../../../private/includes/initialize.php');
require_once('../../../private/includes/staff_header.php');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}


$homes = Home::find_all();
?>

<main class="p-6">
  <h1 class="text-2xl font-bold mb-4">Manage Homes</h1>

  <a href="new.php" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4">+ Add New Home</a>

  <table class="min-w-full border-collapse border border-gray-300">
    <thead>
      <tr class="bg-gray-100">
        <th class="border p-2 text-left">Title</th>
        <th class="border p-2 text-left">Price</th>
        <th class="border p-2 text-left">Sq Ft</th>
        <th class="border p-2 text-left">Status</th>
        <th class="border p-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach($homes as $home): ?>
        <tr>
          <td class="border p-2"><?php echo h($home->get_title()); ?></td>
          <td class="border p-2"><?php echo $home->formatted_price(); ?></td>
          <td class="border p-2"><?php echo h($home->get_square_footage()); ?></td>
          <td class="border p-2"><?php echo h($home->get_status()); ?></td>
          <td class="border p-2">
            <a href="edit.php?id=<?php echo h($home->get_id()); ?>" class="text-blue-600 hover:underline">Edit</a> |
            <a href="delete.php?id=<?php echo h($home->get_id()); ?>" class="text-red-600 hover:underline">Delete</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</main>

<?php require_once('../../../private/includes/staff_footer.php'); ?>
