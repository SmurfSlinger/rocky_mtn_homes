export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  homeInterestId: string;
};

export type ContactFormState = {
  errors?: string[];
  values?: ContactFormValues;
  success?: boolean;
};

export const emptyContactFormValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  homeInterestId: "",
};

export type ContactHomeOption = {
  id: number;
  title: string;
};
