<?php
require_once('../private/includes/initialize.php');

$page_title = "About Us";
$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
require_once('../private/includes/staff_header.php');
}
else
{
  require_once('../private/includes/header.php');
}



?>



<main class="max-w-6xl mx-auto px-6 py-16">
  <div class="flex flex-col md:flex-row items-center gap-10">
    
    <!-- Image Section -->
    <div class="md:w-1/2">
      <img src="css/images/22830688528_4e5170aaab_o.jpg" alt="Rocky Mountains" class="rounded-xl shadow-lg w-full h-auto object-cover">
    </div>

    <!-- Text Content -->
    <div class="md:w-1/2 space-y-4">
      <h1 class="text-4xl font-bold text-gray-800">About Us</h1>
      <p class="text-lg text-gray-700 leading-relaxed">
        <strong>Rocky Mountain Home Sales</strong> was founded by <strong>Lynn Sitterud</strong>, a proud lifelong resident of <em>Huntington, Utah</em>. With decades of experience as the former owner of <em>Mac’s Mining Repair</em>, current owner and manager of <em>Wally’s Tire &amp; Wheel</em>, and a respected former <strong>Emery County Commissioner</strong>, Lynn brings deep community ties and business expertise to the table.
      <p class="text-lg text-gray-700 leading-relaxed">
        His passion for helping families find affordable, quality housing solutions across Utah is what drives our mission. At Rocky Mountain Home Sales, we pair local values with expert service to bring your dream home within reach.
      </p>
    </div>

  </div>
</main>





<?php
$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
require_once('../private/includes/staff_footer.php');
}
else
{
  require_once('../private/includes/footer.php');
}

?>