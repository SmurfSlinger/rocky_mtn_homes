<?php
require_once('../../../private/includes/initialize.php');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}

$id = $_GET['id'] ?? '0';
$home = Home::find_by_id($id);
/** @var \Home $home */
if(!$home) {
    redirect_to(url_for('/staff/homes/index.php'));
}

if(is_post_request()) {
    if(!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        die("CSRF token failed.");
    }

    $result = $home->delete();

    if ($result) {
        redirect_to(url_for('/staff/homes/index.php'));
    } else {
        die("Delete failed. SQL error: " . $database->error);
    }
}

?>

<?php include(SHARED_PATH . '/staff_header.php'); ?>

<main class="max-w-2xl mx-auto mt-20 bg-[#FDF6EC] text-[#5C4033] p-8 rounded-xl shadow-xl border border-[#D2B48C]">
  <h1 class="text-3xl font-serif font-bold mb-6 text-center">Confirm Deletion</h1>

  <p class="text-lg mb-4 leading-relaxed">
    Are you sure you want to delete the following home from the inventory?
  </p>

  <div class="mb-6 bg-[#FAF4E6] p-4 rounded-lg border border-[#D2B48C] shadow-sm">
    <p><strong>Title:</strong> <?php echo h($home->get_title()); ?></p>
    <p><strong>Price:</strong> $<?php echo h($home->get_price()); ?></p>
  </div>

  <form action="<?php echo url_for('/staff/homes/delete.php?id=' . h(u($home->id))); ?>" method="post" class="flex items-center justify-between">
    <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">

    <a href="<?php echo url_for('/staff/homes/index.php'); ?>" 
       class="bg-gray-300 hover:bg-gray-400 text-[#5C4033] font-semibold py-2 px-4 rounded shadow transition">
      Cancel
    </a>

    <input type="submit" value="Delete Home" 
           class="bg-[#8B2C2C] hover:bg-[#A94438] text-white font-semibold py-2 px-4 rounded shadow transition cursor-pointer" />
  </form>
</main>

<?php include(SHARED_PATH . '/staff_footer.php'); ?>
