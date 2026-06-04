/**
 * Static marketing images from the legacy PHP site (`public/css/images/`).
 * Paths match the original site so bookmarks and markup stay consistent.
 */
export const siteAssets = {
  logo: "/css/images/rocky_mtn_homes_logo.png",
  heroHome: "/css/images/example_home.jpg",
  aboutMountains: "/css/images/22830688528_4e5170aaab_o.jpg",
  /**
   * PHP used `/images/placeholder.png` when a listing file was missing, but that
   * file was never in the repo — use the same hero photo as the legacy fallback.
   */
  missingListingImage: "/css/images/example_home.jpg",
} as const;
