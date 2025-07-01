<?php
require_once('../../private/includes/initialize.php');

$page_title = "Login -- Staff Area";

if (is_post_request()) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $admin = Admin::find_by_username($username);

    if ($admin && $admin->verify_password($password)) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin->id;
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $admin->username;

        redirect_to(url_for('/staff/homes/index.php'));
    } else {
        $errors = ['Invalid username or password.'];
    }
}
?>

<?php include(PROJECT_PATH . '/private/includes/header.php'); ?>

<main class="min-h-screen flex items-center justify-center bg-[#FDF6EC] text-[#5C4033] font-sans px-4">
  <div class="bg-[#FAF4E6] border border-[#D2B48C] rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">

    <h1 class="text-3xl font-serif font-bold text-center text-[#5C4033]">Staff Login</h1>

    <?php if (!empty($errors ?? [])): ?>
      <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
        <ul class="list-disc list-inside">
          <?php foreach ($errors as $error): ?>
            <li><?php echo h($error); ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <form action="<?php echo url_for('/staff/login.php'); ?>" method="post" class="space-y-4">

      <div>
        <label class="block text-sm font-semibold mb-1" for="username">Username</label>
        <input type="text" name="username" id="username" required autofocus
               class="w-full p-2 border border-[#D2B48C] rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B2C2C]">
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1" for="password">Password</label>
        <input type="password" name="password" id="password" required
               class="w-full p-2 border border-[#D2B48C] rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B2C2C]">
      </div>

      <div class="text-center">
        <button type="submit"
                class="bg-[#8B2C2C] hover:bg-[#A94438] text-white font-semibold px-6 py-2 rounded shadow-md transition">
          Log In
        </button>
      </div>

    </form>
  </div>
</main>

<?php include(PROJECT_PATH . '/private/includes/footer.php'); ?>
