/** Admin form fields — never includes password hashes. */
export type AdminFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export const emptyAdminFormValues: AdminFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export type AdminFormState = {
  errors?: string[];
  values?: AdminFormValues;
};
