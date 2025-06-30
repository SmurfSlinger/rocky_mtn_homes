<?php
require_once('../private/includes/initialize.php');

$page_title = "Contact Us";
$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
  require_once('../private/includes/staff_header.php');
} else {
  require_once('../private/includes/header.php');
}

// Initialize variables for form values and errors
$name = '';
$email = '';
$phone = '';
$message = '';
$errors = [];
$success = false;

if (is_post_request()) {
  // Trim and collect POST data
  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $phone = trim($_POST['phone'] ?? '');
  $message = trim($_POST['message'] ?? '');

  // Basic validation
  if ($name === '') {
    $errors[] = "Name is required.";
  }
  if ($email === '') {
    $errors[] = "Email is required.";
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Email format is invalid.";
  }
  if ($message === '') {
    $errors[] = "Message is required.";
  }

  // If no errors, process the form (e.g. send email or save to DB)
  if (empty($errors)) {
  // Prepare email
  $to = "grandfather@example.com"; // replace with your grandfather's email
  $subject = "New Contact Form Message from " . $name;
  
  $email_message = "You have received a new message from the contact form on your website.\n\n";
  $email_message .= "Name: " . $name . "\n";
  $email_message .= "Email: " . $email . "\n";
  $email_message .= "Phone: " . $phone . "\n";
  $email_message .= "Message:\n" . $message . "\n";

  $headers = "From: " . $email . "\r\n";
  $headers .= "Reply-To: " . $email . "\r\n";

  // Send email
  $mail_sent = mail($to, $subject, $email_message, $headers);

  if ($mail_sent) {
    $success = true;
    // Clear form values after success
    $name = $email = $phone = $message = '';
  } else {
    $errors[] = "Sorry, there was a problem sending your message. Please try again later.";
  }
}

}
?>

<main class="p-6 max-w-xl mx-auto">
  <h2 class="text-2xl font-bold mb-4">Contact Us</h2>

  <?php if ($success): ?>
    <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      Thank you for your message. We will get back to you shortly.
    </div>
  <?php endif; ?>

  <?php if (!empty($errors)): ?>
    <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <ul class="list-disc list-inside">
        <?php foreach ($errors as $error): ?>
          <li><?php echo h($error); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <form action="" method="post" class="space-y-4">
    <div>
      <label for="name" class="block font-semibold mb-1">Name *</label>
      <input type="text" id="name" name="name" value="<?php echo h($name); ?>" class="w-full p-2 border rounded" required>
    </div>

    <div>
      <label for="email" class="block font-semibold mb-1">Email *</label>
      <input type="email" id="email" name="email" value="<?php echo h($email); ?>" class="w-full p-2 border rounded" required>
    </div>

    <div>
      <label for="phone" class="block font-semibold mb-1">Phone</label>
      <input type="tel" id="phone" name="phone" value="<?php echo h($phone); ?>" class="w-full p-2 border rounded">
    </div>

    <div>
      <label for="message" class="block font-semibold mb-1">Message *</label>
      <textarea id="message" name="message" rows="5" class="w-full p-2 border rounded" required><?php echo h($message); ?></textarea>
    </div>

    <div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send Message</button>
    </div>
  </form>
</main>

<?php
if($logged_in){
  require_once('../private/includes/staff_footer.php');
} else {
  require_once('../private/includes/footer.php');
}
?>
