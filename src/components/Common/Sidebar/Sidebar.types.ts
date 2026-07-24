import type { UserRole } from "@/types/User.types";

export interface StoredUser {
  id: number;
  name: string;
  role: UserRole;
  position_id?: string ;
  position_name?: string;
  photo_url?: string | null;
  avatarUrl?: string | null;
}