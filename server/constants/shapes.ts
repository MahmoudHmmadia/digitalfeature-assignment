export const USER_ACCOUNT_SHAPE = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  token: true,
  fcmToken: true,
  slug: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
} as const;

export const PUBLIC_ACCOUNT_SHAPE = {
  id: true,
  name: true,
  avatarUrl: true,
  slug: true,
  isSuspended: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
} as const;

export const ADMIN_ROLE = 0;
export const USER_ROLE = 1;

export const COMMENT_SHAPE = {
  id: true,
  content: true,
  author: PUBLIC_ACCOUNT_SHAPE,
};

export const VOTE_SHAPE = {
  id: true,
  author: PUBLIC_ACCOUNT_SHAPE,
};
