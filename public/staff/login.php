<?php
require_once('../../private/includes/initialize.php');




if (is_post_request()) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $admin = Admin::find_by_username($username);

    if ($admin && $admin->verify_password($password)) {
        // Password is correct - log them in
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin->id;

        $_SESSION['logged_in'] = true;
        $_SESSION['admin_id'] = $admin->id;
        $_SESSION['username'] = $admin->username;

        redirect_to(url_for('/staff/homes/index.php'));
    } else {
        $errors = ['Invalid username or password.'];
    }
}
?>


<?php $page_title = 'Login'; ?>
<?php include(PROJECT_PATH . '/private/includes/header.php'); ?>

<main class="p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Login</h1>

    <?php if (!empty($errors ?? [])): ?>
        <div class="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo h($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="<?php echo url_for('/staff/login.php'); ?>" method="post" class="space-y-4">
        <label>
            Username
            <input type="text" name="username" required class="w-full p-2 border rounded" autofocus>
        </label>

        <label>
            Password
            <input type="password" name="password" required class="w-full p-2 border rounded">
        </label>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Log In</button>
    </form>
</main>

<?php include(PROJECT_PATH . '/private/includes/footer.php'); ?>
