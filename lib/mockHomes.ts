export type HomeStatus = "available" | "sold";

export type HomeSummary = {
  id: number;
  title: string;
  description: string;
  squareFootage: number;
  lengthFt: number;
  widthFt: number;
  imagePath: string;
  status: HomeStatus;
  price: string;
};

export type HomeDetail = HomeSummary & {
  heightFt: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  hasWasherDryerHookups: boolean | null;
  hasAc: boolean | null;
  hasFurnace: boolean | null;
  includesAppliances: boolean | null;
  flooringType: string;
  yearBuilt: number | null;
  extras: string;
  galleryImages: string[];
};

export const mockHomes: HomeDetail[] = [
  {
    id: 1,
    title: "Summit View Double Wide",
    description:
      "Spacious open floor plan with modern finishes, ideal for families settling in the Uintah Basin.",
    squareFootage: 1680,
    lengthFt: 56,
    widthFt: 30,
    heightFt: 9,
    price: "$89,500",
    bedrooms: 3,
    bathrooms: 2,
    hasWasherDryerHookups: true,
    hasAc: true,
    hasFurnace: true,
    includesAppliances: false,
    flooringType: "Luxury vinyl plank",
    yearBuilt: 2022,
    extras: "Covered porch, energy-efficient windows",
    imagePath: "/images/homes/home-1.svg",
    galleryImages: [
      "/images/homes/home-1.svg",
      "/images/homes/home-1-b.svg",
    ],
    status: "available",
  },
  {
    id: 2,
    title: "Desert Rose Single Wide",
    description:
      "Efficient layout with quality insulation, built for Utah high-desert conditions.",
    squareFootage: 1120,
    lengthFt: 56,
    widthFt: 20,
    heightFt: 8,
    price: "$64,900",
    bedrooms: 2,
    bathrooms: 2,
    hasWasherDryerHookups: true,
    hasAc: null,
    hasFurnace: true,
    includesAppliances: true,
    flooringType: "Carpet and tile",
    yearBuilt: 2020,
    extras: "Skirting package available",
    imagePath: "/images/homes/home-2.svg",
    galleryImages: ["/images/homes/home-2.svg"],
    status: "available",
  },
  {
    id: 3,
    title: "Mountain Crest Model",
    description:
      "Showcase layout with engineered hardwood and mountain-ready insulation.",
    squareFootage: 1450,
    lengthFt: 58,
    widthFt: 25,
    heightFt: 9,
    price: "$79,000",
    bedrooms: 3,
    bathrooms: 2,
    hasWasherDryerHookups: false,
    hasAc: true,
    hasFurnace: true,
    includesAppliances: false,
    flooringType: "Engineered hardwood",
    yearBuilt: 2019,
    extras: "",
    imagePath: "/images/homes/home-3.svg",
    galleryImages: ["/images/homes/home-3.svg"],
    status: "sold",
  },
];

export function getMockHomeSummaries(): HomeSummary[] {
  return mockHomes.map(
    ({
      id,
      title,
      description,
      squareFootage,
      lengthFt,
      widthFt,
      imagePath,
      status,
      price,
    }) => ({
      id,
      title,
      description,
      squareFootage,
      lengthFt,
      widthFt,
      imagePath,
      status,
      price,
    }),
  );
}

export function getMockHomeById(id: number): HomeDetail | undefined {
  return mockHomes.find((home) => home.id === id);
}

/** Cover image first, then gallery rows — matches PHP details.php merge. */
export function getMockHomeGallery(home: HomeDetail): string[] {
  const paths = [home.imagePath, ...home.galleryImages];
  return [...new Set(paths)];
}
