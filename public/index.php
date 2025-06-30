<?php
require_once('../private/includes/initialize.php');

$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
require_once('../private/includes/staff_header.php');
}
else
{
  require_once('../private/includes/header.php');
}



?>

<main class="bg-stone-100 text-stone-800 p-6">
  <h2 class="text-rose-800 text-2xl font-semibold">Welcome to Utah's Trusted Home Provider</h2>
  <p class="mt-2">Explore our inventory of quality manufactured homes.</p>
</main>


<div id="gallery">

<a href="<?php echo url_for('gallery.php'); ?>" class="hover:text-amber-300">View Gallery</a>


</div>





<?php

$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
require_once('../private/includes/staff_footer.php');
}
else
{
  require_once('../private/includes/staff_footer.php');
}

?>