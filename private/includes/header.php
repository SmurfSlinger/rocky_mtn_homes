<?php require_once('initialize.php'); ?>
<?php $logged_in = isset($_SESSION['admin_id']); ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?php if(isset($page_title)){echo $page_title . " - ";}?>Rocky Mountain Home Sales</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="<?php echo WWW_ROOT; ?>/css/styles.css" />
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>
  .fade {
    opacity: 1;
    transition: opacity 0.4s ease-in-out;
  }
  .fade.out {
    opacity: 0;
  }
</style>



</head>

<body class="min-h-screen flex flex-col">
 <header class="bg-rose-900 text-white shadow-lg">
  <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">

    <!-- Left: Logo + Site Title -->
    <div class="flex items-center gap-3">
      <!-- Optional: Logo Icon -->
      <img src="<?php echo url_for('css/images/rocky_mtn_homes_logo.png'); ?>" alt="Rocky Mountain Logo" class="h-10 w-auto">

        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l9-7 9 7v11a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10z" />
      </svg>
       <a href="<?php echo url_for('index.php'); ?>">
     <h1 class="text-2xl md:text-3xl font-bold font-[Lato] tracking-wide">
  Rocky Mountain Home Sales
</h1>

    </a>
    </div>

    <!-- Right: Navigation -->
    <nav class="flex flex-wrap justify-center md:justify-end gap-4 text-sm font-[Lato] mt-2 md:mt-0">
      <a href="<?php echo url_for('index.php'); ?>" class="hover:text-amber-300 transition">Home</a>
      <a href="<?php echo url_for('inventory.php'); ?>" class="hover:text-amber-300 transition">Inventory</a>
      <a href="<?php echo url_for('contact.php'); ?>" class="hover:text-amber-300 transition">Contact</a>
      <a href="<?php echo url_for('about.php'); ?>" class="hover:text-amber-300 transition">About</a>
      <?php if (!$logged_in): ?>
        <a href="<?php echo url_for('/staff/login.php'); ?>" class="hover:text-amber-300 transition">Staff Login</a>
      <?php endif; ?>
    </nav>

  </div>
</header>


  <!-- Start growable content area -->
  <div class="flex-grow">


