<?php


$logged_in = isset($_SESSION['admin_id']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?php if(isset($page_title)){echo $page_title;}?></title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="<?php echo WWW_ROOT; ?>/css/styles.css" />
<header style="position: sticky; top: 0; background: #f8f9fa; padding: 1rem; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center; z-index: 100;">
  <nav>
    <?php if ($logged_in): ?>
    <a href="<?php echo url_for('/staff/homes/index.php'); ?>" style="margin-right: 1rem;">Manage Homes</a>
    <a href="<?php echo url_for('/inventory.php'); ?>" style="margin-right: 1rem;">Inventory</a>
    <!-- Add more staff links here -->
    
      <a href="<?php echo url_for('/staff/view_admins.php'); ?>" style="margin-right: 1rem;">Manage Admins</a>

    <?php endif; ?>
  </nav>

  <div>
    <?php if ($logged_in): ?>
      <form method="post" action="<?php echo url_for('/staff/logout.php'); ?>" style="display:inline;">
        <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">

        <button type="submit" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; cursor: pointer;">Logout</button>
      </form>
      <?php endif;?>
  </div>
</header>
