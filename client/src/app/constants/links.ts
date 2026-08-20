export type AppRole = "USER" | "ADMIN";

export interface NavLink {
  route: string;
  icon: string;
  title: string;
  exact?: boolean;
}

export const USER_LINKS: NavLink[] = [
  { route: "/requests", icon: "inbox", title: "Requests", exact: true },
  { route: "/activities", icon: "list-checks", title: "My Activities" },
  { route: "/profile", icon: "circle-user-round", title: "Profile" },
];

export const ADMIN_LINKS: NavLink[] = [
  {
    route: "/admin",
    icon: "shield-check",
    title: "Admin Overview",
    exact: true,
  },
  { route: "/admin/users", icon: "circle-user-round", title: "Users" },
  { route: "/admin/feedbacks", icon: "inbox", title: "Feedback" },
  {
    route: "/admin/settings",
    icon: "sliders-horizontal",
    title: "App Settings",
  },
];

export function linksForRole(role: AppRole | undefined): NavLink[] {
  return role === "ADMIN" ? ADMIN_LINKS : USER_LINKS;
}
