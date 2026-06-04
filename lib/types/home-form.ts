/** Form field values for create/edit home (all strings except checkboxes). */
export type HomeFormValues = {
  title: string;
  price: string;
  squareFootage: string;
  lengthFt: string;
  widthFt: string;
  heightFt: string;
  bedrooms: string;
  bathrooms: string;
  hasWasherDryerHookups: boolean;
  hasAc: boolean;
  hasFurnace: boolean;
  includesAppliances: boolean;
  flooringType: string;
  yearBuilt: string;
  description: string;
  extras: string;
  status: string;
};

export const emptyHomeFormValues: HomeFormValues = {
  title: "",
  price: "",
  squareFootage: "",
  lengthFt: "",
  widthFt: "",
  heightFt: "",
  bedrooms: "",
  bathrooms: "",
  hasWasherDryerHookups: false,
  hasAc: false,
  hasFurnace: false,
  includesAppliances: false,
  flooringType: "",
  yearBuilt: "",
  description: "",
  extras: "",
  status: "",
};

export type HomeFormState = {
  errors?: string[];
  values?: HomeFormValues;
};
