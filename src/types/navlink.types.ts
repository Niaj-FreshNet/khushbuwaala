// File: types/navlink.ts
export interface NavLink {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>; // Icon component (e.g., from react-icons)
  roles: string[];
  subItems?: NavLink[]; // Optional sub-items for dropdown menus
}