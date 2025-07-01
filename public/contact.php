<?php
require_once('../private/includes/initialize.php');
require_once('phpmailer/PHPMailer.php');
require_once('phpmailer/SMTP.php');
require_once('phpmailer/Exception.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$page_title = "Contact Us";
$logged_in = isset($_SESSION['admin_id']);
require_once($logged_in ? '../private/includes/staff_header.php' : '../private/includes/header.php');

// Initialize variables
$name = $email = $phone = $message = '';
$errors = [];
$success = false;

if (is_post_request()) {
  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $phone = trim($_POST['phone'] ?? '');
  $message = trim($_POST['message'] ?? '');

  if (!empty($_POST['website'])) {
    $errors[] = "Spam detected.";
  }

  if ($name === '') $errors[] = "Name is required.";
  if ($email === '') $errors[] = "Email is required.";
  elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email format is invalid.";
  if ($message === '') $errors[] = "Message is required.";

  if (empty($errors)) {
    $email_message = "You have received a new message from the contact form on your website.\n\n";
    $email_message .= "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message\n";

    $mail = new PHPMailer(true);

    try {
      $mail->isSMTP();
      $mail->Host = 'smtp.gmail.com';
      $mail->SMTPAuth = true;
      $mail->Username = GMAIL_USERNAME;
      $mail->Password = GMAIL_APP_PASSWORD;
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      $mail->Port = 587;

      $mail->setFrom('gundersen.kyler1@gmail.com', 'Rocky Mountain Contact Form');
      $mail->addAddress('rockymountainhomes@myyahoo.com');
      $mail->addReplyTo($email, $name);

      $mail->isHTML(false);
      $mail->Subject = "New Contact Form Message from $name";
      $mail->Body = $email_message;

      $mail->send();
      $success = true;
      $name = $email = $phone = $message = '';
    } catch (Exception $e) {
      $errors[] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
  }
}
?>

<main class="bg-[#FDF6EC] py-12 min-h-screen">
  <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 text-[#4B3621]">
    
    <!-- Contact Form -->
    <div class="bg-[#FAF4E6] border border-[#D2B48C] rounded-xl shadow-lg p-8">
      <h2 class="text-3xl font-bold font-[Lato] mb-6 text-[#5C4033]">Contact Us</h2>

      <?php if ($success): ?>
        <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Thank you for your message. We will get back to you as soon as possible.
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

      <form action="" method="post" class="space-y-5 font-[Inter]">
        <div>
          <label for="name" class="block font-semibold mb-1">Name *</label>
          <input type="text" id="name" name="name" value="<?php echo h($name); ?>" class="w-full p-2 border rounded bg-white" required>
        </div>

        <div>
          <label for="email" class="block font-semibold mb-1">Email *</label>
          <input type="email" id="email" name="email" value="<?php echo h($email); ?>" class="w-full p-2 border rounded bg-white" required>
        </div>

        <div>
          <label for="phone" class="block font-semibold mb-1">Phone</label>
          <input type="tel" id="phone" name="phone" value="<?php echo h($phone); ?>" class="w-full p-2 border rounded bg-white">
        </div>

        <div>
          <label for="message" class="block font-semibold mb-1">Message *</label>
          <textarea id="message" name="message" rows="5" class="w-full p-2 border rounded bg-white" required><?php echo h($message); ?></textarea>
        </div>

        <input type="text" name="website" style="display:none">

        <div>
          <button type="submit" class="bg-[#8B2C2C] text-white px-6 py-2 rounded hover:bg-[#731f1f] transition font-semibold">
            Send Message
          </button>
        </div>
      </form>
    </div>

    <!-- Contact Info Section -->
    <div class="bg-[#FAF4E6] border border-[#D2B48C] rounded-xl shadow-lg p-8 space-y-6 font-[Inter]">
      <h3 class="text-2xl font-bold font-[Lato] mb-2 text-[#5C4033]">Owner Information</h3>
      <p><strong>Owner:</strong> Lynn Sitterud</p>
      <p><strong>Phone:</strong> <a href="tel:4357490270" class="text-red-700 hover:underline">435-749-0270</a></p>
      <p><strong>Email:</strong> <a href="mailto:rockymountainhomes@myyahoo.com" class="text-red-700 hover:underline">rockymountainhomes@myyahoo.com</a></p>
      <p><strong>Location:</strong> Huntington, Utah</p>
      <p><strong>Business Hours:</strong><br>
        Mon–Fri: 9:00 AM – 5:00 PM<br>
        Sat: 9:00 AM – 5:00 PM<br>
        Sun: Closed
      </p>
    </div>
  </div>
</main>


<?php
require_once($logged_in ? '../private/includes/staff_footer.php' : '../private/includes/footer.php');
?>
