import "server-only";

import type { RowDataPacket } from "mysql2";

/** Raw `homes` row as returned by MySQL (snake_case columns). */
export type HomeRow = RowDataPacket & {
  id: number;
  title: string | null;
  description: string | null;
  price: string | null;
  image_path: string | null;
  extras: string | null;
  status: string | null;
  square_footage: number;
  bedrooms: number | null;
  bathrooms: number | null;
  has_washer_dryer_hookups: number | null;
  has_ac: number | null;
  has_furnace: number | null;
  includes_appliances: number | null;
  flooring_type: string | null;
  year_built: number | null;
  length_ft: string | null;
  width_ft: string | null;
  height_ft: string | null;
};

export type HomeImageRow = RowDataPacket & {
  id: number;
  home_id: number;
  image_path: string | null;
};

export type AdminRow = RowDataPacket & {
  id: number;
  username: string;
  hashed_password: string;
  first_name: string;
  last_name: string;
  email: string;
};
