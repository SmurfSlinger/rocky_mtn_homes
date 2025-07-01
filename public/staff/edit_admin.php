<?php
require_once('../../private/includes/initialize.php');

if (!isset($_SESSION['admin_id'])) {
  redirect_to(url_for('/staff/login.php'));
}

$id = $_GET['id'] ?? '';
$admin = Admin::find_by_id($id);
/** @var \Admin $home */
if (!$admin) {
  redirect_to(url_for('/staff/admins/index.php'));
}

$errors = [];

if (is_post_request()) {
  $args = array_map('trim', $_POST);
  $admin->merge_attributes($args);

  // Password update logic: only update if password is provided
    if (empty($args['password'])) {
    $admin->set_password_required(false);
  } else {
    $admin->password = $args['password'];
    $admin->confirm_password = $args['confirm_password'];
    $admin->set_password_required(true);
  }

  error_log("Username before save: " . $admin->username);
$result = $admin->save();
error_log("Save result: " . var_export($result, true));
error_log("Errors: " . implode(", ", $admin->errors));


  if ($result === true) {
    $_SESSION['message'] = "Admin updated successfully.";
    redirect_to(url_for('/staff/view_admins.php'));

  } else {
    $errors = $admin->errors;
  }
}

$page_title = "Edit Admin User";
require_once('../../private/includes/staff_header.php');
?>

<main class="p-6 max-w-md mx-auto">
  <h1 class="text-2xl font-bold mb-6">Edit Admin User</h1>
<p class="mb-4">
  <a href="<?php echo url_for('/staff/view_admins.php'); ?>" class="text-blue-600 hover:underline">&laquo; Back to Admin List</a>
</p>

  <?php if (!empty($errors)): ?>
    <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <ul>
        <?php foreach ($errors as $error): ?>
          <li><?php echo h($error); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

 <form method="post" action="<?php echo url_for('/staff/edit_admin.php?id=' . u($admin->id)); ?>">

    <label for="first_name" class="block font-semibold">First Name</label>
    <input type="text" name="first_name" id="first_name" required value="<?php echo h($admin->first_name); ?>" class="w-full p-2 mb-4 border rounded" />

    <label for="last_name" class="block font-semibold">Last Name</label>
    <input type="text" name="last_name" id="last_name" required value="<?php echo h($admin->last_name); ?>" class="w-full p-2 mb-4 border rounded" />

    <label for="email" class="block font-semibold">Email</label>
    <input type="email" name="email" id="email" required value="<?php echo h($admin->email); ?>" class="w-full p-2 mb-4 border rounded" />

    <label for="username" class="block font-semibold">Username</label>
    <input type="text" name="username" id="username" required value="<?php echo h($admin->username); ?>" class="w-full p-2 mb-4 border rounded" />

    <label for="password" class="block font-semibold">New Password (leave blank to keep current)</label>
    <input type="password" name="password" id="password" class="w-full p-2 mb-4 border rounded" />

    <label for="confirm_password" class="block font-semibold">Confirm Password</label>
    <input type="password" name="confirm_password" id="confirm_password" class="w-full p-2 mb-4 border rounded" />

    <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">

    <input type="submit" value="Update Admin" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" />
  </form>

  <script>
  const form = document.querySelector('form');
  form.addEventListener('submit', function(e) {
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;
    const firstName = form.first_name.value.trim();
    const lastName = form.last_name.value.trim();
    const email = form.email.value.trim();
    const username = form.username.value.trim();

    let errors = [];

    if (!firstName) errors.push("First name cannot be blank.");
    if (!lastName) errors.push("Last name cannot be blank.");
    if (!email) errors.push("Email cannot be blank.");
    if (!username) errors.push("Username cannot be blank.");

    // Password validation only if password is entered
    if (password.length > 0) {
      if (password.length < 12) errors.push("Password must be 12 or more characters.");
      if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter.");
      if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter.");
      if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number.");
      if (!/[^A-Za-z0-9\s]/.test(password)) errors.push("Password must contain at least one symbol.");
      if (password !== confirmPassword) errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });
</script>

</main>

<?php require_once('../../private/includes/staff_footer.php'); ?>
