<?php
$page_title = "Create Admin -- Staff Area";
require_once('../../private/includes/initialize.php');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    redirect_to(url_for('/staff/login.php'));
}

require_once('../../private/includes/staff_header.php');

$errors = [];
$success = false;

// Only run on POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $args = array_map('trim', $_POST);

    // Create new admin object
    $admin = new Admin($args);

    // Attempt to create in DB (validates and hashes password)
    $result = $admin->create();

    if ($result === true) {
        $success = true;
    } else {
        $errors = $admin->errors;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Create Admin User</title>

</head>
<body>

<main class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
  <div class="w-full max-w-xl bg-white rounded-xl shadow-lg p-10 border border-gray-200">
    <h1 class="text-3xl font-extrabold text-blue-700 mb-6 text-center">Create New Admin</h1>

    <p class="text-sm text-center mb-6">
      <a href="<?php echo url_for('/staff/view_admins.php'); ?>" class="text-blue-600 hover:underline">&laquo; Back to Admin List</a>
    </p>

    <?php if ($success): ?>
      <div class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        User created successfully! You can now <a href="login.php" class="underline">login</a>.
      </div>
    <?php endif; ?>

    <?php if (!empty($errors)): ?>
      <div class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <ul class="list-disc pl-5">
          <?php foreach($errors as $error): ?>
            <li><?php echo h($error); ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <form method="post" action="create_admin.php" class="space-y-6">
      <div>
        <label for="first_name" class="block font-semibold mb-1">First Name</label>
        <input type="text" name="first_name" id="first_name" required value="<?php echo h($_POST['first_name'] ?? ''); ?>" class="w-full border rounded-md p-3">
      </div>

      <div>
        <label for="last_name" class="block font-semibold mb-1">Last Name</label>
        <input type="text" name="last_name" id="last_name" required value="<?php echo h($_POST['last_name'] ?? ''); ?>" class="w-full border rounded-md p-3">
      </div>

      <div>
        <label for="email" class="block font-semibold mb-1">Email</label>
        <input type="email" name="email" id="email" required value="<?php echo h($_POST['email'] ?? ''); ?>" class="w-full border rounded-md p-3">
      </div>

      <div>
        <label for="username" class="block font-semibold mb-1">Username</label>
        <input type="text" name="username" id="username" required value="<?php echo h($_POST['username'] ?? ''); ?>" class="w-full border rounded-md p-3">
      </div>

      <div>
        <label for="password" class="block font-semibold mb-1">Password</label>
        <input type="password" name="password" id="password" required class="w-full border rounded-md p-3">
      </div>

      <div>
        <label for="confirm_password" class="block font-semibold mb-1">Confirm Password</label>
        <input type="password" name="confirm_password" id="confirm_password" required class="w-full border rounded-md p-3">
      </div>

      <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">

      <div class="text-right">
        <input type="submit" value="Create Admin User" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md cursor-pointer transition">
      </div>
    </form>
  </div>
</main>


</body>
</html>

<?php
require_once('../../private/includes/staff_footer.php');
?>