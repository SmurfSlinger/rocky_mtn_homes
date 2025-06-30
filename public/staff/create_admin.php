<?php
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
<style>
  body { font-family: Arial, sans-serif; max-width: 600px; margin: 2rem auto; }
  label { font-weight: bold; display: block; margin-top: 1rem; }
  input[type=text], input[type=email], input[type=password] { width: 100%; padding: 8px; }
  .error { background: #fdd; border: 1px solid #f99; padding: 10px; margin-bottom: 1rem; }
  .success { background: #dfd; border: 1px solid #9f9; padding: 10px; margin-bottom: 1rem; }
  input[type=submit] { margin-top: 1rem; padding: 10px 20px; }
</style>
</head>
<body>

<h1>Create New Admin User</h1>

<?php if ($success): ?>
  <div class="success">User created successfully! You can now <a href="login.php">login</a>.</div>
<?php endif; ?>

<?php if (!empty($errors)): ?>
  <div class="error">
    <ul>
      <?php foreach($errors as $error): ?>
        <li><?php echo htmlspecialchars($error); ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
<?php endif; ?>

<form method="post" action="create_admin.php">
  <label for="first_name">First Name</label>
  <input type="text" name="first_name" id="first_name" required value="<?php echo $_POST['first_name'] ?? ''; ?>">

  <label for="last_name">Last Name</label>
  <input type="text" name="last_name" id="last_name" required value="<?php echo $_POST['last_name'] ?? ''; ?>">

  <label for="email">Email</label>
  <input type="email" name="email" id="email" required value="<?php echo $_POST['email'] ?? ''; ?>">

  <label for="username">Username</label>
  <input type="text" name="username" id="username" required value="<?php echo $_POST['username'] ?? ''; ?>">

  <label for="password">Password</label>
  <input type="password" name="password" id="password" required>

  <label for="confirm_password">Confirm Password</label>
  <input type="password" name="confirm_password" id="confirm_password" required>

  <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">


  <input type="submit" value="Create Admin User">
</form>

</body>
</html>

<?php
require_once('../../private/includes/staff_footer.php');
?>