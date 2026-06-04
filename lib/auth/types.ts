/** Safe staff session payload — never includes password hashes. */
export type StaffSession = {
  adminId: number;
  username: string;
};
