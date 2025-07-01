<?php
require_once('../private/includes/initialize.php');

$logged_in = isset($_SESSION['admin_id']);
if($logged_in){
  require_once('../private/includes/staff_header.php');
} else {
  require_once('../private/includes/header.php');
}
?>

<main class="relative min-h-screen font-sans overflow-hidden bg-[#FDF6EC] text-[#5C4033]">

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center md:items-start gap-12">

    <!-- Text Content -->
    <div class="md:w-1/2 bg-[#5C403388] backdrop-blur-sm rounded-xl p-10 space-y-6 shadow-xl border border-[#D2B48C66]">
      <h1 class="text-3xl md:text-5xl font-bold text-[#FDF6EC] font-serif leading-tight drop-shadow">
        Built for Utah. Priced for Families.
      </h1>
      <p class="text-lg text-[#FDF6EC] font-light font-sans leading-relaxed">
        Find your dream home, manufactured for affordability and reliability.
      </p>
      <div>
        <a href="inventory.php" class="inline-block bg-[#8B2C2C] hover:bg-[#A94438] text-white font-semibold py-2 px-6 rounded shadow-md transition">
          View Inventory
        </a>
      </div>
    </div>

    <!-- Image -->
    <div class="md:w-1/2 rounded-xl overflow-hidden shadow-xl border border-[#D2B48C66]">
      <img src="css/images/example_home.jpg" alt="Manufactured Home Example" class="object-cover w-full h-96 md:h-full">
    </div>
  </section>

   <!-- Features Section -->
  <section class="bg-[#F7EEDD] text-[#5C4033] py-24">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      <div class="bg-[#FAF4E6] shadow-lg border border-[#D2B48C] rounded-xl p-6 transition hover:shadow-2xl">
        <h3 class="text-xl font-semibold mb-3 tracking-tight">Modern Layouts</h3>
        <p class="leading-relaxed">Open floor plans, high ceilings, and large windows for a spacious feel.</p>
      </div>

      <div class="bg-[#FAF4E6] shadow-lg border border-[#D2B48C] rounded-xl p-6 transition hover:shadow-2xl">
        <h3 class="text-xl font-semibold mb-3 tracking-tight">Utah-Ready Builds</h3>
        <p class="leading-relaxed">Engineered for durability in high desert and mountain conditions.</p>
      </div>

      <div class="bg-[#FAF4E6] shadow-lg border border-[#D2B48C] rounded-xl p-6 transition hover:shadow-2xl">
        <h3 class="text-xl font-semibold mb-3 tracking-tight">Affordable Ownership</h3>
        <p class="leading-relaxed">Own your home without breaking the bank — financing options available.</p>
      </div>

      <div class="bg-[#FAF4E6] shadow-lg border border-[#D2B48C] rounded-xl p-6 transition hover:shadow-2xl">
        <h3 class="text-xl font-semibold mb-3 tracking-tight">Move-Ready Flexibility</h3>
        <p class="leading-relaxed">
          Manufactured for mobility — our homes are built to move with you. Whether you're relocating across town or across the state, you're ready for the journey.
        </p>
    </div>
  </section>

  <!-- About Section -->
  <section class="bg-[#EEE4D0] text-[#5C4033] py-20">
    <div class="max-w-4xl mx-auto px-6 space-y-8">
      <h2 class="text-4xl font-serif text-center">Why Choose Us?</h2>
      <p class="text-lg leading-relaxed text-center font-light">
        At Rocky Mountain Home Sales, we’re not just selling homes — we’re helping families plant roots. We specialize in homes that combine value, beauty, and lasting quality. Whether you’re starting out or settling down, we’ll help you find the perfect fit.
      </p>
      <div class="text-center">
        <a href="contact.php" class="inline-block bg-[#8B2C2C] hover:bg-[#A94438] text-white px-6 py-3 rounded shadow-md transition">
          Contact Us
        </a>
      </div>
    </div>
  </section>
</main>

<?php
if($logged_in){
  require_once('../private/includes/staff_footer.php');
} else {
  require_once('../private/includes/footer.php');
}
?>
