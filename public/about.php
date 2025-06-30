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



<main>


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