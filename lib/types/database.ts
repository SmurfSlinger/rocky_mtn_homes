/** Matches `homes.status` values used in the PHP app. */
export type HomeStatus = "available" | "sold" | string;

export type Home = {
  id: number;
  title: string;
  description: string;
  price: string | null;
  squareFootage: number;
  lengthFt: string | null;
  widthFt: string | null;
  heightFt: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  hasWasherDryerHookups: boolean | null;
  hasAc: boolean | null;
  hasFurnace: boolean | null;
  includesAppliances: boolean | null;
  flooringType: string | null;
  yearBuilt: number | null;
  extras: string | null;
  imagePath: string;
  status: HomeStatus;
};

/** Inventory card fields derived from `Home`. */
export type HomeSummary = Pick<
  Home,
  | "id"
  | "title"
  | "description"
  | "price"
  | "squareFootage"
  | "lengthFt"
  | "widthFt"
  | "imagePath"
  | "status"
>;

export type HomeImage = {
  id: number;
  homeId: number;
  imagePath: string;
};

export type Admin = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  hashedPassword: string;
};
