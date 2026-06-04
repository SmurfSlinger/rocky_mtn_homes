/** Admin record safe to pass to client components and pages. */
export type AdminPublic = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

export function adminFullName(admin: AdminPublic): string {
  return `${admin.firstName} ${admin.lastName}`.trim();
}
