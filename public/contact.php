<?php
require_once('../private/includes/initialize.php');

$page_title = "Contact Us";
$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
require_once('../private/includes/staff_header.php');
}
else
{
  require_once('../private/includes/header.php');
}



?>

<main>




<div id = "main">

<h2>Contact Us</h2>


</div>

<div id = "contact_form">
<form action="" method="post">

<input type="text" name="name" id="name">
<input type="text" name="email" id="email">
<input type="text" name="phone" id="phone">
<input type="text">

</form>
</div>


</main>


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