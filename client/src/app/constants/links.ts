export type AppRole = 'USER' | 'ADMIN';

export interface NavLink {
  route: string;
  icon: string;
  title: string;
  exact?: boolean;
}

export const USER_LINKS: NavLink[] = [
  { route: '/', icon: 'inbox', title: 'Requests', exact: true },
  { route: '/feedback/new', icon: 'square-plus', title: 'Create Feedback' },
  { route: '/my-feedback', icon: 'file-text', title: 'My Feedback' },
  { route: '/votes', icon: 'thumbs-up', title: 'Votes' },
  { route: '/comments', icon: 'message-circle', title: 'Comments' },
  { route: '/profile', icon: 'circle-user-round', title: 'Profile' },
  { route: '/settings', icon: 'settings', title: 'Settings' },
];

export const ADMIN_LINKS: NavLink[] = [
  { route: '/admin', icon: 'shield-check', title: 'Admin Overview', exact: true },
  { route: '/', icon: 'inbox', title: 'Requests', exact: true },
  { route: '/admin/review', icon: 'list-filter', title: 'Review Queue' },
  { route: '/admin/categories', icon: 'tags', title: 'Categories' },
  { route: '/admin/statuses', icon: 'list-checks', title: 'Statuses' },
  { route: '/admin/comments', icon: 'messages-square', title: 'Moderation' },
  { route: '/admin/settings', icon: 'sliders-horizontal', title: 'App Settings' },
  { route: '/profile', icon: 'circle-user-round', title: 'Profile' },
];

export function linksForRole(role: AppRole | undefined): NavLink[] {
  return role === 'ADMIN' ? ADMIN_LINKS : USER_LINKS;
}
