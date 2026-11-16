export type Role = "superadmin" | "admin" | "petugas";

export type User = {
  id: number | string;
  name: string;
  email: string;
  role: Role;
};

export const roleLabel: Record<Role, string> = {
  superadmin: "Super Admin",
  admin: "Admin Kantor",
  petugas: "Petugas Lapangan",
};
