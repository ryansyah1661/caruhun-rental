export type Role = "admin" | "office_staff" | "field_staff";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export const roleLabel: Record<Role, string> = {
  admin: "Admin",
  office_staff: "Staf Kantor",
  field_staff: "Staf Lapangan",
};