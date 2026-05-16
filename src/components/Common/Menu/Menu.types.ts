import type { UserRole } from "@/types/User.types";

export interface MenuProps {
  role: UserRole;
  status: boolean,
  onClickEvent:  React.Dispatch<React.SetStateAction<boolean>>
}

export interface MenuItem {
  to: string;
  label: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  roles: UserRole[];
}