import type { Redirect } from "next/dist/lib/load-custom-routes";

/** Permanent redirects from legacy PHP URLs to App Router paths. */
export const phpLegacyRedirects: Redirect[] = [
  { source: "/index.php", destination: "/", permanent: true },
  { source: "/inventory.php", destination: "/inventory", permanent: true },
  { source: "/contact.php", destination: "/contact", permanent: true },
  { source: "/about.php", destination: "/about", permanent: true },
  {
    source: "/details.php",
    has: [{ type: "query", key: "id", value: "(?<id>\\d+)" }],
    destination: "/homes/:id",
    permanent: true,
  },
  { source: "/details.php", destination: "/inventory", permanent: true },

  { source: "/staff/login.php", destination: "/staff/login", permanent: true },
  { source: "/staff/logout.php", destination: "/staff/logout", permanent: true },
  {
    source: "/staff/homes/index.php",
    destination: "/staff/homes",
    permanent: true,
  },
  {
    source: "/staff/homes/new.php",
    destination: "/staff/homes/new",
    permanent: true,
  },
  {
    source: "/staff/homes/show.php",
    has: [{ type: "query", key: "id", value: "(?<id>\\d+)" }],
    destination: "/staff/homes/:id",
    permanent: true,
  },
  {
    source: "/staff/homes/edit.php",
    has: [{ type: "query", key: "id", value: "(?<id>\\d+)" }],
    destination: "/staff/homes/:id/edit",
    permanent: true,
  },
  {
    source: "/staff/homes/delete.php",
    has: [{ type: "query", key: "id", value: "(?<id>\\d+)" }],
    destination: "/staff/homes/:id/delete",
    permanent: true,
  },
  {
    source: "/staff/homes/images.php",
    has: [{ type: "query", key: "home_id", value: "(?<id>\\d+)" }],
    destination: "/staff/homes/:id/images",
    permanent: true,
  },
  {
    source: "/staff/homes/images_new.php",
    has: [{ type: "query", key: "home_id", value: "(?<id>\\d+)" }],
    destination: "/staff/homes/:id/images/new",
    permanent: true,
  },
  {
    source: "/staff/homes/images_edit.php",
    has: [
      { type: "query", key: "home_id", value: "(?<homeId>\\d+)" },
      { type: "query", key: "id", value: "(?<imageId>\\d+)" },
    ],
    destination: "/staff/homes/:homeId/images/:imageId/edit",
    permanent: true,
  },
  {
    source: "/staff/homes/images_delete.php",
    has: [
      { type: "query", key: "home_id", value: "(?<id>\\d+)" },
    ],
    destination: "/staff/homes/:id/images",
    permanent: true,
  },
  {
    source: "/staff/view_admins.php",
    destination: "/staff/admins",
    permanent: true,
  },
  {
    source: "/staff/admins/index.php",
    destination: "/staff/admins",
    permanent: true,
  },
  {
    source: "/staff/index.php",
    destination: "/staff/admins",
    permanent: true,
  },
  {
    source: "/staff/create_admin.php",
    destination: "/staff/admins/new",
    permanent: true,
  },
  {
    source: "/staff/edit_admin.php",
    has: [{ type: "query", key: "id", value: "(?<id>\\d+)" }],
    destination: "/staff/admins/:id/edit",
    permanent: true,
  },
  {
    source: "/staff/delete_admin.php",
    has: [{ type: "query", key: "id", value: "(?<id>\\d+)" }],
    destination: "/staff/admins/:id/delete",
    permanent: true,
  },
];
