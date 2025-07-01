  </div> <!-- End flex-grow -->

  <footer class="bg-rose-900 text-white py-8 mt-12">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-[Inter]">
      <p>© 2025 Rocky Mountain Home Sales. All rights reserved.</p>
      <div class="flex gap-4">
        <a href="<?php echo url_for('index.php'); ?>" class="hover:text-amber-300 transition">Home</a>
        <a href="<?php echo url_for('contact.php'); ?>" class="hover:text-amber-300 transition">Contact</a>
        <a href="<?php echo url_for('about.php'); ?>" class="hover:text-amber-300 transition">About</a>
        <?php if (!$logged_in): ?>
          <a href="<?php echo url_for('/staff/login.php'); ?>" class="hover:text-amber-300 transition">Staff Login</a>
        <?php endif; ?>
      </div>
    </div>
  </footer>

</body>
</html>
