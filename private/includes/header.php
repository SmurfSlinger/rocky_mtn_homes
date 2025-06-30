<?php require_once('initialize.php');

?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?php if(isset($page_title)){echo $page_title . " - ";}?>Rocky Mountain Home Sales</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="<?php echo WWW_ROOT; ?>/css/styles.css" />



</head>
<body>
<header class="bg-rose-900 text-white p-4 shadow-md">
  <h1 class="text-3xl font-bold">Rocky Mountain Home Sales</h1>
  <nav class="mt-2 flex gap-4 text-sm">
    <a href="<?php echo url_for('index.php'); ?>" class="hover:text-amber-300">Home</a>
    <a href="<?php echo url_for('inventory.php'); ?>" class="hover:text-amber-300">Inventory</a>
    <a href="<?php echo url_for('contact.php'); ?>" class="hover:text-amber-300">Contact</a>
    <a href="<?php echo url_for('about.php'); ?>" class="hover:text-amber-300">About</a>
  </nav>
</header>
