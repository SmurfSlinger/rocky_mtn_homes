<?php
require_once('../private/includes/initialize.php');
require_once('../private/includes/header.php');

?>


<div id="main">

    <h1>Home Page</h1>
    <ul id="menu">
        <li><a href="<?php echo url_for('inventory.php'); ?>">View Inventory</a></li>
        <li><a href="<?php echo url_for('buy.php'); ?>">Buy</a></li>
        <li><a href="<?php echo url_for('about.php'); ?>">About Us</a></li>
        <li><a href="<?php echo url_for('contact.php'); ?>">Contact</a></li>
    </ul>

</div>


<div id="slogan">

<h2>Your New Home Awaits</h2>

</div>


<div id="gallery">

<a href="<?php echo url_for('gallery.php'); ?>">View Gallery</a>


</div>





<?php

require_once('../private/includes/footer.php');

?>