<?php require_once('initialize.php');

?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?php if(isset($page_title)){echo $page_title . " - ";}?>Rocky Mountain Home Sales</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header>
    <h1>Rocky Mountain Homes</h1>
    <nav>
      <a href="../public/index.php">Home</a>
      <a href="../public/inventory.php">Inventory</a>
      <a href="../public/gallery.php">Gallery</a>
      <a href="../public/contact.php">Contact</a>
      <a href="../public/about.php">About Us</a>
    </nav>
  </header>